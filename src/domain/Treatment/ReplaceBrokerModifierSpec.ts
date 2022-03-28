import {Modifier, ModifierSpec} from '@/domain/Treatment/ModifierSpec';
import {Broker} from '@/domain/Broker/Broker';

export interface ReplaceBrokerModifierSpec extends ModifierSpec {
  original?: Broker;
  replacement?: Broker;
}

export class ReplaceBrokerModifier implements Modifier, ReplaceBrokerModifierSpec {

  public id: string;
  public type: string;
  public name: string;
  public original: Broker;
  public replacement: Broker;


  constructor(id: string, type: string, name: string, original: Broker, replacement: Broker) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.original = original;
    this.replacement = replacement;
  }

}
