<template>
  <div>
    <FormActionBar :title="titleMode">
      <v-btn class="mr-2" small depressed @click="$router.replace('/booking')">กลับ</v-btn>
      <v-btn color="primary" small depressed @click="validateData(form)" :disabled="disabledForm">ตกลง</v-btn>
    </FormActionBar>
    <v-card class="pa-4" outlined>
      <v-form ref="form" v-model="form_valid">
        <v-row class="px-8 pt-2">

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4>ชื่อ</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-text-field v-model="form.lists_name" :rules="valid" required class="mb-2" placeholder="ชื่อ" outlined dense hide-details></v-text-field>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4>ชื่ออังกฤษ</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-text-field v-model="form.lists_name_en" required class="mb-2" placeholder="ชื่ออังกฤษ" outlined dense hide-details></v-text-field>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4>ราคา</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-text-field v-model="form.lists_price" type="number" :rules="valid" required class="mb-2" placeholder="ราคา" outlined dense hide-details></v-text-field>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-5 pb-0">
            <h4>สถานะ</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="">
            <v-radio-group class="py-0" v-model="form.status" dense row hide-details>
              <v-radio label="เปิดใช้งาน" :value="true"></v-radio>
              <v-radio label="ปิดใช้งาน" :value="false"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <Loader v-if="loading" :loading="loading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
  pageTitle: "",
  toolbarMode: "hide",
  async validate({ params, query, store }) {
    const MenuCode = "lists";
    const valid = await store.dispatch("menu/validateRole", MenuCode);
    return valid;
  },
  data() {
    return {
      id: this.$route.params.id,
      mode: 'new',
      form: {
        lists_name: null,
        lists_name_en: null,
        lists_price: null,
        status: true
      },
      loading: false,
      form_valid: true,
      valid: [v => !!v || 'กรุณากรอกข้อมูลให้ครบถ้วน'],
    }
  },
  computed: {
    titleMode() {
      if (this.mode == 'new') return 'สร้าง'
      else return 'แก้ไข'
    },
    disabledForm() {
      if (!this.form.lists_name || !this.form.lists_price || !this.form.status) {
        return true
      }
      return false
    }
  },
  methods: {
    ...mapActions({
      loadInfo: 'lists/loadInfo',
      create: 'lists/create',
      update: 'lists/update',
    }),
    async getInfo(id) {
      this.loading = true
      const res = await this.loadInfo(id)
      if (res.status == true) {
        this.form = res.payload
      }
      this.loading = false
    },
    validateData(form) {
      if (this.form.lists_price) {
        this.form.lists_price = parseInt(this.form.lists_price)
      }
      if (!this.disabledForm) {
        if (this.mode == 'new') {
          this.createData(form)
        } else {
          this.updateData(form)
        }
      }
    },

    async createData(form) {
      this.loading = true
      const res = await this.create(form)
      this.loading = false
      if (res.status == true) {
        Swal.fire({ icon: 'success', title: res.message, })
        this.$router.replace('/lists')
      } else {
        Swal.fire({ icon: 'error', title: res.message, })
      }
    },

    async updateData(form) {
      this.loading = true
      const res = await this.update({ id: form._id, form })
      this.loading = false
      if (res.status == true) {
        Swal.fire({ icon: 'success', title: res.message, })
        this.$router.replace('/lists')
      } else {
        Swal.fire({ icon: 'error', title: res.message, })
      }
    },
  },
  created() {
    if (this.id && this.id != 'new') {
      this.getInfo(this.id)
      this.mode = 'edit'
    }
  },
}
</script>

<style lang="scss" scoped></style>