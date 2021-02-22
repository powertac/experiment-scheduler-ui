<template>
    <span class="job-state-tag" :class="stateClass">
        <fa-icon class="icon" :icon="stateIcon" />
        <!--{{stateText}}-->
    </span>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {JobState} from "@/domain/types/Job";
    import {JobStateHelper} from "@/domain/Job";

    @Component
    export default class JobStateTag extends Vue {

        @Prop({required: true})
        private state: JobState;

        get stateClass(): {[key: string]: boolean} {
            return {
                'queued': this.state === JobState.queued,
                'running': this.state === JobState.running,
                'completed': this.state === JobState.completed,
                'failed': this.state === JobState.failed,
            };
        }

        get stateIcon(): string[] {
            return JobStateHelper.getIcon(this.state);
        }

        get stateText(): string {
            return JobStateHelper.getLabel(this.state);
        }

    }
</script>

<style lang="scss" scoped>
    span.job-state-tag {
        justify-content: center;
        .icon {
            margin-right: .2rem;
          color: #333 !important;
        }
        &.queued {
            color: #333;
        }
        &.running {
            color: #7300E6;
            color: #007BFF;
          color: #00448C;
        }
        &.completed {
          color: #00B362;
          color: #008046;
        }
        &.failed {
            color: #B81F40;
          color: #dc3545;
          color: #850042;
        }
    }
</style>
