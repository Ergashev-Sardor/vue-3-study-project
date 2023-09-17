<template>
  <section class="d-flex justify-center align-center flex-column">
    <p>{{ counter }}</p>
    <div class="actions d-flex" style="gap: 8px">
      <v-btn outlined color="success" @click="increment">+</v-btn>
      <v-btn outlined color="error" @click="decrement">-</v-btn>
    </div>
    <p>Pow: {{ powCounter }}</p>
  </section>
</template>

<script>
export default {
  props: {
    counter: {
      type: Number,
      required: true,
      default: 0
    },
    powCounter: {
      type: Number,
      required: true,
      default: 0
    }
  },
  methods: {
    increment() {
      this.$emit('increment')
    },
    decrement() {
      this.$emit('decrement')
    }
  }
}
</script>

<style scoped></style>
