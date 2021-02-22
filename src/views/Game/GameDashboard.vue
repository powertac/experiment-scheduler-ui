<template>
  <div id="game-dashboard" class="view">
    <div class="container-fluid">
      <div class="row">
        <div class="col box">
          <h4>Currently running:</h4>
          Test Simulation #2
        </div>
        <div class="col">2</div>
        <div class="col">3</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component} from "vue-property-decorator";
  import {VueAdapter} from "@/VueAdapter";

  @Component
  export default class GameDashboard extends VueAdapter {
  }
</script>

<style lang="scss">

  #game-dashboard {

  }

  h1 {
    margin-bottom: 3rem;
  }
  div.box {
    background: #fff;
    padding: 2rem;
    border: 1px solid #eee;
  }
</style>
