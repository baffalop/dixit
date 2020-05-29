<template>
  <div>
    <h1 v-if="gameData.clue" class="clue">{{ gameData.clue }}</h1>
    <PlayerList :players="gameData.players" :me="name" />
    <Hand :cards="gameData.hand" />
    <span>
      <button @click="$emit('quit')">QUIT</button>
      <button v-if="gameData.myTurn || gameData.turn === null" @click="takeTurn()">PLAY</button>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import PlayerList from '@/components/PlayerList.vue'
import Hand from '@/components/Hand.vue'
import { GameData } from '@/util/GameData'
import { PlayClient } from '@/util/PlayClient'

@Component({
  components: {
    PlayerList,
    Hand,
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
  .clue {
    font-family: 'Trade Winds', serif;
    font-style: normal;
    color: #ab8b8e;
  }
</style>
