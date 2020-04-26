<template>
  <div>
    <PlayerList :players="gameData.players" :me="name" :turn="gameData.turn" />
    <button @click="$emit('quit')">QUIT</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { GameData } from '@/util/GameData'
import PlayerList from '@/components/PlayerList.vue'

@Component({
  components: {
    PlayerList,
  },
})

export default class Game extends Vue {
  @Prop({ type: Object, required: true }) gameData!: GameData
  @Prop({ required: true }) name!: string
}
</script>

<style scoped>
</style>
