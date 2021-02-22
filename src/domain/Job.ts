import {JobState} from '@/domain/types/Job';

export class JobStateHelper {

    public static getOrderIndex(state: JobState): number {
        switch (state) {
            case JobState.pending:
                return 3;
            case JobState.queued:
                return 4;
            case JobState.running:
                return 5;
            case JobState.completed:
                return 2;
            case JobState.failed:
                return 1;
        }
        return 0;
    }

    public static getIcon(state: JobState): string[] {
        switch (state) {
            case JobState.queued:
                return ['far', 'clock'];
            case JobState.running:
                return ['fas', 'play'];
            case JobState.completed:
                return ['fas', 'check'];
            case JobState.failed:
                return ['fas', 'bolt'];
        }
        return [];
    }

    public static getLabel(state: JobState): string {
        switch (state) {
            case JobState.queued:
                return 'Queued';
            case JobState.running:
                return 'Running';
            case JobState.completed:
                return 'Completed';
            case JobState.failed:
                return 'Failed';
        }
        return '';
    }

    public static getClass(state: JobState): string {
        switch (state) {
            case JobState.queued:
                return 'state-queued';
            case JobState.running:
                return 'state-running';
            case JobState.completed:
                return 'state-completed';
            case JobState.failed:
                return 'state-failed';
        }
        return '';
    }

}
