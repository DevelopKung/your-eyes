<template>
  <div>
    <FormFilterBar>
      <v-row>
        <v-col cols="12" sm="4" md="3">
          <v-text-field v-model="filter.search" prepend-inner-icon="mdi-magnify" outlined placeholder="ค้นหา" single-line hide-details clearable dense></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </FormFilterBar>
    <v-card class="pa-4" outlined style="min-height: 70vh;">
      <div class="mb-4">
        <v-btn color="primary" depressed @click="$router.push('/lists/new')">
          <v-icon left>mdi-plus</v-icon> เพิ่ม
        </v-btn>
      </div>
      <v-data-table dense 
        :search="filter.search" 
        :headers="dataTable.headers" 
        :items="lists" 
        :items-per-page="30" 
        :footer-props="dataTable.footerProps" 
        :item-class="rowClass" 
        item-key="id" 
      >
        <template v-slot:[`item.index`]="{ index }">
          <div>{{ index + 1 }}</div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <span :class="(item.status == true) ? 'success--text' : 'error--text'">{{ (item.status == true) ? 'ใช้งาน' : 'ยกเลิก' }}</span>
        </template>
        <template v-slot:[`item.created_date`]="{ item }">
          <span>{{ new Date(item.created_date).toLocaleDateString('TH') }}</span>
        </template>
        <template v-slot:[`item.lists_price`]="{ item }">
          <span>{{ item.lists_price | numeral }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="openForm(item._id)"> mdi-pencil </v-icon>
          <v-icon small class="mr-2" @click="deleteData(item._id)"> mdi-delete </v-icon>
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
    const MenuCode = "lists";
    const valid = await store.dispatch("menu/validateRole", MenuCode);
    return valid;
  },
  data() {
    return {
      loading: false,
      filter: {
        search: null,
        selected: '',
        start: this.$moment().startOf('month').format('YYYY-MM-DD'),
        end: this.$moment().endOf('month').format('YYYY-MM-DD'),
      },
    }
  },
  computed: {
    ...mapGetters({
      lists: 'lists/lists',
    }),

    dataTable() {
      return {
        headers: [
          { text: "ลำดับ", value: 'index', sortable: false, width: 10, align: "right" },
          { text: "ชื่อ", value: 'lists_name', sortable: false, width: 100, },
          { text: "ราคา", value: 'lists_price', sortable: false, width: 150 },
          { text: "สร้างวันที่", value: 'created_date', sortable: false, width: 70 },
          { text: "สถานะ", value: 'status', sortable: false, width: 100 },
          { text: 'ข้อมูล', value: 'actions', sortable: false,  width: 150, align: "right" }
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
      loadData: 'lists/loadData',
      delete: 'lists/delete',
    }),
    rowClass(item) {
      return (item.status == ('false' || false)) ? 'error--text' : ''
    },
    openForm(id) {
      this.$router.push({ path: this.$route.path + "/" + id })
    },
    async getData(){
      this.loading = true
      let param = { show_all: 'y' }
      await this.loadData(param)
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
          await this.delete(id).then((res) => {
            this.loading = false
            if (res.status == false) {
              Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', })
            } else {
              Swal.fire({ position: 'top-center', icon: 'success', title: 'ลบสำเร็จ', })
            }
          })
        }
      })

    },
    clearImport(){
      this.file_excel = null
    },
  },
  async fetch() {
    await this.getData()
  }
}
</script>

<style lang="scss" scoped></style>