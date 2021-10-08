<template>
  <div class="game-selector">
    <autocomplete :items="gameList"
                  :initial-value="initialName"
                  @item-selected="selectGame($event)"
                  @item-changed="selectGame($event)" />
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import Autocomplete from '@/components/form/Autocomplete.vue';
import {Game} from '@/domain/Game/Game';

@Component({components: {Autocomplete}})
export default class GameSelector extends Vue {

  @Prop({required: false, default: () => {}})
  private filter: (game: Game) => boolean

  @Prop({required: false, default: null})
  private initialValue: Game | null

  private mounted() {
    this.$store.dispatch('games/loadAll').then(() => {
      // TODO : add loading indication
    }).catch(() => {
      // TODO : show fatal error message
    });
    this.$store.dispatch('games/subscribe').then(() => {
      // TODO : add loading indication
    }).catch(() => {
      // TODO : show fatal error message
    });
  }

  get initialName(): string {
    if (null != this.initialValue) {
      return this.gameLabel(this.initialValue)
    }
    return ''
  }

  get gameList(): string[] {
    let jobs = this.$store.getters['games/findAll'];
    return jobs
        .sort((a: Game, b: Game) => b.start - a.start)
        .filter(this.filter)
        .map(this.gameLabel);
  }

  @Emit('game-selected')
  private selectGame(label: string): Game | null {
    const games = this.$store.getters['games/findAll']
    for (const index in games) {
      if (this.gameLabel(games[index]) == label) {
        return games[index]
      }
    }
    return null
  }

  private gameLabel(game: Game): string {
    return `${game.id} - ${game.name}`;
  }

}
</script>

<style scoped lang="scss">
</style>
