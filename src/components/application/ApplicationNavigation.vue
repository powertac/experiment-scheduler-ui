<template>
  <div id="nav">
    <div class="brand">POWERTAC</div>
    <router-link class="nav-option" to="/games">
      <fa-icon icon="dice-d6" transform="shrink-2" class="nav-option-icon" />
      Games
    </router-link>
    <router-link class="nav-option" to="/experiments">
      <fa-icon icon="flask" transform="shrink-2" class="nav-option-icon" />
      Experiments
    </router-link>
    <!--
    <router-link class="nav-option" to="/analysis">
      <fa-icon icon="chart-line" transform="shrink-2" class="nav-option-icon" />
      Analysis
    </router-link>
    <router-link class="nav-option mt-5" to="/system">
      <fa-icon icon="server" transform="shrink-2" class="nav-option-icon" />
      System
    </router-link>
    <router-link class="nav-option" to="/help">
      <fa-icon icon="info-circle" transform="shrink-2" class="nav-option-icon" />
      Help
    </router-link>
    -->
    <div class="footer">
      <div class="connection-status" :class="{'dead': !serverStatus.running}">
        <fa-icon class="fa-icon" icon="circle"></fa-icon>
        <span class="label" v-if="serverStatus.healthy">Orchestrator online</span>
        <span class="label" v-else>Orchestrator offline</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {ServerStatus} from "@/domain/types/Server";

  @Component
  export default class ApplicationNavigation extends Vue {

    @Prop() readonly serverStatus: ServerStatus;

  }
</script>

<style lang="scss">

  #nav {
    position: relative;
    background: var(--nav-bg);
    border-right: 1px solid #eee;
    min-width: 15rem;

    div.brand {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.75rem;
      overflow: hidden;
      border-bottom: 1px solid #eee;
      background: repeating-linear-gradient(
              45deg,
              #fff,
              #fff 5px,
              #ccc 5px,
              #ccc 5px
      );
      margin-bottom: 2.5rem;
      font-weight: bold;
      font-size: .875em;
      color: #040DBF;
    }

    a.nav-option {
      display: flex;
      align-items: center;
      color: #555;
      padding: .5rem 3rem .5rem 2rem;
      text-decoration: none;
      outline: none;
      font-size: 1.1em;

      .nav-option-icon {
        margin-right: 1.5em;
      }

      &.router-link-active {
        color: #3071F2;
        &:hover {
          color: #3071F2;
        }
      }
      &:hover {
        color: #3071F2;
      }
    }

    div.footer {
      position:absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;


      div.connection-status {
        padding: 1rem 2rem;
        text-align: center;
        span.label {
          text-transform: uppercase;
          font-size: .875em;
          color: #555;
        }
        .fa-icon {
          font-size: .75em;
          margin-right: .5rem;
          color: #00D072;
        }
        &.dead {
          span.label {
            color: #FF2C00;
          }
          background: #ffc9c9;
          .fa-icon {
            color: #FF2C00;
          }
        }
      }
    }

  }
</style>
