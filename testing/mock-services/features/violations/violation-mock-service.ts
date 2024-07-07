import { of } from 'rxjs';
import { PenaltyInfoDetails, violationClassList, validatorDetailsMock } from 'testing';
import { Component } from '@angular/core';
import { MemberDecisionDto, ModifyViolationRequest } from '@gosi-ui/features/violations/lib/shared';
@Component({
  selector: 'gosi-progress-wizard-dc',
  template: ''
})
export class ViolationsWizardMock {
  setNextItem() {}
  setPreviuosItem() {}
}
export class ViolationMockService {
  getViolationClassDetails(isAllExcluded: boolean) {
    if (isAllExcluded) {
    }
    return of(violationClassList);
  }
  submitPenaltyCalculations(violationid, penalityInfo) {
    if (violationid && penalityInfo) {
    }
    return of(PenaltyInfoDetails);
  }
  getTransactionDetails(violationId: number) {
    if (violationId) {
      return of(validatorDetailsMock);
    }
  }
  submitModifyViolations(violationId: number, modifyViolationDetails: ModifyViolationRequest) {
    if (violationId && modifyViolationDetails) return of(true);
  }
  submitValidation(violationId: number, UpdateDoctor: MemberDecisionDto, bpmTaskId: string) {
    if (violationId && UpdateDoctor && bpmTaskId) {
    }
    return of(null);
  }
  getDocsFromRased() {
    return of(null);
  }
  getDocumentMeasures(documentUrl: string, fileName: string) {
    if (documentUrl && fileName) {
    }
    return of(null);
  }
}
