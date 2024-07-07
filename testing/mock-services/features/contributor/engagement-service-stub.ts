import { of } from 'rxjs';
import { engagementData } from 'testing/test-data';
import { bindToObject } from '@gosi-ui/core';
import { EngagementDetails } from '@gosi-ui/features/contributor';

export class EngagementServiceStub {
  getEngagementDetails() {
    return of(bindToObject(new EngagementDetails(), engagementData));
  }

  updateEngagementDetails() {
    return of({ message: { english: 'succes', arabic: 'success' } });
  }
  saveEngagementDetails() {
    return of({ message: { english: 'succes', arabic: 'success' }, id: 894561352 });
  }

  updatePenaltyIndicator() {
    return of(true);
  }
}
