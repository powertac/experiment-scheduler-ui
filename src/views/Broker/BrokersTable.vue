<template>
  <div id="game-details" class="view">
    <div class="action-bar">
      <router-link to="/brokers/create">
        <fa-icon icon="plus" class="icon-left" /> Add Broker
      </router-link>
    </div>
    <table class="table datatable table-bordered">
      <thead>
      <tr>
        <th class="col-center">Status</th>
        <th>Broker</th>
        <th>Version</th>
        <th>Image name</th>
      </tr>
      </thead>
      <tbody v-for="brokerName in brokersGroupedByName.keys()" :key="brokerName">
      <tr v-for="version in brokersGroupedByName.get(brokerName)" :key="version.version">
        <td class="col-center broker-status" :class="{'enabled': version.enabled}">
          {{version.enabled ? 'enabled' : 'disabled'}}
        </td>
        <td>{{brokerName}}</td>
        <td>{{version.version}}</td>
        <td class="monospaced">{{version.imageTag}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Duration from '@/components/time/Duration.vue';
import {Broker} from '@/domain/Broker/Broker';

@Component({components: {duration: Duration}})
export default class BrokersTable extends Vue {

  private mounted(): void {
    this.$store.dispatch('brokers/loadAll');
  }

  get brokers(): Broker[] {
    return this.$store.getters['brokers/findAll'];
  }

  get brokersGroupedByName(): Map<string, Broker[]> {
    const brokersByName: Map<string, Broker[]> = new Map<string, Broker[]>();
    this.brokers.forEach((b) => {
      if (!brokersByName.has(b.name)) {
        brokersByName.set(b.name, []);
      }
      const brokerGroup = brokersByName.get(b.name);
      if (undefined !== brokerGroup) {
        brokerGroup.push(b);
      }
    });
    return brokersByName;
  }

}
</script>

<style lang="scss" scoped>
.broker-list-content {
  padding: 2rem 3rem;
  h1 {
    margin-bottom: 2rem;
  }
}

td.broker-status {
  font-size: .75rem;
  text-transform: uppercase;
  vertical-align: middle;
  color: #999;
  background: #fafafa;
  &.enabled {
    background: #E0FFF5;
    color: #00804A;
  }
}

div.broker {
  h2 {
    padding: .75rem;
    font-size: 1.33rem;
    margin: 0;
    background: #eee;
  }
  border: 1px solid #ddd;
  border-radius: .2rem;
  margin-bottom: 1rem;
  table.datatable {
    border-top: 1px solid #dee2e6;
  }
}

</style>

