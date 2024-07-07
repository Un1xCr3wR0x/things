export class CryptoServiceStub {
  encrypt(token) {
    if (token) return token;
    return null;
  }
}
