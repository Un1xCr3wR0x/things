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
  TransactionService,
  Transaction,
  AuthTokenService
} from '@gosi-ui/core';
import { FormBuilder} from '@angular/forms';
import { tap } from 'rxjs/operators';
import { BehaviorSubject} from 'rxjs';
import { ComplicationService, ContributorService, DiseaseService, EstablishmentService, InjuryService, OhBaseScComponent, OhService } from '../../../shared';

@Component({
  selector: 'oh-report-complication-disease-sc',
  templateUrl: './report-complication-disease-sc.component.html',
  styleUrls: ['./report-complication-disease-sc.component.scss']
})
export class ReportComplicationDiseaseScComponent extends OhBaseScComponent implements OnInit {

  complicationId: number;
  registrationNo: number;
  socialInsuranceNo: number;
  complicationDocumentList: DocumentItem[] = [];
  complications: any;
  isValidatorView = true;
  transaction: Transaction;
  transactionRefId: number;
  transactionId: number;
  resourceType: string;
  isAppIndividual = false;
  refNo: number;

 
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
    readonly transactionService: TransactionService,
    readonly authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
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
    this.transaction = this.transactionService.getTransactionDetails();
    this.isAppIndividual = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    if (this.transaction) {
      this.refNo = this.transaction.transactionRefNo;
      this.registrationNo = this.transaction.params.REGISTRATION_NO;
      if (this.isAppIndividual) {
        this.socialInsuranceNo = this.authTokenService.getIndividual();
      }
      else {
        this.socialInsuranceNo = this.transaction.params.SIN;
      }

      this.complicationId = this.transaction.params.BUSINESS_ID;
      this.diseaseNumber = this.transaction.params.INJURY_ID;
      this.referenceNo = this.transaction.transactionRefNo;
      this.ohService.setRegistrationNo(this.registrationNo);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.getComplication();
      this.getDiseasePersonDetails();
    }
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
    this.router.navigate([
      `home/oh/view/${this.complications.establishmentRegNo}/${this.socialInsuranceNo}/${disease}/disease/info`
    ]);
    this.alertService.clearAlerts();
  }

}

