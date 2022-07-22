<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Game from '@/domain/Game/Game';
import GameStatusBlock from '@/components/game/GameStatusBlock.vue';
import FormattedDate from '@/components/time/FormattedDate.vue';
@Component({
  components: {FormattedDate, GameStatusBlock}
})
export default class GameViewHeader extends Vue {

  @Prop({required: true})
  private game: Game|null;

}
</script>

<template>
  <div class="game-view-header status-header">
    <div class="status-primary">
      <div class="status-title">
        <h1>{{game.name}}</h1>
        <game-status-block :game="game" />
      </div>
      <div class="tuple-table mt-2">
        <div class="tuple" v-if="game.baseline !== null">
          <div class="key">Baseline</div>
          <div class="value">
            <router-link :to="'/baselines/' + game.baselineId + '/details'">{{game.baseline.name}}</router-link>
          </div>
        </div>
        <div class="tuple" v-if="game.treatment !== null">
          <div class="key">Treatment</div>
          <div class="value">
            <router-link :to="'/treatments/' + game.treatment.id + '/details'">{{game.treatment.name}}</router-link>
          </div>
        </div>
        <div class="tuple" v-if="game.base !== null">
          <div class="key">Base game</div>
          <div class="value">
            <router-link :to="'/game/' + game.base.id">{{game.base.name}}</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="status-secondary">
      <div class="tuple-table">
        <div class="tuple">
          <div class="key">ID</div>
          <div class="value mono">{{game.id}}</div>
        </div>
        <div class="tuple">
          <div class="key">Created at</div>
          <div class="value mono text-uppercase"><formatted-date :date="game.createdAt" /></div>
        </div>
      </div>
    </div>
    <div class="status-nav">
      <router-link :to="{name: 'game-config', params: {gameId: game.id}}">
        <fa-icon icon="sliders-h" class="icon" />
        Game Config
      </router-link>
      <router-link :to="{name: 'game-files', params: {gameId: game.id}}">
        <fa-icon icon="file" class="icon" />
        Files
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div.status-header {
  background: #fafafa;
  border-bottom: 1px solid #ddd;
  display: flex;
  //justify-content: space-between;
  flex-wrap: wrap;
}
div.status-primary {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  padding: 2rem;
  flex-direction: column;

  div.status-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      font-size: 2rem;
      margin: 0;
    }
  }
}
div.status-nav {
  width: 100%;
  display: flex;
  align-self: flex-end;
  background: #eee;
  border-top: 1px solid #dbdfe2;

  a {
    color: #1E40AF;
    display: block;
    text-decoration: none;
    padding: .33rem 1.5rem;

    &.router-link-active, &:hover {
      color: #F1F5F9;
      background: #1D4ED8;
    }

    &:hover {
      background: #2563EB;
    }

    .icon {
      font-size: .875em;
      margin-right: .5em;
    }
  }
}
div.status-secondary {
  padding: 2rem;
  display: flex;
  align-items: flex-end;
}
div.game-status-block {
  padding: .5rem 1.33rem;
  margin-left: 2rem;
}
</style>

