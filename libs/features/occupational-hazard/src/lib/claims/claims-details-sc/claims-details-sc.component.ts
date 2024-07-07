import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  DocumentService,
  EstablishmentStatusEnum,
  LanguageToken,
  LookupService,
  RoleIdEnum,
  scrollToTop
} from '@gosi-ui/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { ClaimDetailsFilterParams, EstablishmentService, OhService, OHTransactionType, TabSetVariables } from '../../shared';
import { OhClaimsService } from '../../shared/services/oh-claims.service';
import { ClaimsBaseScComponent } from '../base/claims-base.sc.component';
@Component({
  selector: 'oh-claims-details-sc',
  templateUrl: './claims-details-sc.component.html',
  styleUrls: ['./claims-details-sc.component.scss']
})
export class ClaimsDetailsScComponent extends ClaimsBaseScComponent implements OnInit {
  transactionMessage: BilingualText;
  constructor(
    readonly router: Router,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly ohService: OhService,
    readonly claimService: OhClaimsService,
    readonly lookupService: LookupService
  ) {
    super();
    const navigation = this.router.getCurrentNavigation();
    this.transactionMessage = navigation?.extras?.state?.data?.transactionMessage;
  }
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
      this.statusEst = this.establishment?.status.english;
      if (this.lang === 'ar') {
        this.statusEst = this.establishment?.status.arabic;
      }
    });
    this.getLookUpValues();
    if(this.transactionMessage) {
      this.alertService.showSuccess(this.transactionMessage);
      scrollToTop();
    }
    this.alertService.clearAllErrorAlerts();
    this.alertService.getAlerts();
    this.ohService.setHasRoutedBack(false);
    if(this.ohService.getCurrentPath()){
      this.ohService.setPreviousPath(this.ohService.getCurrentPath());      
    }
    this.ohService.setCurrentPath(this.router.url);
    this.ohService.setSelectedTabid(TabSetVariables.Claims);
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.getData();
    if (!this.injuryStatus) {
      this.injuryStatus = this.ohService.getInjurystatus();
    }
    if (this.complicationId) {
      this.injuryStatus = this.ohService.getComplicationstatus();
    }
    if (
      this.injuryStatus?.english === 'Rejected' ||
      this.injuryStatus?.english === 'Cancelled' ||
      this.injuryStatus?.english === 'Cancelled By System'
    ) {
      this.showNewClaims = false;
    }
    if (this.isAppPrivate) {
      this.reimbuserRoles.push(RoleIdEnum.CSR);
    } else {
      this.reimbuserRoles.push(RoleIdEnum.OH_ADMIN, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN);
    }
    this.getClaimsDetails();
  }
  getLookUpValues() {
    this.statusTemp$ = this.lookupService.getTransactionStatusList('OHClaimStatusType');
    this.claimType$ = this.lookupService.getTransactionStatusList('OHClaimType');
    this.claimPayee$ = this.lookupService.getTransactionStatusList('OHBenefitPayableTo');
  }
  getData() {
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    this.injuryId = this.ohService.getInjuryId();
    this.complicationId = this.ohService.getComplicationId();
    this.diseaseId = this.ohService.getDiseaseId();
    this.diseaseId = null;
    if (this.complicationId) {
      this.payeeId = this.complicationId;
    } else if(this.diseaseId) {
      this.payeeId = this.diseaseId;
    } else {
      this.payeeId = this.injuryId;
    }
  }
  getEstablishment() {
    this.establishmentService.getEstablishmentDetails(this.registrationNo).subscribe(
      response => {
        this.establishment = response;
        if (
          this.establishment?.status.english === EstablishmentStatusEnum.CLOSED ||
          this.establishment?.status.english === EstablishmentStatusEnum.CLOSING_IN_PROGRESS
        ) {
          this.isEstClosed = true;
          this.language.subscribe(language => {
            this.lang = language;
            this.statusEst = this.establishment?.status.english;
            if (this.lang === 'ar') {
              this.statusEst = this.establishment?.status.arabic;
            }
            if (this.statusEst && !this.isAppPrivate) {
              this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.PROHIBIT-REIMBURSEMENT', {
                status: this.statusEst
              });
            }
          });
        } else {
          this.isEstClosed = false;
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  newClaim() {
    this.getEstablishment();
    if (this.isEstClosed !== true) {
      if (this.complicationId) {
        this.injuryNo = this.ohService.getInjuryNumber();
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNo}/${this.complicationId}/reimbursement`
        ]);
      } else {
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/reimbursement`
        ]);
      }
    }
  }
  applyFilter(filterValues: ClaimDetailsFilterParams) {
    this.getClaimsDetails(filterValues);
  }
  setFilterValues(filterValues) {
    if(filterValues){
      this.ohService.getClaimsDetails(filterValues).subscribe(response => {
        this.claimsDetailsForFilter = response;
      });
     }
  }
  getClaimsDetails(filterValues?) {
    this.setFilterValues(filterValues);
    this.ohService.getClaimsDetails(filterValues).subscribe(
      res => {
        this.claimsWrapper = res;
        this.claimBreakUpList = res.claims;
        this.claimList = [];
        this.isError = false;
        if (this.claimsWrapper && this.claimsWrapper.claims && this.claimsWrapper.claims.length > 0) {
          this.claimsWrapper.claims.forEach((item, index) => {
            let status = item.paymentStatus.english;
            if (item?.invoiceItemId) {
              if (this.claimList.findIndex(i => i.invoiceItemId === item.invoiceItemId) === -1) {
                this.claimList.push(item);
              } 
              else {
                this.claimList.forEach(element => {
                  status = element.paymentStatus.english;
                  if (element.invoiceItemId === item.invoiceItemId && item.invoiceItemId !== null) {
                    if (
                      element.paymentStatus.english === 'Case rejected' &&
                      item.paymentStatus.english !== 'Case rejected'
                    ) {
                      element.paymentStatus = item.paymentStatus;
                    }
                    if (element.paymentStatus.english === 'Paid' && item.paymentStatus.english !== 'Paid') {
                      element.paymentStatus = item.paymentStatus;
                    }
                    if (item.expenses) {
                      item.expenses.forEach(id => {
                        if (id.type.english === 'Recovery Claim') {
                          id.amount = -Math.abs(id.amount);
                        }
                      });
                    }
                  }
                });
              }
            } else {
              this.claimList.push(item);
            }
          });
          this.claimsWrapper.claims = this.claimList;
          this.claimsWrapper.claims = this.claimsWrapper.claims.filter(function (el) {
            return el != null;
          });
          this.totalAmount = this.claimsWrapper?.totalAmount;
          this.getHoldDetails();
          this.claimsWrapper.claims.forEach((claims, index) => {
            this.document = [];
            const type =
              claims?.claimType?.english === 'Total Disability Repatriation Expenses'
                ? OHTransactionType.TOTAL_DISABILITY_REPATRIATION
                : OHTransactionType.DEAD_BODY_REPATRIATION;
            if (
              claims?.claimType?.english === 'Cashless Claim' ||
              claims?.claimType?.english === 'Reconciliation Claim'
            ) {
              this.getMultipleDocuments(claims.claimId, null, null, null, claims);
            } else if (claims.referenceNo && claims.reImbId) {
              let id = this.injuryId;
              if (this.complicationId) {
                id = this.complicationId;
              }
              this.getMultipleDocuments(id, null, null, claims.referenceNo, claims);
            } else if (claims.transactionId || claims.transactionId === 0) {
              this.getMultipleDocuments(null, type, null, claims.transactionId, claims);
            } else if (claims.transactionId === null) {
              this.getMultipleDocuments(claims.claimId, type, null, null, claims);
            }
            if (claims?.claimType?.english) {
              this.getDetails(claims, index);
              claims.showDetails = true;
            } else if (claims?.reImbId != null) {
              claims.showDetails = true;
            } else {
              claims.showDetails = false;
            }
          });
        }
        this.getTotalClaims();
        if (this.claimsWrapper && this.claimsWrapper.transactionMessage) {
          this.isError = true;
        } else {
          if (this.claimsWrapper && this.claimsWrapper.claims) {
            this.claimsWrapper.claims.forEach(claim => {
              if (
                ((claim?.payeeDetails?.payableTo?.english === 'Establishment' &&
                  claim?.claimType?.english !== 'Cashless Claim' &&
                  claim?.claimType?.english !== 'Reconciliation Claim' &&
                  !this.isAppPrivate) ||
                  this.isAppPrivate) &&
                !this.isEmployer
              ) {
                this.isError = false;
                this.isEmployer = true;
              }
              if (
                claim?.payeeDetails?.payableTo?.english === 'Establishment' &&
                claim?.claimType?.english !== 'Cashless Claim' &&
                claim?.claimType?.english !== 'Reconciliation Claim' &&
                !this.isAppPrivate
              ) {
                this.count = this.count + 1;
              }
            });
            if (!this.isAppPrivate || (this.claimsWrapper?.claims?.length > 1 && this.isAppPrivate)) {
              this.showFilter = true;
            }
          }
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  getTotalClaims() {
    if (this.claimsWrapper && this.claimsWrapper.claims) {
      this.claimsWrapper.claims.forEach(element => {
        if (element?.claimType && element?.expenses?.length > 0) {
          element.expenses.forEach(item => {
            this.totalExpense = this.totalExpense + item.amount;
            if (this.claimsWrapper && this.claimsWrapper.startDate) {
              const startDate = moment(this.claimsWrapper.startDate.gregorian);
              const endDate = moment(this.claimsWrapper.endDate.gregorian);
              this.daysDifference = endDate.diff(startDate, 'days') + 1;
            }
          });
        }
      });
    }
  }
  navigateTimelineView() {
    this.setPaginationVariables(0);
  }
  navigateTableView() {
    this.setPaginationVariables(1);
  }
  getMultipleDocuments(referenceNo?, type?, transacton?, transactionId?, claims?) {
    this.documentService
      .getMultipleDocuments(referenceNo, claims.reImbId ? null : type, transacton, transactionId)
      .subscribe(documentsResponse => {
        if (claims.reImbId) {
          this.document = [];
        }
        if (documentsResponse) {
          this.document = this.document.concat(documentsResponse.filter(item => item.documentContent !== null));
          claims.document = this.document;
        }
      });
  }
  setPaginationVariables(value) {
    this.currentTab = value;
    this.pagination.page.pageNo = 0;
    this.pagination.page.size = 5;
    this.isLoadMore = false;
    this.isPagination = false;
    this.getClaimsDetails();
  }
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  getDetails(claims, index) {
    if (claims && claims?.expenses?.length > 0 && claims.claimType.english !== 'Reissue Allowance') {
      this.getBreakUpDetails(claims?.claimId, claims?.expenses[0]?.id, index);
    }
    if (claims?.claimType?.english === 'Reimbursement' && claims?.reImbId) {
      this.getExpenseDetails(claims?.claimId, claims?.reImbId, index);
    } else if (
      claims?.claimType?.english === 'Cashless Claim' ||
      claims?.claimType?.english === 'Reconciliation Claim'
    ) {
      this.getServiceDetails(claims?.claimId, index);
      this.getRecoveryDetails(claims?.claimId, index);
    }
    if (
      (claims && claims.claimType && claims.claimType.english === 'Companion Allowance') ||
      claims.claimType.english === 'Companion Daily Allowance' ||
      claims.claimType.english === 'Companion Conveyance Allowance'
    ) {
      this.ohService.getCompanionDetails(claims.claimId).subscribe(
        res => {
          if (this.claimsWrapper?.claims?.length > 0) {
            this.claimsWrapper.claims[index].companionDetails = res;
            if (
              this.claimsWrapper.claims[index].companionDetails &&
              this.claimsWrapper.claims[index].companionDetails.distanceTravelled
            ) {
              this.claimsWrapper.claims[index].companionDetails.distanceTravelled = Number(
                this.claimsWrapper.claims[index].companionDetails.distanceTravelled
              ).toString();
              if (Number(this.claimsWrapper.claims[index].companionDetails.distanceTravelled) > 100) {
                this.claimsWrapper.claims[index].companionDetails.isGreater = true;
              } else {
                this.claimsWrapper.claims[index].companionDetails.isGreater = false;
              }
            }
          }
        },
        err => {
          this.showError(err);
        }
      );
    }
  }
  getBreakUpDetails(claimId, id, index) {
    this.ohService.getBreakUpDetails(claimId, id).subscribe(
      res => {
        if (this.claimsWrapper?.claims[index]) {
          this.claimsWrapper.claims[index].calculationWrapper = res;
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  getHoldDetails() {
    this.ohService.fetchHoldAndAllowanceDetails(this.registrationNo, this.socialInsuranceNo, this.payeeId).subscribe(
      response => {
        this.holdDetails = response;
        if (
          this.holdDetails?.requestType === 1 &&
          (this.holdDetails?.status === 1001 || this.holdDetails?.status === 1003) &&
          this.claimsWrapper?.claims?.length > 0
        ) {
          this.showHoldInfo = true;
        }
        if (
          this.holdDetails?.requestType === 2 &&
          this.holdDetails?.status === 1001 &&
          this.claimsWrapper?.claims?.length > 0
        ) {
          this.showHoldInfo = true;
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  uploadDocuments(event) {
    this.alertService.clearAlerts();
    this.claimService.setReferenceNo(event.refernceNo);
    this.alertService.clearAlerts();
    if (this.complicationId) {
      this.injuryNo = this.ohService.getInjuryNumber();
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNo}/${this.complicationId}/${event.ReimbId}/claims/upload-documents`
      ]);
    } else {
      this.router.navigate([
        `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/${event.ReimbId}/claims/upload-documents`
      ]);
    }
  }
  getExpenseDetails(claimId, reimbursementId, index) {
    this.ohService.getExpenseDetails(claimId, reimbursementId).subscribe(
      res => {
        if (this.claimsWrapper.claims) {
          this.claimsWrapper.claims[index].expenseDetails = res;
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  getServiceDetails(claimId, index) {
    this.claimService
      .getServiceDetails(this.registrationNo, this.socialInsuranceNo, this.payeeId, claimId, false)
      .subscribe(
        res => {
          if (this.claimsWrapper.claims) {
            this.claimsWrapper.claims[index].serviceDetails = res;
          }
        },
        err => {
          this.showError(err);
        }
      );
  }
  getRecoveryDetails(claimId, index) {
    this.claimService
      .getServiceDetails(this.registrationNo, this.socialInsuranceNo, this.payeeId, claimId, true)
      .subscribe(
        res => {
          if (this.claimsWrapper.claims) {
            this.claimsWrapper.claims[index].recoveryDetails = res;
            if (this.claimsWrapper.claims[index]) {
              this.claimsWrapper.claims[index].recoveryDetails.totalAmount = 0;
              this.claimsWrapper?.claims[index]?.recoveryDetails?.services?.forEach(item => {
                this.claimsWrapper.claims[index].recoveryDetails.totalAmount =
                  this.claimsWrapper.claims[index].recoveryDetails.totalAmount + item.rejectedAmount;
                item.noOfUnits = Math.abs(item.noOfUnits);
              });
            }
          }
        },
        err => {
          this.showError(err);
        }
      );
  }
  navigateToContributor() {
    this.alertService.clearAllSuccessAlerts();
    this.router.navigate([`home/profile/contributor/${this.registrationNo}/${this.socialInsuranceNo}/info`]);
  }
  navigateToEstProfile() {
    this.alertService.clearAllSuccessAlerts();
    if (this.registrationNo) this.router.navigate([`home/establishment/profile/${this.registrationNo}/view`]);
    else {
      this.router.navigate(['home/establishment/profile']);
    }
  }
}

