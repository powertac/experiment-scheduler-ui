<template>
    <div class="brokerSelector">
        <div class="inline-form-wrapper" v-if="brokerFormOpen">
            <add-broker :types="types"
                        :disabled-types="disabledTypes"
                        v-on:form:close="brokerFormOpen = false"
                        v-on:submit:broker="testEvent"/>
        </div>
        <div class="control-button" @click="brokerFormOpen = true" v-else>
            <div class="control-button-icon">
                +
            </div>
            <div class="control-button-text">
                Add broker
            </div>
        </div>
        <div class="broker mt-2" v-for="broker in brokers">
            <div class="broker-name">
                {{broker.name}}
            </div>
            <div class="broker-version">
                <small>Version:</small>
                latest
            </div>
            <div class="broker-actions">
                <!--<fa-icon icon="pen" class="fa-icon"></fa-icon>-->
                <fa-icon class="fa-icon"
                         :icon="['fas', 'times']"
                         @click="removeBroker(broker)" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import uuid from 'uuid/v4';
    import {Broker, BrokerType} from '@/domain/types/Broker';
    import SelectBrokerButton from '@/components/SelectBrokerButton.vue';
    import BrokerConfigurationForm from '@/views/Broker/BrokerConfigurationForm.vue';

    // TODO : move to orchestrator
    const maxBrokerCount = 8;

    @Component({components: {'add-broker': BrokerConfigurationForm, 'broker-select': SelectBrokerButton}})
    export default class BrokerSelector extends Vue {

        @Prop({required: true})
        private types: BrokerType[];

        // TODO : use event to propagate the broker set to parent components
        @Prop({required: true})
        private callback: (brokers: Broker[]) => void;

        private brokers: Broker[];
        private brokerFormOpen: boolean;

        constructor() {
            super();
            this.brokers = [];
            this.brokerFormOpen = false;
        }

        get maxBrokerCount(): number {
            return maxBrokerCount;
        }

        get brokerLimitReached(): boolean {
            return this.brokers.length >= maxBrokerCount;
        }

        get disabledTypes(): BrokerType[] {
            return this.brokers.map((broker) => broker.type);
        }

        @Watch('brokers')
        private onBrokersChanged(val: Broker[], oldVal: Broker[]) {
            this.callback(val);
        }

        private testEvent(arg: any) {
            this.addBroker(arg);
            this.brokerFormOpen = false;
        }

        private addBroker(type: BrokerType) {
            if (this.brokerLimitReached || this.isBrokerTypeAvailable(type)) {
                return;
            }
            this.brokers.push({
                id: uuid(),
                name: type.name,
                type,
            });
        }

        private removeBroker(broker: Broker) {
            this.$delete(this.brokers, this.brokers.indexOf(broker));
        }

        private clearBrokers() {
            this.brokers = [];
        }

        private isBrokerTypeAvailable(type: BrokerType): boolean {
            return this.brokerLimitReached
                || (this.brokers.filter((broker) => broker.type.name === type.name).length > 0);
        }

    }
</script>

<style scoped lang="scss">

    div.broker {
        display: flex;
        border: 1px solid #ccc;
        border-radius: .2em;
        align-items: center;
        padding: .75em 1.25em;
      background: #fff;

        &:hover .broker-actions .fa-icon {
            color: #7B93E8;
        }

        & + & {
            margin-top: .5em;
        }

        .broker-version {
            margin-left: 2em;
        }

        .broker-actions {
            display: flex;
            flex-grow: 1;
            justify-content: flex-end;

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

    div.inline-form-wrapper {
        margin-top: .5em;
        border: 1px solid #A5B3E8;
        border-radius: .2em;
    }

    div.add-instance {
        border: 1px solid #A5B3E8;
        border-radius: .2em;
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        color: #4069FF;

        .add-instance-icon {
            width: 3em;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: .75em 1.25em;
            font-weight: bold;
        }

        .add-instance-text {
            display: flex;
            align-items: center;
        }

        &:hover {
            background: #F2F5FF;
            color: #0C3CE8;
            cursor: pointer;
        }
    }

    .brokerSelector {
        padding-left: 0;
        padding-right: 0;
    }
    div.available-brokers .btn {
        &.btn-block {
            text-align: left;
        }
        .fa-icon {
            margin-right: .5rem;
        }
        &.disabled {
            cursor: not-allowed;
        }
    }
    ul.available-brokers {
        list-style: none;
        padding-left: 0;
        li {
            padding: .75rem;
            border-radius: .2rem;
            border: 1px solid rgba(0,0,0,.125);
            margin: 0 0 .2rem 0;
            cursor: pointer;

            .fa-icon {
                margin-right: .5rem;
            }

            &:hover {
                border-color: #007bff;
                color: #007bff;
            }

            &.disabled {
                background: #eee;;
                color: #999;
                cursor: not-allowed;
            }
        }
    }
    .selected-brokers {
        display: flex;
        flex-wrap: wrap;
        margin: -.2rem;
        .card-wrapper {
            padding: .2rem;
        }
        .card {
            background: #f0faf7;
            border: 1px solid #abc;
            color: #345;
            .card-title {
                text-align: center;
                margin: 0;
            }
            .btn-group {
                opacity: 0;
                .btn {
                    color: #555;
                    &:hover {
                        color: #007bff;
                    }
                }
            }
            &:hover {
                .btn-group {
                    opacity: 1;
                }
            }
        }
        .alert {
            margin: .2rem;
        }
    }

</style>
