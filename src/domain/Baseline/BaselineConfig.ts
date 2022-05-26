export class BaselineConfig {

  private name: string;
  private generator: BaselineGenerator;

  constructor(name: string, generator: BaselineGenerator) {
    this.name = name;
    this.generator = generator;
  }

  get isValid(): boolean {
    return this.name.length > 5 && this.generator.isValid;
  }

}

export interface BaselineGenerator {
  readonly type: string;
  readonly isValid: boolean;
}
