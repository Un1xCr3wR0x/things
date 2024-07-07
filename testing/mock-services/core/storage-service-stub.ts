/**
 * Stub Class For Storage Service
 */
export class StorageServiceStub {
  store = {};
  sessionStore = {};

  /**
   * Intialising with Auth Token
   */
  constructor() {
    this.store = {
      AUTH_TOKEN:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOiIwMy0xMC0yMDE5In0.eOwl_XJkgU71TtmpGmklbOYSkWKQfyx20ZP35gytaYM'
    };
  }

  public getLocalValue(key: string) {
    if (key) {
      return this.store[key];
    }
  }

  public setLocalValue(key, token) {
    this.store[key] = token;
  }

  public clearLocal() {
    this.store = {};
  }

  public setSessionValue(key, value) {
    this.sessionStore[key] = value;
  }

  public getSessionValue(key) {
    if (key) {
      return this.sessionStore[key];
    }
  }

  public clearSession() {
    this.sessionStore = {};
  }
  public clearLocalValue() {
    this.sessionStore = {};
  }
}
