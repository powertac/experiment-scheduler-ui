<template>
    <div class="broker-configuration-form">
        <div class="form-action-close">
            <fa-icon icon="times" @click="closeForm" />
        </div>
        <div class="form-body">
            <div class="mutation-selection" v-if="provideTreatment">
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
            <div class="type-selection">
                <div class="broker-pill broker-pill-selectable"
                     v-for="type in types"
                     :class="{'selected': (type.name === name), 'disabled': isDisabled(type)}">
                    <span class="broker-pill-name"
                          @click="selectType(type)">
                        {{type.name}}
                    </span>
                </div>
            </div>
            <!--<div v-if="name !== ''">
                <div class="version-selection">
                    <div class="pill pill-selectable selected">
                        latest
                    </div>
                </div>
            </div>-->
        </div>
        <div class="form-action-main"
             :class="{'disabled': !isValid}"
             @click="submit">
            <fa-icon icon="plus" class="fa-icon" />
            {{submitLabel}}
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {BrokerType} from '@/domain/types/Broker';
    import {BrokerMutationAction, Treatment, TreatmentType} from '@/domain/Treatment/Treatment';
    import {BrokerSpec} from '@/domain/Broker/BrokerSpec';

    @Component
    export default class BrokerConfigurationForm extends Vue {

        @Prop({required: true})
        private types: BrokerType[];

        @Prop({required: false, default: false})
        private provideTreatment: boolean;

        @Prop({required: false, default: () => []})
        private disabledTypes: BrokerType[];

        @Prop({required: false, default: 'Add Broker'})
        private submitLabel: string;

        private name: string;
        private mutationType: string;
        private version: string;

        constructor() {
            super();
            this.name = "";
            this.mutationType = '';
            this.version = "latest";
        }

        get broker(): BrokerSpec {
            return {
                name: this.name,
                version: this.version
            };
        }

        get treatment(): Treatment {
            return {
                type: TreatmentType.BrokerSet,
                mutation: {
                    action: this.mutationType,
                    broker: this.broker
                }
            }
        }

        get isValid(): boolean {
            return (this.provideTreatment && this.isValidTreatment)
                || this.isValidBroker;
        }

        get isValidBroker(): boolean {
            return this.name !== ''
                && this.version !== '';
        }

        get isValidTreatment(): boolean {
            return this.isValidBroker
                && this.mutationType != '';
        }

        private closeForm(): void {
            this.$emit('form:close');
        }

        private selectType(type: BrokerType): void {
            if (this.isDisabled(type)) {
                return;
            }
            this.name = type.name;
        }

        private selectMutation(mutationType: string): void {
            this.mutationType = mutationType;
        }

        private isDisabled(type: BrokerType): boolean {
            for (let disabledType of this.disabledTypes) {
                if (disabledType.name === type.name) {
                    return true;
                }
            }
            return false;
        }

        private submit(): void {
            if (!this.isValid) {
                // TODO: communicate error
                return;
            }
            if (this.provideTreatment) {
                this.$emit('submit:treatment', this.treatment);
            }
            else {
                this.$emit('submit:broker', this.broker);
            }
        }

    }
</script>

<style scoped lang="scss">
    .broker-configuration-form {
        position: relative;
        .form-body {
            padding: 1.25em;
          background: #fff;
          border-radius: .2rem;
        }
    }
    div.mutation-selection {
        display: flex;
        margin-bottom: .75em;
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
    .form-title {
        color: #0C3CE8;
    }
    div.type-selection, div.version-selection {
        display: flex;
        margin-bottom: .75em;
        align-items: center;
        &:last-child {
            margin-bottom: 0;
        }
    }
    div.version-selection {
        div.selection-label {
            padding: 0 .2em;
            margin: 0 .75em;
        }
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
</style>
