<template>
  <section class="auth-wrapper">
    <div class="auth-wrapper__card">
      <v-form class="auth-wrapper__card-form" @submit.prevent="onSubmit">
        <h1 class="text-center">Authorization</h1>
        <v-text-field
          v-model="auth.email"
          variant="outlined"
          clearable
          label="Email"
          placeholder="test@mail.ru"
          type="email"
          hide-details
        />
        <v-text-field
          v-model="auth.password"
          variant="outlined"
          clearable
          label="Password"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          hide-details
          @click:append-inner="showPassword = !showPassword"
        />
        <v-btn class="w-100 mt-3" type="submit" color="primary">SUBMIT</v-btn>
      </v-form>
    </div>
    <v-snackbar v-model="snackbar.model">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="snackbar.model = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </section>
</template>

<script>
export default {
  data: () => ({
    auth: {
      email: 'test@mail.ru',
      password: '123456'
    },
    snackbar: {
      model: false,
      text: ''
    },
    showPassword: false
  }),
  methods: {
    onSubmit() {
      if (this.auth.email === 'test@mail.ru' && this.auth.password === '123456') {
        localStorage.setItem('token', 'Authorized')

        this.$router.push({ path: '/' })
      } else {
        this.snackbar.text = 'Incorrect password or email'
        this.$nextTick(() => {
          this.snackbar.model = true
        })
      }
    }
  }
}
</script>

<style scoped>
.auth-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-wrapper__card {
  width: 400px;
  border: 1px solid black;
}

.auth-wrapper__card-form {
  padding: 20px 20px;
}
</style>
