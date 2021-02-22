<template>
    <div id="job-form" class="container">
        <h1 class="mb-5">Create new job</h1>
        <div class="form-group mb-5">
            <label for="job-name">Name</label>
            <input type="text" v-model="name" class="form-control" id="job-name" placeholder="Any name will do ...">
        </div>
        <h4 class="mb-3">Simulation parameters</h4>
        <p class="mb-3">
            These parameters will apply to the game during simulation. They do not affect the bootstrap run. For a full
            reference of configurable parameters, please refer to this
            <a href="https://github.com/powertac/server-distribution/blob/master/config/server.properties" target="_blank">
                <code>server.properties</code> file on github</a>.
        </p>
        <p class="mb-3">
            <em>Please be advised: The parameters you pass will not be validated before running the simulation.</em>
        </p>
        <div class="parameters mb-5">
            <parameter v-for="param in simulationParameters" :key="param.id"
                       :allowedParameters="allowedParameters"
                       :enableRemove="isParameterRemovable(param)"
                       @param-updated="updateParam(param, $event)"
                       @param-removed="removeParam(param)"
            ></parameter>
        </div>
        <div class="form-group">
            <h4 class="mb-3">Brokers</h4>
            <broker-selector :types="availableTypes" :callback="setBrokers"></broker-selector>
        </div>
        <div class="text-right mt-5 form-actions">
            <button type="button" class="btn btn-outline-secondary btn-lg mr-3" @click="$router.back()">
                <fa-icon icon="times-circle" />
                Cancel
            </button>
            <button class="queue-job btn btn-primary btn-lg" :class="{disabled: !isValid}" :disabled="!isValid" @click="queueJob">
                <fa-icon icon="check" class="fa-icon"></fa-icon>
                Queue job
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {StompClient} from '@/api/StompClient';
    import {Broker, BrokerType} from '@/domain/types/Broker';
    import {JobRequest, Parameter} from "@/domain/types/Job";
    import BrokerSelector from '@/components/BrokerSelector.vue';
    import {RestClient} from '@/api/RestClient';
    import {TransientParameter} from '@/domain/types/Parameter';
    import ParameterInput from '@/components/form/ParameterInput.vue';
    import uuid from 'uuid/v4';

    @Component({components: {'broker-selector': BrokerSelector, 'parameter': ParameterInput}})
    export default class JobForm extends Vue {

        private name: string;
        private brokers: Broker[];
        private simulationParameters: TransientParameter[];
        private allowedParameters: string[];

        constructor() {
            super();
            this.name = '';
            this.brokers = [];
            this.simulationParameters = [];
            this.$set(this, 'simulationParameters', []);
            this.allowedParameters = [];
        }

        get availableTypes(): BrokerType[] {
            return this.$store.getters['brokers/types'];
        }

        get isValid(): boolean {
            if (this.name === '') {
                return false;
            }
            if (this.brokers.length < 1) {
                return false;
            }
            return true;
        }

        private created(): void {
            this.simulationParameters.push({
                id: uuid(),
                key: '',
                value: '',
            });
            this.$store.dispatch('brokers/refresh');
            RestClient.supportedParams()
                .then((params) => this.allowedParameters = params.sort())
                .catch((e) => console.log(e));
        }

        @Watch('simulationParameters')
        private onSimulationParametersChanged(params: TransientParameter[]): void {
            if (params.filter((param) => param.key === '' && param.value === '').length < 1) {
                this.simulationParameters.push({
                    id: uuid(),
                    key: '',
                    value: '',
                });
            }
        }

        private updateParam(oldParam: TransientParameter, newParam: TransientParameter): void {
            newParam.id = oldParam.id;
            this.$set(this.simulationParameters, this.simulationParameters.indexOf(oldParam), newParam);
        }

        private removeParam(param: TransientParameter): void {
            this.$delete(this.simulationParameters, this.simulationParameters.indexOf(param));
        }

        private isParameterRemovable(param: TransientParameter): boolean {
            return this.simulationParameters.length > 1 && !(
                this.simulationParameters.indexOf(param) === (this.simulationParameters.length - 1)
                && param.key === ''
                && param.value === '');
        }

        private setBrokers(brokers: Broker[]): void {
            this.brokers = brokers;
        }

        private removeBroker(broker: Broker): void {
            this.$delete(this.brokers, this.brokers.indexOf(broker));
        }

        private queueJob() {
            const selectedBrokers: string[] = this.brokers
                .map((broker) => broker.name)
                .filter((brokerName) => brokerName !== undefined)
                // TODO : remove samplebroker from orchestrator repository
                .filter((brokerName) => brokerName !== 'samplebroker') as string[];
            const parameters: Parameter[] = [];
            this.simulationParameters.filter((param) => param.key !== '')
                .filter((param) => param.value !== '')
                .forEach((param) => parameters.push({parameter: param.key, value: param.value}));
            StompClient.send<JobRequest>('/requests/jobs/create', {
                name: this.name,
                brokers: selectedBrokers,
                params: parameters,
            });
            this.$router.push('/jobs');
        }

    }
</script>

<style scoped lang="scss">
    #job-form {
        padding: 3rem;
    }
    .brokers {

        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .broker {
            margin-bottom: 1rem;
            width: 15rem;
            margin-right: 1.28rem;
            &:after(4) {
                margin-right: 0;
            }
        }

        &:after {
            content: "";
            flex: auto;
        }
    }
    .btn.queue-job {
        .fa-icon {
            margin-right: .5rem;
        }
    }
    .form-actions {
        margin: .2rem;
    }
    label {
        font-size: 1.5rem;
    }
</style>