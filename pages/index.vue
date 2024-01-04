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

                <v-toolbar-title v-if="$refs.calendar"> {{ $refs.calendar.title }} </v-toolbar-title>

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
              <small> <b>ยอดทั้งเดือน</b> </small>
              <div :class="totalMonth? 'success--text':''"> <b>{{ totalMonth | numeral }}</b> </div>
            </v-card>
          </v-col>
          <v-col class="pa-1" cols="12" sm="6">
            <v-card outlined class="pa-4 d-flex justify-space-between align-center rounded-xl">
            <small> <b>ยอดวันที่ {{ new Date(focus).toLocaleDateString('TH') }}</b> </small>
            <div :class="totalDateNow? 'success--text':'error--text'"> <b>{{ totalDateNow | numeral }}</b> </div>
          </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-sheet height="600">
          <v-calendar 
            ref="calendar" color="primary"
            v-model="focus"
            :events="listsCalendar" 
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
    }
  },
  computed: {
    ...mapGetters({
      calendar: 'service/calendar'
    }),
    listsCalendar(){
      let lists = JSON.parse(JSON.stringify(this.calendar))
      lists = lists.map(x => {
        x.start = new Date(x.start)
        x.end = new Date(x.end)
        return x
      })
      return lists
    },
    totalDateNow(){
      if (this.calendar&&this.calendar.length > 0) {
        let lists = Object.assign([], this.calendar)
        let first = new Date(this.$moment(this.focus).startOf('day'))
        let end = new Date(this.$moment(this.focus).endOf('day'))
        let booking = lists.filter(x => x.type == 'booking')
        let expenses = lists.filter(x => x.type == 'expenses')

        expenses = expenses.filter(x => (new Date(x.start) > first && new Date(x.start) < end)).reduce((acc, list) => (acc + list.total), 0)
        booking = booking.filter(x => (new Date(x.start) > first && new Date(x.start) < end)).reduce((acc, list) => (acc + list.total), 0)
        return (booking - expenses)
      }
      return 0
    },
    totalMonth(){
      if (this.calendar&&this.calendar.length > 0) {
        let lists = Object.assign([], this.calendar)
        let first = new Date(this.$moment(this.focus).startOf('month'))
        let end = new Date(this.$moment(this.focus).endOf('month'))
        let booking = lists.filter(x => x.type == 'booking')
        let expenses = lists.filter(x => x.type == 'expenses')

        expenses = expenses.filter(x => (new Date(x.start) > first && new Date(x.start) < end)).reduce((acc, list) => (acc + list.total), 0)
        booking = booking.filter(x => (new Date(x.start) > first && new Date(x.start) < end)).reduce((acc, list) => (acc + list.total), 0)
        return (booking - expenses)
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
    }
  },
  mounted() {
    this.$refs.calendar.checkChange()
  },
  methods: {
    ...mapActions({
      loadDataCalendar: 'service/loadDataCalendar'
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
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
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