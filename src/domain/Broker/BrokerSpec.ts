export interface BrokerSpec {
    id?: string;
    name: string;
    version?: string;
    parameters?: {[key: string]: string};
}
