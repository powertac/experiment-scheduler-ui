<template>
    <div class="broker-set-treatment-form">
        <div class="form-content">
            <div class="mutation-selection">
                <div class="pill pill-selectable"
                     :class="{'selected': mutationType === 'add'}"
                     @click="selectMutation('add')">
                    <fa-icon icon="plus" class="fa-icon" />
                    Add broker
                </div>
                <div class="pill pill-selectable"
                     :class="{'selected': mutationType === 'remove'}"
                     @click="selectMutation('remove')">
                    <fa-icon icon="minus" class="fa-icon" />
                    Remove broker
                </div>
            </div>
            <div class="broker-selection">
                <div class="broker-pill broker-pill-selectable"
                     v-for="type in availableTypes"
                     :class="{'selected': (type.name === brokerName)}">
                    <span class="broker-pill-name"
                          @click="selectBroker(type)">
                        {{type.name}}
                    </span>
                </div>
            </div>
            <broker-config :types="availableTypes" />
        </div>
        <div class="form-action-main" :class="{'disabled': !isSubmittable}">
            <fa-icon icon="plus" class="fa-icon" />
            Add treatment
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ParameterInput from '@/components/form/ParameterInput.vue';
    import {BrokerType} from '@/domain/types/Broker';
    import BrokerConfigurationForm from '@/views/Broker/BrokerConfigurationForm.vue';

    @Component({components: {'broker-config': BrokerConfigurationForm}})
    export default class BrokerSetTreatmentForm extends Vue {

        private mutationType: string;
        private brokerName: string;

        constructor() {
            super();
            this.mutationType = '';
            this.brokerName = '';
        }

        get isSubmittable(): boolean {
            return false;
        }

        get availableTypes(): BrokerType[] {
            return this.$store.getters['brokers/types'];
        }

        private created(): void {
            this.$store.dispatch('brokers/refresh');
        }

        private selectMutation(mutationType: string): void {
            this.mutationType = mutationType;
        }

        private selectBroker(type: BrokerType): void {
            this.brokerName = type.name;
        }

    }
</script>

<style lang="scss" scoped>
    .form-content {
        padding: 2em;

    }
    div.mutation-selection {
        display: flex;
    }
    div.broker-selection {
        display: flex;
        margin-top: .5em;
    }
    div.pill {
        display: flex;
        align-items: center;
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
        .fa-icon {
            margin-right: .75em;
            font-size: .75em;
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
