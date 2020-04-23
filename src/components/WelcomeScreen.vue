<template>
  <div id="welcome-screen" class="dialogue">
    <p>
      Welcome. Please enter your name to begin.
    </p>
    <form method="post" @submit.prevent="onSubmit">
      <input type="text" size="30" required v-model="name" />
      <input type="submit" value="BEGIN">
      <p class="message" v-if="message">{{ message }}</p>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  @Prop({ default: '' }) readonly initialName!: string
  @Prop({ default: '' }) readonly message!: string

  private name = this.initialName

  private onSubmit () {
    this.$emit('submit', {
      name: this.name,
    })
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

  .message {
    color: #d7686a;
    font-size: 0.8em;
  }
</style>
