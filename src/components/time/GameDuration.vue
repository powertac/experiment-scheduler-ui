<template>
    <span class="duration" v-html="durationRepresentation"></span>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import moment from "moment";
    import {GameInterface} from '@/domain/Game/GameInterface';

    const updateInterval: number = 1000;

    @Component
    export default class GameDuration extends Vue {

        @Prop({required: true})
        private game: GameInterface;

        private durationRepresentation: string;
        private stopUpdate: boolean;

        constructor() {
            super();
            this.durationRepresentation = '00:00:00';
            this.stopUpdate = false;
        }

        get shouldUpdate(): boolean {
            return (this.game.end >= 0) && !this.stopUpdate;
        }

        private created(): void {
            this.updateDurationRepresentation();
        }

        private beforeDestroy(): void {
            this.stopUpdate = true;
        }

        private getReferenceEnd(): moment.Moment {
            return this.game.end >= 0 ? moment(this.game.end) : moment(moment.now());
        }

        private getDuration(): moment.Duration {
            return moment.duration(this.getReferenceEnd().diff(moment(this.game.start)));
        }

        private updateDurationRepresentation(): void {
            this.durationRepresentation = this.createDurationRepresentation();
            if (!this.shouldUpdate) {
                return;
            }
            setTimeout(() => this.updateDurationRepresentation(), updateInterval);
        }

        private createDurationRepresentation(): string {
            const duration: moment.Duration = this.getDuration();
            if (!duration.isValid()) {
                return '&mdash;';
            }
            return duration.hours().toString().padStart(2, "0") + ":"
                + duration.minutes().toString().padStart(2, "0") + ":"
                + duration.seconds().toString().padStart(2, "0");
        }

    }
</script>
