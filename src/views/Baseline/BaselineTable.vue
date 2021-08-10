<template>
  <div id="baseline-table" class="view">
    <div class="action-bar">
      <router-link to="/baselines/create">
        <fa-icon icon="plus" />
      </router-link>
    </div>
    <table class="table datatable table-hover table-bordered">
      <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Instance count</th>
        <th>Locked</th>
      </tr>
      </thead>
      <tbody>
        <tr>
          <td class="monospaced">
            f5fe69d
          </td>
          <td>EWIIS3 - paper & broker development</td>
          <td>22</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {Component} from "vue-property-decorator";
import {VueAdapter} from "@/VueAdapter";

@Component({})
export default class BaselineTable extends VueAdapter {}
</script>

<style lang="scss" scoped>
</style>
