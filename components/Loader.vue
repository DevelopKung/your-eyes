<template>
  <v-overlay :value="loading" z-index="999">
    <div class="loading pa-2">
      <v-img class="img" src="logo.png" width="100"></v-img>
    </div>
  </v-overlay>
</template>
<script>
export default {
  props : {
    loading : { type:Boolean , default:false },
    textLoad : { type:Boolean , default:false }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  background: #fff;
  border-radius: 50%;
  .img { border-radius: 50%; padding: 10px; }
  animation-name: loading;
  animation-duration: 1s;
  animation-iteration-count: infinite;

  @keyframes loading {
    0% { transform: scale(1); }
    100% { transform: scale(1.5); }
  }
}
</style>