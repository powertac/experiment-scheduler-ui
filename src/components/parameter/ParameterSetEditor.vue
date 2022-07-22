<script lang="ts">
import {Component, Emit, Vue} from 'vue-property-decorator';
import Autocomplete from '@/components/form/Autocomplete.vue';
import ParametersTable from '@/components/parameter/ParametersTable.vue';

@Component({name: 'parameter-set-editor', components: {ParametersTable, Autocomplete}})
export default class ParameterSetEditor extends Vue {

  private currentParamKey: string;
  private currentParamValue: string;
  private parameters: {[key: string]: string};

  private paramKeyReloadIndex: number;

  constructor() {
    super();
    this.currentParamKey = "";
    this.currentParamValue = "";
    this.parameters = {};
    this.paramKeyReloadIndex = 0;
  }

  private created(): void {
    this.$store.dispatch('loadSupportedParameters').catch(e => console.error(e));
  }

  get supportedParameters(): string[] {
    return this.$store.getters['supportedParameters'];
  }

  @Emit('parameters-updated')
  private addParam(): {[key: string]: string} {
    Vue.set(this.parameters, this.currentParamKey, this.currentParamValue);
    this.currentParamKey = '';
    this.currentParamValue = '';
    this.paramKeyReloadIndex = this.paramKeyReloadIndex + 1;
    return this.parameters;
  }

  @Emit('parameters-updated')
  private removeParam(key: string): {[key: string]: string} {
    Vue.delete(this.parameters, key);
    return this.parameters;
  }

}
</script>

<template>
  <div class="parameter-set-editor">
    <div class="parameter-input">
      <autocomplete :items="supportedParameters"
                    :reload-index="paramKeyReloadIndex"
                    v-on:item-changed="currentParamKey = $event"
                    v-on:item-selected="currentParamKey = $event" />
      <div class="key-value-separator">
        =
      </div>
      <input v-model="currentParamValue" type="text" class="text-input current-param-value" />
      <button type="button" @click="addParam()">Set parameter</button>
    </div>
    <parameters-table :parameters="parameters" :params-removable="true" @remove-param="removeParam" />
  </div>
</template>



<style lang="scss">
button[type=button] {
  font-size: .75em;
  text-transform: uppercase;
  border: 1px solid #ddd;
  border-radius: .2rem;
  padding: .6rem .85rem .6rem .875rem;
  line-height: 1;
  background: transparent;
  color: $slate-700;

  &:hover {
    background: #E0E7FF;
    color: #4338CA;
    border-color: #A5B4FC;
  }
}

div.parameter-input {
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  align-items: stretch;
  margin-bottom: .66rem;

  div.autocomplete {
    flex-grow: .7;
  }

  input.current-param-value {
    flex-grow: .3;
    border-radius: 0;
  }

  div.autocomplete > input.text-input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    min-width: 25rem;
    text-align: left;
    width: 100%;
  }

  div.key-value-separator {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background: #F1F5F9;
  }

  input.text-input {
    text-align: center;
  }

  button[type=button] {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -1px;
    border-left-color: transparent;
    &:hover {
      border-left-color: #A5B4FC;
    }
  }
}
</style>
