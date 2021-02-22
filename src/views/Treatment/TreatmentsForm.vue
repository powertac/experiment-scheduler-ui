<template>
    <div id="treatments-form">
        <div class="container-fluid">
            <div class="row mb-5" v-if="formTitle !== ''">
                <div class="col">
                    <h1>{{formTitle}}</h1>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="inline-form-wrapper" v-if="typeSelectionOpen">
                        <div class="type-selection">
                            <div class="pill pill-selectable"
                                 v-for="type of treatmentTypes"
                                :class="{'selected': (type === treatmentTypeSelection)}"
                                 @click="treatmentTypeSelection = type">
                                {{type}}
                            </div>
                        </div>
                        <p class="warning" v-if="treatmentType !== treatmentTypeSelection && treatments.length > 0">
                            If you change the treatment type now, the existing treatments will be removed!
                        </p>
                        <div class="form-action-main" @click="confirmTreatmentType">
                            <fa-icon icon="check" class="fa-icon" />
                            Select treatment type
                        </div>
                    </div>
                    <div v-else>
                        <div class="control-button" @click="typeSelectionOpen = true" v-if="treatmentType === ''">
                            <div class="control-button-icon">
                                <fa-icon :icon="['far', 'circle']" />
                            </div>
                            <div class="control-button-text">
                                Select treatment type
                            </div>
                        </div>
                        <div class="control-button mt-2" @click="typeSelectionOpen = true" v-else>
                            <div class="control-button-icon">
                                <fa-icon icon="check" />
                            </div>
                            <div class="control-button-text">
                                <strong>Treatment type:</strong>
                                <span class="ml-3">{{treatmentType}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" v-if="treatmentType !== ''">
                <div class="col">
                    <div class="inline-form-wrapper mb-2" v-if="treatmentFormOpen">
                        <parameters-form v-if="treatmentType === treatmentTypes.parameter"
                                         v-on:submit:treatment="addTreatment"
                                         v-on:form:close="treatmentFormOpen = false" />
                        <broker-configuration-form v-if="treatmentType === treatmentTypes.broker"
                                                   :types="availableTypes"
                                                   :provide-treatment="true"
                                                   :submit-label="'Add treatment'"
                                                   v-on:submit:treatment="addTreatment"
                                                   v-on:form:close="treatmentFormOpen = false" />
                    </div>
                    <div class="control-button mt-2 mb-2" @click="treatmentFormOpen = true" v-else>
                        <div class="control-button-icon">
                            +
                        </div>
                        <div class="control-button-text">
                            Add treatment
                        </div>
                    </div>
                    <div class="treatment" v-for="(treatment, index) in treatments">
                        <div class="treatment-index">
                            {{index + 1}}
                        </div>
                        <div class="treatment-body">
                            <div class="treatment-brokers" v-if="treatment.type === treatmentTypes.broker">
                                <div class="broker-mutation" v-if="treatment.mutation.action === 'add'">
                                    <fa-icon class="fa-icon" icon="plus" />
                                    Add broker
                                </div>
                                <div class="broker-mutation" v-if="treatment.mutation.action === 'remove'">
                                    <fa-icon class="fa-icon" icon="minus" />
                                    Remove broker
                                </div>
                                <div class="broker-pill">
                                        <span class="broker-pill-name">
                                            {{treatment.mutation.broker.name}}
                                        </span>
                                        <!--<span class="broker-pill-version">
                                            {{treatment.mutation.broker.version}}
                                        </span>-->
                                </div>
                            </div>
                            <div class="treatment-parameters" v-if="treatment.type === treatmentTypes.parameter">
                                <table class="server-parameter">
                                    <tr v-for="param in treatment.mutation.parameters">
                                        <td>{{param.key}}</td>
                                        <td>=</td>
                                        <td>{{param.value}}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Treatment, TreatmentType} from '@/domain/Treatment/Treatment';
    import {BrokerType} from '@/domain/types/Broker';
    import BrokerSetTreatmentForm from '@/views/Treatment/BrokerSetTreatmentForm.vue';
    import BrokerConfigurationForm from '@/views/Broker/BrokerConfigurationForm.vue';
    import ServerParameterTreatmentForm from '@/views/Treatment/ServerParameterTreatmentForm.vue';

    @Component({components: {BrokerConfigurationForm, 'parameters-form': ServerParameterTreatmentForm, 'broker-set-form': BrokerSetTreatmentForm}})
    export default class TreatmentsForm extends Vue {

        @Prop({required: false, default: 'New Treatments'})
        private formTitle: string;

        private treatmentTypeSelection: string;
        private treatmentType: string;
        private treatments: Treatment[];
        private typeSelectionOpen: boolean;
        private treatmentFormOpen: boolean;

        private readonly treatmentTypes: {[key: string]: TreatmentType};

        constructor() {
            super();
            this.treatmentTypeSelection = '';
            this.treatmentType = '';
            this.treatments = [];
            this.typeSelectionOpen = false;
            this.treatmentFormOpen = false;
            this.treatmentTypes = {
                'parameter': TreatmentType.ServerParameter,
                'broker': TreatmentType.BrokerSet
            };
        }

        get availableTypes(): BrokerType[] {
            return this.$store.getters['brokers/types'];
        }

        private created(): void {
            this.$store.dispatch('brokers/refresh');
        }

        private confirmTreatmentType(): void {
            if (this.treatmentType !== this.treatmentTypeSelection) {
                this.treatments = [];
            }
            this.treatmentType = this.treatmentTypeSelection;
            this.typeSelectionOpen = false;
        }

        private addTreatment(treatment: Treatment): void {
            this.treatments.push(treatment);
            this.treatmentFormOpen = false;
            this.$emit('treatments:updated', this.treatments)
        }

    }
</script>

<style lang="scss" scoped>
  #treatments-form > .container-fluid {
    padding: 0;
  }
    div.alternative-actions {
        display: flex;
        align-items: stretch;
        padding-top: 1.5em;

        > .control-button {
            flex-grow: 1;
        }
        .alternative-actions-separator {
            display: flex;
            align-items: center;
            margin: 0 1.5em;
        }
    }
    div.inline-form-wrapper {
        margin-top: .5em;
        border: 1px solid #A5B3E8;
        border-radius: .2em;
    }
    div.type-selection {
        padding: 2em;
        display: flex;

        & + p.warning {
            padding: 0 2em 1em 2em;
            color: #DB0030;
        }
    }
    div.broker-mutation {
        display: flex;
        align-items: center;
        font-weight: bold;
        margin-right: 1em;
        padding-top: calc(.3em + 1px);
        .fa-icon {
            font-size: .75em;
            margin-right: .75em;
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
    div.treatment {
        border: 1px solid #ccc;
        border-radius: .2em;
        display: flex;
        flex-wrap: wrap;

        & + .treatment, & + .add-instance {
            margin-top: .5em;
        }

        &:hover .treatment-actions .fa-icon {
            color: #7B93E8;
        }

        .treatment-index {
            font-size: 1.5em;
            width: 3em;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: .5em 1.25em .5em 1.25em;
            //background: #eaecf0;
          font-weight: bold;
        }

        .treatment-body {
            display: flex;
            align-items: stretch;
        }

        .treatment-brokers {
            margin: .75em 0;
            padding: .5em .875em;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
        }

        .treatment-parameters {
            padding: 1em .875em 1em .875em;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
        }

        .treatment-actions {
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            flex-grow: 1;
            padding: 1em 1.25em;
            font-size: 1.3em;

            .fa-icon {
                color: #B5C0E8;
                &:hover {
                    color: #0C3CE8;
                    cursor: pointer;
                }

                & + .fa-icon {
                    margin-left: .75em;
                }
            }
        }
    }
    table.server-parameter {
        td {
            font-family: "Inconsolata", monospace;
            padding: .2em .5em;
        }
    }
    div.broker-pill {
        display: flex;
        align-items: stretch;
        background: #eaecf0;
        margin: 0 .2em;
        border-radius: .2em;
        border: 1px solid #ccc;
        &.broker-pill-selectable {
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
            &.disabled {
                cursor: not-allowed;
                color: #777;
                background: #cdd0d5;
                &:hover {
                    color: #777;
                    border-color: #ccc;
                }
            }
            &:first-child {
                margin-left: 0;
            }
            &:last-child {
                margin-right: 0;
            }
        }
        span.broker-pill-name {
            display: flex;
            align-items: center;
            padding: .3em 1em;
        }
        span.broker-pill-version {
            display: flex;
            align-items: center;
            background: #dadce0;
            border-left: 1px solid #cdd0d5;
            padding: .3em 1em;
        }
        span.broker-pill-actions {
            display: flex;
            align-items: center;
            border-top-right-radius: .2em;
            border-bottom-right-radius: .2em;
            background: #cdd0d5;
            padding: .3em .75em .3em .75em;

            .fa-icon {
                margin: .2em;
            }
        }
    }
</style>
