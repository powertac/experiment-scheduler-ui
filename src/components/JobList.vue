<template>
    <div class="job-list">
        <JobCard :class="[jobClass]" :job="job" v-for="job in jobs" :key="job.id"></JobCard>
        <div class="placeholder-block" v-if="jobs.length < 1">
            {{emptyMessage}}
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Job} from '@/domain/types/Job';
    import JobCard from '@/components/JobCard.vue';

    @Component({components: {JobCard}})
    export default class JobList extends Vue {

        @Prop({required: true})
        public jobs: Job[];

        @Prop({required: true})
        public emptyMessage: string;

        @Prop({required: false, default: ''})
        public jobClass: string;

    }
</script>

<style scoped lang="scss">
</style>