export default class GameValidator {

  // FIXME : make sure it doesn't start or end with whitespace
  private static readonly namePattern: RegExp = /[a-zA-Z\d\-_\s]{5,}/;

  public static isValidName(name: string): boolean {
    return this.namePattern.test(name);
  }

}
