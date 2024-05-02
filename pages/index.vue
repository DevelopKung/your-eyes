<template>
  <div>
    <v-row class="fill-height">
      <v-col cols="12">
        <v-card class="pa-2" outlined>
          <v-row>
            <v-col cols="12">
              <div class="d-flex justify-space-between align-center">
                <v-btn fab text small color="grey darken-2" @click="prev">
                  <v-icon small> mdi-chevron-left </v-icon>
                </v-btn>

                <v-toolbar-title v-if="tab == 0 && $refs.booking"> {{ $refs.booking.title }} </v-toolbar-title>
                <v-toolbar-title v-if="tab == 1 && $refs.expenses"> {{ $refs.expenses.title }} </v-toolbar-title>

                <v-btn fab text small color="grey darken-2" @click="next">
                  <v-icon small> mdi-chevron-right </v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-row no-gutters>
          <v-col class="pa-1" cols="12" sm="6">
            <v-card outlined class="pa-4 d-flex justify-space-between align-center rounded-xl">
              <div>
                <small> <b>ยอดรายรับ </b> </small>
                <div class="text-left" :class="totalDateBookingNow ? 'success--text':''"> <b>{{ totalDateBookingNow |numeral }}</b> </div>
              </div>
              <div class="text-center">
                <small><b> วันที่ </b></small>
                <div><b>{{ new Date(focus).toLocaleDateString('TH') }}</b></div>
              </div>
              <div>
                <small> <b>ยอดรายจ่าย</b> </small>
                <div class="text-right" :class="totalDateExpensesNow > 0? 'error--text':''"> <b>{{ totalDateExpensesNow | numeral }}</b> </div>
              </div>
            </v-card>
          </v-col>
          <v-col class="pa-1" cols="12" sm="6">
            <v-card outlined class="pa-4 d-flex justify-space-between align-center rounded-xl">
              <div>
                <small> <b>รายรับทั้งเดือน</b> </small>
                <div class="text-left" :class="totalMonthBooking? 'success--text':''"> <b>{{ totalMonthBooking | numeral }}</b> </div>
              </div>
              <div>
                <small> <b>ยอดจองเดือนนี้</b> </small>
                <div class="text-center" :class="totalBooking? 'warning--text':''"> <b>{{ totalBooking | numeral }}</b> </div>
              </div>
              <div>
                <small> <b>รายจ่ายทั้งเดือน</b> </small>
                <div class="text-right" :class="totalMonthExpenses? 'error--text':''"> <b>{{ totalMonthExpenses | numeral }}</b> </div>
              </div>
            </v-card>
          </v-col>
          <v-col class="pa-1" cols="12" sm="6">
            <v-card outlined class="pa-4 d-flex justify-space-between align-center rounded-xl">
              <small> <b>สรุปยอด</b> </small>
              <div class="text-center" :class="total > 0? 'success--text':'error--text'"> <b>{{ total | numeral }}</b> </div>
           </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-tabs class="mb-2" v-model="tab"  :color="tab ? 'error': 'success'" grow  >
          <v-tab> รายรับ </v-tab>
          <v-tab> รายจ่าย </v-tab>
        </v-tabs>
        
        <v-sheet height="600">
          <v-calendar
            v-show="tab == 0" 
            ref="booking" color="primary"
            v-model="focus"
            :events="listsBooking" 
            :event-color="getEventColor"
            :type="type" 
            @click:event="showEvent" 
            @click:more="viewDay" 
            @click:date="viewDay"
            locale="TH"
            :interval-format="intervalFormat"
            :first-interval="firstTime"
            :interval-minutes="60"
            :interval-count="endTime"
          >
            <template v-slot:event="{event}">
              <span class="px-2">{{ event.name }}</span>
            </template>
          </v-calendar>
          <v-calendar 
            v-show="tab == 1"
            ref="expenses" color="primary"
            v-model="focus"
            :events="listsExpenses" 
            :event-color="getEventColor"
            :type="type" 
            @click:event="showEvent" 
            @click:more="viewDay" 
            @click:date="viewDay"
            locale="TH"
            :interval-format="intervalFormatExpenses"
          >
            <template v-slot:event="{event}">
              <div class="d-flex justify-space-between">
                <span class="px-2">{{ event.name }}</span>
                <span class="px-2">{{ event.total | numeral }} บ.</span>
              </div>
            </template>
          </v-calendar>
          <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
            <v-card flat min-width="200">
              <v-toolbar :color="setColor(selectedEvent)" dark>
                <v-btn icon @click="edit(selectedEvent)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="selectedOpen = false">
                  <v-icon>mdi-close-thick</v-icon>
                </v-btn>
              </v-toolbar>

              <v-card-text>
                <div> คุณ : {{ selectedEvent.name }} </div>
                <div> วัน : {{ new Date(selectedEvent.start).toLocaleDateString('TH') }} </div>
                <div> เวลา : {{ isTime(selectedEvent.start) }} - {{ isTime(selectedEvent.end) }} </div>
                <div v-if="selectedEvent.detail">
                  <span v-if="selectedEvent.detail.lists_name" class="mr-4"> รายการ : {{ selectedEvent.detail.lists_name }} </span>
                </div>
                <div v-if="selectedEvent.detail && selectedEvent.detail.lists_total"> ราคา : {{ selectedEvent.detail.lists_total | numeral }} </div>
                <div v-if="selectedEvent.mascara"> มาสคาร่า : รับ 29 บ. </div>
                <div v-if="selectedEvent.detail">
                  <span v-if="selectedEvent.detail.discount"> ส่วนลด : {{ selectedEvent.detail.discount }} </span>
                  <span v-if="selectedEvent.total" class="mr-4"> ราคาสุทธิ : {{ selectedEvent.total | numeral  }} </span>
                </div>
                <div v-if="selectedEvent.detail"> ข้อมูลติดต่อ : {{ selectedEvent.detail.social }} </div>
                <div v-if="selectedEvent.detail"> เบอร์โทร : {{ selectedEvent.detail.phone }} </div>
                <div v-if="selectedEvent.remark"> หมายเหตุ : {{ selectedEvent.remark }} </div>
                <div  v-if="selectedEvent.total && selectedEvent.type == 'expenses'"> ราคา : {{ selectedEvent.total | numeral }} </div>

                <div v-if="selectedEvent.status == 'จองคิว'" class="d-flex justify-space-between align-end">
                  <span>เปลี่ยนสถานะ</span>
                  <div>
                    <v-btn @click="changeStatus(selectedEvent)" outlined color="success" small>
                      สำเร็จ <v-icon color="success" right>mdi-check-circle-outline</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>

    <Loader v-if="loading" :loading="loading" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { houses, times } from '@/static/data.json'

export default {
  pageTitle: "หน้าแรก",
  toolbarMode: "hide",
  async validate({ params, query, store }) {
    const MenuCode = "calendar";
    const valid = await store.dispatch("menu/validateRole", MenuCode);
    return valid;
  },
  data() {
    return {
      focus: this.$moment().format('YYYY-MM-DD'),
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      loading: false,
      tab: 0
    }
  },
  computed: {
    ...mapGetters({
      calendar: 'service/calendar'
    }),
    listsBooking(){
      let lists = JSON.parse(JSON.stringify(this.calendar))
      lists = lists.filter(x => x.type == 'booking').map(x => {
        x.start = new Date(x.start)
        x.end = new Date(x.end)
        return x
      })
      return lists
    },
    listsExpenses(){
      let lists = JSON.parse(JSON.stringify(this.calendar))
      lists = lists.filter(x => x.type == 'expenses').map((x,i) => {
        x.start = new Date(x.start)
        x.end = new Date(x.end)
        return x
      })
      return lists
    },
    total(){
      try {
        return this.totalMonthBooking - this.totalMonthExpenses
      } catch (error) {
        return 0 
      }
    },
    totalMonthBooking(){
      if (this.calendar&&this.calendar.length > 0) {
        let lists = Object.assign([], this.calendar)
        let first = new Date(this.$moment(this.focus).startOf('month'))
        let end = new Date(this.$moment(this.focus).endOf('month'))
        let booking = lists.filter(x => x.type == 'booking' && x.status == 'สำเร็จ')
        return booking.filter(x => (new Date(x.start) >= first && new Date(x.start) <= end)).reduce((acc, list) => (acc + list.total), 0)
      }
      return 0
    },
    totalMonthExpenses(){
      if (this.calendar&&this.calendar.length > 0) {
        let lists = Object.assign([], this.calendar)
        let first = new Date(this.$moment(this.focus).startOf('month'))
        let end = new Date(this.$moment(this.focus).endOf('month'))
        let expenses = lists.filter(x => x.type == 'expenses')
        return expenses.filter(x => (new Date(x.start) >= first && new Date(x.start) <= end)).reduce((acc, list) => (acc + list.total), 0)
      }
      return 0
    },
    totalDateBookingNow(){
      if (this.calendar&&this.calendar.length > 0) {
        let lists = Object.assign([], this.calendar)
        let first = new Date(this.$moment(this.focus).startOf('day'))
        let end = new Date(this.$moment(this.focus).endOf('day'))
        let booking = lists.filter(x => x.type == 'booking' && x.status == 'สำเร็จ')
        return booking.filter(x => (new Date(x.start) > first && new Date(x.start) < end)).reduce((acc, list) => (acc + list.total), 0)
      }
      return 0
    },
    totalDateExpensesNow(){
      if (this.calendar&&this.calendar.length > 0) {
        let lists = Object.assign([], this.calendar)
        let first = new Date(this.$moment(this.focus).startOf('day'))
        let end = new Date(this.$moment(this.focus).endOf('day'))
        let expenses = lists.filter(x => x.type == 'expenses')
        return expenses.filter(x => (new Date(x.start) >= first && new Date(x.start) <= end)).reduce((acc, list) => (acc + list.total), 0)
      }
      return 0
    },
    mobile(){
      return this.$vuetify.breakpoint.width < 450
    },
    firstTime(){
      if (times&&times.length>0) {
        let first_time = times[0].value.split(":")[0] - 1
        return first_time
      }
      return 5
    },
    endTime(){
      if (houses&&houses.length>0) {
        return houses.length + 1
      }
      return 18
    },
    totalBooking(){
      let lists = Object.assign([], this.calendar)
      let first = new Date(this.$moment(this.focus).startOf('month'))
      let end = new Date(this.$moment(this.focus).endOf('month'))
      let booking = lists.filter(x => x.type == 'booking' && x.status == 'จองคิว')
      return booking.filter(x => (new Date(x.start) >= first && new Date(x.start) <= end)).reduce((acc, list) => (acc + list.total), 0)
    }
  },
  mounted() {
    if (this.$refs.booking) {
      this.$refs.booking.checkChange()
    }
    if (this.$refs.expenses) {
      this.$refs.expenses.checkChange()
    }
  },
  methods: {
    ...mapActions({
      loadDataCalendar: 'service/loadDataCalendar',
      loadInfo: 'booking/loadInfo',
      updateStatus: 'booking/update',
    }),
    viewDay({ date }) {
      this.focus = date
      if (this.mobile) {
        this.type = this.type=='month'?'day':'month'
        return
      }
      this.type = this.type=='month'?'4day':'month'
    },
    getEventColor(event) {
      return this.setColor(event)
    },
    prev() {
      this.$refs.booking.prev()
      this.$refs.expenses.prev()
    },
    next() {
      this.$refs.booking.next()
      this.$refs.expenses.next()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    isTime(date){
      return this.$moment(date).format('HH:mm')
    },
    intervalFormat(e){
      return e.time
    },
    intervalFormatExpenses(e){
      return 
    },
    setColor(event){
      if (event.type == 'booking') {
        return event.status == 'สำเร็จ' ? 'success': 'warning'
      }
      return 'error'
    },
    edit(event){
      if (event.type == 'booking') {
        return this.$router.replace(`/booking/${event.id}`)
      }
      return this.$router.replace(`/expenses/${event.id}`)
    },
    setDay({event, eventParsed, day}){
      return event.name
    },
    async changeStatus(object){
      try {
        const id = object.id
        let res = await this.loadInfo(id)
        if (res.status) {
          let params = res.payload
          if (params.booking_status == "จองคิว") {
            params.booking_status = "สำเร็จ"
            params.booking_lists_id = params.booking_lists.lists_id
            delete params.booking_lists
            delete params._id
            let result = await this.updateStatus({ id: id, form: params })
            if (result.status) {
              await this.loadDataCalendar()
              await this.$nextTick()
            }
          }
        }
        this.loading = false
        this.selectedOpen = false
      } catch (error) {
        this.loading = false
      }
    }
  },
  async created() {
    this.loading = true
    await this.loadDataCalendar()
    this.loading = false
  },
}
</script>

<style lang="scss" scoped></style>