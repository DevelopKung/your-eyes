<template>
<div class="page-login d-flex justify-center align-center">
  <div>
    <v-card v-show="show_login" class="px-4 py-6 card" min-width="350" outlined>
      <div>
        <v-form  ref="form_login" v-model="valid_login" lazy-validation @submit.prevent="onSubmit()" autocompete="new" class="mt-4" autocomplete="off">
          <v-text-field v-model="member.username" :rules="requireRules" label="ชื่อเข้าใช้งาน"></v-text-field>
          <v-text-field
            autocomplete="off" 
            :append-icon="show_pwd ? 'mdi-eye' : 'mdi-eye-off'" 
            :rules="requireRules" :type="show_pwd ? 'text' : 'password'" 
            name="input-10-2" label="รหัสผ่าน" 
            v-model="member.password"
            @click:append="show_pwd = !show_pwd">
          </v-text-field>
          <v-btn type="submit" rounded class="mt-2" color="primary" dark :loading="loading" depressed large block> เข้าสู่ระบบ </v-btn>
        </v-form>
      </div>
    </v-card>
  </div>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
  layout: 'blank',
  data() {
    return {
      logo_image: "/logo.jpg",
      show_pwd: false,
      loading: false,
      valid_login: true,
      requireRules: [v => !!v || 'กรุณากรอกข้อมูล'],
      member: { username: "", password: "" },
      show_login: true,
    }
  },

  methods: {
    ...mapActions({
      register: 'register/register'
    }),
    async onSubmit() {
      this.loading = true
      try {
        const auth = await this.$auth.loginWith('local', { 
          data: {
            username: this.member.username,
            password: this.member.password
          } 
        })
        if (auth.data.status == true) {
          this.$router.replace("/")
        } else {
          await this.$auth.logout()
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: err.response.data.message, })
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-login {
  height: 100vh;
  background: url('~/static/bg.jpg')  top no-repeat;
  background-size: cover;
  position: relative;

  &:before {
      content: "";
      border-radius: 20px !important;
      background: rgba(255, 255, 255, 0.56);
      position: absolute;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
    }

  .card {
    background: url('~/static/logo.jpg')  right no-repeat;
    background-size: cover;
    border-radius: 20px !important;
    
    &:before {
      content: "";
      border-radius: 20px !important;
      background: rgba(255, 255, 255, 0.925);
      position: absolute;
      bottom: 0;
      top: 0;
      left: 0;
      right: 0;
    }
  }
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
