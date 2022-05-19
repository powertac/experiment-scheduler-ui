export interface ModifierSpec {
  type?: string;
  name?: string;
}

export interface Modifier extends ModifierSpec {
  id: string;
  type: string;
  name: string;
}

export interface ModifierData {
  id: string;
  type: string;
  name: string;
}
