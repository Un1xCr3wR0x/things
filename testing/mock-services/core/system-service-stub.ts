import { SystemStatus } from '@gosi-ui/core';
import { Observable, of } from 'rxjs';
import { systemWorking } from '../../test-data/core/system-status';

export class SystemServiceStub {
  getSystemStatus(): Observable<SystemStatus> {
    return of(systemWorking);
  }

  get status() {
    return undefined;
  }

  get statusChecked() {
    return true;
  }

  get isUnderMaintanance(): boolean {
    return false;
  }

  get shouldRefresh(): boolean {
    return false;
  }

  reload() {}
}
