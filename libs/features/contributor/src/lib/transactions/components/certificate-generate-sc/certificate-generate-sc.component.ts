import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { TransactionBaseScComponent } from '../shared';
import {
  RouterDataToken,
  RouterData,
  AlertService,
  TransactionService,
  LookupService,
  DocumentService,
  BilingualText,
  Person,
  getPersonArabicName,
  MenuService,
  AuthTokenService,
  RoleIdEnum,
  ApplicationTypeEnum,
  ApplicationTypeToken
} from '@gosi-ui/core';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { Router } from '@angular/router';
import {
  ValidateWageUpdateService,
  EstablishmentService,
  ContributorService,
  EngagementService
} from '../../../shared';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import { Location } from '@angular/common';

@Component({
  selector: 'cnt-certificate-generate-sc',
  templateUrl: './certificate-generate-sc.component.html',
  styleUrls: ['./certificate-generate-sc.component.scss']
})
export class CertificateGenerateScComponent extends TransactionBaseScComponent implements OnInit, OnDestroy {
  contributorNameArabic: string;
  contributorNameEnglish: string;
  Nin: any;
  errorMessage: BilingualText = new BilingualText();
  personDetails: Person;
  isSaudiPerson: boolean;

  constructor(
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly engagementService: EngagementService,
    readonly lookupService: LookupService,
    readonly transactionService: TransactionService,
    readonly wageUpdateService: ValidateWageUpdateService,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly router: Router,
    public changePersonService: ChangePersonService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly location: Location,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly menuService: MenuService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly tokenService: AuthTokenService
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
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.getTransactionDetails();
    this.getPersonDetails();
  }

  /** Method to retrieve person data for view. */
  getPersonDetails() {
    this.personIdentifier = this.nin || this.iqama || this.socialInsuranceNo;
    this.searchRequest.searchKey = this.personIdentifier.toString();
    const isGuest = this.menuService.isUserEntitled([RoleIdEnum.GUEST]);

    if (!this.personIdentifier) {
      this.location.back();
    } else if (!(this.isIndividualApp && isGuest)) {
      this.dashboardSearchService.searchIndividual(this.searchRequest, false).subscribe(response => {
        this.personDetails = response.listOfPersons[0];

        this.contributorNameEnglish = this.personDetails.name.english.name;
        this.contributorNameArabic = getPersonArabicName(this.personDetails.name.arabic);
        this.isSaudiPerson = this.personDetails.nationality.english == 'Saudi Arabia' ? true : false;

        this.Nin = this.contributorService.NINDetails[0]?.newNin || this.contributorService.IqamaDetails[0]?.iqamaNo;
      });
    }
  }
}
