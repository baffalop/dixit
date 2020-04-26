<template>
  <div class="dialogue">
    <ul>
      <li v-for="(player) in players" :key="player.name" :class="{ turn: player.turn }">
        {{ player.name }} ({{ player.score }})
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Player } from '@/util/GameData'

@Component
export default class PlayerList extends Vue {
  @Prop({ type: Array, required: true }) players!: Player[]
  @Prop({ type: String, required: true }) me!: string
}
</script>

<style scoped>
  .turn {
    font-weight: bold;
  }
</style>
