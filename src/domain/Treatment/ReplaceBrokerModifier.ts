import {Modifier, ModifierData, ModifierSpec} from '@/domain/Treatment/Modifier';
import {Broker} from '@/domain/Broker/Broker';
import {findOrFail} from '@/domain/FindOrFail';
import store from '@/domain/Store/RootStoreImpl';

export interface ReplaceBrokerModifierSpec extends ModifierSpec {
  original?: Broker;
  replacement?: Broker;
}

export interface ReplaceBrokerModifierData extends ModifierData {
  originalId: string;
  replacementId: string;
}

export class ReplaceBrokerModifier implements Modifier, ReplaceBrokerModifierSpec {

  public readonly id: string;
  public readonly type: string;
  public readonly name: string;
  public readonly originalId: string;
  public readonly replacementId: string;

  constructor(data: ReplaceBrokerModifierData) {
    this.id = data.id;
    this.type = data.type;
    this.name = data.name;
    this.originalId = data.originalId;
    this.replacementId = data.replacementId;
  }

  get original(): Broker {
    return findOrFail<Broker>(() => store.getters['brokers/find'](this.originalId));
  }

  get replacement(): Broker {
    return findOrFail<Broker>(() => store.getters['brokers/find'](this.replacementId));
  }

}


