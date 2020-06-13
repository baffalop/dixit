<template>
  <div>
    <h1 v-if="gameData.clue" class="clue">{{ gameData.clue }}</h1>

    <Hand
      :cards="gameData.table"
      :stage="gameData.stage"
      :can-play="canPlayFromTable"
    />

    <PlayerList :players="gameData.players" :me="name" />

    <Hand
      :cards="gameData.hand"
      :stage="gameData.stage"
      :can-play="canPlayFromHand"
      @clue="makeClue"
      @play="playCard"
    />

    <span>
      <button @click="$emit('quit')">QUIT</button>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import PlayerList from '@/components/PlayerList.vue'
import Hand from '@/components/Hand.vue'
import { GameData, Stage } from '@/util/GameData'
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

  get canPlayFromHand (): boolean {
    if (!this.gameData.canPlay) {
      return false
    }

    switch (this.gameData.stage) {
      case Stage.AwaitingClue:
      case Stage.CollectingCards:
        return true
      default:
        return false
    }
  }

  get canPlayFromTable (): boolean {
    return this.gameData.canPlay && this.gameData.stage == Stage.Guessing
  }

  private makeClue (data: { card: string, clue: string }) {
    this.client.makeClue(data)
    this.gameData.canPlay = false
  }

  private playCard (data: { card: string }) {
    this.client.playCard(data)
    this.gameData.canPlay = false
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
