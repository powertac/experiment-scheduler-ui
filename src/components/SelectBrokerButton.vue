<template>
    <div class="interaction-bar pt-1 pb-1 mt-2" @click="toggleOpen">
        <div class="interaction-bar-header">
            <div class="interaction-bar-icon">
                +
            </div>
            <div class="interaction-bar-title">
                Add Broker
            </div>
        </div>
        <div class="interaction-bar-body" v-if="open">
            <div class="broker-pill" v-for="type in brokerTypes">
                <span class="broker-pill-name">
                    {{type.name}}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Broker} from '@/domain/types/Broker';

    @Component
    export default class SelectBrokerButton extends Vue {

        @Prop({required: true})
        private brokerTypes: Broker[];

        private brokerName: string;

        private open: boolean;

        constructor() {
            super();
            this.brokerName = "";
            this.open = false;
        }

        private toggleOpen() {
            if (!this.open) {
                this.open = true;
            }
        }

    }
</script>

<style scoped lang="scss">

    div.interaction-bar {
        border: 1px solid #A5B3E8;
        border-radius: .2em;
        margin-bottom: 1.5em;
        color: #4069FF;

        .interaction-bar-header {
            display: flex;
            flex-wrap: wrap;
            align-items: stretch;

            .interaction-bar-icon {
                font-size: 1.5em;
                width: 3em;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: .5em 1.25em .5em 1.25em;
                font-weight: bold;
            }

            .interaction-bar-title {
                display: flex;
                align-items: center;
                font-size: 1.2em;
                flex-grow: 1;
                flex-wrap: wrap;
            }
        }

        .interaction-bar-body {
            display: flex;
            align-items: center;
            font-size: 1.2em;
            flex-grow: 1;
            flex-wrap: wrap;
            margin-left: 3em;
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

        &:hover {
            background: #F2F5FF;
            color: #0C3CE8;
            cursor: pointer;
        }
    }
</style>