import { Component, Inject, OnInit } from '@angular/core';
import { TransactionBaseScComponent } from '../shared';
import { AlertService, ApplicationTypeToken, DocumentService, GosiCalendar, LanguageToken, LookupService, Person, RouterData, RouterDataToken, Transaction, TransactionReferenceData, TransactionService, checkBilingualTextNull, getPersonArabicName } from '@gosi-ui/core';
import { ContributorService, ContributorsWageService, EngagementService, EstablishmentService, SearchEngagementResponse, TransferContributorService } from '../../../shared';
import { Router } from '@angular/router';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cnt-enter-rpa-transaction-sc',
  templateUrl: './enter-rpa-transaction-sc.component.html',
  styleUrls: ['./enter-rpa-transaction-sc.component.scss']
})
export class EnterRpaTransactionScComponent extends TransactionBaseScComponent implements OnInit {

  contributorNameArabic: string;
  contributorNameEnglish: string;
  Nin: any;
  comments: TransactionReferenceData[] = [];
  personDetails: Person;
  birthDate: GosiCalendar = new GosiCalendar();
  engagementDetails: SearchEngagementResponse;
  lang = 'en';
  isFirstScheme: boolean = true;
  transaction: Transaction;



  constructor(readonly contributorService: ContributorService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly location: Location,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly transferContributorService: TransferContributorService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly router: Router,
    readonly contributorWageService: ContributorsWageService,
    @Inject(RouterDataToken) private routerData: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
      super(
        contributorService,
        establishmentService,
        engagementService,
        lookupService,
        documentService,
        transactionService,
        alertService,
        router
      );
     }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.transaction = this.transactionService.getTransactionDetails();
    const trimmedTitle = this.transaction.title.english.replace(/\s+$/, '');
    if(trimmedTitle == 'Request to Aggregate GOSI Contributions to PPA'){
      this.isFirstScheme = true;
    }
    else if(trimmedTitle == 'Request to Aggregate PPA Contributions to GOSI'){
      this.isFirstScheme = false;
    }
    this.readTransactionDataFromToken(this.routerData);
    super.getTransactionDetails();
    this.getPersonDetails();
    this.getIndividualContributorDetails();
    this.getRpaDetails();
  }

  getRpaDetails(){
    this.contributorService.getRpaDetails(this.socialInsuranceNo,this.referenceNo).subscribe(res => {
      this.engagementDetails = res;
    })
  }

  /** Method to read transaction data from token. */
  readTransactionDataFromToken(token: RouterData) {
    if (token.payload) {
      const payload = JSON.parse(token.payload);
      //if (payload.requestId) this.requestId = payload.requestId;
      if (payload.comments)  this.comments = payload.comments;
    }
  }

  /** Method to retrieve person data for view. */
  getPersonDetails() {
    this.personIdentifier = this.nin || this.iqama || this.socialInsuranceNo;
    this.searchRequest.searchKey = this.personIdentifier.toString();

    if (!this.personIdentifier) {
      this.location.back();
    } else {
      this.dashboardSearchService.searchIndividual(this.searchRequest, false).subscribe(response => {
        this.personDetails = response.listOfPersons[0];

        this.contributorNameEnglish = this.personDetails.name.english.name;
        this.contributorNameArabic = getPersonArabicName(this.personDetails.name.arabic);
        this.birthDate = this.personDetails.birthDate;
       // this.isSaudiPerson = this.personDetails.nationality.english == 'Saudi Arabia' ? true : false;
        this.Nin = this.contributorService.NINDetails[0]?.newNin || this.contributorService.IqamaDetails[0]?.iqamaNo;
        this.getScannedDocument(this.referenceNo);
      });
    }
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

  /** Method to get contributor details. */
  getIndividualContributorDetails() {
    this.contributorService.getIndividualContDetails(this.socialInsuranceNo).subscribe(
      res => {
        this.contributor = res;
      },
      err => {
        if (err.error) {
          this.alertService.showError(err.error);
        }
      }
    );
  }

  checkNull(control) {
    return checkBilingualTextNull(control);
  }

}
