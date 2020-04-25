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
