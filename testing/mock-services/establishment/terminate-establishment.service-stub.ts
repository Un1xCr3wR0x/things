import { Injectable } from '@angular/core';
import { TerminateEstablishmentService } from '@gosi-ui/features/establishment';
import { terminateResponseMock } from 'testing/test-data';
import { of } from 'rxjs';

@Injectable()
export class TerminateEstablishmentStubService extends TerminateEstablishmentService {
  terminateEstablishment() {
    return of(terminateResponseMock);
  }
}
