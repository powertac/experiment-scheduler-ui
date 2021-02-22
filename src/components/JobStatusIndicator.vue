<template>
    <div class="job-state">
        <div v-if="isCompleted" data-toggle="tooltip" data-placement="bottom" :title="'completed at ' + endDate">
            <fa-icon icon="check-square" />
            Completed at {{endDate}}
        </div>
        <div v-else-if="isRunning" data-toggle="tooltip" data-placement="bottom" :title="'started at ' + startDate">
            <fa-icon icon="running" />
            Running for <duration :start="status.start" :end="status.end" />
        </div>
        <div v-else>
            <fa-icon :icon="['far', 'clock']" />
            Waiting for start
        </div>
    </div>
</template>

<script lang="ts">
    import moment from 'moment';
    import {Component, Prop} from 'vue-property-decorator';
    import {VueAdapter} from '@/VueAdapter';
    import {JobState, JobStatus} from '@/domain/types/Job';
    import Duration from "@/components/time/Duration.vue";

    @Component({components: {duration: Duration}})
    export default class JobStatusIndicator extends VueAdapter {

        @Prop({required: true})
        private status: JobStatus;

        get isCompleted(): boolean {
            return this.status.state === JobState.completed;
        }

        get isRunning(): boolean {
            return this.status.state === JobState.running;
        }

        get startDate() {
            return moment(this.status.start).format('YYYY-MM-DD HH:mm');
        }

        get endDate() {
            return moment(this.status.end).format('l LT');
        }

    }
</script>

<style scoped lang="scss">
    svg {
        margin-right: .25rem;
    }
</style>