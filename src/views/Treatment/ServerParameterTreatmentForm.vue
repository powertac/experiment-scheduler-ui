<template>
    <div class="server-parameter-treatment-form">
        <div class="form-action-close">
            <fa-icon icon="times" @click="closeForm" />
        </div>
        <div class="form-content">
            <parameter v-for="param in serverParameters" :key="param.id"
                       :allowedParameters="allowedParameters"
                       :enableRemove="isParameterRemovable(param)"
                       @param-updated="updateParam(param, $event)"
                       @param-removed="removeParam(param)" />
        </div>
        <div class="form-action-main" @click="submit" :class="{'disabled': !isSubmittable}">
            <fa-icon icon="plus" class="fa-icon" />
            Add treatment
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import ParameterInput from '@/components/form/ParameterInput.vue';
    import {BrokerType} from '@/domain/types/Broker';
    import BrokerConfigurationForm from '@/views/Broker/BrokerConfigurationForm.vue';
    import BrokerSelector from '@/components/BrokerSelector.vue';
    import {Parameter, TransientParameter} from '@/domain/types/Parameter';
    import uuid from 'uuid/v4';
    import {RestClient} from '@/api/RestClient';
    import {Treatment, TreatmentType} from '@/domain/Treatment/Treatment';

    @Component({components: {'broker-selector': BrokerSelector, 'parameter': ParameterInput}})
    export default class TreatmentsForm extends Vue {

        private serverParameters: TransientParameter[];
        private allowedParameters: string[];

        constructor() {
            super();
            this.$set(this, 'serverParameters', []);
            this.allowedParameters = [];
        }

        get isSubmittable(): boolean {
            return this.cleanedParameters.length > 0;
        }

        get cleanedParameters(): Parameter[] {
            const parameters: Parameter[] = [];
            this.serverParameters
                .filter((param) => param.key !== '')
                .filter((param) => param.value !== '')
                .forEach((param) => parameters.push({key: param.key, value: param.value}));
            return parameters;
        }

        get treatment(): Treatment {
            return {
                type: TreatmentType.ServerParameter,
                mutation: {
                    parameters: this.cleanedParameters
                }
            };
        }

        private created(): void {
            this.serverParameters.push({
                id: uuid(),
                key: '',
                value: '',
            });
            RestClient.supportedParams()
                .then((params) => this.allowedParameters = params.sort())
                .catch((e) => console.log(e));
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
        private onServerParametersChanged(params: TransientParameter[]): void {
            if (params.filter((param) => param.key === '' && param.value === '').length < 1) {
                this.serverParameters.push({
                    id: uuid(),
                    key: '',
                    value: '',
                });
            }
        }

        private submit(): void {
            if (this.isSubmittable) {
                this.$emit('submit:treatment', this.treatment);
            }
        }

        private closeForm(): void {
            this.$emit('form:close');
        }

    }
</script>

<style lang="scss" scoped>
    .server-parameter-treatment-form {
        position: relative;
        padding-top: 1.5em;
    }
    .form-content {
        padding: 2em;
    }
    .form-action-close {
        position: absolute;
        top: .5em;
        right: .875em;
        font-size: 1.5em;
        color: #4069FF;
        &:hover {
            cursor: pointer;
            color: #0C3CE8;
        }
    }
    .form-action-main {
        display: flex;
        justify-content: center;
        align-items: baseline;
        padding: .75em 1.5em;
        color: #4069FF;
        border-top: 1px solid #A5B3E8;
        background: #F2F5FF;
        &:hover {
            cursor: pointer;
            color: #0C3CE8;
            background: #E6EBFF;
        }
        &.disabled {
            border-top-color: #ccc;
            cursor: not-allowed;
            background: #eaecf0;
            color: #888;
            &:hover {
                background: #eaecf0;
                color: #888;
            }
        }
        .fa-icon {
            margin-right: 1em;
            font-size: .8em;
        }
    }
</style>
