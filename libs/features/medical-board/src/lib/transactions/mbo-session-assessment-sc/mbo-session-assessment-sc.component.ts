import { Component, Inject, OnInit } from '@angular/core';
import {
  DisabilityAssessmentService,
  ParticipantDetails,
  RescheduleSessionData,
  SessionStatusService,
  VisitingDoctorList
} from '../../shared';
import { LanguageToken, Transaction, TransactionService } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mb-mbo-session-assessment-sc',
  templateUrl: './mbo-session-assessment-sc.component.html',
  styleUrls: ['./mbo-session-assessment-sc.component.scss']
})
export class MboSessionAssessmentScComponent implements OnInit {
  sessionData: RescheduleSessionData;
  sessionId: number;
  transaction: Transaction;
  lang = 'en';
  visitingDoctorList: VisitingDoctorList[];
  participantDetails: ParticipantDetails;
  isCompleted = false;

  constructor(
    readonly statusService: SessionStatusService,
    readonly transactionService: TransactionService,
    private disabilityAssessmentService: DisabilityAssessmentService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    this.sessionId = +this.transaction?.params?.MB_SESSION_ID;
    this.getSessionDetails(this.sessionId);
    this.getParticipantsById();
    this.getVisitingDoctors();
  }
  getSessionDetails(sessionId: number) {
    this.statusService.getRescheduleSessionData(sessionId).subscribe(res => {
      this.sessionData = res;
    });
  }
  /* Method to get visiting doctors */
  getVisitingDoctors() {
    this.disabilityAssessmentService
      .getVisitingDoctors(this.sessionId)
      .subscribe(res => (this.visitingDoctorList = res));
  }
  /* Method to get participant by session id */
  getParticipantsById() {
    this.statusService.getParticipantsBySessionId(this.sessionId).subscribe(res => {
      this.participantDetails = res;
    });
  }
}
