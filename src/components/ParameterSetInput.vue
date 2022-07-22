<template>
  <div>
    <parameter v-for="param in serverParameters"
               :key="param.id"
               :initial-key="param.key"
               :initial-value="param.value"
               :allowedParameters="supportedParameters"
               :enableRemove="isParameterRemovable(param)"
               @param-updated="updateParam(param, $event)"
               @param-removed="removeParam(param)" />
  </div>
</template>

<script lang="ts">
import {Component, Emit, Vue, Watch} from 'vue-property-decorator';
import ParameterInput from '@/components/form/ParameterInput.vue';
import {TransientParameter} from '@/domain/types/Parameter';
import uuid from 'uuid/v4';

@Component({name: 'parameters-input', components: {'parameter': ParameterInput}})
export default class ParameterSetInput extends Vue {

  private commonParameters: {[key: string]: string}
  private serverParameters: TransientParameter[];

  constructor() {
    super();
    this.commonParameters = {};
    this.serverParameters = [];
  }

  private created(): void {
    this.$store.dispatch('loadSupportedParameters').then().catch();
    this.serverParameters.push({id: uuid(), key: '', value: ''});
  }

  get supportedParameters(): string[] {
    return this.$store.getters['supportedParameters'];
  }

  private updateParam(oldParam: TransientParameter, newParam: TransientParameter): void {
    newParam.id = oldParam.id;
    this.$set(this.serverParameters, this.serverParameters.indexOf(oldParam), newParam);
  }

  private removeParam(param: TransientParameter): void {
    this.$delete(this.serverParameters, this.serverParameters.indexOf(param));
  }

  private isParameterRemovable(param: TransientParameter): boolean {
    return this.serverParameters.length > 1 && !(
        this.serverParameters.indexOf(param) === (this.serverParameters.length - 1)
        && param.key === ''
        && param.value === '');
  }

  @Watch('serverParameters')
  @Emit('parameters-updated')
  private onServerParametersChanged(params: TransientParameter[]): {[key: string]: string} {
    // add empty field if there is none
    if (params.filter((param) => param.key === '' && param.value === '').length < 1) {
      this.serverParameters.push({
        id: uuid(),
        key: '',
        value: '',
      });
    }
    return params.filter((param) => param.key !== '' && param.value !== '')
        .reduce((parameterMap: {[key: string]: string}, parameter) => {
          parameterMap[parameter.key] = parameter.value;
          return parameterMap;
        }, {});
  }

}
</script>

<style lang="scss" scoped>
</style>
