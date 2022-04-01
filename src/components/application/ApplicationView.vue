<template>
  <div id="content">
    <div id="view">
      <router-view class="view" />
      <router-view class="sidebar" name="sidebar" />
    </div>
    <!--<app-bar class="bar" />-->
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ApplicationNavigation from "@/components/application/ApplicationNavigation.vue";
import ApplicationBar from "@/components/application/ApplicationBar.vue";

@Component({components: {'app-nav': ApplicationNavigation, 'app-bar': ApplicationBar}})
  export default class ApplicationView extends Vue {}
</script>

<style lang="scss">
  #view {
    display: flex;
    flex-grow: 1;
    .view {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow-y: auto;
      align-self: stretch;
      border-right: 1px solid #ddd;

      div.action-bar {
        position: sticky;
        top: 0;
        display: flex;
        align-items: stretch;
        background: #fff;
        border-bottom: 1px solid #ddd;
        height: 2.75rem;
        z-index: 999;

        a {
          height: calc(2.75rem - 1px);
          .icon {
            margin-right: .5em;
          }
        }

        label.filter-toggle, a {
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          color: #3071F2;
          margin: 0;
          background: #fff;
          &:hover {
            background: #040DBF;
            background: #3071F2;
            color: #fff;
          }
        }
      }
    }

    .sidebar {
      min-width: 15rem;
      width: 22.5%;
      max-width: 40rem;
      overflow-y: auto;
    }
  }

  #content {
    display: flex;
    flex-grow: 1;
    flex-wrap: nowrap;
    flex-direction: column;
    background: var(--view-bg);
    align-items: stretch;
  }
</style>
