<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({name: 'parameters-table'})
export default class ParametersTable extends Vue {

  @Prop({required: true})
  private parameters: {[key: string]: string};

}
</script>

<template>
  <table class="parameters">
    <tbody>
    <tr v-for="parameterKey in Object.keys(parameters)" :key="parameterKey">
      <td class="mono">{{parameterKey}}</td>
      <td>=</td>
      <td class="text-right mono">{{parameters[parameterKey]}}</td>
    </tr>
    </tbody>
  </table>
</template>
