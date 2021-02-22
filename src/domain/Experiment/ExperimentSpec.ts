import {GameSpec} from '@/domain/Game/GameSpec';
import {Treatment} from '@/domain/Treatment/Treatment';

export interface ExperimentSpec {
    name: string;
    baseline: GameSpec[];
    treatments: Treatment[];
}
