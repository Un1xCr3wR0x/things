import { Pipe, PipeTransform } from '@angular/core';
import { PaymentsDetail } from '../models';

@Pipe({
  name: 'paymentTypePipe'
})
export class PaymentTypePipe implements PipeTransform {
  transform(payments: PaymentsDetail[]): PaymentsDetail[] {
    return payments.sort((prev, next) => (prev?.paymentType?.english > next?.paymentType?.english ? -1 : 1));
  }
}
