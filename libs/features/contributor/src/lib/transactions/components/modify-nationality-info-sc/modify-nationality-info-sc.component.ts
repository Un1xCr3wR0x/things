import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TransactionBaseScComponent } from '../shared';
import { ContributorConstants, ContributorService, EngagementService, EstablishmentService, ValidateWageUpdateService } from '../../../shared';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, BilingualText, DocumentService, GosiCalendar, LanguageToken, LookupService, Person, RouterData, RouterDataToken, TransactionService, getPersonArabicName, getPersonEnglishName } from '@gosi-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services';
import { ChangeRequestList, modifyDetailsResponse } from '@gosi-ui/features/customer-information/lib/shared/models/modify-nationality-details-info';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cnt-modify-nationality-info-sc',
  templateUrl: './modify-nationality-info-sc.component.html',
  styleUrls: ['./modify-nationality-info-sc.component.scss']
})
export class ModifyNationalityInfoScComponent extends TransactionBaseScComponent implements OnInit, OnDestroy {
  personId: number;
  nationalId: any;
  gccNO: any;
  name: string;
  nameArab: string;
  personDetails: Person;
  iqmaNo: any;
  borderNo: any;
  nationalityResponse: modifyDetailsResponse;
  oldNationality: BilingualText;
  oldPassport: string;
  oldPassportIssue: GosiCalendar;
  oldPassportExpiry: GosiCalendar;
  status: string;
  changeRequestDetails: ChangeRequestList[] = [];
  passportNumber: any;
  nationality: BilingualText;
  passportExpiryDetails: any;
  passportIssueDetails: any;
  nationalityInfo: any;
  passport: any;
  lang: any;
  identifier: number;
  showGccId: boolean = false;
  gccID: any;
  businessTransaction: string;
  constructor(readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly wageUpdateService: ValidateWageUpdateService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    public changePersonService: ChangePersonService,
    readonly dashboardSearchService: DashboardSearchService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super(contributorService, establishmentService, engagementService, lookupService, documentService, transactionService, alertService, router)
  }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });

    this.getTransactionDetails();
    this.getBasicDetails();

    // super.getDocuments(
    //   'MODIFY_NATIONALITY_NON_SAUDI_TO_NON_SAUDI',
    //   'MODIFY_NATIONALITY_NON_SAUDI_TO_NON_SAUDI_HAVING_IQAMA',
    //   null,
    //   this.referenceNo
    // ).subscribe();
    this.status = this.transaction.status.english;
    this.getBusinessTransaction();
    this.setDetails();
    this.getScannedDocument(this.referenceNo);


  }
  /** get scanned documents */
getScannedDocument(referenceNo) {
  this.documentService.getAllDocuments(null, referenceNo).subscribe(
    res => {
      this.documents = res;
    },
    err => {
      //this.showErrorMessage(err);
    }
  );
}
  setDetails() {
    this.personIdentifier = this.nin || this.iqama || this.socialInsuranceNo;
    this.searchRequest.searchKey = this.personIdentifier.toString();
    this.dashboardSearchService.searchIndividual(this.searchRequest, false).subscribe(response => {
      this.personId = response.listOfPersons[0].personId
      this.personDetails = response.listOfPersons[0];
      this.name = getPersonEnglishName(this.personDetails.name.english.name);
      this.nameArab = getPersonArabicName(this.personDetails.name.arabic);
      this.nationalId = this.personDetails.identity.find(id => id.idType === 'IQAMA')
      this.gccNO = this.personDetails.identity.find(id => id.idType === 'GCCID')
      const borderNO = this.personDetails.identity.find(id => id.idType === 'BORDERNO')
      const value = this.personDetails.identity.find(id => id.idType === 'PASSPORT')
      this.passportNumber = value
      this.nationality = this.personDetails.nationality
      if (borderNO) {
        this.borderNo = borderNO
      }
      if(this.appToken === ApplicationTypeEnum.PRIVATE) {
        this.identifier = this.personId;
      }
      else{
        this.identifier = this.nationalId?.iqamaNo ? this.nationalId?.iqamaNo :  this.borderNo?.id
      }

      if (this.status == 'Completed' || this.status == 'Approved' || this.status== 'Rejected') {
        this.changePersonService.getModifyNationalityRevision(this.identifier, this.referenceNo, this.businessTransaction).subscribe(res => {
          this.nationalityResponse = res;
          // this.oldNationality = res.nationality;
          // this.oldPassport = res.oldPassportNo;
          // this.oldPassportExpiry = res.oldExpiryDate;
          // this.oldPassportIssue = res.oldIssueDate;
        })

      }
      else if (this.status == 'In Progress') {
        this.changePersonService.getChangeRequestDetails(this.identifier).subscribe(response => {
          this.changeRequestDetails = response.changeRequestList;
          this.passportIssueDetails = this.changeRequestDetails?.find(data => data.parameter == 'Passport Issue Date')
          this.passportExpiryDetails = this.changeRequestDetails?.find(data => data.parameter == 'Passport Expiry Date')
          this.nationalityInfo = this.changeRequestDetails?.find(data => data.parameter == 'Nationality')
          this.passport = this.changeRequestDetails?.find(data => data.parameter == 'Passport Number')
          this.gccID = this.changeRequestDetails?.find(data => data.parameter == 'Gcc Id')
          if(this.gccID){
            this.showGccId = true;
          }
          else{
            this.showGccId = false;
          }

        })
      }

    });

  }
  getBusinessTransaction(){
    switch (this.transaction?.transactionId) {
      case 300404:
          this.businessTransaction = ContributorConstants.MODIFY_NATIONALITY_IMMIGRATED_TRIBES_TO_GCC;
          break;
      case 300414:
          this.businessTransaction = ContributorConstants.MODIFY_NATIONALITY_GCC_TO_GCC;
          break;
      case 300407:
          this.businessTransaction = ContributorConstants.MODIFY_NATIONALITY_NON_SAUDI_TO_GCC;
          break;
      case 300402:
          this.businessTransaction = ContributorConstants.MODIFY_NATIONALITY_NON_SAUDI_TO_IMMIGRATED_TRIBES;
          break;
      case 300406:
          this.businessTransaction = ContributorConstants.MODIFY_NATIONALITY_GCC_TO_IMMIGRATED_TRIBES;
          break;
      case 300405:
          this.businessTransaction = ContributorConstants.MODIFY_NATIONALITY_GCC_TO_NON_SAUDI;
          break;
      case 300403:
          this.businessTransaction = ContributorConstants.MODIFY_NATIONALITY_IMMIGRATED_TRIBES_TO_NON_SAUDI;
          break;
      case 300400:
          this.businessTransaction = ContributorConstants.NATIONALITY_TRANSACTIONID;
          break;
  }

  }



}



