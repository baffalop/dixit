<template>
  <div class="hand">
    <div
      v-for="card in cards"
      :key="card"
      class="card"
      :class="{
        selectable: canPlay && !hasSelected,
        selected: cardIsSelected(card),
      }"
    >
      <img
        :src="cardSrc(card)"
        @click="onCardClick(card)"
      />

      <div
        v-if="cardIsSelected(card)"
        v-on-clickaway="deselect"
        class="dialogue floating"
      >
        <form @submit.prevent="onPlay">
          <input v-if="stage == stages.AwaitingClue" v-model="clue" />
          <input v-if="stage == stages.Guessing" type="submit" value="Guess Card" />
          <input v-else type="submit" value="Play Card" />
        </form>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mixin as clickaway } from 'vue-clickaway2'
import { Stage } from '@/util/GameData'

@Component({
  mixins: [clickaway],
})
export default class Hand extends Vue {
  @Prop({ type: Array, required: true }) readonly cards!: string[]
  @Prop({ type: String, required: true }) readonly stage!: Stage
  @Prop({ type: Boolean, required: true }) readonly canPlay!: boolean

  readonly stages = Stage // expose Stage enum to embedded statements (ie. v-if)

  private selected: string | null = null
  private clue: string | null = null

  get hasSelected (): boolean {
    return this.selected !== null
  }

  private onPlay () {
    switch (this.stage) {
      case Stage.AwaitingClue:
        this.$emit('clue', {
          card: this.selected,
          clue: this.clue,
        })
        break

      case Stage.CollectingCards:
        this.$emit('play', {
          card: this.selected,
        })
        break

      case Stage.Guessing:
        this.$emit('guess', {
          card: this.selected,
        })
        break

      default:
        break
    }

    this.deselect()
  }

  private onCardClick (card: string) {
    if (!this.canPlay) {
      return
    }

    if (this.hasSelected) {
      this.deselect()
      return
    }

    this.selectCard(card)
  }

  private selectCard (card: string) {
    this.selected = card
  }

  private cardIsSelected (card: string): boolean {
    return card === this.selected
  }

  private deselect () {
    this.selected = null
  }

  private cardSrc (card: string) {
    return `/cards/${card}.jpg`
  }
}
</script>

<style scoped>
  .hand {
    margin: 20px;
    width: 1200px;
    height: 170px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
  }

  .hand .card img {
    height: 150px;
    margin: 10px;
    border-radius: 10px;
    box-shadow: 5px 5px 15px 0 #0e0a1073;
    transition: all 0.4s;
  }

  .hand .card img:hover {
    cursor: pointer;
  }

  .hand .card.selectable:hover {
    z-index: 1000;
  }

  .hand .card.selected {
    z-index: 1000;
  }

  .hand .card.selectable img:hover {
    height: 600px;
    margin: -45px;
    border-radius: 20px;
    justify-self: normal;
  }

  .hand .card.selected img {
    height: 600px;
    margin: -60px 25px;
    border-radius: 20px;
    justify-self: normal;
  }

  .floating {
    position: absolute;
  }
</style>
