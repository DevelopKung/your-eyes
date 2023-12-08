<template>
  <div>
    <v-menu ref="date" v-model="open" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto" :return-value.sync="date">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-on="on" v-bind="attrs" 
          v-model="distpaly"
          :clearable="clearable" 
          :label="title" readonly 
          outlined dense hide-details
          @click:clear="onClearClicked"
          :suffix="suffix"
        >
        <template v-if="locationIcon == 'right'" v-slot:append>
          <v-icon @click="open = true"> mdi-calendar </v-icon>
        </template>
        <template v-if="locationIcon == 'left'" v-slot:prepend-inner>
          <v-icon @click="open = true"> mdi-calendar </v-icon>
        </template>
        </v-text-field>
      </template>
      <v-date-picker v-if="noBtnSave" v-model="date" locale="TH" color="#0288D1" :min="minDate" :max="maxDate" @input="save"></v-date-picker>
      <v-date-picker v-else v-model="date" locale="TH" color="#0288D1" :min="minDate" :max="maxDate">
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="open = false"> ยกเลิก </v-btn>
        <v-btn text color="primary" @click="save"> ตกลง </v-btn>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: String, default: null },
    title: { type: String, default: null },
    minDate: { type: String, default: null },
    maxDate: { type: String, default: null },
    clearable: { type: Boolean, default: false },
    locationIcon: { type: String, default: "right" },
    suffix: { type: String, default: null },
    noBtnSave: { type: Boolean, default: false }
  },
  data() {
    return {
      open: false,
      date: null,
    }
  },
  watch: {
    value(e) {
      this.date = e
    }
  },
  computed: {
    distpaly() {
      if (this.date) return new Date(this.date).toLocaleDateString('TH')
      return null
    },
  },
  methods: {
    async save() {
      this.$refs.date.save(this.date)
      this.$emit('update', this.date)
    },
    onClearClicked(){
      this.$emit('update', null)
    }
  },
  created() {
    this.date = this.value
  },
}
</script>

<style lang="scss" scoped></style>
