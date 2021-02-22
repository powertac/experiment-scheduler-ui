import {TreatmentType} from "@/domain/Treatment/Treatment";
<template>
    <div id="treatment-form">
        <div class="form-content">
            <div v-if="treatmentType === treatmentTypes.parameter">
                <server-parameters v-for="param in serverParameters" :key="param.id"
                           :allowedParameters="allowedParameters"
                           :enableRemove="isParameterRemovable(param)"
                           @param-updated="updateParam(param, $event)"
                           @param-removed="removeParam(param)" />
            </div>
            <div class="broker-treatment" v-if="treatmentType === treatmentTypes.broker">
                <div class="pill pill-selectable">
                    Add broker
                </div>
                <div class="pill pill-selectable">
                    Remove broker
                </div>
            </div>
        </div>
        <div class="form-action-main" :class="{'disabled': !isSubmittable}">
            <fa-icon icon="plus" class="fa-icon" />
            Add treatment
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import ParameterInput from '@/components/form/ParameterInput.vue';
    import uuid from 'uuid/v4';
    import {RestClient} from '@/api/RestClient';
    import {isValidParameterSet, TransientParameter} from '@/domain/types/Parameter';
    import {TreatmentType} from '@/domain/Treatment/Treatment';
    import {BrokerType} from '@/domain/types/Broker';

    @Component({components: {'server-parameters': ParameterInput}})
    export default class TreatmentsForm extends Vue {

        @Prop({required: true})
        private treatmentType: TreatmentType;

        private serverParameters: TransientParameter[];
        private allowedParameters: string[];

        private readonly treatmentTypes: {[key: string]: TreatmentType};

        constructor() {
            super();
            this.$set(this, 'serverParameters', []);
            this.allowedParameters = [];
            this.treatmentTypes = {
                'parameter': TreatmentType.ServerParameter,
                'broker': TreatmentType.BrokerSet
            };
        }

        get isSubmittable(): boolean {
            switch(this.treatmentType) {
                case TreatmentType.ServerParameter:
                    return isValidParameterSet(this.serverParameters);
                case TreatmentType.BrokerSet:
                    return false;
                default:
                    return false;
            }
        }

        get availableTypes(): BrokerType[] {
            return this.$store.getters['brokers/types'];
        }

        private created(): void {
            this.serverParameters.push({
                id: uuid(),
                key: '',
                value: '',
            });
            this.$store.dispatch('brokers/refresh');
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

    }
</script>

<style lang="scss" scoped>
    #treatment-form .form-content {
        //padding: 2em;
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
    div.pill {
        display: flex;
        align-items: stretch;
        background: #eaecf0;
        margin: 0 .2em;
        border-radius: .2em;
        border: 1px solid #ccc;
        padding: .3em 1em;
        &.pill-selectable {
            &:hover {
                background: #F2F5FF;
                color: #0C3CE8;
                cursor: pointer;
                border: 1px solid #A5B3E8;
            }
            &.selected {
                background: #4069FF;
                color: #F2F5FF;
                cursor: pointer;
                border: 1px solid #0C3CE8;
            }
            &:first-child {
                margin-left: 0;
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
    .broker-treatment {
        display: flex;

    }
</style>
