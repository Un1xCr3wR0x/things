/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, ComponentFactoryResolver, Type, ViewChild, Inject } from '@angular/core';
import { EntityTypeEnum, ReceiptApprovalStatus } from '../../../shared/enums';
import { AlertService, LovList, LookupService, scrollToTop, LanguageToken } from '@gosi-ui/core';
import { EntityTypeEstablishmentDcComponent } from '../entity-type-establishment-dc/entity-type-establishment-dc.component';
import { ComponentHostDirective } from '@gosi-ui/foundation-theme';
import { EntityTypeVicDcComponent } from '../entity-type-vic-dc/entity-type-vic-dc.component';
import { EntityTypeAllEntityDcComponent } from '../entity-type-all-entity-dc/entity-type-all-entity-dc.component';
import { Observable } from 'rxjs/internal/Observable';
import { DetailedBillService } from '../../../shared/services/detailed-bill.service';
import { Router } from '@angular/router';
import { BillingConstants } from '../../../shared/constants';
import { PenalityWavierService } from '../../../shared/services/penality-wavier.service';
import { BillDashboardService, ContributionPaymentService, CreditManagementService } from '../../../shared/services';
import { map } from 'rxjs/operators';
import { BehaviorSubject, noop } from 'rxjs';

@Component({
  selector: 'blg-exception-penalty-waiver-homepage-sc',
  templateUrl: './exception-penalty-waiver-homepage-sc.component.html',
  styleUrls: ['./exception-penalty-waiver-homepage-sc.component.scss']
})
export class ExceptionalPenaltyWaiverHomepageScComponent implements OnInit {
  /************Variables**************** */
  entityType: EntityTypeEnum;
  penaltyWaiverReason$: Observable<LovList>;
  allEntityPenaltyWaiverReason$: Observable<LovList>;
  establishmentSegmentList$: Observable<LovList>;
  segmentsList$: Observable<LovList>;
  vicSegmentList$: Observable<LovList>;
  fileContent = [];
  entitySegmentList$: Observable<LovList>;
  peanlityReason$: Observable<LovList>;
  lang: string;
  isEstRegistered = false;
  changeRequestFlag = false;

  /**Template and child reference */
  @ViewChild(ComponentHostDirective, { static: true })
  gosiComponentHost: ComponentHostDirective;

  constructor(
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly detailedBillService: DetailedBillService,
    readonly penalityWavierService: PenalityWavierService,
    readonly billDashboardService: BillDashboardService,
    readonly router: Router,
    readonly componentFactoryResolver: ComponentFactoryResolver,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly creditManagementService: CreditManagementService,
    readonly contributionPaymentService: ContributionPaymentService
  ) {}

  ngOnInit(): void {
    this.allEntityPenaltyWaiverReason$ = this.penaltyWaiverReason$ = this.lookupService.getExceptionalPenaltyWaiverReason();
    if (this.penaltyWaiverReason$) {
      this.penaltyWaiverReason$ = this.penaltyWaiverReason$.pipe(
        map(list => {
          if (list) {
            return new LovList(list.items.filter(lov => lov.value.english !== 'Change in Late Fees Calculation Date'));
          }
          return list;
        })
      );
    }
    this.peanlityReason$ = this.penaltyWaiverReason$;
    this.vicSegmentList$ = this.lookupService.getVicSegmentFilterList();
    this.establishmentSegmentList$ = this.lookupService.getEstablishmentSegmentFilterList();
    this.segmentsList$ = this.entitySegmentList$ = this.lookupService.getAllEntityFilter();
  }
  /**
   * Method to set entity type on entity type select
   * @param contributorType
   */

  onEntityTypeSelect(entityType: EntityTypeEnum) {
    this.alertService.clearAlerts();
    this.entityType = entityType;
    if (entityType) {
      this.loadEntityTypeComponent(entityType);
    }
  }
  /**
   * Method to load search forms dynamically based on selected contributor type
   */
  loadEntityTypeComponent(entityType: string) {
    let componentRef;
    switch (entityType) {
      case EntityTypeEnum.Establishment: {
        componentRef = this.resolveComponent(EntityTypeEstablishmentDcComponent);
        if (this.penaltyWaiverReason$ && componentRef) {
          componentRef.instance.penalityWaiverReason = this.penaltyWaiverReason$;
          componentRef.instance.establishmentSegmentList = this.establishmentSegmentList$;
          componentRef.instance.segmentsList = this.segmentsList$;
        }
        break;
      }
      case EntityTypeEnum.VIC: {
        componentRef = this.resolveComponent(EntityTypeVicDcComponent);
        if (componentRef) {
          componentRef.instance.penalityWaiverReason = this.penaltyWaiverReason$;
          componentRef.instance.vicSegmentList = this.vicSegmentList$;
          componentRef.instance.segmentsList = this.segmentsList$;
        }
        break;
      }
      case EntityTypeEnum.AllEntities: {
        /**
         * Temprory Change Need to revert after R2
         */
        componentRef = this.resolveComponent(EntityTypeAllEntityDcComponent);
        const res = {
          reason: {
            arabic: 'تغيير تاريخ فرض غرامات التأخير',
            english: 'Change in Late Fees Calculation Date'
          },
          otherReason: null,
          entitySegment: {
            arabic: 'All',
            english: 'All'
          },
          searchOption: 'entityType'
        };
        this.penalityWavierService.setPenalityWaiverReason(res?.reason);
        this.penalityWavierService.setPenalityWaiverOtherReason(res?.otherReason);
        this.penalityWavierService.setAllEntitySegments(res?.entitySegment);
        this.alertService.clearAlerts();
        this.router.navigate([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ENTITY_TYPE], {
          queryParams: {
            searchOption: res?.searchOption
          }
        });
        break;
      }
      default:
        break;
    }
    componentRef.changeDetectorRef.detectChanges();
    componentRef.instance.verify.subscribe(res => {
      this.onVerify(res);
    }, noop);
    componentRef.instance.reset.subscribe(() => {
      this.reset();
    }, noop);

    componentRef.instance.error.subscribe(() => {
      this.showMandatoryFieldsError();
    }, noop);
    componentRef.instance.processFileVic.subscribe(file => {
      this.processFile(file, 'vic');
    }, noop);
    componentRef.instance.processFileEst.subscribe(file => {
      this.processFile(file, 'est');
    }, noop);
    componentRef.instance.segmentListValue.subscribe(res => {
      if (res === 'saudi') {
        componentRef.instance.segmentsList = this.lookupService.getlegalEntityList();
        componentRef.changeDetectorRef.detectChanges();
      } else if (res === 'Purpose of Registration') {
        componentRef.instance.segmentsList = this.lookupService.getPurposeOfRegistrationList();
        componentRef.changeDetectorRef.detectChanges();
      } else if (res === 'nationality') {
        componentRef.instance.segmentsList = this.lookupService.getNationalityList();
        componentRef.changeDetectorRef.detectChanges();
      } else if (res === 'paymentType') {
        componentRef.instance.segmentsList = this.lookupService.getPaymentTypeWavier();
        componentRef.changeDetectorRef.detectChanges();
      } else if (res === 'installment') {
        componentRef.instance.segmentsList = this.lookupService.getInstallmentStatusList();
        componentRef.changeDetectorRef.detectChanges();
      } else if (res === 'violationRecord') {
        componentRef.instance.segmentsList = this.lookupService.getViolationRecord();
        componentRef.changeDetectorRef.detectChanges();
      } else if (res === 'all') {
        componentRef.instance.penalityWaiverReason = this.lookupService.getExceptionalPenaltyWaiverReason();
        componentRef.changeDetectorRef.detectChanges();
      } else {
        componentRef.instance.segmentsList = this.lookupService.getSegmentsList(res);
        componentRef.instance.penalityWaiverReason = this.peanlityReason$;
        componentRef.changeDetectorRef.detectChanges();
      }
      this.language.subscribe(language => {
        this.lang = language;
        this.penaltyWaiverReason$ = this.sortLovList(this.penaltyWaiverReason$, true);
        componentRef.instance.segmentsList = this.sortLovList(componentRef.instance.segmentsList, false);
      }, noop);
    }, noop);
  }
  //*********For processing CSV Upload file data**** */
  processFile(file, from) {
    this.penalityWavierService.setPenalityWaiverBulkFileContent(file?.fileContent);
    if (from === 'vic') {
      this.penalityWavierService.setPenalityWaiverReason(file?.reason);
      this.penalityWavierService.setPenalityWaiverOtherReason(file?.otherReason);
      this.router.navigate([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_VIC], {
        queryParams: {
          searchOption: 'csvUploadVic'
        }
      });
    }
    if (from === 'est') {
      this.penalityWavierService.setPenalityWaiverReason(file?.reason);
      this.penalityWavierService.setPenalityWaiverOtherReason(file?.otherReason);
      this.router.navigate([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ESTABLISHMENT], {
        queryParams: {
          searchOption: 'csvUploadEst'
        }
      });
    }
  }

  /**
   * Method to resolve component and return a reference to that dynamic component
   * @param component
   */
  resolveComponent(
    component: Type<EntityTypeEstablishmentDcComponent | EntityTypeVicDcComponent | EntityTypeAllEntityDcComponent>
  ) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.gosiComponentHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    return componentRef;
  }

  onVerify(res) {
    if (res?.searchOption === 'registration') {
      this.detailedBillService.getBillingHeader(res?.regNo, true).subscribe(
        data => {
          if (data) {
            this.penalityWavierService.setPenalityWaiverReason(res?.reason);
            this.penalityWavierService.setPenalityWaiverOtherReason(res?.otherReason);
            this.penalityWavierService.setEstablishmentSegments(res?.establishmentSegments);
            this.penalityWavierService.setSegments(res?.segments);
            this.alertService.clearAlerts();
            this.getEstablishmentStatus(res, data);
          }
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
    if (res?.searchOption === 'SIN') {
      this.creditManagementService.getContirbutorByNationalId(res?.sinNo).subscribe(
        resp => {
          if (!resp.statusType) this.alertService.showErrorByKey('BILLING.VIC-INACTIVE');
          else {
            res.sinNo = resp?.socialInsuranceNo;
            this.penalityWavierService.getVicWavierPenalityDetails(res?.sinNo, 'SPECIAL').subscribe(
              data => {
                if (data) {
                  this.penalityWavierService.setPenalityWaiverDetails(data);
                  this.penalityWavierService.setPenalityWaiverReason(res?.reason);
                  this.penalityWavierService.setPenalityWaiverOtherReason(res?.otherReason);
                  this.penalityWavierService.setVicSegments(res?.vicSegments);
                  this.penalityWavierService.setSegments(res?.segments);
                  this.alertService.clearAlerts();
                  this.router.navigate([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_VIC], {
                    queryParams: {
                      sin: res?.sinNo,
                      searchOption: res?.searchOption
                    }
                  });
                }
              },
              err => {
                this.alertService.showError(err?.error?.message);
              }
            );
          }
        },
        err => {
          if (err?.error?.message) {
            this.alertService.showError(err?.error?.message);
          }
        }
      );
    }
    if (res?.searchOption === 'segmentation') {
      this.penalityWavierService.setPenalityWaiverReason(res?.reason);
      this.penalityWavierService.setPenalityWaiverOtherReason(res?.otherReason);
      this.penalityWavierService.setEstablishmentSegments(res?.establishmentSegments);
      this.penalityWavierService.setSegments(res?.segments);
      this.alertService.clearAlerts();
      this.router.navigate([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ESTABLISHMENT], {
        queryParams: {
          regNo: res?.regNo,
          searchOption: res?.searchOption
        }
      });
    }
    if (res?.searchOption === 'vicSegmentation') {
      this.penalityWavierService.setPenalityWaiverReason(res?.reason);
      this.penalityWavierService.setPenalityWaiverOtherReason(res?.otherReason);
      this.penalityWavierService.setVicSegments(res?.vicSegments);
      this.penalityWavierService.setSegments(res?.segments);
      this.alertService.clearAlerts();
      this.router.navigate([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_VIC], {
        queryParams: {
          sin: res?.sinNo,
          searchOption: res?.searchOption
        }
      });
    }
    if (res?.searchOption === 'entityType') {
      this.penalityWavierService.setPenalityWaiverReason(res?.reason);
      this.penalityWavierService.setPenalityWaiverOtherReason(res?.otherReason);
      this.penalityWavierService.setAllEntitySegments(res?.entitySegment);
      this.alertService.clearAlerts();
      this.router.navigate([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ENTITY_TYPE], {
        queryParams: {
          searchOption: res?.searchOption
        }
      });
    }
  }
  /**
   * Method to get establilshment status
   * @param res
   * @param data
   */
  getEstablishmentStatus(res, data) {
    if (data?.status?.english === ReceiptApprovalStatus.REGISTERED || data?.status?.english === BillingConstants.REOPENED_STATUS || data?.status?.english === BillingConstants.REOPEN_CLOSING_IN_PROGRESS_STATUS) {
      this.contributionPaymentService.getWorkFlowStatus(res?.regNo).subscribe(
        () => {
          this.changeRequestFlag = true;
          this.router.navigate([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ESTABLISHMENT], {
            queryParams: {
              regNo: res?.regNo,
              searchOption: res?.searchOption
            }
          });
        },
        err => {
          if (err?.error?.details[0].message) {
            this.alertService.showError(err?.error?.details[0].message);
          } else {
            this.alertService.showError(err?.error?.message);
          }
        }
      );
    } else {
      this.changeRequestFlag = true;
      this.alertService.showErrorByKey('BILLING.ESTABLISHMENT-STATUS-ERROR');
    }
  }
  /**This method need to be removed later
   * Method to get change request status
   * @param res
   */
  getChangeRequestStatus(res) {
    return res.forEach(value => {
      if (value) {
        if (value.type === BillingConstants.LEGAL_ENTITY_CHANGE) {
          this.alertService.showErrorByKey('BILLING.CHANGE-IN-LEGAL-ENTITY');
          this.changeRequestFlag = false;
          return false;
        } else if (value.type === BillingConstants.DELINK_BRANCH_CHANGE) {
          this.alertService.showErrorByKey('BILLING.CHANGE-IN-DELINK');
          this.changeRequestFlag = false;
          return false;
        } else if (value.type === BillingConstants.CHANGE_OWNER) {
          this.alertService.showErrorByKey('BILLING.CHANGE-IN-OWNER');
          this.changeRequestFlag = false;
          return false;
        } else {
          this.changeRequestFlag = false;
          return true;
        }
      } else return true;
    });
  }
  /**
   *Method to reset person type selected on cancel of popup
   */
  reset() {
    this.entityType = null;
    this.gosiComponentHost.viewContainerRef.clear();
  }
  /** Method to set mandatory fields validation (Use this as common method for all under this feature). */
  showMandatoryFieldsError() {
    scrollToTop();
    this.alertService.showMandatoryErrorMessage();
  }
  /**
   * Method to sort lov list.
   * @param list lov list
   * @param isBank bank identifier
   */
  sortLovList(list: Observable<LovList>, otherValue: boolean) {
    if (list) {
      return list.pipe(
        map(res => {
          if (res) {
            return this.penalityWavierService.sortLovList(res, otherValue, this.lang);
          }
        })
      );
    }
  }
}
