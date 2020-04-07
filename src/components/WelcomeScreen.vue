<template>
  <div id="welcome-screen">
    <form method="post" @submit="onSubmit">
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

  private onSubmit () {
    console.log(`Got the name ${this.name}`)
  }
}
</script>

<style scoped>

</style>
