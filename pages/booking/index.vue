<template>
  <div>
    <FormFilterBar>
      <v-row>
        <v-col cols="6" sm="4" md="3">
          <Date-Picker v-if="filter.start" :value="filter.start" :title="`เริ่ม`" @update="startDate" :noBtnSave="true"/>
        </v-col>
        <v-col cols="6" sm="4" md="3">
          <Date-Picker v-if="filter.end" :value="filter.end" :title="`สิ้นสุด`" @update="endDate" :noBtnSave="true"/>
        </v-col>
        <!-- <v-col cols="12" sm="4" md="3">
          <v-text-field v-model="filter.search" prepend-inner-icon="mdi-magnify" outlined placeholder="ค้นหา" single-line hide-details clearable dense></v-text-field>
        </v-col> -->
        <v-spacer></v-spacer>
        <v-col cols="12" sm="4" md="3">
          <v-btn color="primary" depressed @click="getData">
            <v-icon left>mdi-magnify</v-icon> ค้นหา
          </v-btn>
        </v-col>
      </v-row>
    </FormFilterBar>
    <v-card class="pa-4" outlined style="min-height: 76vh;">
      <div class="mb-4">
        <v-btn color="primary" depressed @click="$router.push('/booking/new')">
          <v-icon left>mdi-plus</v-icon> เพิ่ม
        </v-btn>
      </div>
      <v-data-table dense :search="filter.search" :headers="dataTable.headers" :items="lists" :items-per-page="30" :footer-props="dataTable.footerProps" :item-class="rowClass" item-key="id">
        <template v-slot:[`item.index`]="{ index }">
          <div>{{ index + 1 }}</div>
        </template>
        <template v-slot:[`item.booking_lists.lists_price`]="{ item }">
          <div>{{ item.booking_lists.lists_price | numeral }}</div>
        </template>
        <template v-slot:[`item.booking_total`]="{ item }">
          <div>{{ item.booking_total | numeral }}</div>
        </template>
        <template v-slot:[`item.booking_date`]="{ item }">
          <span>{{ new Date(item.booking_date.start).toLocaleDateString('TH')}}</span>
        </template>
        <template v-slot:[`item.booking_time`]="{ item }">
          <span>
            {{ $moment(item.booking_date.start).format('HH:mm') }} - 
            {{ $moment(item.booking_date.end).format('HH:mm')}}
          </span>
        </template>
        <template v-slot:[`item.created_date`]="{ item }">
          <span>{{ isDate(item.created_date) }}</span>
        </template>
        <template v-slot:[`item.updated_date`]="{ item }">
          <span>{{ isDate(item.created_date) }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="openForm(item._id)">
            mdi-pencil
          </v-icon>
          <v-icon small class="mr-2" @click="deleteData(item._id)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <Loader v-if="loading" :loading="loading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import socket from '@/plugins/socket.io'
import Swal from 'sweetalert2'

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
      loading: false,
      filter: {
        search: null,
        start: this.$moment().startOf('month').format('YYYY-MM-DD'),
        end: this.$moment().endOf('month').format('YYYY-MM-DD'),
      },
    }
  },
  computed: {
    ...mapGetters({
      lists: 'booking/lists',
    }),

    dataTable() {
      return {
        headers: [
          { text: "ลำดับ", value: 'index', sortable: false, width: 10, align: "right" },
          { text: "ชื่อ", value: 'booking_name', sortable: false, width: 100 },
          { text: "ราคาเต็ม", value: 'booking_lists.lists_price', sortable: false, width: 100, align: "right" },
          { text: "รายการ", value: 'booking_lists.lists_name', sortable: false, width: 100 },
          { text: "ส่วนลด", value: 'booking_discount.text', sortable: false, width: 100 },
          { text: "ราคาสุทธิ", value: 'booking_total', sortable: false, width: 100, align: "right" },
          { text: "วันที่", value: 'booking_date', sortable: false, width: 100 },
          { text: "เวลา", value: 'booking_time', sortable: false, width: 120 },
          { text: "สร้างวันที่", value: 'created_date', sortable: false, width: 170 },
          { text: "แก้ไขวันที่", value: 'updated_date', sortable: false, width: 170 },
          { text: 'ข้อมูล', value: 'actions', sortable: false, width: 150, align: "right" }
        ],
        footerProps: {
          'items-per-page-options': [30, 50, 100, -1],
          'itemsPerPageText': "จำนวนต่อหน้า"
        }
      }
    },
  },
  methods: {
    ...mapActions({
      loadData: 'booking/loadData',
      delete: 'booking/delete',
    }),
    rowClass(item) {
      return (item.status == ('false' || false)) ? 'error--text' : ''
    },
    openForm(id) {
      this.$router.push({ path: this.$route.path + "/" + id })
    },
    async getData(){
      this.loading = true
      await this.loadData(this.filter)
      this.loading = false
    },
    async deleteData(id) {
      Swal.fire({
        title: 'ต้องการลบข้อมูลจริงหรือไม่ ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ไม่'
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loading = true
          await this.delete(id).then(async (res) => {
            this.loading = false
            if (res.status == false) {
              Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', })
            } else {
              await this.getData()
              Swal.fire({ position: 'top-center', icon: 'success', title: 'ลบสำเร็จ', })
            }
          })

        }
      })

    },
    startDate(date){
      this.filter.start = this.$moment(date).format('YYYY-MM-DD')
    },
    endDate(date){
      this.filter.end = this.$moment(date).format('YYYY-MM-DD')
    },
    isDate(date){
      if (date) {
        return new Date(date).toLocaleString('TH')
      }
      return date
    }
  },
  async fetch() {
    await this.getData()
  }
}
</script>

<style lang="scss" scoped></style>