<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';

@Component({name: 'parameters-table'})
export default class ParametersTable extends Vue {

  @Prop({required: true})
  private parameters: {[key: string]: string};

  @Prop({required: false, default: () => false})
  private paramsRemovable: boolean;

  @Emit("remove-param")
  private removeParam(key: string): string {
    return key;
  }

}
</script>

<template>
  <table class="key-value">
    <thead>
    <tr>
      <th>Parameter</th>
      <th class="text-center">Value</th>
      <th v-if="paramsRemovable"></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="parameterKey in Object.keys(parameters).slice().sort()" :key="parameterKey">
      <td class="mono">{{parameterKey}}</td>
      <td class="text-center mono">{{parameters[parameterKey]}}</td>
      <td v-if="paramsRemovable" class="text-right">
        <fa-icon icon="times" @click="removeParam(parameterKey)" />
      </td>
    </tr>
    <tr v-if="Object.values(parameters).length < 1">
      <td :colspan="paramsRemovable ? 3 : 2" class="text-center no-data-text">No parameters set</td>
    </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
table.key-value {
  //width: 100%;
}
</style>
