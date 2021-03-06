import {ExperimentSpec} from '@/domain/Experiment/ExperimentSpec';
import {Game} from "@/domain/Game/Game";

export interface Experiment extends ExperimentSpec {
    id: string;
    hash: string;
    instances: Game[];
}
