<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {formatDate} from '@/util/Date';
import Game from '@/domain/Game/Game';

@Component
export default class GameTable extends Vue {

  @Prop({required: true})
  private games: Game[];

  private selected: Game|null;

  constructor() {
    super();
    this.selected = null;
  }

  @Emit("game-selected")
  private select(game: Game): Game {
    this.selected = game;
    return game;
  }

  private formatDate(date: number): string {
    return formatDate(date);
  }

  // TODO : move to component
  private statusIcon(status: string): any {
    switch (status) {
      case 'queued':
        return ['far', 'clock'];
      case 'running':
        return ['fas', 'play'];
      case 'completed':
        return ['fas', 'check'];
      case 'failed':
        return ['fas', 'bolt'];
      case 'cancelled':
        return ['fas', 'times'];
    }
    return [];
  }

}
</script>

<template>
    <table class="table datatable table-hover table-bordered clickable-rows">
      <thead>
      <tr>
        <th class="col-center">Status</th>
        <th class="col-center">ID</th>
        <th>Name</th>
        <th>Brokers</th>
        <th class="text-center">Created at</th>
        <th class="text-center">Completed at</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="game in games"
          :key="game.id"
          :class="{'selected': game === selected}"
          @click="select(game)">
        <td class="col-center status-icon">
          <span class="status-icon"><fa-icon :icon="statusIcon(game.status)" /></span>
        </td>
        <td class="col-center monospaced">{{game.id.substr(0, 8)}}</td>
        <td>{{game.name}}</td>
        <td class="mono" v-html="game.brokers.map((b) => b.name + ':<code>' + b.version + '</code>').join(', ')"></td>
        <td class="monospaced text-center">{{formatDate(game.createdAt)}}</td>
        <td class="monospaced text-center" v-html="formatDate(game.end)"></td>
      </tr>
      </tbody>
    </table>
</template>

<style lang="scss" scoped>

</style>
