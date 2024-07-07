import { Component, Inject, OnInit } from '@angular/core';
import {
  ComplicationService,
  ContributorService,
  DiseaseService,
  EstablishmentService,
  InjuryService,
  OhBaseScComponent,
  OhService
} from '../../shared';
import { AlertService, ApplicationTypeToken, DocumentItem, DocumentService, LanguageToken, LookupService } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
// import { DisabilityAssessmentService } from '@gosi-ui/features/medical-board';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'oh-view-appeal-reason-sc',
  templateUrl: './view-appeal-reason-sc.component.html',
  styleUrls: ['./view-appeal-reason-sc.component.scss']
})
export class ViewAppealReasonScComponent extends OhBaseScComponent implements OnInit {
  disabilityAssessmentId: number;
  assessmentRequestId: number;
  documents: DocumentItem[] = [];
  identifier: number;

  constructor(
    readonly alertService: AlertService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly establishmentService: EstablishmentService,
    readonly injuryService: InjuryService,
    readonly ohService: OhService,
    readonly fb: FormBuilder,
    readonly complicationService: ComplicationService,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly lookupService: LookupService,
    readonly router: Router,
    @Inject(LanguageToken) language: BehaviorSubject<string>,
    readonly diseaseService: DiseaseService
  ) {
    super(
      language,
      alertService,
      contributorService,
      documentService,
      establishmentService,
      injuryService,
      ohService,
      router,
      fb,
      complicationService,
      diseaseService,
      location,
      appToken
    );
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    this.personId = this.ohService.getPersonId();
    this.injuryId = this.ohService.getInjuryId();
    this.disabilityAssessmentId = this.ohService.getDisablilityAssessmentId();
    this.assessmentRequestId = this.ohService.getAssessmentRequestId();
    this.identifier = this.ohService.getIdentifier();
    this.getDisabilityDetails();
    this.documentFetch(this.disabilityAssessmentId);
  }
  getDisabilityDetails() {
    this.ohService.getDisabilityDetails(this.identifier, this.assessmentRequestId).subscribe(
      res => {
        this.disabilityDetails = res;
      },
      err => {
        this.alertService.showError(err.error?.message);
      }
    );
  }
  documentFetch(transactionId) {
    this.documentService.getMultipleDocuments(transactionId).subscribe(documentResponse => {
      if (documentResponse) {
        this.documents = documentResponse?.filter(item => item.documentContent !== null);
      }
    });
  }
  // getPreviousDisability() {
  //   this.disabilityAssessmentService.getPreviousDisability(this.socialInsuranceNo).subscribe(res => {
  //     this.previousDisabilityDetails = res;
  //     // this.totalItems = res.count;
  //   });
  // }
}
