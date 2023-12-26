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
            <h4>ชื่อ</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-text-field v-model="form.booking_name" :rules="valid" required placeholder="ชื่อ" outlined dense hide-details></v-text-field>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4>รายการ</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-select v-model="booking_lists" :rules="valid" :items="items_lists" placeholder="รายการ" item-text="lists_name" item-value="_id" outlined dense hide-details return-object></v-select>
            <v-row no-gutters>
              <!-- <v-col cols="12" sm="12" md="4" class="my-2">
                <v-select v-model="form.booking_discount" :rules="valid" :items="listsDiscount" label="ส่วนลด" placeholder="ลดราคา" outlined dense hide-details return-object></v-select>
              </v-col> -->

              <v-col cols="6" sm="6" md="4" class="pr-3 px-md-3 my-2">
                <v-text-field v-model="form.booking_discount.value" label="ส่วนลด" placeholder="ราคาเต็ม" outlined dense hide-details type="number"></v-text-field>
              </v-col>
              <v-col cols="6" sm="6" md="4" class="pl-3 px-md-0 my-2">
                <v-select v-model="form.booking_discount.type" :rules="valid" :items="type_discount" item-value="value" item-text="text" outlined dense hide-details></v-select>
              </v-col>

              <v-col v-if="form.booking_discount || booking_lists" cols="6" sm="6" md="4" class="pr-3 px-md-3 my-md-2">
                <v-text-field class="total-price" v-if="booking_lists" label="ราคา" placeholder="ราคาเต็ม" outlined dense hide-details readonly :value="booking_lists.lists_price" :suffix="discounting.toString()"></v-text-field>
              </v-col>
              <v-col v-if="form.booking_discount || booking_lists" cols="6" sm="6" md="4" class="pl-3 px-md-0 my-md-2">
                <v-text-field v-if="booking_lists" label="ส่วนลด" placeholder="ราคาสุทธิ" outlined dense hide-details readonly :value="totalPrice" suffix="บาท"></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4>วันที่</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-row>
              <v-col cols="12" sm="6" class="py-1 py-sm-2">
                <Date-Picker :value="form.date" :title="`เริ่ม`" @update="setDate" :noBtnSave="true"/>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4> เวลาเริ่ม </h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-row no-gutters>
              <v-col class="py-1 pr-1" cols="6" md="3">
                <v-select v-model="form.s_house" :items="times.houses" placeholder="ชั่วโมง" item-text="text" item-value="value" outlined dense hide-details></v-select>
              </v-col>
              <v-col class="py-1 pl-1" cols="6" md="3">
                <v-select v-model="form.s_minutes" :items="times.minutes" placeholder="นาที" item-text="text" item-value="value" outlined dense hide-details></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4> เวลาสิ้นสุด </h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-row no-gutters>
              <v-col class="py-1 pr-1" cols="6" md="3">
                <v-select v-model="form.e_house" :items="times.houses" placeholder="ชั่วโมง" item-text="text" item-value="value" outlined dense hide-details></v-select>
              </v-col>
              <v-col class="py-1 pl-1" cols="6" md="3">
                <v-select v-model="form.e_minutes" :items="times.minutes" placeholder="นาที" item-text="text" item-value="value" outlined dense hide-details></v-select>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4>โซเชียล</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-text-field v-model="form.booking_social" placeholder="โซเชียล" outlined dense hide-details></v-text-field>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4>เบอร์โทร</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-text-field v-model="form.booking_phone" @keypress="isPhone($event)" placeholder="เบอร์โทร" outlined dense hide-details></v-text-field>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4>สี</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-select v-model="form.booking_color" :items="colors" placeholder="สี" outlined dense hide-details>
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0" :color="item">
                  <span style="color: #fff;">{{ item }}</span>
                </v-chip>
              </template>

              <template v-slot:item="{ item }">
                <span :style="`background: ${item}; width: 25px; height: 25px; border-radius: 20px;`"></span>
                <span class="ml-4">{{ item }}</span>
              </template>
            </v-select>
          </v-col>

          <v-col cols="12" sm="3" md="2" class="pt-4 pb-0">
            <h4>หมายเหตุ</h4>
          </v-col>
          <v-col cols="12" sm="9" md="4" class="pb-0">
            <v-text-field v-model="form.booking_remark" class="mb-2" placeholder="หมายเหตุ" outlined dense hide-details></v-text-field>
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
import { colors, houses, minutes, times } from '@/static/data.json'
export default {
  pageTitle: "",
  toolbarMode: "hide",
  async validate({ params, query, store }) {
    const MenuCode = "booking";
    const valid = await store.dispatch("menu/validateRole", MenuCode);
    return valid;
  },
  data() {
    return {
      id: this.$route.params.id,
      mode: 'new',
      form: {
        date: this.$moment().format('YYYY-MM-DD'),
        s_house: '10',
        s_minutes: '00',
        e_house: '11',
        e_minutes: '00',
        booking_color: '#5582b9',
        booking_discount: {
          value: 0,
          type: 'percent'
        }
      },
      type_discount: [
        { value: 'percent', text: '%' },
        { value: 'bath', text: 'บาท' }
      ],
      loading: false,
      form_valid: true,
      valid: [v => !!v || 'กรุณากรอกข้อมูลให้ครบถ้วน'],
      // lists_time: times,
      booking_lists: (this.items_lists&&this.items_lists.length > 0) ? this.items_lists[0]: null,
      colors: colors,
      times: {
        houses: houses,
        minutes: minutes
      }
    }
  },
  computed: {
    ...mapGetters({
      items_lists: 'lists/lists',
      lists_discount: 'service/discount',
    }),
    titleMode() {
      if (this.mode == 'new') return 'สร้าง'
      else return 'แก้ไข'
    },
    listsDiscount(){
      return JSON.parse(JSON.stringify(this.lists_discount))
    },
    totalPrice(){
      try {
        let price = this.booking_lists.lists_price
        let discounts = this.form.booking_discount
        if (price && discounts) {
          if (discounts.type === 'percent') {
            let discount = ((discounts.value * price) / 100).toFixed(2)
            return  parseInt(price) - Math.floor(parseFloat(discount))
          } else {
            return  parseInt(price) - parseInt(discounts.value)
          }
        } else if (price) return price
        return 0
      } catch (error) {
        return 0
      }
    },
    discounting(){
      try {
        let price = this.booking_lists.lists_price
        let discounts = this.form.booking_discount
        if (price && discounts) {
          if (discounts.type === 'percent') {
            let discount = ((discounts.value * price) / 100).toFixed(2)
            return  Math.floor(parseFloat(discount))
          } else {
            return  discounts.value
          }
        }
        return 0
      } catch (error) {
        return 0
      }
    }
  },
  watch: {
    booking_lists(value) {
      if (value) {
        this.form.booking_lists_id = value.lists_id
        this.form.booking_total = value.lists_price
      }
    },
  },
  methods: {
    ...mapActions({
      loadDataLists: 'lists/loadData',
      loadInfo: 'booking/loadInfo',
      create: 'booking/create',
      update: 'booking/update',
      loadDiscount: 'service/loadDataDiscount',
    }),
    async getInfo(id) {
      this.loading = true
      const res = await this.loadInfo(id)
      if (res.status == true) {
        this.form = res.payload
        this.form.date = this.$moment(this.form.booking_date.start).format('YYYY-MM-DD')
        this.form.s_house = this.$moment(this.form.booking_date.start).format('HH')
        this.form.s_minutes = this.$moment(this.form.booking_date.start).format('mm')
        this.form.e_house = this.$moment(this.form.booking_date.end).format('HH')
        this.form.e_minutes = this.$moment(this.form.booking_date.end).format('mm')
        this.booking_lists = res.payload.booking_lists
      }
      this.loading = false
    },
    validateData(form) {
      let _discount = (typeof form.booking_discount.value != 'number')
                      ? parseInt(form.booking_discount.value)
                      : form.booking_discount.value
      let params = {
        booking_name: form.booking_name || null,
        booking_lists_id: form.booking_lists_id || null,
        booking_phone: form.booking_phone || null,
        booking_social: form.booking_social || null,
        booking_discount:  {
          value: _discount || 0,
          type: form.booking_discount.type || 'percent'
        },
        booking_total: this.totalPrice || 0,
        booking_date: {
          start: this.$moment(`${this.form.date} ${this.form.s_house}:${this.form.s_minutes}`),
          end: this.$moment(`${this.form.date} ${this.form.e_house}:${this.form.e_minutes}`),
        },
        booking_color: form.booking_color || null,
        booking_remark: form.booking_remark || null,
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
        this.$router.replace('/booking')
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
        this.$router.replace('/booking')
      } else {
        Swal.fire({ icon: 'error', title: res.message, })
      }
    },

    setDate(date){
      this.form.date = this.$moment(date).format('YYYY-MM-DD')
    },
    isPhone(evt) {
      const keyPressed = evt.key;
      const value  = evt.target.value
      if (!/^\d+$/.test(keyPressed) || value.length > 9) {
        evt.preventDefault()
      }
    }
  },
  async created() {
    this.loading = true
    await this.loadDataLists()
    await this.loadDiscount()

    if (this.id && this.id != 'new') {
      this.getInfo(this.id)
      this.mode = 'edit'
    }
    this.loading = false
  },
}
</script>

<style lang="scss" scoped>
::v-deep .total-price {
  .v-text-field__suffix { font-size: 14px; color: red; }
}
</style>