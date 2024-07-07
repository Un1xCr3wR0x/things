/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, OnDestroy, Inject, Input, ElementRef, ViewChild } from '@angular/core';
import {
  AlertService,
  LookupService,
  DocumentService,
  RouterDataToken,
  RouterData,
  CsvFile,
  WorkflowService,
  CommonIdentity,
  getIdentityByType,
  getPersonNameAsBilingual,
  ContactDetails,
  isAddressEmpty,
  AddressDetails,
  AddressTypeEnum,
  BilingualText,
  convertToStringDDMMYYYY,
  parseToHijiri,
  IdentityTypeEnum,
  Alert,
  AlertTypeEnum,
  AlertIconEnum,
  MenuService,
  BenefitsGosiShowRolesConstants
} from '@gosi-ui/core';
import { Router } from '@angular/router';
import {
  ContributorService,
  AddAuthorizationService,
  ValidatorBaseScComponent,
  EstablishmentService,
  DocumentTransactionId,
  DocumentTransactionType,
  PersonalInformation,
  Minor,
  AuthorizerList,
  AuthorizationSource,
  ContributorRouteConstants,
  AttorneyDetails,
  CustodyDetails
} from '@gosi-ui/features/contributor';
import { AutoValidationComments } from '@gosi-ui/core/lib/models/auto-validation';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, noop, Observable, of } from 'rxjs';
import moment from 'moment';
import { switchMap, tap } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { PersonBankDetails } from '@gosi-ui/features/contributor/lib/shared';
import { CountryCode, getCountryCallingCode } from 'libphonenumber-js';

enum ServiceType {
  MOJ = 'add authorization MOJ',
  OTHER = 'add authorization external'
}
@Component({
  selector: 'cnt-validate-authorization-sc',
  templateUrl: './validate-authorization-sc.component.html',
  styleUrls: ['./validate-authorization-sc.component.scss']
})
export class ValidateAuthorizationScComponent extends ValidatorBaseScComponent implements OnInit, OnDestroy {
  /** Creates an instance of ValidateAuthorizationScComponent. */
  constructor(
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly addAuthorizationService: AddAuthorizationService,
    readonly workflowService: WorkflowService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly documentService: DocumentService,
    readonly modalService: BsModalService,
    readonly router: Router,
    @Inject(RouterDataToken) private routerData: RouterData,
    readonly menuService: MenuService
  ) {
    super(
      establishmentService,
      contributorService,
      lookupService,
      documentService,
      alertService,
      workflowService,
      modalService,
      router
    );
  }
  /** Local variables */
  @Input() transactionType;
  @Input() showComments: boolean;
  @Input() autoValidationComments?: AutoValidationComments[] = [];
  @Input() csvDocument: CsvFile;

  isAttorney = true;
  isMOJ = true;
  authorizationId: number;
  authorizationDetails;
  authorizedPerson: PersonalInformation;
  authorizedPersonIdentity: CommonIdentity;
  authorizedPersonName;
  authorizedPersonContactDetails: ContactDetails;
  hasNationalAddress: boolean;
  hasPOAddress: boolean;
  hasOverseasAddress: boolean;
  authPurpose: BilingualText;
  authorizerList: Array<AuthorizerList> | Array<Minor>;
  authText;
  bankAccount: PersonBankDetails;
  ibanPendingVerificationAlert = new Alert();

  @ViewChild('custodyTextIframe')
  custodyTextIframe: ElementRef;
  isEditable = false;
  isValidatorShow = false;
  /** Method to initialize the component. */
  ngOnInit(): void {
    this.ibanPendingVerificationAlert.messageKey = 'CONTRIBUTOR.IBAN-VERIFICATION-INFO-VAL';
    this.ibanPendingVerificationAlert.type = AlertTypeEnum.INFO;
    this.ibanPendingVerificationAlert.icon = AlertIconEnum.INFO;
    super.readDataFromToken(this.routerData);
    super.setFlagsForView(this.routerData);
    super.getDefaultLookupValues();
    this.isAttorney = this.routerData.idParams.get('authorizationType') === 'Attorney';
    this.authorizationId = this.routerData.idParams.get('authorizationId');

    const authDetails: Observable<AttorneyDetails | CustodyDetails> = this.isAttorney
      ? this.addAuthorizationService.getNonMOJAttorneyDetails(this.authorizationId)
      : this.addAuthorizationService.getNonMOJCustodyDetails(this.authorizationId);

    authDetails
      .pipe(
        tap(res => {
          this.authorizationDetails = res;
          this.isMOJ = res.authorizationSource === AuthorizationSource.MOJ;
          if (this.authorizationDetails.agent) {
            this.personId = this.authorizationDetails.agent.id;
            this.authorizerList = this.authorizationDetails.authorizerList;
            this.authText = new FormControl(this.authorizationDetails.attorneyText, [Validators.required]);
          } else {
            this.personId = this.authorizationDetails.custodian.id;
            this.authorizerList = this.authorizationDetails.minorList;
          }
        }),
        switchMap(_ => {
          return this.contributorService.getPersonById(this.personId as number);
        }),
        switchMap(p => {
          this.authorizedPerson = p;
          this.authorizedPersonIdentity = getIdentityByType(p.identity, p.nationality.english);
          this.authorizedPersonName = getPersonNameAsBilingual(p.name);
          this.authorizedPersonContactDetails = p.contactDetail;
          this.hasNationalAddress = !isAddressEmpty(this.getAddress(p.contactDetail, AddressTypeEnum.NATIONAL));
          this.hasPOAddress = !isAddressEmpty(this.getAddress(p.contactDetail, AddressTypeEnum.POBOX));
          this.hasOverseasAddress = !isAddressEmpty(this.getAddress(p.contactDetail, AddressTypeEnum.OVERSEAS));
          if (this.authorizationDetails.receiveBenefitPurpose || this.authorizationDetails.requestBenefitPurpose) {
            this.authPurpose = this.setAuthPurpose(
              this.authorizationDetails.receiveBenefitPurpose,
              this.authorizationDetails.requestBenefitPurpose
            );
          }
          if (!this.authorizedPersonName.english) this.authorizedPersonName.english = this.authorizedPersonName.arabic;

          return this.getDocuments(
            DocumentTransactionId.ADD_AUTHORIZATION,
            [DocumentTransactionType.ADD_AUTHORIZATION],
            this.authorizationId,
            this.referenceNo
          );
        }),
        switchMap(() => {
          let persons$; // Type Script compiler issues as always, we need to refactor the models
          if (this.isAttorney) {
            persons$ = (this.authorizerList as AuthorizerList[]).map(authorizer => {
              return this.contributorService.getPersonById(Number(authorizer.id)).pipe(
                tap(person => {
                  const identity = getIdentityByType(person.identity, person.nationality.english);
                  authorizer.id = identity.id + '';
                  authorizer.idType = identity.idType as IdentityTypeEnum;
                })
              );
            });
          } else {
            persons$ = (this.authorizerList as Minor[]).map(minor => {
              return this.contributorService.getPersonById(minor.id).pipe(
                tap(person => {
                  const identity = getIdentityByType(person.identity, person.nationality.english);
                  minor.id = identity.id;
                  minor.idType = identity.idType as IdentityTypeEnum;
                })
              );
            });
          }
          return forkJoin(persons$);
        }),
        switchMap(() => {
          if (this.isMOJ && !this.isAttorney) {
            return this.addAuthorizationService
              .getCustodyTextContent(this.authorizedPersonIdentity.id, this.authorizationDetails.custodyNumber)
              .pipe(
                tap(custodyText => {
                  const doc = this.custodyTextIframe.nativeElement.contentDocument;
                  doc.open();
                  doc.write(custodyText.textContent);
                  doc.close();
                })
              );
          } else {
            return of('empty');
          }
        }),
        switchMap(_ => {
          return this.addAuthorizationService
            .getBankForTransaction(
              this.personId as number,
              this.referenceNo,
              this.isMOJ ? ServiceType.MOJ : ServiceType.OTHER
            )
            .pipe(
              tap(account => {
                this.bankAccount = account.bankAccountList.filter(
                  acc => acc.ibanBankAccountNo == this.authorizationDetails.ibanBankAccountNo
                )[0];
                this.authorizationDetails.ibanBankAccountNo = this.bankAccount.ibanBankAccountNo;
              })
            );
        })
      )
      .subscribe(noop, noop);
      this.isEditable = this.menuService.isUserEntitled(BenefitsGosiShowRolesConstants.CREATE_PRIVATE);
      this.isValidatorShow = this.menuService.isUserEntitled(BenefitsGosiShowRolesConstants.ADD_AUTHORIZATION_VALIDATOR);
  }

  /** Method to clear alerts  */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }

  /**
   * Method to get the particular address from array
   * @param type
   */
  getAddress(contactDetails, type): AddressDetails {
    if (contactDetails?.addresses) {
      return contactDetails.addresses.find(address => address.type === type) || new AddressDetails();
    } else {
      return new AddressDetails();
    }
  }

  get getISDCodePrefix() {
    const callingCode = getCountryCallingCode(
      this.authorizedPersonContactDetails.mobileNo.isdCodePrimary.toUpperCase() as CountryCode
    );
    return `+${callingCode}`;
  }

  setAuthPurpose(receive, request) {
    if (!receive && !request) return;

    const arabic = [];
    const english = [];
    if (receive) {
      arabic.push('استلام منفعة');
      english.push('Receive Benefit');
    }
    if (request) {
      arabic.push('طلب منفعة');
      english.push('Request Benefit');
    }
    return {
      arabic: arabic.join('، '),
      english: english.join(', ')
    };
  }

  /** Method to handle workflow events. */
  handleWorkflowEvents(key: number) {
    const action = super.getWorkflowAction(key);
    const data = super.setWorkflowData(this.routerData, action);
    super.saveWorkflow(data);
    super.hideModal();
  }

  /** Method to navigate to validator edit. */
  navigateToEdit() {
    this.router.navigate([ContributorRouteConstants.ROUTE_ADD_AUTHORIZATION_EDIT], {
      state: {
        authorizationId: this.authorizationId,
        isAttorney: this.isAttorney,
        isMOJ: this.isMOJ,
        authorizationDetails: this.authorizationDetails,
        authorizedPerson: this.authorizedPerson,
        authorizedPersonIdentity: this.authorizedPersonIdentity,
        referenceNo: this.referenceNo,
        documents: this.documents,
        bankAccount: this.bankAccount
      }
    });
  }

  gregorianBirthDate(birthDate) {
    const age = moment(new Date()).diff(moment(birthDate.gregorian), 'years');
    return this.personAgeBilingual(convertToStringDDMMYYYY(birthDate.gregorian.toString()), age);
  }

  hijriBirthDate(birthDate, age) {
    return this.personAgeBilingual(parseToHijiri(birthDate.hijiri), age);
  }

  /**
   * Calculate age
   */
  personAgeBilingual(birthDate: string, age: number) {
    return {
      english: [birthDate, '(Age:', age, 'years)'].join(' '),
      arabic: [birthDate, '(السن:', age, this.calculateYear(age)].join(' ') + ')'
    };
  }

  /**
   *
   * @param years Label for years
   * @param years
   */
  calculateYear(years) {
    if (years <= 10) {
      return 'سنوات';
    } else if (years > 10) {
      return 'سنة';
    }
  }
}
