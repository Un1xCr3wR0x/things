import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  WorkflowService,
  AlertService,
  LookupService,
  DocumentService,
  TransactionService,
  DocumentItem,
  CommonIdentity,
  BilingualText,
  Alert,
  AlertIconEnum,
  AlertTypeEnum,
  getIdentityByType,
  getPersonNameAsBilingual,
  isAddressEmpty,
  convertToStringDDMMYYYY,
  parseToHijiri,
  IdentityTypeEnum
} from '@gosi-ui/core';
import { ContactDetails } from '@gosi-ui/foundation-dashboard/lib/individual-app/models';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Transaction } from 'testing';
import {
  EstablishmentService,
  ContributorService,
  AddAuthorizationService,
  PersonalInformation,
  AuthorizerList,
  Minor,
  PersonBankDetails,
  AttorneyDetails,
  CustodyDetails,
  AuthorizationSource,
  AddressTypeEnum,
  AddressDetails,
  DocumentTransactionId,
  DocumentTransactionType
} from '../../../shared';
import { TransactionBaseScComponent } from '../../../transactions/components';
import { Observable, forkJoin, noop, observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { CountryCode, getCountryCallingCode } from 'libphonenumber-js';

enum ServiceType {
  MOJ = 'add authorization MOJ',
  OTHER = 'add authorization external'
}
@Component({
  selector: 'cnt-view-authorization-sc',
  templateUrl: './view-authorization-sc.component.html',
  styleUrls: ['./view-authorization-sc.component.scss']
})
export class ViewAuthorizationScComponent implements OnInit, OnDestroy {
  /** Creates an instance of ViewAuthorizationScComponent. */
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
    private route: ActivatedRoute
  ) {}
  /** Local variables */
  transaction: Transaction;
  personId;
  referenceNo: number;
  documents: DocumentItem[] = [];
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

  authSource;

  @ViewChild('custodyTextIframe')
  custodyTextIframe: ElementRef;

  ngOnInit(): void {
    this.ibanPendingVerificationAlert.messageKey = 'CONTRIBUTOR.IBAN-VERIFICATION-INFO-VAL';
    this.ibanPendingVerificationAlert.type = AlertTypeEnum.INFO;
    this.ibanPendingVerificationAlert.icon = AlertIconEnum.INFO;

    this.isAttorney = this.route.snapshot.queryParamMap.get('authType') === 'attorney';
    this.authorizationId = Number(this.route.snapshot.queryParamMap.get('authorizationId'));
    //this.referenceNo = Number(this.route.snapshot.queryParamMap.get('referenceNo'));

    const authDetails: Observable<AttorneyDetails | CustodyDetails> = this.isAttorney
      ? this.addAuthorizationService.getNonMOJAttorneyDetails(this.authorizationId)
      : this.addAuthorizationService.getNonMOJCustodyDetails(this.authorizationId);

    authDetails
      .pipe(
        tap(res => {
          this.authorizationDetails = res;
          this.isMOJ = res.authorizationSource === AuthorizationSource.MOJ;
          this.referenceNo = Number(res.referenceNumber) || 0;
          this.authSource = this.isMOJ
            ? { english: 'Ministry of Justice', arabic: 'وزارة العدل' }
            : { english: 'Other Source', arabic: 'مصدر آخر' };
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
        tap(p => {
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

          // return this.getDocumentDetails(
          //   DocumentTransactionId.ADD_AUTHORIZATION,
          //   DocumentTransactionType.ADD_AUTHORIZATION,
          //   this.authorizationId,
          //   this.referenceNo
          // );
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
          }

          return of({});
        }),
        switchMap(() => {
          if (this.referenceNo) {
            return this.getDocumentDetails(
              DocumentTransactionId.ADD_AUTHORIZATION,
              DocumentTransactionType.ADD_AUTHORIZATION,
              this.authorizationId,
              this.referenceNo
            );
          }
          return of({});
        }),
        switchMap(_ => {
          if (this.authorizationDetails.ibanBankAccountNo) {
            return this.addAuthorizationService.getBankAccountsForPerson(this.personId as number).pipe(
              tap(account => {
                this.bankAccount = account.bankAccountList.filter(
                  acc => acc.ibanBankAccountNo == this.authorizationDetails.ibanBankAccountNo
                )[0];
                this.authorizationDetails.ibanBankAccountNo = this.bankAccount.ibanBankAccountNo;
              })
            );
          }
        })
      )
      .subscribe(noop, noop);
  }

  /**
   * Method to get document list
   * @param transactionKey
   * @param transactionType
   * @param businessId
   */
  getDocumentDetails(transactionKey: string, transactionType: string, businessId: number, referenceNo: number) {
    return this.documentService
      .getDocuments(transactionKey, transactionType, businessId, referenceNo)
      .pipe(tap(res => (this.documents = res.filter(item => item.documentContent != null))));
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

  /** Method to clear alerts  */
  ngOnDestroy() {
    this.alertService.clearAllErrorAlerts();
  }
}
