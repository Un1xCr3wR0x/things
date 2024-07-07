import { Component, Inject, OnInit } from '@angular/core';
import { CoreAdjustmentService, CoreBenefitService, LanguageToken, Transaction, TransactionService } from '@gosi-ui/core';
import { Assessments, RescheduleSessionData, SessionAssessments } from '../../shared/models';
import { DisabilityAssessmentService, MbRouteConstants, SessionStatusService } from '../../shared';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'mb-tracking-e-sign-sc',
  templateUrl: './tracking-e-sign-sc.component.html',
  styleUrls: ['./tracking-e-sign-sc.component.scss']
})
export class TrackingESignScComponent implements OnInit {
  sessionData: RescheduleSessionData;
  sessionId: number;
  transaction: Transaction;
  lang = 'en';
  sessionAssessments: SessionAssessments;
  
  constructor(
    readonly statusService: SessionStatusService,
    readonly transactionService: TransactionService,
    private disabilityAssessmentService: DisabilityAssessmentService,
    private coreAdjustmentService: CoreAdjustmentService,
    private coreBenefitService: CoreBenefitService,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    this.getSessionDetails(+this.transaction?.params?.MB_SESSION_ID);
    this.getSessionAssessments()
  }
  getSessionDetails(sessionId: number) {
    this.statusService.getRescheduleSessionData(sessionId).subscribe(res => {
      this.sessionData = res;
    });
  }
  getSessionAssessments() {
    this.disabilityAssessmentService
      .getSessionAssessments(+this.transaction?.params?.MB_SESSION_ID)
      .subscribe(res => (this.sessionAssessments = res));
  }
   /* Method to view assessment details by assessment id */
   viewDisabilityAssessment(assessments: Assessments) {
    this.coreAdjustmentService.socialNumber = assessments?.sin;
    this.coreBenefitService.injuryId = assessments?.injuryId;
    this.coreAdjustmentService.identifier = assessments?.identifier;
    this.coreBenefitService.assessmentRequestId = assessments?.assessmentRequestId;
    this.disabilityAssessmentService.disabilityAssessmentId = assessments.disabilityAssmtId;
    this.disabilityAssessmentService.nationalId = assessments?.identifier?.personIdentifier;
    this.disabilityAssessmentService.disabilityType = {
      english: assessments?.disabilityType,
      arabic: assessments?.disabilityType
    };
    this.router.navigate([MbRouteConstants.ROUTE_ASSESSMENT_VIEW], {
      queryParams: { referenceNo: assessments.referenceNo }
    });
  }
}
