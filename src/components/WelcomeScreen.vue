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
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class HelloWorld extends Vue {
  private name!: string

  private async onSubmit () {
    const { data: myName } = await axios.post('/login', {
      name: this.name,
    })
    console.log('And my name is...')
    console.log(myName)
  }
}
</script>

<style scoped>

</style>
