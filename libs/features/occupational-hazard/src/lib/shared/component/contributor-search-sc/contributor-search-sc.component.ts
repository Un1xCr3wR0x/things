/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  BaseComponent,
  BorderNumber,
  EstablishmentStatusEnum,
  GccCountryEnum,
  IdentityTypeEnum,
  Iqama,
  LanguageToken,
  NationalId,
  NIN,
  Passport,
  scrollToTop,
  StorageService
} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { RouteConstants } from '../../constants/route-constants';
import { ContributorType, OHReportTypes } from '../../enums';
import { ContributorSearchResult, Establishment, Person } from '../../models';
import { EstablishmentService, OhService } from '../../services';
import { ContributorService } from '../../services/contributor.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services';

@Component({
  selector: 'oh-contributor-search-sc',
  templateUrl: './contributor-search-sc.component.html',
  styleUrls: ['./contributor-search-sc.component.scss']
})
export class ContributorSearchScComponent extends BaseComponent implements OnInit {
  /**
   * local variables
   */
  hasSearchResult = false;
  contributors: ContributorSearchResult[];
  selectedType: OHReportTypes = null;
  noInjuryList = false;
  error: Error;
  modalRef: BsModalRef;
  contributor: ContributorSearchResult;
  xl : string;
  reportDiseaseModal :  TemplateRef<HTMLElement>
  registrationNo: number;
  establishment: Establishment;
  searchContributorForm: FormGroup = new FormGroup({});
  parentForm = new FormGroup({});
  isValidNonSaudiContributor = true;
  isValidGCCContributor = true;
  isValidSaudiContributor = true;
  successMessageDisplay = false;
  person: Person;
  isEstClosed: boolean;
  isAppPrivate: boolean;
  contributorType: string;
  lang: string;
  statusEst: string;

  constructor(
    readonly alertService: AlertService,
    readonly ohService: OhService,
    readonly modalService: BsModalService,
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly dashboardSearchService: DashboardSearchService,
    readonly storageService: StorageService
  ) {
    super();
  }
  /**
   * This method handles initialization tasks.
   *
   * @memberof ContributorSearchScComponent
   */
  ngOnInit() {
    this.alertService.getAlerts().subscribe(alerts => {
      alerts?.forEach(alert => {
        if (
          alert?.message?.english?.includes('Report occupational injury is successfully submitted') ||
          alert?.message?.english?.includes('Report occupational Disease is successfully submitted') ||
          alert?.message?.english?.includes('Occupational complication is successfully reported') ||
          alert?.message?.english?.includes('Report Group Injury is submitted successfully')
        ) {          
        } else {          
         this.alertService.clearAlerts();
        }
      });
    });
    this.ohService.setISNewTransaction(true); 
    if(this.dashboardSearchService.registrationNo){
      this.registrationNo = this.dashboardSearchService.registrationNo;
      this.ohService.setRegistrationNo(this.registrationNo);
    } else if(this.ohService.getRegistrationNumber()){
      this.registrationNo = this.ohService.getRegistrationNumber();
    }else {
      this.registrationNo = Number(this.storageService.getLocalValue('registerationNumber'));
    }
    this.storageService.setLocalValue('registerationNumber', this.registrationNo);

    if (this.ohService.getReportType() !== null || this.ohService.getReportType() !== undefined) {
      this.selectedType = this.ohService.getReportType();
      this.setReportType(this.selectedType);
    }
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
  }
  getEstablishment() {
    if (this.registrationNo) {
      this.establishmentService.getEstablishmentDetails(this.registrationNo).subscribe(
        response => {
          this.establishment = response;
          if (
            this.establishment?.status.english === EstablishmentStatusEnum.CLOSED ||
            this.establishment?.status.english === EstablishmentStatusEnum.CLOSING_IN_PROGRESS
          ) {
            this.isEstClosed = true;
            this.statusEst = this.establishment.status.english;
            if (this.lang === 'ar') {
              this.statusEst = this.establishment.status.arabic;
            }
            if (this.selectedType === OHReportTypes.Injury) {
              this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.PROHIBIT-REPORT-INJURY', {
                status: this.statusEst
              });
            } else if (this.selectedType === OHReportTypes.Complication) {
              this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.PROHIBIT-REPORT-COMPLICATION', {
                status: this.statusEst
              });
            }
          } else {
            this.isEstClosed = false;
          }
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    }
  }
  /**
   *
   * @param type Method after report type select
   */
  setReportType(type: OHReportTypes) {
    scrollToTop();
    this.selectedType = type;
    this.hasSearchResult = false;
    this.ohService.setReportType(type);
    if (this.selectedType && this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.getEstablishment();
      this.language.subscribe(language => {
        this.lang = language;
        this.getEstablishment();
      });
    }
  }

  /**
   *
   *
   * @param searchValue Search using NIN/BORDER NUMBER/SIN/PASSPORT NO
   */
  searchContributor(searchValue) {
    this.contributorService.getContributorSearch(searchValue, null).subscribe(
      response => {
        if (this.appToken === ApplicationTypeEnum.PRIVATE) {
          this.contributors = response;
        } else if (this.appToken === ApplicationTypeEnum.PUBLIC) {
          this.contributors = response.contributors;
        }
        this.ohService.setContributor(this.contributors[0]);
        if (this.contributors.length <= 0) {
          this.contributorSearchError();
          this.hasSearchResult = false;
        } else {
          this.alertService.clearAlerts();
          this.hasSearchResult = true;
        }
      },
      err => {
        this.hasSearchResult = false;
        this.alertService.showError(err.error.message);
      }
    );
  }

  /**
   * Check if contributor have injury/disease list
   */
  checkInjuryList() {
    this.ohService.getOhHistory(OHReportTypes.Complication, null, this.isAppPrivate).subscribe(
      response => {
        if (response.injuryHistory) {
          if (response.injuryHistory.length === 0) {
            this.alertService.showWarningByKey('OCCUPATIONAL-HAZARD.EMPTY_INJURY_LIST');
            this.noInjuryList = true;
          } else {
            this.router.navigate([RouteConstants.ROUTE_COMPLICATION]);
          }
        }
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }

  /**
   * Method to navigate to corresponding pages
   * @param contributor
   */
  selectContributor(contributor: Partial<ContributorSearchResult>) {
    this.ohService.setInjuryId(null);
    this.ohService.setComplicationId(null);
    this.ohService.setPersonDetails(contributor.person);
    this.contributorType = contributor.contributorType;
    this.ohService.setSocialInsuranceNo(contributor.socialInsuranceNo);
    this.person = this.ohService.getPersonDetails();
    this.checkNonSaudiConditions(this.person.identity);
    this.checkForGCC(this.person.identity, this.person.nationality);
    if (this.selectedType === OHReportTypes.Injury) {
      if (!this.isValidNonSaudiContributor) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.NON_SAUDI_ERROR');
      } else if (!this.isValidSaudiContributor) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.SAUDI_ERROR');
      } else if (!this.isValidGCCContributor) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.GCC_ERROR');
      } else {
        this.router.navigate([RouteConstants.ROUTE_INJURY_ADD]);
      }
    } else if (this.selectedType === OHReportTypes.Complication) {
      if (!this.isValidNonSaudiContributor) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.NON_SAUDI_ERROR');
      } else if (!this.isValidGCCContributor) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.GCC_ERROR');
      } else if (!this.isValidSaudiContributor) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.SAUDI_ERROR');
      } else {
        this.checkInjuryList();
      }
    } 
  }

  /** Method to show modal. */
  showModal(template: TemplateRef<HTMLElement>, size: string): void {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size}` };
    this.modalRef = this.modalService.show(template, config);
  }

  addNewDisease(){
    this.ohService.setInjuryId(null);
    this.ohService.setComplicationId(null);
    this.contributor = this.ohService.getContributor();
    this.ohService.setPersonDetails(this.contributor?.person);
    this.contributorType = this.contributor?.contributorType;
    this.ohService.setSocialInsuranceNo(this.contributor?.socialInsuranceNo);
    this.person = this.ohService.getPersonDetails();
    this.checkNonSaudiConditions(this.person?.identity);
    this.checkForGCC(this.person?.identity, this.person?.nationality);
    if (this.selectedType === OHReportTypes.Disease){
      if (!this.isValidNonSaudiContributor) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.NON_SAUDI_ERROR');
      } else if (!this.isValidSaudiContributor) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.SAUDI_ERROR');
      } else if (!this.isValidGCCContributor) {
        this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.GCC_ERROR');
      } else {
        this.router.navigate([RouteConstants.ROUTE_ADD_DISEASE]);       
      }
      this.hideModal();
    }

  }

  hideModal(){
    this.modalRef.hide();  
  }

  /**
   * Method to show error message in person identity is not available in contributor
   */
  contributorSearchError() {
    scrollToTop();
    this.hasSearchResult = false;
    this.alertService.showErrorByKey('OCCUPATIONAL-HAZARD.REQUESTED-DETAILS-NOT-AVAILABLE');
  }
  /**
   * Check whether the contributor has valid identities
   */
  checkNonSaudiConditions(identities: Array<NIN | Iqama | NationalId | Passport | BorderNumber>) {
    this.isValidGCCContributor = true;
    this.isValidNonSaudiContributor = true;
    this.isValidSaudiContributor = true;
    if (identities && identities[0]) {
      let exit = false;
      if (this.contributorType === ContributorType.NON_SAUDI) {
        identities.forEach(identity => {
          if (!exit) {
            if (
              this.person.nationality.english !== GccCountryEnum.BAHRAIN &&
              this.person.nationality.english !== GccCountryEnum.KUWAIT &&
              this.person.nationality.english !== GccCountryEnum.OMAN &&
              this.person.nationality.english !== GccCountryEnum.QATAR &&
              this.person.nationality.english !== GccCountryEnum.UAE
            ) {
              if (identity.idType === IdentityTypeEnum.BORDER || identity.idType === IdentityTypeEnum.IQAMA) {
                this.isValidNonSaudiContributor = true;
                exit = true;
              } else {
                this.isValidNonSaudiContributor = false;
              }
            }
          }
        });
      }
      exit = false;
      if (this.contributorType === ContributorType.SAUDI) {
        identities.forEach(item => {
          if (!exit) {
            if (item.idType === IdentityTypeEnum.NIN) {
              this.isValidSaudiContributor = true;
              exit = true;
            } else {
              this.isValidSaudiContributor = false;
            }
          }
        });
      }
    }
  }
  /**
   *
   * @param identities Check for GCC
   * @param nationality
   */
  checkForGCC(identities: Array<NIN | Iqama | NationalId | Passport | BorderNumber>, nationality) {
    this.isValidGCCContributor = true;
    let exit = false;
    if (identities && identities[0]) {
      if (this.contributorType === ContributorType.GCC || this.contributorType === ContributorType.NON_SAUDI) {
        identities.forEach(item => {
          if (
            nationality.english === GccCountryEnum.BAHRAIN ||
            nationality.english === GccCountryEnum.KUWAIT ||
            nationality.english === GccCountryEnum.OMAN ||
            nationality.english === GccCountryEnum.QATAR ||
            nationality.english === GccCountryEnum.UAE
          ) {
            if (!exit) {
              if (item.idType === IdentityTypeEnum.NATIONALID) {
                this.isValidGCCContributor = true;
                exit = true;
              } else {
                this.isValidGCCContributor = false;
              }
            }
          }
        });
      }
    } else {
      if (this.contributorType === ContributorType.NON_SAUDI) {
        this.isValidNonSaudiContributor = false;
      }
      if (this.contributorType === ContributorType.GCC) {
        this.isValidGCCContributor = false;
      }
      if (this.contributorType === ContributorType.SAUDI) {
        this.isValidSaudiContributor = false;
      }
    }
  }
  reportGroupInjury(){
    this.router.navigate([RouteConstants.ROUTE_ADD_GROUP_INJURY]);

  }
  /**
   *
   * Clear the alerts
   */
  clearAlerts() {
    if(!this.ohService.getSuccessMessageDisplay()){
      this.alertService.clearAllSuccessAlerts();
    }   
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllInfoAlerts();
    this.alertService.clearAllWarningAlerts(); 
  }
}

