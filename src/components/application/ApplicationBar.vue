<template>
  <div id="bar">
    <div class="bar-navigation">
      <a class="bar-button " @click="showContent = !showContent">
        <fa-icon :icon="showContent ? 'angle-down' : 'angle-up'" />
      </a>
      <a class="bar-button" :class="{'active': showMessages, 'has-updates': hasMessageUpdates}" @click="toggleMessages">
        <fa-icon class="update" icon="circle" />
        <fa-icon class="fa-icon" icon="inbox" />
        Messages
      </a>
      <a class="bar-button">
        <fa-icon class="update" icon="circle" />
        <fa-icon class="fa-icon" :icon="hasRunningGames ? 'play' : 'pause'" />
        Running Games
      </a>
      <a class="bar-button align-right">
        <fa-icon class="update" icon="circle" />
        <fa-icon class="fa-icon server-status" icon="circle" />
        Server Status
      </a>
    </div>
    <div class="bar-content" v-if="showContent">
      <div class="messages" v-if="showMessages">
        <div class="message">
          <div class="timestamp">5 Minutes ago</div>
          <h4 class="title">
            <span class="label error">ERROR</span>
            Could not update 'Test Simulation'
          </h4>
          <p class="description">While trying to update the </p>
          <div class="reference">
            <fa-icon class="fa-icon" icon="arrow-right" />
            <span class="type">[ Game ]</span>
            <a href="#">Test Simulation</a>
          </div>
        </div>
        <div class="message">
          <div class="timestamp">12 Minutes ago</div>
          <h4 class="title">
            <span class="label success">Success</span>
            Finished 'Test Simulation'
          </h4>
          <div class="reference">
            <fa-icon class="fa-icon" icon="arrow-right" />
            <span class="type">[ Game ]</span>
            <a href="#">Test Simulation</a>
          </div>
          <div class="reference">
            <fa-icon class="fa-icon" icon="arrow-right" />
            <span class="type">[ Broker ]</span>
            <a href="#">EWIIS3</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component
  export default class MainNavigation extends Vue {

    private showContent: boolean;
    private showMessages: boolean;
    private hasMessageUpdates: boolean;
    private hasRunningGames: boolean;

    constructor() {
      super();
      this.showContent = false
      this.showMessages = true;
      this.hasMessageUpdates = true;
      this.hasRunningGames = true;
    }

    private toggleMessages() {
      this.showContent = !this.showContent;
      this.showMessages = true;
      this.hasMessageUpdates = !(this.showContent && this.showMessages) && this.hasMessageUpdates;
    }

  }
</script>

<style lang="scss">
#bar {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  overflow: visible;
  background: #eaeaea;
  border-top: 1px solid #ddd;

  .bar-navigation {
    overflow-y: auto;
    background: #e5e5e5;
    display: flex;
    align-items: flex-start;
  }

  .bar-button {
    position: relative;
    padding: .5rem 1rem;
    border-right: 1px solid #d0d0d0;
    border-bottom: 0;
    border-top: 0;
    font-size: .875rem;
    color: #555;
    &:hover, &.active {
      background: #d5d5d5;
      color: #111;
      cursor: pointer;
    }
    .fa-icon {
      margin-right: .5em;
      &.server-status {
        font-size: .875em;
        color: #00B362;
      }
    }
    .update {
      display: none;
      position: absolute;
      top: .8em;
      left: 1em;
      font-size: .75em;
      color: #007bff;
    }
    &.has-updates {
      .update {
        display: block;
      }
    }
    &.align-right {
      margin-left: auto;
      border-right: 0;
      border-left: 1px solid #d0d0d0;
    }
  }

  .bar-content {
    height: 15rem;
    background: #fafafa;
    box-sizing: content-box;
    max-height: 15rem;
    overflow: auto;
  }

  .messages {
    padding-bottom: 5rem;
    .message {
      padding: 1rem 1.5rem 0 1.5rem;
      .label {
        font-weight: 400;
        text-transform: uppercase;
        margin-right: .33em;
        &.error {
          color: #dc3545;
        }
        &.success {
          color: #00B362;
        }
      }
      div.timestamp {
        color: #555;
        font-size: .875rem;
        margin-bottom: .25rem;
      }
      h4.title {
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 700;
        margin-bottom: .25em;
        span.badge {
          margin-right: .5rem;
        }
      }
      p.description {
        margin-bottom: .25em;
      }
      div.reference {
        background: #fafafa;
        padding: .125em .5em;
        font-size: .875rem;
        .fa-icon {
          font-size: .75em;
          margin-right: .33rem;
        }
        span.type {
          margin-right: .33rem;
        }
      }
    }
  }

}
</style>
