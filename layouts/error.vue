<template>
  <v-app >
    <div class="error-page">
      <div class="index">
        <h1 v-if="error.statusCode === 404" class="primary--text"> {{ pageNotFound }} </h1>
        <h1 v-else class="primary--text"> {{ otherError }} </h1>
        <NuxtLink to="/" class="pl-6 "> กลับไปยังหน้าแรก </NuxtLink>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  layout: 'blank',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: 'ไม่พบหน้านี้',
      otherError: 'เกิดข้อผิดพลาด'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped lang="scss">
.error-page {
  height: 100vh;
  background: url('~/static/bg.jpg')  right no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .index { z-index: 1200 !important; }

  &:before {
    content: "";
    border-radius: 20px !important;
    background: rgba(255, 255, 255, 0.86);
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
  }
}
</style>
