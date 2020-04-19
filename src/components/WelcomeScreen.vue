<template>
  <div id="welcome-screen">
    <form method="post" @submit.prevent="onSubmit">
      <label for="name">Your name:</label>
      <input id="name" type="text" required v-model="name" />

      <input type="submit" value="Begin">
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  @Prop() private name!: string

  private async onSubmit () {
  }
}
</script>

<style scoped>

</style>
