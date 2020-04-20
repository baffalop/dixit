<template>
  <div id="welcome-screen" class="dialogue">
    <p>
      Welcome. Please enter your name to begin.
    </p>
    <form method="post" @submit.prevent="onSubmit">
      <input id="name" type="text" size="30" required v-model="name" />
      <input type="submit" value="BEGIN">
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class HelloWorld extends Vue {
  private name = ''

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
  input[type=submit] {
    background: #e9c98e;
    color: #46363f;
    border: none;
    margin: 15px;
    font-family: 'Noto Serif', serif;
    font-weight: bold;
    font-size: 1.2em;
    box-shadow: inset 0 0 20px #46363f;
    transition: box-shadow ease-out 0.2s;
  }

  input[type=submit]:hover {
    box-shadow: inset 0 0 25px #241c20;
    cursor: pointer;
  }

  form {
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
  }
</style>
