// TODO : change all references to new broker model

export interface BrokerType {
    name: string;
    image: string;
}

export interface BrokerConfig {
    params: {[key: string]: string};
}

export interface Broker {
    id: string;
    name: string;
    type: BrokerType;
    config?: BrokerConfig;
}
