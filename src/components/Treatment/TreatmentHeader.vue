<template>
  <div>
    <div class="game-view-header">
      <div class="game-view-header-block">
        <h1 class="game-view-title">{{treatment.name}}</h1>
        <table class="meta">
          <tr>
            <th>ID</th>
            <td class="mono">{{treatment.id}}</td>
          </tr>
          <tr>
            <th>Created at</th>
            <td class="mono"><format-date :date="treatment.createdAt" /></td>
          </tr>
          <tr>
            <th>Progress</th>
            <td class="mono">{{Math.round(treatment.progress * 100)}}% ({{treatment.completedGames.length}}/{{treatment.games.length}})</td>
          </tr>
          <tr v-if="treatment.baseline !== null">
            <th>Baseline</th>
            <td><router-link :to="'/baselines/' + treatment.baseline.id + '/details'">
              <fa-icon icon="seedling" class="link-icon" />
              {{treatment.baseline.name}}
            </router-link></td>
          </tr>
        </table>
      </div>
      <div class="game-view-header-block">
        <h2>Treatment</h2>
        <table class="meta">
          <tr>
            <th>Type</th>
            <td>{{treatment.modifier.type}}</td>
          </tr>
          <template v-if="treatment.modifier.type === 'replace-broker'">
            <tr>
              <th>Original</th>
              <td>{{originalBroker.name}}:{{originalBroker.version}}</td>
            </tr>
            <tr>
              <th>Replacement</th>
              <td>{{replacementBroker.name}}:{{replacementBroker.version}}</td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Treatment} from '@/domain/Treatment/Treatment';
import FormatDate from '@/components/time/FormattedDate.vue';
import moment from 'moment';
import {formatDate} from '@/util/Date';
import GameStatusIcon from '@/components/game/GameStatusIcon.vue';
import {ReplaceBrokerModifier} from '@/domain/Treatment/ReplaceBrokerModifier';
import {Broker} from '@/domain/Broker/Broker';

@Component({name: 'treatment-header', components: {FormatDate, 'status-icon': GameStatusIcon}})
export default class TreatmentHeader extends Vue {

  @Prop({required: true})
  private treatment: Treatment<any>;

  get replaceBrokerModifier(): ReplaceBrokerModifier {
    return this.treatment.modifier;
  }

  get originalBroker(): Broker {
    return this.$store.getters['brokers/find'](this.replaceBrokerModifier.originalId);
  }

  get replacementBroker(): Broker {
    return this.$store.getters['brokers/find'](this.replaceBrokerModifier.replacementId);
  }

  private formatWeatherDate(date: number): string {
    return moment(date).format('L')
  }

  private formatDate(date: number): string {
    return formatDate(date);
  }

}
</script>

<style lang="scss">
div.game-view {
  display: flex;
  overflow: hidden;
  height: 100vh;
  flex-direction: row;
}
div.game-view-header {
  display: flex;
  background: #F1F5F9;
  border-bottom: 1px solid #CBD5E1;

  .game-view-title {
    display: flex;
    flex-direction: column;
    font-size: 2rem;
    small {
      font-size: 1rem;
      font-family: "Inconsolata", monospace;
    }
  }
  div.game-view-header-block {
    min-width: 18rem;
    padding: 1.75rem 2.33rem;
    h2 {
      font-size: 1.5rem;
    }
  }

  div.game-view-header-block + div.game-view-header-block {
    border-left: 1px solid #CBD5E1;
  }
}
.header-nav {
  background: #F1F5F9;
  border-bottom: 1px solid #CBD5E1;
  a {
    text-decoration: none;
    display: inline-block;
    padding: .25rem 1rem;
    &.router-link-active, &:hover {
      text-decoration: none;
      color: #fff;
      background: #3071F2;
    }
  }
}
</style>
