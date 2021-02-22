import {GameSpec} from "@/domain/Game/GameSpec";
import {JobStatus} from "@/domain/types/Job";

export interface Game extends GameSpec {
    status: JobStatus
}
