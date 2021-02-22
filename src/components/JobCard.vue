<template>
        <div class="card">
            <div class="card-body" >
                <h5 class="card-title">
                    <span @click="showDetails">{{job.name}}</span>
                    <small class="text-muted">@{{job.id}}</small>
                </h5>
                <div class="brokers">
                    <span v-for="broker in job.brokers" class="broker bg-primary">{{ broker.name }}</span>
                </div>
            </div>
            <div class="card-footer text-muted">
                <JobStatusIndicator :status="job.status"></JobStatusIndicator>
                <fa-icon class="show-details" icon="info-circle" @click="showDetails" />
            </div>
        </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import {VueAdapter} from '@/VueAdapter';
    import {Job} from '@/domain/types/Job';
    import JobStatusIndicator from '@/components/JobStatusIndicator.vue';

    @Component({components: {JobStatusIndicator}})
    export default class JobList extends VueAdapter {

        @Prop({required: true})
        public job: Job;

        private showDetails(): void {
            this.$router.push({name: 'job', params: {id: this.job.id}});
        }

    }
</script>

<style scoped lang="scss">
    div.card {
        margin-bottom: 1rem;
        border-radius: .2rem;

        .card-body {
            padding: .875rem;
            overflow: hidden;
            z-index: 999;

            .card-title {
                display: flex;
                justify-content: space-between;
                align-items: center;

                span {
                    cursor: pointer;
                }
            }

            div.brokers {
                margin: -.1rem;

                span.broker {
                    display: inline-block;
                    border-radius: .2rem;
                    color: #fff;
                    padding: .1rem .6rem;
                    margin: .1rem;
                    font-weight: 600;
                    font-size: .875rem;
                }
            }
        }

        .card-footer {
            padding: .5rem .875rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 0;
            font-size: .875rem;

            .show-details {
                cursor: pointer;
            }
        }

        &.queued {
            background: #fff;

            .card-body {
                background: #fff;
            }

            div.brokers span.broker.bg-primary {
                background-color: #9f9f9f !important;
            }
        }

        &.running {
            background: #F3EDFF;
            color: #7300E6;
            border-color: #CFB8E6;

            .card-body {
                background: #F3EDFF;
            }

            .text-muted {
                color: rgba(140, 25, 255, .8) !important;
            }

            div.brokers span.broker.bg-primary {
                background-color: #925CFF !important;
            }
        }

        &.completed {
            background: #E0FFF5;
            color: #00804A;
            border-color: #C1E8D0;

            .card-body {
                background: #E0FFF5;
            }

            .text-muted {
                color: rgba(0, 128, 50, .8) !important;
            }

            div.brokers span.broker.bg-primary {
                background-color: #2BAB80 !important;
            }
        }

        &.empty-card {
            border-color: #eee;
            .card-title {
                justify-content: center;
                margin: 1rem;
                &.text-muted {
                    color: #aaa !important;
                }
            }
        }
    }
</style>