<template>
  <div class="hand">
    <img
      v-for="card in cards"
      :key="card"
      :src="cardSrc(card)"
      class="card"
      :class="{ selectable: cardsAreSelectable, selected: cardIsSelected(card) }"
      @click="onCardClick(card)"
      v-on-clickaway="() => onClickaway(card)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mixin as clickaway } from 'vue-clickaway2'

@Component({
  mixins: [clickaway],
})
export default class Hand extends Vue {
  @Prop({ type: Array, required: true }) readonly cards!: string[]

  private selected: string | null = null

  get cardsAreSelectable (): boolean {
    return this.selected === null
  }

  private onCardClick (card: string) {
    if (!this.cardsAreSelectable) {
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

  private onClickaway (card: string) {
    if (this.cardIsSelected(card)) this.deselect()
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
    width: 1200px;
    height: 700px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
  }

  .hand .card {
    width: 100px;
    margin: 10px;
    transition: all 0.4s;
  }

  .hand .card:hover {
    cursor: pointer;
  }

  .hand .card.selectable:hover {
    width: 450px;
    margin: -25px;
    justify-self: normal;
    z-index: 1000;
  }

  .hand .card.selected {
    width: 450px;
    margin: 25px;
    justify-self: normal;
    z-index: 1000;
  }
</style>
