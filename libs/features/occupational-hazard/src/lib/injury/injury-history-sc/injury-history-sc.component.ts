/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, Inject, OnChanges, OnInit, TemplateRef, SimpleChanges, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BilingualText,
  CoreContributorService,
  DocumentService,
  LanguageToken,
  LookupService,
  LovList,
  RoleIdEnum,
  StorageService,
  AppConstants,
  AuthTokenService,
  MedicalAssessmentService
} from '@gosi-ui/core';
import { ChangePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { OhBaseScComponent } from '../../shared/component/base/oh-base-sc.component';
import { RouteConstants } from '../../shared/constants';
import { OHReportTypes, Route } from '../../shared/enums';
import { EstablishmentsDetails, InjuryHistory, InjuryHistoryResponse, Pagination } from '../../shared/models';
import {
  ComplicationService,
  ContributorService,
  EstablishmentService,
  InjuryService,
  OhService,
  DiseaseService,
  MedicalBoardService
} from '../../shared/services';
import { HttpClient } from '@angular/common/http';
import { DiseaseHistory } from '../../shared/models/disease-history';
import { IndividualDashboardService } from '@gosi-ui/foundation-dashboard/lib/individual-app/services/individual-dashboard.service';
import { EngagementDetails } from '@gosi-ui/foundation-dashboard/lib/individual-app/models/engagement-details';
import { ContributionCategory } from '@gosi-ui/features/collection/billing/lib/shared/enums/contribution-category';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';

@Component({
  selector: 'oh-injury-history-sc',
  templateUrl: './injury-history-sc.component.html',
  styleUrls: ['./injury-history-sc.component.scss']
})
export class InjuryHistoryScComponent extends OhBaseScComponent implements OnInit, OnChanges {
  individualProfile: boolean;
  isAppPublic = false;
  fromEst: boolean;
  activeHasOH = false;
  overallEngagementHasOH = false;
  isThereOH = false;
  gosiEngWithOH: boolean;
  actvGosiEngWithOH: boolean;
  fromMb = false;
  diseaseComplicationNew: any;
  /**
   * Creating instance
   * @param alertService
   * @param viewInjuryService
   * @param contributorService
   * @param manageInjuryService
   * @param router
   * @param lookupService
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly modalService: BsModalService,
    readonly contributorService: ContributorService,
    readonly coreContributorService: CoreContributorService,
    readonly establishmentService: EstablishmentService,
    readonly fb: FormBuilder,
    readonly location: Location,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly injuryService: InjuryService,
    readonly ohService: OhService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly documentService: DocumentService,
    readonly changePersonService: ChangePersonService,
    readonly router: Router,
    readonly storageService: StorageService,
    readonly activatedRoute: ActivatedRoute,
    readonly lookupService: LookupService,
    private httpClient: HttpClient,
    readonly authTokenService: AuthTokenService,
    readonly individualAppDashboardService: IndividualDashboardService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly coreMedicalAssessmentService: MedicalAssessmentService,
    readonly medicalBoardService: MedicalBoardService
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
  /**
   * Local variables
   */
  injuryHistoryList: InjuryHistory[];
  diseasePresent: boolean;
  pagination = new Pagination();
  establishmentDetails = new EstablishmentsDetails();
  lang: string;
  modalRef: BsModalRef;
  clearResult = false;
  closeFilter = false;
  isPrivate = false;
  isPublic = false;
  injuryList: InjuryHistory[] = [];
  diseaseList: DiseaseHistory[] = [];
  diseaseJsonList: any;
  diseaseHistoryList: DiseaseHistory[];
  isLoading: boolean;
  isDiseaseLoading: boolean;
  isHeading = false;
  disabledId: boolean;
  filteredPageNo = 0;
  isFiltered = false;
  addComplication = false;
  noResults = false;
  statusEst: string;
  roleValidation = [];
  noInjuryList = false;

  /** Disease variablea */
  noDiseaseList = false;
  addDisease = false;
  /** Observables */
  status$: Observable<LovList>;
  statusTemp$: Observable<LovList>;
  statusLists: BilingualText[] = [];
  statusFilter: BilingualText[] = [];
  applicationTypeEnum = ApplicationTypeEnum;
  engagementDetails: EngagementDetails[];
  overallEngagements: EngagementDetails[];
  activeEngagementPpa = false;
  AnyEngagementNotPpa = false;
  hideButtonForPpa = false;
  coverageCategory = ContributionCategory;
  ppaEstablishment: boolean;

  /**
   * This method handles the initialization tasks.
   *
   * @memberof ViewInjuryDetailsScComponent
   */
  ngOnInit() {
    this.isLoading = true;
    this.isDiseaseLoading = true;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.isIndividualApp = this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP ? true : false;
    this.alertService.clearAllWarningAlerts();
    this.injuryService.setStatus(null);
    this.ohService.setIsFromGroupInjuryPage(false);
    if(this.ohService.getCurrentPath()){
      this.ohService.setPreviousPath(this.ohService.getCurrentPath());
    }
    this.ohService.setCurrentPath(this.router.url);
    if(this.ohService.getSocialInsuranceNo()){
      this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    }else{
      this.socialInsuranceNo = this.coreContributorService.selectedSIN;
    }
    this.registrationNo = this.coreContributorService.registartionNo;
    this.ppaEstablishment = this.dashboardSearchService.ppaEstablishment;
    this.fromMb = this.coreMedicalAssessmentService.fromMb;
    if (this.activatedRoute.snapshot['_routerState'].url.includes('individual')) {
      this.individualProfile = true;
    }
    if (!this.registrationNo) {
      this.registrationNo = this.coreContributorService.unifiedRegNo;
    }
    if (!this.registrationNo) {
      this.registrationNo = Number(this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY));
    }
    if (!this.registrationNo && this.ohService.getRegistrationNumber()) {
      this.registrationNo = this.ohService.getRegistrationNumber();
    }
    this.ohService.setRegistrationNo(this.registrationNo);
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.isAppPublic = true;
    }
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.roleValidation.push(RoleIdEnum.CONTRIBUTOR);
      this.ohService.setRoute(Route.PROFILE_INDIVIDUAL);
    } else if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isPrivate = true;
      this.roleValidation.push(RoleIdEnum.CSR);
      if (this.individualProfile) {
        // this.changePersonService.setMenuIndex(3);
        this.ohService.setRoute(Route.INDIVIDUAL_PROFILE_OH);
        if (this.socialInsuranceNo) this.fetchEngagementDetails(this.socialInsuranceNo);
      } else {
        this.ohService.setRoute(Route.PROFILE_PRIVATE);
      }
    } else {
      this.ohService.setRoute(Route.PROFILE_PUBLIC);
      this.roleValidation.push(RoleIdEnum.OH_ADMIN, RoleIdEnum.BRANCH_ADMIN, RoleIdEnum.SUPER_ADMIN);
      if (this.appToken !== ApplicationTypeEnum.INDIVIDUAL_APP) {
        this.getEstablishment();
      }
    }
    this.language.subscribe(language => {
      this.lang = language;
      if (this.lang === 'ar') {
        this.statusEst = this.establishment?.status?.arabic;
      } else {
        this.statusEst = this.establishment?.status?.english;
      }
    });
    this.activatedRoute.paramMap.subscribe(res => {
      if (!this.socialInsuranceNo) {
        if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
          this.socialInsuranceNo = this.authTokenService.getIndividual();
        } else {
          if (this.individualProfile) {
            this.changePersonService.getSocialInsuranceNo().subscribe(res => {
              this.socialInsuranceNo = res;
              this.getInjuryHistory();
              this.getDiseaseHistory(); 
              if (this.socialInsuranceNo) this.fetchEngagementDetails(this.socialInsuranceNo);
            });
          } else {
            this.socialInsuranceNo = parseInt(res.get('socialInsuranceNo'), 10);
          }
        }
      }
      const canDisplay = res.get('canDisplayHeading');
      if (canDisplay === 'true') {
        this.isHeading = true;
      } else {
        this.isHeading = false;
      }
      if (this.socialInsuranceNo) {
        this.getInjuryHistory();
        this.getDiseaseHistory();        
      }
      this.getLookupValues();
    });
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    if (this.ohService.getTransactionMessage()) {
      this.alertService.showSuccess(this.ohService.getTransactionMessage());
      this.ohService.setTransactionMessage(null);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      {
        if (this.changePersonService.getSIN() || this.socialInsuranceNo) {
          this.socialInsuranceNo = this.changePersonService.getSIN();
          this.fetchEngagementDetails(this.socialInsuranceNo);
        }
      }
    }
  }
  fetchEngagementDetails(sin: number) {
    this.individualAppDashboardService.getEngagementFullDetails(sin).subscribe(res => {
      this.engagementDetails = res.activeEngagements;
      this.overallEngagements = res.overallEngagements;

      if (this.engagementDetails.length > 0) {
        this.engagementDetails.forEach(item => {
          this.activeEngagementPpa = item?.ppaIndicator;
          item.engagementPeriod.filter(eachPeriod => {
            if (
              eachPeriod.coverageType.findIndex(eachCoverage => {
                eachCoverage.english === this.coverageCategory.oh;
              }) >= 0
            ) {
              this.activeHasOH = true;
            }
          });
        });
        const activeGosiEngagements = this.engagementDetails.filter(engagement => engagement.ppaIndicator === false);
        activeGosiEngagements.forEach(eachGosiEngagement => {
          eachGosiEngagement.engagementPeriod.forEach(eachPeriod => {
            if (
              eachPeriod.coverageType.findIndex(eachCoverage => eachCoverage.english === 'Occupational Hazard') >= 0
            ) {
              this.actvGosiEngWithOH = true;
            }
          });
        });
      }
      // not else if
      if (this.overallEngagements.length > 0) {
        if (this.overallEngagements.findIndex(item => item.ppaIndicator === false) >= 0) {
          this.AnyEngagementNotPpa = true;
        }
      }
      const gosiEngagements = this.overallEngagements.filter(engagement => engagement.ppaIndicator === false);
      gosiEngagements.forEach(eachGosiEngagement => {
        eachGosiEngagement.engagementPeriod.forEach(eachPeriod => {
          if (eachPeriod.coverageType.findIndex(eachCoverage => eachCoverage.english === 'Occupational Hazard') >= 0) {
            this.gosiEngWithOH = true;
          }
        });
      });
      //PPA
      // If only ppa engagement is available for the contributor , the above transaction should be disabled .
      // report oh should be only visible  if Gosi  engagement is having oh as one of its  coverage .
      // } else if (!this.gosiEngWithOH && !this.actvGosiEngWithOH) {
      //   this.hideButtonForPpa = true;
      if (this.ppaEstablishment) {
        this.hideButtonForPpa = true;
      } else {
        if (this.gosiEngWithOH || this.actvGosiEngWithOH) {
          this.hideButtonForPpa = false;
        } else if (this.engagementDetails.length == 0 && this.overallEngagements.length == 0) {
          this.hideButtonForPpa = false;
        } else if (this.activeEngagementPpa && !this.AnyEngagementNotPpa) {
          this.hideButtonForPpa = true;
        } else if (this.engagementDetails?.length == 0) {
          this.hideButtonForPpa = !this.AnyEngagementNotPpa ? true : false;
        } else if (this.overallEngagements?.length == 0 && this.activeEngagementPpa) {
          this.hideButtonForPpa = true;
        }
      }
      // console.log('hideButtonForPpa' + this.hideButtonForPpa);
    });
  }
  /** Method to get lookup values. */
  getLookupValues() {
    this.statusTemp$ = this.lookupService.getTransactionStatusList('TransactionStatus');
    this.statusTemp$.subscribe(res => {
      if (res) {
        this.status$ = this.statusTemp$;
      }
    });
  }
  /**
   * Navigate to add new injury page */
  addNewInjury() {
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setInjuryId(null);
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.ohService.setRegistrationNo(this.registrationNo);
    if (this.isEstClosed) {
      this.statusEst = this.establishment.status.english;
      this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.PROHIBIT-REPORT-INJURY', {
        status: this.statusEst
      });
    } else {
      this.router.navigate([RouteConstants.ROUTE_INJURY_ADD]);
    }
  }

  /**
   * Navigate to add new complication page
   */
  addNewComplication() {
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setComplicationId(null);
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.ohService.setRegistrationNo(this.registrationNo);
    if (this.isEstClosed) {
      this.statusEst = this.establishment.status.english;
      this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.PROHIBIT-REPORT-COMPLICATION', {
        status: this.statusEst
      });
    } else if (this.noInjuryList && !this.addComplication) {
      this.alertService.showWarningByKey('OCCUPATIONAL-HAZARD.EMPTY_INJURY_LIST');
    } else {
      this.router.navigate([RouteConstants.ROUTE_COMPLICATION]);
    }
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size}` };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * Navigate to add new complication page
   */
  addNewDisease() {
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setDiseaseId(null);
    this.ohService.setIsNewDisease(true);
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.ohService.setRegistrationNo(this.registrationNo);
    if (this.isEstClosed) {
      this.statusEst = this.establishment.status.english;
      this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.PROHIBIT-REPORT-DISEASE', {
        status: this.statusEst
      });
    } else {
      this.router.navigate([RouteConstants.ROUTE_ADD_DISEASE]);
      this.hideModal();
    }
  }
  hideModal() {
    this.modalRef.hide();
  }
  /**
   * Method to get Filter parameters
   */
  getInjuryFilter(injuryfilter) {
    this.isFiltered = true;
    this.statusLists = [];
    if (injuryfilter) {
      this.injuryService.setStatus(injuryfilter.status);
      if (injuryfilter.status) {
        injuryfilter.status.forEach(items => {
          if (items) {
            this.statusLists.push(items);
          }
        });
      }
    } else {
      this.injuryService.setStatus(null);
    }
    this.pagination.page.pageNo = this.filteredPageNo;
    this.getInjuryHistory();
  }
  /**
   * Filtering data based on selected Status details
   */
  getStatus(data) {
    this.currentPage = 0;
    this.pagination.page.pageNo = 0;
    this.statusLists = this.statusLists.filter(item => item.english !== data.english);
    this.statusLists.length > 0 ? this.injuryService.setStatus(this.statusLists) : this.injuryService.setStatus(null);
    this.statusFilter = data;
    this.getInjuryHistory();
  }

  /**
   * Fetching injury history details
   */
  getInjuryHistory() {
    this.injuryService
      .getInjuryHistory(this.socialInsuranceNo, OHReportTypes.Injury, this.pagination, this.isAppPublic)
      .subscribe(
        response => {
          this.totalSize = response.totalCount;
          this.diseasePresent = response.diseasePresent;
          this.injuryList = response.injuryHistory;
          this.injuryHistoryList = response.injuryHistory;
          if (this.injuryList && this.injuryList.length > 0) {
            this.injuryList.forEach(injuryList => {
              if (!this.isPrivate && this.registrationNo.toString() !== injuryList.establishmentRegNo.toString()) {
                injuryList.disableId = true;
              }
              if (injuryList.type.english === OHReportTypes.Disease) {
                injuryList.disableId = true;
              }
            });
          }
          if (this.injuryHistoryList && this.injuryHistoryList.length > 0) {
            this.injuryHistoryList.forEach((injuryHistory, index) => {
              if (
                injuryHistory.actualStatus.english === 'Cured With Disability' ||
                injuryHistory.actualStatus.english === 'Cured Without Disability'
              ) {
                this.addComplication = true;
              }
              setTimeout(() => {
                this.getComplication(injuryHistory, index);
              }, 1000);
            });
            this.isLoading = false;
            this.noInjuryList = false;
          } else {
            this.isLoading = true;
            this.noResults = true;
            this.noInjuryList = true;
          }
        },
        err => {
          this.showError(err);
        }
      );
  }
  /**
   * Fetching disease history details
   */
  getDiseaseHistory () {
    this.diseaseService
      .getDiseaseHistory(
        this.registrationNo,
        this.socialInsuranceNo,
        OHReportTypes.Disease,
        this.pagination,
        this.isIndividualApp,
        this.isAppPrivate
      )
      .subscribe(response => {
        this.diseaseList = response;
        this.diseaseHistoryList = response;
        if (this.diseaseList && this.diseaseList.length > 0) {
          this.diseaseList.forEach(diseaseList => {
            if (
              !this.isPrivate &&
              diseaseList.establishmentDetails[0] &&
              this.registrationNo.toString() !== diseaseList.establishmentDetails[0].establishmentRegNo.toString()
            ) {
              diseaseList.disableId = true;
            }
            if (diseaseList.type.english === OHReportTypes.Disease) {
              diseaseList.disableId = true;
            }
          });
        }
        if (this.diseaseHistoryList && this.diseaseHistoryList.length > 0) {
          this.diseaseHistoryList.forEach((diseaseHistory, index) => {
            if (
              diseaseHistory.actualStatus &&
              (diseaseHistory.actualStatus.english === 'Cured With Disability' ||
                diseaseHistory.actualStatus.english === 'Cured Without Disability')
            ) {
              this.addComplication = true;
            }
            setTimeout(() => {
             // this.getDiseaseComplication(diseaseHistory, index);
            }, 1000);
          });
          this.isDiseaseLoading = false;
          this.noResults = false;
        } else {
          this.isDiseaseLoading = true;
          this.noResults = true;
          this.noDiseaseList = true;
        }
      });
  } 
  /**
   * Method to navigate to injury view page
   * @param injuryId
   * @param complicationNumber
   */
  viewInjury(injury: InjuryHistory) {
    this.ohService.setInjuryId(injury.injuryId);
    this.ohService.setRegistrationNo(injury.establishmentRegNo);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setInjurystatus(injury.status);
    this.medicalBoardService.setInjuryRoute(true);
    if (injury.actualStatus) {
      this.router.navigate([
        `home/oh/view/${injury.establishmentRegNo}/${this.socialInsuranceNo}/${injury.injuryId}/injury/info`
      ]);
    }
    this.alertService.clearAlerts();
  }

  /**
   * Method to navigate to disease view page
   * @param diseaseId
   * @param complicationNumber
   */
  viewDisease(disease: DiseaseHistory) {
    this.establishmentDetails = disease.establishmentDetails[0];
    this.ohService.setRegistrationNo(this.establishmentDetails?.establishmentRegNo);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setInjurystatus(disease.status);
    this.medicalBoardService.setInjuryRoute(true);
    if (disease.actualStatus) {
      this.router.navigate([
        RouteConstants.ROUTE_VIEW_DISEASE(
          this.establishmentDetails?.establishmentRegNo,
          this.socialInsuranceNo,
          disease.diseaseId
        )
      ]);
    }
    this.alertService.clearAlerts();
  }
  /**
   * view complication details
   * @param complication
   */
  viewComplication(complication: InjuryHistory) {
    this.ohService.setComplicationId(complication.injuryId);
    this.ohService.setInjuryNumber(complication.injuryNo);
    this.ohService.setRegistrationNo(complication.establishmentRegNo);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setComplicationstatus(complication.status);
    if (complication.actualStatus) {
      this.router.navigate([
        `home/oh/view/${complication.establishmentRegNo}/${this.socialInsuranceNo}/${complication.injuryNo}/${complication.injuryId}/complication/info`
      ]);
    }
  }

  viewDiseaseComplications(complication: DiseaseHistory) {
    this.ohService.setComplicationId(complication.diseaseId);
    this.ohService.setDiseaseNumber(complication.diseaseNo);
    this.ohService.setRegistrationNo(complication.establishmentDetails[0]?.establishmentRegNo);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setComplicationstatus(complication.status);
    if (complication.actualStatus) {
      this.router.navigate([
        `home/oh/view/${complication.establishmentDetails[0]?.establishmentRegNo}/${this.socialInsuranceNo}/${complication.diseaseNo}/${complication.diseaseId}/complication/complication-info`
      ]);
    }
  }
  /**
   * Route back to previous page
   */
  routeBack() {
    this.alertService.clearAlerts();
    this.location.back();
  }
  /**
   * Catching the browser back button
   */
  @HostListener('window:popstate', ['$event'])
  onPopState() {
    if (this.ohService.getIsFromValidatorPage() || this.ohService.getIsFromPreviousOHHistoryPage()) {
      let path = this.ohService.getValidatorPath();
      this.router.navigate([path]);
    }
    else{
      this.location.back();
    }
  }
  /**
   * Method to listen to load more button
   * @param pageNo
   */
  onLoadMore(loadMoreObj) {
    this.currentPage = loadMoreObj.currentPage;
    if (this.isFiltered === true) {
      this.pagination.page.pageNo++;
    } else {
      this.pagination.page.pageNo = this.currentPage;
      this.isFiltered = false;
    }
    this.pagination.page.size = this.pageSize;
    this.requestHandler(this.pagination, false);
  }

  /**
   * Method to handle load more requests
   * @param pagination
   * @param clearlist
   */
  //TODO: restructure this
  requestHandler(pagination, clearlist: boolean) {
    this.injuryService.getInjuryHistory(this.socialInsuranceNo, OHReportTypes.Injury, pagination).subscribe(
      (response: InjuryHistoryResponse) => {
        this.totalSize = response.totalCount;
        if (clearlist) {
          this.injuryList = [];
        }
        if (response.injuryHistory) {
          response.injuryHistory.forEach(element => {
            this.injuryList.push(element);
          });
          if (this.injuryList && this.injuryList.length > 0) {
            this.injuryList.forEach(injuryList => {
              if (!this.isPrivate && this.registrationNo.toString() !== injuryList.establishmentRegNo.toString()) {
                injuryList.disableId = true;
              }
            });
          }
        }
        this.injuryHistoryList = response.injuryHistory;
        if (this.injuryHistoryList) {
          this.injuryHistoryList.forEach((injuryHistory, index) => {
            //TODO: remove timeout if possible
            setTimeout(() => {
              this.getComplication(injuryHistory, index);
            }, 1000);
          });
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
  /* Clear all Filter */

  resetFilter() {
    this.clearResult = true;
    this.injuryService.setStatus(null);
    this.getInjuryHistory();
    this.statusLists = [];
  }

  /**
   * Fetching complication details
   */
  getComplication(injuryHistory: InjuryHistory, index) {
    this.complicationService.getComplicationHistory(this.socialInsuranceNo, injuryHistory.injuryNo).subscribe(
      res => {
        if (this.injuryHistoryList) {
          this.injuryHistoryList[index].complication = res.injuryHistory;
        }
      },
      err => {
        this.showError(err);
      }
    );
  }

  /**
   * Method to add new complication
   * @param injury
   */
  reportComplication(injury: InjuryHistory) {
    if (injury.addComplicationAllowed === false) {
      this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.INJURY.ERR-PROHIBIT-ADD-COMPLICATION');
    } else if (this.isEstClosed) {
      this.statusEst = this.establishment.status.english;
      this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.PROHIBIT-REPORT-COMPLICATION', {
        status: this.statusEst
      });
    } else {
      this.ohService.setInjuryId(injury.injuryId);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.ohService.setEstablishmetRegistrationNo(injury.establishmentRegNo);
      this.router.navigate([RouteConstants.ROUTE_ADD_COMPLICATION_REPORT], {
        queryParams: {
          type: 'report'
        }
      });
    }
  }
  diseaseComplication(disease: DiseaseHistory) {
    if (this.isEstClosed) {
      this.statusEst = this.establishment.status.english;
      this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.PROHIBIT-REPORT-COMPLICATION', {
        status: this.statusEst
      });
    } else {
      this.ohService.setDiseaseId(disease.diseaseId);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.router.navigate([RouteConstants.ROUTE_ADD_COMPLICATION_REPORT], {
        queryParams: {
          type: 'report'
        }
      });
    }
  }
  ngOnDestroy() {
    this.alertService.clearAllSuccessAlerts();
  }

  /**
   * Fetching complication details
   */
  getDiseaseComplication(diseaseHistory: DiseaseHistory, index) {
    this.complicationService.getDiseaseComplicationHistory(this.socialInsuranceNo, diseaseHistory.diseaseNo).subscribe(
      res => {
        if (this.diseaseHistoryList) {
          this.diseaseHistoryList[index].complication = res;
        }
      },
      err => {
        this.showError(err);
      }
    );
  }
}
