import {Modifier, ModifierData, ModifierSpec} from '@/domain/Treatment/Modifier';

export interface ParameterSetModifierSpec extends ModifierSpec {
  parameters: {[key: string]: string};
}

export interface ParameterSetModifierData extends ModifierData {
  originalId: string;
  replacementId: string;
}

export class ParameterSetModifier implements Modifier, ParameterSetModifierSpec {

  public readonly id: string;
  public readonly type: string;
  public readonly name: string;
  public readonly parameters: {[key: string]: string};

  constructor(data: ParameterSetModifierData) {
    this.id = data.id;
    this.type = data.type;
    this.name = data.name;
  }

}


