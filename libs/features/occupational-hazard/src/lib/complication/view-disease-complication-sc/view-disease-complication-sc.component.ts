/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import {
  AlertService,
  DocumentService,
  ApplicationTypeToken,
  DocumentItem,
  ApplicationTypeEnum,
  LanguageToken,
  AuthTokenService,
} from '@gosi-ui/core';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService
} from '../../shared/services';
import { FormBuilder} from '@angular/forms';
import { OhBaseScComponent } from '../../shared/component/base/oh-base-sc.component';
import { tap } from 'rxjs/operators';
import { BehaviorSubject} from 'rxjs';
@Component({
  selector: 'oh-view-disease-complication-sc',
  templateUrl: './view-disease-complication-sc.component.html',
  styleUrls: ['./view-disease-complication-sc.component.scss']
})
export class ViewDiseaseComplicationScComponent extends OhBaseScComponent implements OnInit {
  // Common variables and methods are declared in the base component
  /*
   * Local variables
   */
 
  complicationId: number;
  registrationNo: number;
  sessionReg: string;
  socialInsuranceNo: number;
  complicationDocumentList: DocumentItem[] = [];
  complications: any;
  personId: number;
  isValidatorView = true;

 
  /**
   * Initializing constructor
   * @param alertService
   * @param contributorService
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly injuryService: InjuryService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly ohService: OhService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly authTokenService: AuthTokenService
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

  /**
   * Method for initialization tasks
   */
  ngOnInit() {
    super.ngOnInit();
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    this.diseaseId = this.ohService.getDiseaseId();
    this.ohService.setDiseaseId(this.diseaseId);
    this.diseaseNumber = +localStorage.getItem('diseaseNumber') || this.ohService.getDiseaseNumber();
    this.complicationId = this.ohService.getComplicationId();
    localStorage.setItem('diseaseNumber', this.diseaseNumber.toString());
    if (this.appToken === ApplicationTypeEnum.PUBLIC) this.getEstablishment();
    this.getComplication();
    this.getDiseasePersonDetails();
  }
  
  /**
   * Metod to get the complication details
   */
  getComplication() {
    this.complicationService
      .getHistoryComplication(
        this.registrationNo,
        this.socialInsuranceNo,
        this.diseaseNumber,
        this.complicationId
      )
      .pipe(
        tap(res => {
          this.complications = res?.diseaseComplicationResponse;
          this.diseaseId = this.complications?.diseaseId
          this.getDisease(false);
        })
      )
      .subscribe(
        () => {
          this.documentService.getOldDocuments(this.complicationId).subscribe(documentResponse => {
            this.complicationDocumentList = documentResponse.filter(item => item.documentContent !== null);
          });

          // this.getDiseasePersonDetails();
          // this.getDisease(false);
          if (this.appToken !== ApplicationTypeEnum.INDIVIDUAL_APP) this.getEngagement();
        },
        err => {
          this.showError(err);
        }
      );
  }

  getDiseasePersonDetails() {
    this.contributorService.getDiseasePerson(this.registrationNo, this.socialInsuranceNo).subscribe(
      response => {
        this.person = response;
      },
      err => {
        this.showError(err);
      }
    );
  }
  viewDisease(disease: number) {
    this.setComplicationParams();
    this.router.navigate([
      `home/oh/view/${this.complications.establishmentRegNo}/${this.socialInsuranceNo}/${disease}/disease/info`
    ]);
    this.alertService.clearAlerts();
  }
  setComplicationParams() {
    this.ohService.setRegistrationNo(this.complications.establishmentRegNo);
    this.ohService.setDiseaseNumber(this.complications.diseaseNo);
    this.ohService.setDiseaseId(this.complications.diseaseId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
  }
}

