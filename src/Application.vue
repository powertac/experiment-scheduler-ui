<template>
  <div id="app">
    <app-nav :server-status="orchestratorStatus" />
    <!-- <loader id="loader" v-if="!orchestratorStatus.running" /> -->
    <app-view />
  </div>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator';
import {VueAdapter} from '@/VueAdapter';
import {ServerStatus} from '@/domain/Service/ServerStatus';
import ServerStatusIndicator from '@/components/ServerStatusIndicator.vue';
import Loader from '@/components/Loader.vue';
import ApplicationNavigation from '@/components/application/ApplicationNavigation.vue';
import ApplicationView from "@/components/application/ApplicationView.vue";

@Component({components: {'server-status': ServerStatusIndicator, 'loader': Loader, 'app-nav': ApplicationNavigation, 'app-view': ApplicationView}})
export default class App extends VueAdapter {

  get orchestratorStatus(): ServerStatus {
    return this.$store.getters.orchestratorStatus;
  }

  private created(): void {
    this.$store.dispatch('activateOrchestratorStatusListener');
    this.$store.dispatch('startClock');
    this.$store.dispatch('games/loadAll')
      .catch(() => console.error("unable to load games"));
    this.$store.dispatch('games/subscribe')
        .catch(() => console.error('failed to subscribe to games channel'));
    this.$store.dispatch('brokers/subscribe')
        .catch(() => console.error('failed to subscribe to brokers channel'));
  }

}
</script>

<style lang="scss">
#app {
  font-family: "Assistant", Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;

  --nav-bg: #fff;
  --nav-option-bg: #eee;
  --view-bg: #fff;

  --c-main: #3071F2;

  --c1: #fff;
  --c2: #eee;
  --c3: #ccc;
  --c4: #262626;
  --c5: #0D0D0D;

  &.dark {
    --nav-bg: #222;
    --view-bg: #333;
  }
}
.placeholder-block {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0faf7;
  border: 1px solid #dde3e6;
  border-radius: .2rem;
  font-size: 1.1rem;
  color: #678;
  padding: 2rem;
}
.container-fluid.form-container {
  padding: 2rem;
  width: 50%;

}
  input[type=text].form-control {
    padding: .75em 1.25em;
    height: calc(1.5em + 1.5em + 2px);
  }

  .control-button {
    border: 1px solid #A5B3E8;
    border-radius: .2em;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    color: #4069FF;
    background: #F2F5FF;
    height: 2.75rem;

    .control-button-icon {
      width: 3em;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: .5em 1em;
      font-weight: bold;
    }

    .control-button-text {
      display: flex;
      align-items: center;
    }

    &:hover {
      background: #E6EBFF;
      color: #0C3CE8;
      cursor: pointer;
    }

    &.confirm {
      border-color: #85C985;
      color: #1C991C;
      background: #EDFFED;
      &:hover {
        color: #008000;
        background: #D9FFD9;
      }
    }

    &.disabled {
      border-color: #ccc;
      cursor: not-allowed;
      background: #eaecf0;
      color: #888;
      &:hover {
        background: #eaecf0;
        color: #888;
      }
    }
  }
  // TODO : find a more appropriate selector; otherwise the '#app' prefix is always required to override style
  #app code {
    font-family: "Inconsolata", monospace;
    font-size: .9em;
  }
</style>
