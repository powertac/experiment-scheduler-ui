<template>
    <div id="experiments">
        <div class="container-fluid">
            <div class="row">
                <div class="col">
                    <h1>Experiments</h1>
                    <router-link to="/experiments/create" class="btn btn-outline-primary">
                        <fa-icon icon="plus" class="fa-icon" />
                        Create Experiment
                    </router-link>
                </div>
            </div>
            <div class="row mt-5">
                <div class="col">
                    <div class="experiment" v-for="experiment in experiments" :key="experiment.hash">
                        <div class="experiment-header">
                            <h3>
                                {{experiment.name}}
                                <small class="text-muted">@{{experiment.hash}}</small>
                            </h3>
                        </div>
                        <div class="experiment-body container-fluid">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="experiment-baseline">
                                        <h5>
                                            Baseline instances
                                            <span class="counter">
                                                {{experiment.baseline.length}}
                                            </span>
                                        </h5>
                                        <div class="instance" v-for="(instance, index) in experiment.baseline">
                                            <div class="instance-index">
                                                {{baselineIndex(index)}}
                                            </div>
                                            <div class="instance-body">
                                                <div class="instance-brokers">
                                                    <div class="broker-pill" v-for="broker in instance.brokers">
                                                    <span class="broker-pill-name">
                                                        {{broker.name}}
                                                    </span>
                                                        <!--<span class="broker-pill-version">
                                                        {{broker.version}}
                                                    </span>-->
                                                    </div>
                                                </div>
                                                <table class="server-parameter" v-if="instance.serverParameters.length > 0">
                                                    <tr v-for="param in instance.serverParameters">
                                                        <td>{{param.key}}</td>
                                                        <td>=</td>
                                                        <td>{{param.value}}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="experiment-treatments">
                                        <h5>
                                            Treatments
                                            <span class="counter">
                                                {{experiment.treatments.length}}
                                            </span>
                                            <!-- add treatment type -->
                                        </h5>
                                        <div class="treatment" v-for="(treatment, index) in experiment.treatments">
                                            <div class="treatment-index">{{index + 1}}</div>
                                            <div class="treatment-body" v-if="treatment.type === 'Change broker set'">
                                                <div class="broker-mutation" v-if="treatment.mutation.action.toString().toLocaleLowerCase() === 'add'">
                                                    <fa-icon class="fa-icon" icon="plus" />
                                                    Add broker
                                                </div>
                                                <div class="broker-mutation" v-if="treatment.mutation.action.toString().toLocaleLowerCase() === 'remove'">
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
                                            <div class="server-parameters" v-if="treatment.type === 'Set server parameter'">
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
                                <div class="col-md-4">
                                    <div class="experiment-instances">
                                        <h5>
                                            Instances
                                            <span class="counter">
                                                {{experiment.instances.length}}
                                            </span>
                                        </h5>
                                        <div class="instance" v-for="(instance, index) in experiment.instances">
                                            <div class="instance-index">
                                                {{instanceIndex(index, experiment.baseline.length)}}
                                            </div>
                                            <div class="instance-body">
                                                <div class="instance-brokers">
                                                    <div class="broker-pill" v-for="broker in instance.brokers">
                                                    <span class="broker-pill-name">
                                                        {{broker.name}}
                                                    </span>
                                                      <!--<span class="broker-pill-version">
                                                        {{broker.version}}
                                                    </span>-->
                                                    </div>
                                                </div>
                                                <table class="server-parameter" v-if="instance.serverParameters.length > 0">
                                                    <tr v-for="param in instance.serverParameters">
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
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import {VueAdapter} from '@/VueAdapter';
    import {Experiment} from '@/domain/Experiment/Experiment';

    @Component
    export default class Experiments extends VueAdapter {

        get experiments(): Experiment[] {
            return this.$store.getters['experiments/all'];
        }

        mounted() {
            this.$store.dispatch('experiments/refresh').then(() => {
                // TODO : add loading indication
            }).catch(() => {
                // TODO : show fatal error message
            });
        }

        private baselineIndex(index: number): string {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            return alphabet[index];
        }

        private instanceIndex(index: number, baselineSize: number): string {
            let baselineIndex = Math.floor(index / baselineSize);
            let treatmentsIndex = index % baselineSize;
            return this.baselineIndex(baselineIndex) + '' +
                + (treatmentsIndex + 1);
        }

    }
</script>

<style lang="scss" scoped>
    #experiments {
        padding: 2rem;
    }
    div.experiment {
        border: 1px solid #ccc;
        margin-bottom: .5em;
        border-radius: .2em;
        padding-bottom: .75em;
        background: #eaecf0;
        div.experiment-header {
            padding: 1em 1.25em;
        }
        div.experiment-body {
            & > .row {
                & > *:first-child {
                    padding-left: 1.25em;
                }
                & > *:last-child {
                    padding-right: 1.25em;
                }
            }
        }
    }
    div.instance {
        border: 1px solid #bbb;
        border-radius: .2em;
        display: flex;
        margin-bottom: .5em;
        background: #fff;
        .instance-index {
            padding: .75em 1.25em;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #cdd0d5;
        }
        .instance-body {
            padding: .75em 1em;
            div.instance-brokers {
                display: flex;
                flex-wrap: wrap;
            }
            .server-parameter {
                margin-top: .5em;
            }
        }
    }
    div.treatment {
        border: 1px solid #bbb;
        background: #fff;
        border-radius: .2em;
        display: flex;
        margin-bottom: .5em;
        .treatment-index {
            padding: .75em 1.25em;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #cdd0d5;
        }
        .treatment-body {
            display: flex;
            align-items: center;
            div.broker-mutation {
                margin: 0 1em;
                .fa-icon {
                    font-size: .75em;
                    margin-right: .75em;
                }
            }
        }
        div.server-parameters {
            display: flex;
            align-items: center;
        }
    }
    div.broker-pill {
        display: flex;
        align-items: stretch;
        background: #eaecf0;
        margin: .2em;
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
