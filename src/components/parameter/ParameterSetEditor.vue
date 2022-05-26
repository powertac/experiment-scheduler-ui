<script lang="ts">
import {Component, Emit, Vue} from 'vue-property-decorator';
import Autocomplete from '@/components/form/Autocomplete.vue';

@Component({name: 'parameter-set-editor', components: {Autocomplete}})
export default class ParameterSetEditor extends Vue {

  private currentParamKey: string;
  private currentParamValue: string;
  private parameters: {[key: string]: string};

  constructor() {
    super();
    this.currentParamKey = "";
    this.currentParamValue = "";
    this.parameters = {};
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
      <autocomplete class="text-input" :items="supportedParameters"
                    v-on:item-changed="currentParamKey = $event"
                    v-on:item-selected="currentParamKey = $event" />
      <div class="key-value-separator">
        =
      </div>
      <input v-model="currentParamValue" type="text" class="text-input" />
      <button type="button" @click="addParam()">ADD</button>
    </div>
    <table class="parameters">
      <tbody>
      <tr v-for="parameterKey in Object.keys(parameters)" :key="parameterKey">
        <td><button type="button" @click="removeParam(parameterKey)"><fa-icon icon="times" /></button></td>
        <td class="mono">{{parameterKey}}</td>
        <td>=</td>
        <td class="text-right mono">{{parameters[parameterKey]}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>



<style lang="scss">
button[type=button] {
  font-size: .875em;
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

  div.autocomplete > input.text-input {
    border-top-left-radius: .2rem;
    border-bottom-left-radius: .2rem;
    min-width: 25rem;
    text-align: left;
  }

  div.key-value-separator {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
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

table.parameters {
  margin: .5rem 0;

  td {
    padding: .2rem .4rem;
  }
}
</style>
