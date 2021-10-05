<template>
    <div class="parameter">
        <!-- TODO : make outer corners round; include trash in line... redesign all the things! -->
        <autocomplete class="autocomplete col br-0 "
                      @item-selected="key = $event"
                      @item-changed="key = $event"
                      :items="allowedParameters"
                      :initial-value="initialKey"></autocomplete>
        <div class="separator">=</div>
        <div class="col">
            <input type="text" class="form-control parameter-value" v-model="value">
        </div>
        <button type="button" class="remove-parameter btn" :class="{disabled: !enableRemove}" :disabled="!enableRemove" @click="$emit('param-removed')">
            <fa-icon icon="times" />
        </button>
    </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
import Autocomplete from '@/components/form/Autocomplete.vue';
import {Parameter} from '@/domain/types/Parameter';

@Component({components: {autocomplete: Autocomplete}})
    export default class ParameterInput extends Vue {

        @Prop({required: false, default: () => []})
        private allowedParameters: string[];

        @Prop({required: false, default: () => true})
        private enableRemove: boolean;

        @Prop({required: false, default: ''})
        private initialKey: string;

        @Prop({required: false, default: ''})
        private initialValue: string;

        private key: string;
        private value: string;

        constructor() {
            super();
            this.key = this.initialKey;
            this.value = this.initialValue;
        }

        @Watch('key')
        @Emit('key-updated')
        private onKeyChange(key: string): string {
            this.updateParam();
            return key;
        }

        @Watch('value')
        @Emit('value-updated')
        private onValueChange(value: string): string {
            this.updateParam();
            return value;
        }

        @Emit('param-updated')
        private updateParam(): Parameter {
            return {
                key: this.key,
                value: this.value,
            };
        }

    }
</script>

<style scoped lang="scss">

    input.parameter-key {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .parameter-value {
        font-family: Inconsolata, monospace;
    }

    button.btn.remove-parameter {
      transition: none;
      color: var(--c-main);
      border-radius: 0;
      padding-left: 1rem;
      padding-right: 1rem;
      border: 1px solid #ced4da;
      border-left: 0;
      background: #fafafa;
      &:hover {
        background: var(--c-main);
        color: #fff;
        border-color: var(--c-main);
      }
      &:disabled {
        color: #aaa;
        border-color: #ced4da;
        &:hover {
          color: #aaa;
          background: #fafafa;
          border-color: #ced4da;
        }
      }
    }

    div.parameter {
        position: relative;
        display: flex;
        justify-content: space-between;
        margin-top: -1px;

        &:last-child {
            margin-bottom: 0;
        }

        .col {
            padding-left: 0;
            padding-right: 0;

            &:last-child input.form-control {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                font-family: Inconsolata, monospace;
            }
        }

        div.separator {
            padding: .3rem 1rem;
            background: #eaecf0;
            border-width: 1px 0 1px 0;
            border-style: solid;
            border-color: #ddd;
            display: flex;
            align-items: center;
        }

        input[type=text] {
          outline:0;
          -webkit-box-shadow:none;
          box-shadow:none;
          border-radius: 0;
          padding: .5em 1em;
          height: auto;
        }
    }

</style>
