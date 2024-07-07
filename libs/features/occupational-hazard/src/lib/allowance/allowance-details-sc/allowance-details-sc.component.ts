/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  AlertTypeEnum,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  DocumentService,
  GosiCalendar,
  LanguageToken,
  LookupService,
  RoleIdEnum,
  Alert
} from '@gosi-ui/core';
import * as moment from 'moment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  CalculationWrapper,
  CompanionDetails,
  ComplicationService,
  ContributorService,
  EstablishmentService,
  HoldResumeDetails,
  InjuryService,
  OhBaseScComponent,
  OhConstants,
  OhService,
  Pagination,
  DiseaseService,
  TabSetVariables
} from '../../shared';
import { AuditClaims } from '../../shared/models/audit-claims';
import { dateCalculation } from '../../shared/models/date';
import { OhClaimsService } from '../../shared/services/oh-claims.service';

@Component({
  selector: 'oh-allowance-details-sc',
  templateUrl: './allowance-details-sc.component.html',
  styleUrls: ['./allowance-details-sc.component.scss']
})
export class AllowanceDetailsScComponent extends OhBaseScComponent implements OnInit, AfterViewInit {
  /** Local variables */
  lighterLabel = '#999999';
  currentTab = 0;
  complicationId: number;
  isAppPrivate = false;
  isDiseasePresent = false;
  injuryNo: number;
  pageTotal: number;
  injuryId: number;
  diseaseId: number;
  payeeId: number;
  disable: boolean;
  isLoadMore = false;
  totalAllowance = 0;
  registrationNo: number;
  socialInsuranceNo: number;
  workDisabilityDate: GosiCalendar = new GosiCalendar();
  error = false;
  pagination = new Pagination();
  canEdit = true;
  allowancePayee: String;
  showHeader = true;
  daysDifference: number;
  companionDetails: CompanionDetails;
  calculationWrapper: CalculationWrapper;
  lang = 'en';
  @Output() payeeT: EventEmitter<number> = new EventEmitter();
  showSucess: boolean;
  successMessage: BilingualText;
  infoMessage: BilingualText;
  showHoldInfo = false;
  alertErr = [];
  isPagination = false;
  noAllowance = false;
  holdResumeDetails: HoldResumeDetails;
  isAllowance = false;
  paymentDetail = [];
  rejectedAllowanceList: AuditClaims;
  permittedRoles = [];
  /**
   * Creating Instance
   */

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly complicationService: ComplicationService,
    readonly contributorService: ContributorService,
    readonly documentService: DocumentService,
    readonly establishmentService: EstablishmentService,
    readonly injuryService: InjuryService,
    readonly lookupService: LookupService,
    readonly ohservice: OhService,
    readonly diseaseService: DiseaseService,
    readonly claimsService: OhClaimsService,
    readonly router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(ApplicationTypeToken) readonly appToken: string,    
    readonly fb: FormBuilder,
    readonly location: Location,
    readonly modalService: BsModalService
  ) {
    super(
      language,
      alertService,
      contributorService,
      documentService,
      establishmentService,
      injuryService,
      ohservice,
      router,
      fb,
      complicationService,
      diseaseService,
      location,
      appToken      
    );
  }
  /**
   * This method if for initialization tasks
   */
  ngOnInit(): void {
    this.showHoldInfo = false;
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.currentTab = 0;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    if (this.isAppPrivate) {
      this.permittedRoles.push(RoleIdEnum.CSR);
    } else {
      this.permittedRoles.push(RoleIdEnum.OH_ADMIN, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN);
    }
    this.getEstablishment();
    this.ohService.setHasRoutedBack(false);
    this.ohService.setSelectedTabid(TabSetVariables.Allowance);
    if(this.ohService.getCurrentPath()){
      this.ohService.setPreviousPath(this.ohService.getCurrentPath());      
    }
    this.ohService.setCurrentPath(this.router.url);
    this.successMessage = this.claimsService.getAlert();
    this.alertService.getAlerts().subscribe(alert => {
      if (alert) {
        alert.forEach(item => {
          if (item.type === AlertTypeEnum.SUCCESS) {
            this.successMessage = item.message;
          } else if (item.type === AlertTypeEnum.INFO) {
            this.infoMessage = item.message;
          } else {
            this.alertErr.push(item);
          }
        });
      }
    });
    this.claimsService.setAlert(null);
    this.getData();
    this.pagination.page.pageNo = 0;
    this.pagination.page.size = 5;
    if (this.payeeId !== this.diseaseId && this.payeeId.toString() !== 'NaN') {
      this.getAllowanceDetails();
      this.fetchRejectedAllowance();
    }
  }
  getDocuments() {
    this.documentService.getOldDocuments(this.payeeId, 'ADD_ALLOWANCE').subscribe(documentResponse => {
      this.documents = documentResponse.filter(item => item.documentContent !== null);
    });
  }
  /* This method is to handle the language subscription */
  ngAfterViewInit() {
    this.language.subscribe(language => {
      this.lang = language;
      if (this.allowanceDetails.allowancePayee === 2) {
        this.allowancePayee = this.lang === 'ar' ? 'المشترك' : 'Contributor';
      } else if (this.allowanceDetails.allowancePayee === 1) {
        this.allowancePayee = this.lang === 'ar' ? 'منشأة' : 'Establishment';
      }
    });
    this.cdr.detectChanges();
  }
  //Getting data from services
  getData() {
    this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.injuryId = this.ohService.getInjuryId();
    this.complicationId = this.ohService.getComplicationId();
   // this.diseaseId = this.ohservice.getDiseaseId();
    if (this.complicationId) {
      this.payeeId = this.complicationId;
      this.disable = true;
      this.injuryId = this.complicationId;
    } else if (this.diseaseId) {
      this.payeeId = this.diseaseId;
      this.disable = true;
      this.injuryId = this.diseaseId;
    }
    {
      this.disable = false;
      this.payeeId = this.injuryId;
    }
    this.injuryNo = this.ohService.getInjuryNumber();
    if(this.diseaseId){
      this.isDiseasePresent = true;
    }
    this.isDiseasePresent = false;
  }
  /* Method to get Allowance data*/
  getAllowanceDetails() {
    this.ohService.getallowanceDetails(this.pagination).subscribe(
      res => {
        if (!this.isLoadMore && !this.isPagination) {
          this.allowanceDetails = res;
        } else if (this.isLoadMore) {
          res.allowances.forEach(element => {
            this.allowanceDetails.allowances = [...this.allowanceDetails.allowances, element];
          });
        } else if (this.isPagination) {
          this.allowanceDetails = res;
        }
        if (!this.isAllowance) {
          this.getHoldDetails();
          this.getPerson(true, this.payeeId);
          this.workDisabilityDate = this.allowanceDetails.workDisabilityDate;
          if (this.isAppPrivate) {
            this.totalAllowance = this.allowanceDetails.totalAllowance;
          } else {
            this.totalAllowance = this.allowanceDetails.totalAllowanceForAdmin;
          }
          this.ngAfterViewInit();
        }
        this.dateCalculation();
        if (this.allowanceDetails && this.allowanceDetails.allowances && this.allowanceDetails.allowances.length > 0) {
          this.getDocuments();
          this.allowanceDetails.allowances.forEach((allowances, index) => {
            this.calculationWrapper = allowances.calculationWrapper;
            if (!this.allowanceDetails.allowances[index].day) {
              if (this.allowanceDetails.allowances[index].benefitStartDate) {
                this.allowanceDetails.allowances[index].day = dateCalculation(
                  this.allowanceDetails.allowances[index].benefitStartDate,
                  this.allowanceDetails.allowances[index].benefitEndDate
                );
              } else {
                this.allowanceDetails.allowances[index].day = dateCalculation(
                  this.allowanceDetails.allowances[index].startDate,
                  this.allowanceDetails.allowances[index].endDate
                );
              }

              if (allowances.actualPaymentStatus.english === 'Invalid Wage') {
                if (
                  allowances.allowanceType.english === 'InPatient Daily Allowance' ||
                  allowances.allowanceType.english === 'OutPatient Daily Allowance' ||
                  allowances.allowanceType.english === 'OutPatient Allowance' ||
                  allowances.allowanceType.english === 'InPatient Daily Allowance Adjustment' ||
                  allowances.allowanceType.english === 'OutPatient Daily Allowance Adjustment' ||
                  allowances.allowanceType.english === 'Balance Settlement Allowance' ||
                  allowances.allowanceType.english === 'Balance Settlement Reversal' ||
                  allowances.allowanceType.english === 'Balance Settlement Adjustment Allowance' ||
                  allowances.allowanceType.english === 'Balance Settlement Reversal Adjustment'
                ) {
                  this.allowanceDetails.allowances[index].isDisabled = true;
                }
              } else {
                this.allowanceDetails.allowances[index].isDisabled = false;
              }
            }
          });
        }

        if (
          this.allowanceDetails?.allowances?.length < 1 &&
          this.allowanceDetails?.transactionMessage?.english === OhConstants.NO_ALLOWANCE
        ) {
          this.noAllowance = true;
        }
        if (this.allowanceDetails && this.allowanceDetails.allowances && !this.isAppPrivate) {
          this.findIsPayee();
        }
        this.isAllowance = true;
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**
   * Fetch Rejected Allowance Details
   */
  fetchRejectedAllowance() {
    this.claimsService
      .getRejectedAllowanceDetails(this.registrationNo, this.socialInsuranceNo, this.injuryId)
      .subscribe(
        response => {
          this.rejectedAllowanceList = response;
        },
        err => {
          this.showError(err);
        }
      );
  }
  /**
   * Calculation of dates
   */
  dateCalculation() {
    if (this.allowanceDetails && this.allowanceDetails.startDate) {
      const startDate = moment(this.allowanceDetails.startDate.gregorian);
      const endDate = moment(this.allowanceDetails.endDate.gregorian);
      this.daysDifference = endDate.diff(startDate, 'days') + 1;
      if (this.allowanceDetails && this.allowanceDetails.allowances && this.allowanceDetails.allowances.length > 0) {
        this.allowanceDetails.allowances.forEach((allowances, index) => {
          if (!this.allowanceDetails.allowances[index].calculationWrapper) {
            this.getAdditionalDetails(allowances, index);
          }
        });
      }
    }
  }
  /**
   * method to show erorr if establishment is not a payee
   */
  findIsPayee() {
    if (this.allowanceDetails?.allowances?.length < 1 && !this.allowanceDetails?.transactionMessage) {
      this.showHeader = false;
      this.showHoldInfo = false;
    }
  }
  /* Method to navigate to Timeline view*/
  navigateTimelineView() {
    this.allowanceDetails = null;
    this.rejectedAllowanceList = null;
    this.currentTab = 0;
    this.pagination.page.pageNo = 0;
    this.pagination.page.size = 5;
    this.isLoadMore = false;
    this.isPagination = false;
    this.getAllowanceDetails();
    this.fetchRejectedAllowance();
  }
  /**
   *
   * @param err This method to show the page level error
   */
  showError(err) {
    if (err && err.error && err.error.message) {
      this.alertService.showError(err.error.message, err.error.details);
    }
  }
  /*Method to navigate to Table view*/

  navigateTableView() {
    this.allowanceDetails = null;
    this.rejectedAllowanceList = null;
    this.currentTab = 1;
    this.pagination.page.pageNo = 0;
    this.pagination.page.size = 5;
    this.isLoadMore = false;
    this.isPagination = false;
    this.getAllowanceDetails();
    this.fetchRejectedAllowance();
  }
  /**
   *
   * @param id Fetch break up details
   */
  getAdditionalDetails(allowance, index) {
    this.calculationWrapper = null;
    if (allowance.allowanceType.english !== 'Reissue Allowance') {
      this.getBreakUpDetails(allowance.claimId, allowance.id, index);
    } else {
      const paymentValues = {
        allowanceBreakup: null,
        paymentDetails: {
          accountNo: allowance.accountNo,
          paymentDate: allowance.paymentDate,
          paymentMethod: allowance.paymentMethod,
          transactionId: null
        },
        transactionMessage: null
      };
      if (this.allowanceDetails.allowances) {
        this.allowanceDetails.allowances[index].calculationWrapper = paymentValues;
      }
    }
    if (
      allowance.allowanceType.english === 'Companion Allowance' ||
      allowance.allowanceType.english === 'Companion Conveyance Allowance' ||
      allowance.allowanceType.english === 'Companion Daily Allowance'
    ) {
      this.ohService.getCompanionDetails(allowance.claimId).subscribe(res => {
        if (this.allowanceDetails.allowances) {
          this.allowanceDetails.allowances[index].companionDetails = res;
          if (this.allowanceDetails.allowances[index].allowanceType.english === 'Companion Daily Allowance') {
            if (
              this.allowanceDetails.allowances[index].companionDetails.startDate.hijiri !==
              this.allowanceDetails.allowances[index].benefitStartDate.hijiri
            ) {
              this.allowanceDetails.allowances[index].calculationWrapper.benefitStartDate =
                this.allowanceDetails.allowances[index].benefitStartDate;
            }
          }
          if (
            this.allowanceDetails.allowances[index].companionDetails &&
            this.allowanceDetails.allowances[index].companionDetails.distanceTravelled
          ) {
            this.allowanceDetails.allowances[index].companionDetails.distanceTravelled = Number(
              this.allowanceDetails.allowances[index].companionDetails.distanceTravelled
            ).toString();

            if (Number(this.allowanceDetails.allowances[index].companionDetails.distanceTravelled) > 100) {
              this.allowanceDetails.allowances[index].companionDetails.isGreater = true;
            } else {
              this.allowanceDetails.allowances[index].companionDetails.isGreater = false;
            }
          }
        }
      });
    }
  }
  onEditContent() {
    if (this.allowanceDetails.hasPendingModifyPayeeRequest) {
      if (this.alertErr.length > 0) {
        this.alertErr.forEach(function (object: Alert) {
          if (
            object.type === AlertTypeEnum.DANGER &&
            object.messageKey !== 'OCCUPATIONAL-HAZARD.PROHIBIT-MODIFY-PAYEE'
          ) {
            this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.PROHIBIT-MODIFY-PAYEE');
          }
        });
      } else {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.PROHIBIT-MODIFY-PAYEE', null, null, null, false);
      }
    } else {
      if (this.complicationId) {
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryNo}/${this.complicationId}/modify-payee`
        ]);
      } /* else if (this.diseaseId) {
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.diseaseId}/modify-payee`
        ]);
      }  */else {
        this.router.navigate([
          `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.injuryId}/modify-payee`
        ]);
      }
    }
  }
  /**
   * Fetch calculation details
   */
  getBreakUpDetails(claimId, id, index) {
    this.ohService.getBreakUpDetails(claimId, id).subscribe(
      res => {
        if (this.allowanceDetails.allowances) {
          this.allowanceDetails.allowances[index].calculationWrapper = res;
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**
   * Fetch Hold Details
   */
  getHoldDetails() {
    this.ohService.fetchHoldAndAllowanceDetails(this.registrationNo, this.socialInsuranceNo, this.payeeId).subscribe(
      response => {
        this.holdResumeDetails = response;
        if (
          this.holdResumeDetails?.requestType === 1 &&
          (this.holdResumeDetails?.status === 1001 || this.holdResumeDetails?.status === 1003) &&
          this.allowanceDetails?.allowances?.length > 0
        ) {
          this.showHoldInfo = true;
        }
        if (
          this.holdResumeDetails?.requestType === 2 &&
          this.holdResumeDetails?.status === 1001 &&
          this.allowanceDetails?.allowances?.length > 0
        ) {
          this.showHoldInfo = true;
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  /**
   *
   * @param loadmoreObj Load more
   */
  loadMore(loadmoreObj) {
    this.isPagination = false;
    this.isLoadMore = true;
    this.pagination.page.pageNo = loadmoreObj.currentPage;
    this.pagination.page.size = this.pageSize;
    this.getAllowanceDetails();
  }
  /**
   *
   * @param page Api call for Pagination
   */
  onPagination(page) {
    this.isLoadMore = false;
    this.isPagination = true;
    this.pagination.page.pageNo = page;
    this.pagination.page.size = this.pageSize;
    this.getAllowanceDetails();
    if (page === 0) {
      this.fetchRejectedAllowance();
    }
  }

  /**
   * Method to capture navigation details and send to parent via event emitter
   */
  navigateToInjuryDetails() {
    this.router.navigate([
      `home/profile/contributor/${this.registrationNo}/${this.contributor.socialInsuranceNo}/info`
    ]);
  }
}

