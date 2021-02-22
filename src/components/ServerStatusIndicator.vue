<template>
    <div class="container-fluid server-status"
         :class="{'running': isRunning && isHealthy, 'unhealthy': isRunning && !isHealthy, 'down': !isRunning && !isHealthy}">
        <div class="row">
            <div class="col">
                <div class="server-status">
                    <h5>Orchestrator</h5>
                    <div class="badge badge-lg" :class="{'badge-success': isRunning, 'badge-danger': !isRunning}">
                        Running:
                        <fa-icon icon="circle"  />
                    </div>
                    <div class="badge badge-lg" :class="{'badge-success': isHealthy, 'badge-danger': !isHealthy}">
                        Healthy:
                        <fa-icon icon="circle" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop} from 'vue-property-decorator';
    import {VueAdapter} from '../VueAdapter';
    import {JobState, JobStatus} from '@/domain/types/Job';
    import {ServerStatus} from '@/domain/types/Server';

    @Component
    export default class ServerStatusIndicator extends VueAdapter {

        @Prop({required: true})
        private status: ServerStatus;

        get isRunning(): boolean {
            return this.status.running;
        }

        get isHealthy(): boolean {
            return this.status.healthy;
        }

    }
</script>

<style lang="scss" scoped>
    div.server-status {
        &.running {
            background: aquamarine;
        }
        &.unhealthy {
            background: orange;
        }
        &.down {
            background: indianred;
        }
    }
</style>