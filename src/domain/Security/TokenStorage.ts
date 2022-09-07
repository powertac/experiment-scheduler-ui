import config from '@/config';
import CryptoJS from 'crypto-js';

const tokenStorageKey: string = 'experimentManagerToken';

export default class TokenStorage {

  public static saveToken(token: string): void {
    localStorage.setItem(tokenStorageKey, CryptoJS.AES.encrypt(token, config.localStorageKey).toString());
  }

  public static loadToken(): string|null {
    const encryptedToken = localStorage.getItem(tokenStorageKey);
    return null !== encryptedToken
      ? CryptoJS.AES.decrypt(encryptedToken, config.localStorageKey).toString(CryptoJS.enc.Utf8)
      : null;
  }

  public static clearToken(): void {
    localStorage.removeItem(tokenStorageKey);
  }

}
