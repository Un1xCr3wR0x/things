// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'cnt-add-nin-sc',
//   templateUrl: './add-nin-sc.component.html',
//   styleUrls: ['./add-nin-sc.component.scss']
// })
// export class AddNinDetailsScComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  DocumentService,
  LookupService,
  RouterData,
  RouterDataToken,
  TransactionService,
  BilingualText,
  Person,
  getPersonArabicName
} from '@gosi-ui/core';
import { ContributorRouteConstants, EngagementDetails, getTransactionType } from '../../../shared';
import { throwError, noop } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { DocumentTransactionId, DocumentTransactionType } from '../../../shared/enums';
import { UpdatedWageListResponse } from '../../../shared/models';
import {
  ContributorService,
  EngagementService,
  EstablishmentService,
  ValidateWageUpdateService
} from '../../../shared/services';
import { TransactionBaseScComponent } from '../shared';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import { Location } from '@angular/common';
import { PersonDetailsDTO } from '../../../shared/models/person-details-dto';

@Component({
  selector: 'cnt-add-nin-sc',
  templateUrl: './add-nin-sc.component.html',
  styleUrls: ['./add-nin-sc.component.scss']
})
export class AddNinDetailsScComponent extends TransactionBaseScComponent implements OnInit, OnDestroy {
  contributorNameArabic: string;
  contributorNameEnglish: string;
  Nin: any;
  updatedWageListResponse: UpdatedWageListResponse;
  engagement: EngagementDetails;
  errorMessage: BilingualText = new BilingualText();
  personDetails: Person;
  isSaudiPerson: boolean;
  personalDetailsCurrentDto: PersonDetailsDTO = new PersonDetailsDTO();
  personalDetailsFromNicDto: PersonDetailsDTO = new PersonDetailsDTO();
  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly transactionService: TransactionService,
    readonly wageUpdateService: ValidateWageUpdateService,
    readonly alertService: AlertService,
    readonly router: Router,
    public changePersonService: ChangePersonService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly location: Location,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData
  ) {
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
    this.getTransactionDetails();
    // this.fetchDataForView();
    this.getPersonDetails();
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
        this.isSaudiPerson = this.personDetails.nationality.english == 'Saudi Arabia' ? true : false;

        this.contributorService.getPersonCompareDetails(this.personDetails.personId).subscribe(res => {
          let data: any = res;
          this.personalDetailsCurrentDto = data.personalDetailsCurrentDto;
          this.personalDetailsFromNicDto = data.personalDetailsFromNicDto;
        })
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

  /** Method to retrieve data for validator view. */
  // fetchDataForView() {
  //   if(this.transaction.title.english == 'Add NIN'){
  //   super
  //     .getDocuments(
  //       DocumentTransactionId.ADD_NIN,
  //       DocumentTransactionType.ADD_NIN,
  //       null,
  //       this.referenceNo
  //     )
  //     .subscribe(res=>{
  //     });
  //   }
  //   else if(this.transaction.title.english.trim() == 'Edit NIN'){
  //     super
  //       .getDocuments(
  //         DocumentTransactionId.EDIT_NIN,
  //         DocumentTransactionType.EDIT_NIN,
  //         null,
  //         this.referenceNo
  //       )
  //       .subscribe(res=>{
  //       });
  //     }
  // }

  /** Method to retrieve data for validator view. */
  // fetchEngagementDataForView() {
  //   if (this.registrationNo && this.socialInsuranceNo && this.engagementId) {
  //     super
  //       .getBasicDetails(new Map().set('checkBeneficiaryStatus', true))
  //       .pipe(
  //         switchMap(() => {
  //           return this.wageUpdateService
  //             .getOccupationAndWageDetails(
  //               this.registrationNo,
  //               this.socialInsuranceNo,
  //               this.engagementId,
  //               this.referenceNo
  //             )
  //             .pipe(tap((res: UpdatedWageListResponse) => (this.updatedWageListResponse = res)));
  //         }),
  //         switchMap(() => {
  //           return super.getDocuments(
  //             DocumentTransactionId.MANAGE_WAGE,
  //             DocumentTransactionType.MANAGE_WAGE,
  //             this.engagementId,
  //             this.routerDataToken.transactionId
  //           );
  //         }),
  //         catchError(err => {
  //           super.handleError(err, true);
  //           return throwError(err);
  //         })
  //       )
  //       .subscribe(noop, noop);
  //   }
  // }

  /**
   * Navigate to CSR edit view from validator view
   */
  navigateToCSR() {
    this.router.navigate([ContributorRouteConstants.ROUTE_UPDATE_INDIVIDUAL_WAGE_EDIT]);
  }
}