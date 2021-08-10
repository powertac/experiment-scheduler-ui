<template>
    <div class="form-container">
        <div class="mdl" v-if="addInstanceOpen">
            <instance-form :form-title="'New Instance'"
                           :form-submit-label="'Add instance'"
                           :with-name="false"
                           v-on:form:close="addInstanceOpen = false"
                           v-on:form:submit="addInstance" />
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col">
                    <h1 class="mt-4 mb-4">Create new experiment</h1>
                    <div class="form-group mb-4">
                        <h4><label for="experiment-name">Name</label></h4>
                        <input type="text" v-model="name" class="form-control" id="experiment-name" placeholder="Any name will do ...">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <h4 class="with-info-icon">Baseline <fa-icon :icon="['far', 'question-circle']" class="info-icon" /></h4>
                    <div class="control-button" @click="addInstanceOpen = true">
                        <div class="control-button-icon">
                            +
                        </div>
                        <div class="control-button-text">
                            Add baseline instance
                        </div>
                    </div>
                    <div class="baseline-instances mt-2 mb-4">
                        <div class="baseline-instance" v-for="(instance, index) in baseline">
                            <div class="baseline-instance-index">
                                {{ instanceIndex(index) }}
                            </div>
                            <div class="baseline-instance-body">
                                <div class="baseline-instance-brokers">
                                    <div class="broker-pill" v-for="broker in instance.brokers">
                                        <span class="broker-pill-name">
                                            {{broker.name}}
                                        </span>
                                        <!--<span class="broker-pill-version">
                                            {{broker.version}}
                                        </span>-->
                                    </div>
                                </div>
                                <div class="baseline-instance-parameters" v-if="instance.serverParameters.length > 0">
                                    <table class="server-parameter">
                                        <tr v-for="param in instance.serverParameters">
                                            <td>{{param.key}}</td>
                                            <td>=</td>
                                            <td>{{param.value}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div class="baseline-instance-actions">
                                <fa-icon icon="pen" class="fa-icon"></fa-icon>
                                <fa-icon icon="copy" class="fa-icon"></fa-icon>
                                <fa-icon :icon="['fas', 'trash-alt']" class="fa-icon"></fa-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <h4 class="with-info-icon">Treatments <fa-icon :icon="['far', 'question-circle']" class="info-icon" /></h4>
                    <treatments-form form-title="" v-on:treatments:updated="setTreatments" />
                </div>
            </div>
            <div class="row mt-5 mb-4">
                <div class="col">
                    <div class="alternative-actions">
                        <div class="control-button confirm"
                             :class="{'disabled': !isValid}"
                             @click="submit">
                            <div class="control-button-icon">
                                <fa-icon icon="check" />
                            </div>
                            <div class="control-button-text">
                                Queue experiment
                            </div>
                        </div>
                        <div class="alternative-actions-separator">
                            OR
                        </div>
                        <div class="control-button" @click="cancel">
                            <div class="control-button-icon">
                                <fa-icon icon="times" />
                            </div>
                            <div class="control-button-text">
                                Cancel
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {GameSpec} from '@/domain/Game/GameSpec';
    import ExperimentGameForm from '@/views/Game/ExperimentGameForm.vue';
    import TreatmentsForm from '@/views/Treatment/TreatmentsForm.vue';
    import {Treatment} from '@/domain/Treatment/Treatment';
    import {RestClient} from '@/api/RestClient';
    import {Experiment} from '@/domain/Experiment/Experiment';
    import {ExperimentSpec} from '@/domain/Experiment/ExperimentSpec';

    @Component({components: {'instance-form': ExperimentGameForm, 'treatments-form': TreatmentsForm}})
    export default class ExperimentForm extends Vue {

        private name: string;
        private baseline: GameSpec[];
        private treatments: Treatment[];
        private addInstanceOpen: boolean;

        constructor() {
            super();
            this.name = '';
            this.baseline = [];
            this.treatments = [];
            this.addInstanceOpen = false;
        }

        get isValid(): boolean {
            return this.name !== ''
                && this.baseline.length > 0
                && this.treatments.length > 0;
        }

        get experiment(): ExperimentSpec {
            return {
                name: this.name,
                baseline: this.baseline,
                treatments: this.treatments
            };
        }

        private addInstance(instance: GameSpec): void {
            this.baseline.push(instance);
            this.addInstanceOpen = false;
        }

        private setTreatments(treatments: Treatment[]): void {
            this.treatments = treatments;
        }

        private instanceIndex(index: number): string {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            return alphabet[index];
        }

        private submit(): void {
            if (this.isValid) {
                console.log(this.experiment);
                RestClient.createExperiment(this.experiment)
                    .then((message: string) => console.log(message))
                    .catch((error: any) => console.error(error));
                this.$router.push('/experiments');
            }
        }

        private cancel(): void {
            this.$router.back();
        }

    }
</script>

<style lang="scss" scoped>
    .form-container {
        padding: 2rem 3rem;
        position: relative;
    }

    div.mdl {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255, 0.9);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #game-form {
        width: 100%;
    }

    h2, h3, h4 {
        margin-top: .75rem;
        margin-bottom: 1rem;
    }

    label.name-label {
        font-size: 1.75em;
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

    .with-info-icon {
        display: flex;
        align-items: baseline;
        .info-icon {
            font-size: .7em;
            margin-left: .5em;
            //color: #0C3CE8;
            color: #555;
            cursor: pointer;
        }
    }

    div.baseline-instance {
        border: 1px solid #ccc;
        border-radius: .2em;
        display: flex;
        flex-wrap: wrap;

        & + .baseline-instance, & + .add-instance {
            margin-top: .5em;
        }

        &:hover .baseline-instance-actions .fa-icon {
            color: #7B93E8;
        }

        .baseline-instance-index {
            font-size: 1.5em;
            width: 3em;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: .5em 1.25em .5em 1.25em;
            background: #eaecf0;
        }

        .baseline-instance-brokers {
            margin: .75em 0;
            padding: .5em .875em;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
        }

        .baseline-instance-parameters {
            padding: 0 .875em 1em .875em;
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
        }

        .baseline-instance-actions {
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

    div.add-instance {
        border: 1px solid #A5B3E8;
        border-radius: .2em;
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        margin-bottom: 1.5em;
        color: #4069FF;

        .add-instance-icon {
            font-size: 1.5em;
            width: 3em;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: .5em 1.25em .5em 1.25em;
            font-weight: bold;
        }

        .add-instance-text {
            display: flex;
            align-items: center;
            font-size: 1.2em;
        }

        &:hover {
            background: #F2F5FF;
            color: #0C3CE8;
            cursor: pointer;
        }
    }

    div.broker-pill {
        display: flex;
        align-items: stretch;
        background: #eaecf0;
        margin: 0 .2em;
        border-radius: .2em;
        border: 1px solid #ccc;
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

    table.server-parameter {
        td {
            font-family: "Inconsolata", monospace;
            padding: .2em .5em;
        }
    }

</style>
