<template>
  <div>
    <FormActionBar :title="titleMode">
      <v-btn class="mr-2" small depressed @click="$router.back()">กลับ</v-btn>
      <v-btn color="primary" small depressed @click="validateData(form)" :disabled="!form_valid">ตกลง</v-btn>
    </FormActionBar>

    <v-card class="pa-4" outlined>
      <v-form class="pb-4" ref="form" v-model="form_valid">
        <v-row class="px-8 pt-2">
          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4>หัวข้อ</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-text-field v-model="form.exp_name" :rules="valid" required placeholder="หัวข้อ" outlined dense hide-details></v-text-field>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4>ราคา</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-text-field v-model="form.exp_price" :rules="valid" required placeholder="ราคา" outlined dense hide-details></v-text-field>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4>วันที่</h4>
          </v-col>
          <v-col cols="12" sm="9" md="6" class="pb-0">
            <v-row>
              <v-col cols="12" sm="6" class="py-1 py-sm-2">
                <Date-Picker :value="form.date" :title="`เริ่ม`" @update="setDate" :noBtnSave="true"/>
              </v-col>
              <v-col cols="6" sm="3" class="py-1 py-sm-2">
                <v-select v-model="form.house" :items="times.houses" placeholder="ชั่วโมง" item-text="text" item-value="value" outlined dense hide-details></v-select>
              </v-col>
              <v-col cols="6" sm="3" class="py-1 py-sm-2">
                <v-select v-model="form.minutes" :items="times.minutes" placeholder="นาที" item-text="text" item-value="value" outlined dense hide-details></v-select>
              </v-col>
            </v-row>
          </v-col>

        </v-row>
      </v-form>
    </v-card>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Swal from 'sweetalert2'
import { colors, houses, minutes, times } from '@/static/data.json'
export default {
  pageTitle: "",
  toolbarMode: "hide",
  async validate({ params, query, store }) {
    const MenuCode = "expenses";
    const valid = await store.dispatch("menu/validateRole", MenuCode);
    return valid;
  },
  data() {
    return {
      id: this.$route.params.id,
      mode: 'new',
      form_valid: true,
      valid: [v => !!v || 'กรุณากรอกข้อมูลให้ครบถ้วน'],
      form: {
        date: this.$moment().format('YYYY-MM-DD'),
        house: '10',
        minutes: '00',
      },
      times: {
        houses: houses,
        minutes: minutes
      }
    }
  },
  computed: {
    ...mapGetters({
      items_lists: 'lists/lists',
    }),
    titleMode() {
      if (this.mode == 'new') return 'สร้าง'
      else return 'แก้ไข'
    },
    mobile() {
      return this.$vuetify.breakpoint.width < 450
    },
  },
  methods: {
    ...mapActions({
      loadInfo: 'expenses/loadInfo',
      create: 'expenses/create',
      update: 'expenses/update',
    }),
    async getInfo(id) {
      this.loading = true
      const res = await this.loadInfo(id)
      if (res.status == true) {
        this.form = res.payload
        this.form.date = this.$moment(this.form.exp_date).format('YYYY-MM-DD')
        this.form.house = this.$moment(this.form.exp_date).format('HH')
        this.form.minutes = this.$moment(this.form.exp_date).format('mm')
      }
      this.loading = false
    },
    validateData(form){
      let { exp_name, exp_price } = form
      let params = {
        exp_name, 
        exp_price,
        exp_date: this.$moment(`${form.date} ${form.house}:${form.minutes}`)
      }
      if (this.form_valid) {
        if (this.mode == 'new') {
          this.createData(params)
        } else {
          this.updateData(params)
        }
      }
    },
    async createData(form) {
      this.loading = true
      const res = await this.create(form)
      this.loading = false
      if (res.status == true) {
        Swal.fire({ icon: 'success', title: res.message, })
        this.$router.replace('/expenses')
      } else {
        Swal.fire({ icon: 'error', title: res.message, })
      }
    },
    async updateData(form) {
      this.loading = true
      const res = await this.update({ id: this.id, form })
      this.loading = false
      if (res.status == true) {
        Swal.fire({ icon: 'success', title: res.message, })
        this.$router.replace('/expenses')
      } else {
        Swal.fire({ icon: 'error', title: res.message, })
      }
    },
    setDate(date){
      this.form.date = this.$moment(date).format('YYYY-MM-DD')
    },
  },
  async created() {
    if (this.id && this.id != 'new') {
      this.getInfo(this.id)
      this.mode = 'edit'
    }
  },
}
</script>

<style lang="scss" scoped></style>