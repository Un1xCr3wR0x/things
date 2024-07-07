import { of } from 'rxjs';

export class ExchangeRateServiceStub {
  getExchangeRate() {
    return of(8.23);
  }
}
