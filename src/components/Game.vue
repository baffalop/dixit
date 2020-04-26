<template>
  <div>
    <PlayerList :players="gameData.players" :me="name" />
    <span>
      <button @click="$emit('quit')">QUIT</button>
      <button v-if="gameData.myTurn || gameData.turn === null" @click="takeTurn()">PLAY</button>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import PlayerList from '@/components/PlayerList.vue'
import { GameData } from '@/util/GameData'
import { PlayClient } from '@/util/PlayClient'

@Component({
  components: {
    PlayerList,
  },
})

export default class Game extends Vue {
  @Prop({ type: Object, required: true }) gameData!: GameData
  @Prop({ required: true }) name!: string
  @Prop({ type: Object, required: true }) client!: PlayClient

  private takeTurn () {
    this.client.takeTurn()
    this.gameData.myTurn = false
  }
}
</script>

<style scoped>
</style>
