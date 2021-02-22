<template>
    <div class="parameterEditor container-fluid pl-0 pr-0 mb-3">
        <h6>Server Parameters</h6>
        <div class="parameters">
            <div class="parameter" v-for="param of parameters" :key="param.id">
                <autocomplete class="autocomplete col param-left"
                              :items="allowedParameters" ></autocomplete>
                <div class="separator">=</div>
                <div class="col">
                    <input type="text" class="form-control" >
                </div>
                <div class="btn-group" v-if="Object.keys(parameters).length > 1" role="group" aria-label="Button group with nested dropdown">
                    <button type="button" class="btn-outline-secondary btn" @click="removeParam(param.id)">
                        <fa-icon icon="trash-alt" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Model, Prop, Vue} from 'vue-property-decorator';
    import Autocomplete from '@/components/form/Autocomplete.vue';
    import uuid from 'uuid/v4';
    import {TransientParameter} from '@/domain/types/Parameter';

    @Component({components: {autocomplete: Autocomplete}})
    export default class ParameterEditor extends Vue {

        @Model('input', {required: true})
        private readonly parameters: Map<string, TransientParameter>;

        @Prop({required: true, default: () => []})
        private allowedParameters: string[];

        @Emit('input')
        private setParams(params: Map<string, TransientParameter>): Map<string, TransientParameter> {
            return params;
        }

        private mounted(): void {
            if (Array.from(this.parameters.keys()).length < 1) {
                const parameters = new Map();
                const param = this.createParam();
                parameters.set(param.id, param);
                this.setParams(parameters);
            }
        }

        private createParam(): TransientParameter {
            return {
                id: uuid(),
                key: '',
                value: '',
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
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left: 0;
    }

    div.parameter {
        display: flex;
        justify-content: space-between;
        margin-bottom: -1px;

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
            //padding: .3rem 1rem;
            color: red;
            background: #f0f0f0;
            border-width: 1px 0 1px 0;
            border-style: solid;
            border-color: #ddd;
            display: flex;
            align-items: center;
        }
    }

</style>
