export interface Broker {
  id?: string;
  name: string;
  version: string;
  imageTag: string;
  enabled: boolean;
}

export class BrokerImpl implements Broker {
  public id?: string;
  public name: string;
  public version: string;
  public imageTag: string;
  public enabled: boolean;

  constructor(id: string|undefined, name: string, version: string, imageTag: string, enabled: boolean) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.imageTag = imageTag;
    this.enabled = enabled;
  }

}
