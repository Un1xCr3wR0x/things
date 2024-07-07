/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import {
  Component,
  ComponentFactoryResolver,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  Type,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  BorderNumber,
  CalendarService,
  DocumentService,
  EstablishmentStatusEnum,
  getIdentityValue,
  getPersonIdentifier,
  IdentityTypeEnum,
  Iqama,
  LanguageToken,
  LegalEntitiesEnum,
  LookupService,
  NationalId,
  RegistrationNoToken,
  RegistrationNumber,
  RoleIdEnum,
  RouterData,
  RouterDataToken,
  scrollToTop,
  WorkflowService
} from '@gosi-ui/core';
import { ComponentHostDirective } from '@gosi-ui/foundation-theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ContributorConstants } from '../../../constants';
import { ContributorTypesEnum } from '../../../enums';
import { Establishment, PersonalInformation } from '../../../models';
import {
  ContributorRoutingService,
  ContributorService,
  EngagementService,
  EstablishmentService,
  ManageWageService
} from '../../../services';
import { AddContributorBaseSc } from '../../base/add-contributor-base-sc';
import { SearchGccDcComponent } from '../search-gcc-dc/search-gcc-dc.component';
import { SearchImmigratedTribeDcComponent } from '../search-immigrated-tribe-dc/search-immigrated-tribe-dc.component';
import { SearchNonSaudiDcComponent } from '../search-non-saudi-dc/search-non-saudi-dc.component';
import { SearchSaudiDcComponent } from '../search-saudi-dc/search-saudi-dc.component';
import { SearchSplForeignerDcComponent } from '../search-spl-foreigner-dc/search-spl-foreigner-dc.component';
import { BlockFlagReasonEnum } from '@gosi-ui/features/establishment';

@Component({
  selector: 'cnt-person-search-sc',
  templateUrl: './person-search-sc.component.html',
  styleUrls: ['./person-search-sc.component.scss']
})
export class PersonSearchScComponent extends AddContributorBaseSc implements OnInit, OnDestroy {
  /**
   * Variable declarations & initialization
   */
  currentLang: string;
  isAppPrivate: boolean;
  langSubscription: Subscription;
  isRegistered = false;
  isABSHERVerified = true;
  userRole: string[] = [];
  showErrorrMessage = false;
  isOutOfMarket = false;
  ppaEstablishment: boolean;
  isAppPublic: boolean;
  estFlagReason: string[] = [];
  person:PersonalInformation ;

  /**Template and child reference */
  @ViewChild(ComponentHostDirective, { static: true })
  gosiComponentHost: ComponentHostDirective;
  @ViewChild('addDocInfoTemplate', { static: false })
  addDocInfoTemplate: TemplateRef<HTMLElement>;
  @ViewChild('gosiOnlineInfoTemplate', { static: false })
  gosiOnlineInfoTemplate: TemplateRef<HTMLElement>;
  @ViewChild('resetTemplate', { static: false })
  resetTemplate: TemplateRef<HTMLElement>;
  @ViewChild('noAbsherAccountTemplate', { static: false })
  noAbsherAccountTemplate: TemplateRef<HTMLElement>;

  constructor(
    readonly alertService: AlertService,
    readonly componentFactoryResolver: ComponentFactoryResolver,
    readonly contributorRoutingService: ContributorRoutingService,
    readonly contributorService: ContributorService,
    readonly establishmentService: EstablishmentService,
    readonly lookupService: LookupService,
    readonly engagementService: EngagementService,
    readonly modalService: BsModalService,
    readonly documentService: DocumentService,
    readonly location: Location,
    readonly router: Router,
    readonly manageWageService: ManageWageService,
    readonly workflow: WorkflowService,
    readonly calendarService: CalendarService,
    readonly authTokenService: AuthTokenService,
    @Inject(LanguageToken) readonly lang: Observable<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(RegistrationNoToken) readonly regNoToken: RegistrationNumber
  ) {
    super(
      alertService,
      lookupService,
      contributorService,
      establishmentService,
      engagementService,
      documentService,
      location,
      router,
      manageWageService,
      workflow,
      calendarService,
      appToken,
      routerDataToken
    );
  }

  /**
   * Method to handle all initial tasks
   */
  ngOnInit() {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.isAppPublic = this.appToken === ApplicationTypeEnum.PUBLIC;
    this.setLovLists();
    this.langSubscription = this.lang.subscribe(res => (this.currentLang = res));
    this.registrationNo = this.isAppPrivate
      ? this.regNoToken.value
      : this.establishmentService.getRegistrationFromStorage();
    this.onEstablishmentSearch(this.registrationNo);
  }

  /** Method to get user roles. */
  getUserRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    if (gosiscp) {
      if (!this.isAppPrivate) {
        const adminRole = gosiscp.filter(item => Number(item.establishment) === this.registrationNo)[0];
        this.userRole = adminRole ? adminRole.role.map(r => r.toString()) : [];
      } else this.userRole = gosiscp?.[0].role.map(r => r.toString());
    }
  }

  /**
   * Method to fetch establishment details on establishment search emit
   * @param registrationNo
   */
  onEstablishmentSearch(registrationNo) {
    this.alertService.clearAllErrorAlerts();
    if (registrationNo) {
      this.getEstablishmentDetails(registrationNo).subscribe(res => {
        this.getUserRoles();
        this.checkEstablishmentEligibility(res);
        this.isPpa = res.ppaEstablishment
      });
    } else {
      this.showMandatoryFieldsError();
    }
  }

  /** Method to check establishment eligibility. */
  checkEstablishmentEligibility(establishment: Establishment) {
    //GCC CSR should be allowed to add contributor in GCC Establishment.
    if (
      this.userRole.includes(RoleIdEnum.GCC_CSR.toString()) &&
      !this.userRole.includes(RoleIdEnum.CSR.toString()) &&
      !establishment?.gccEstablishment?.gccCountry
    )
      this.alertService.showErrorByKey('CONTRIBUTOR.REGISTER-CONTRIBUTOR-GCC-CSR-ERROR');
    //CSR should be allowed to add contributor in non GCC Establishment.
    else if (
      this.userRole.includes(RoleIdEnum.CSR.toString()) &&
      !this.userRole.includes(RoleIdEnum.GCC_CSR.toString()) &&
      establishment?.gccEstablishment?.gccCountry
    )
      this.alertService.showErrorByKey('CONTRIBUTOR.REGISTER-CONTRIBUTOR-CSR-ERROR');
    else if (establishment.status.english !== EstablishmentStatusEnum.REGISTERED && establishment.status.english !== EstablishmentStatusEnum.REOPEN)
      this.alertService.showErrorByKey('CONTRIBUTOR.NOT-REGISTERED');
      else if (
        establishment.status.english == EstablishmentStatusEnum.REGISTERED &&
        this.isAppPublic &&
        establishment.blockTransactionFlags
      ) {
        establishment.blockTransactionFlags.forEach(value => this.estFlagReason.push(value.flagReason.english));
        if (this.estFlagReason.includes(BlockFlagReasonEnum.STOP_REGISTER_CONTRIBUTOR.toString()))
          this.alertService.showErrorByKey('CONTRIBUTOR.RESTRICT-REGISTER-CONTRIBUTOR');
      } else if (!this.isAppPrivate) {
      if (
        establishment.legalEntity.english === LegalEntitiesEnum.INDIVIDUAL ||
        establishment.legalEntity.english === LegalEntitiesEnum.PATNERSHIP
      ) {
        if (!establishment.gccCountry) {
          if (establishment.outOfMarket) {
            this.isOutOfMarket = true;
            this.showErrorrMessage = true;
          } else if (establishment.molEstablishmentIds === null) this.showErrorrMessage = true;
          else if (
            establishment.molEstablishmentIds?.molEstablishmentId === null ||
            establishment.molEstablishmentIds.molEstablishmentOfficeId === null ||
            establishment.molEstablishmentIds.molOfficeId === null ||
            establishment.molEstablishmentIds.molunId === null
          )
            this.showErrorrMessage = true;
          else {
            this.establishment = establishment;
            this.isRegistered = true;
          }
        } else {
          this.establishment = establishment;
          this.isRegistered = true;
        }
      } else {
        this.establishment = establishment;
        this.isRegistered = true;
      }
    } else {
      this.establishment = establishment;
      this.isRegistered = true;
    }
    establishment?.ppaEstablishment? this.ppaEstablishment = true : false;
  }

  /**
   * Method to set contributor type on contributor type select (Either choosing contributor type icons or using workflow resource type)
   * @param contributorType
   */

  onContributorTypeSelect(contributorType: ContributorTypesEnum) {
    this.alertService.clearAlerts();
    this.contributorType = contributorType;
    this.contributorService.setContributorType = contributorType;
    if (contributorType) {
      this.loadSearchFormComponent(this.contributorType);
    }
  }

  /**
   * Method to verify person search and get contributor details
   * @param url
   */
  onVerify(personSearchData) {
    // let identityList= [...getPersonIdentifier(personSearchData?.personDetails)];
    // let iqama: Iqama = new Iqama();
    // iqama = { ...(<Iqama>getIdentityValue(identityList, IdentityTypeEnum.IQAMA) || iqama) };
    if (personSearchData.queryParams) {
      this.contributorService
        .getPersonDetails(personSearchData.queryParams, this.setOptionsForVerify())
        .pipe(
          tap(res => {
            this.contributorService.setPersonalInformation(res ? res : personSearchData.personDetails);
            if (res)
              this.isABSHERVerified = ContributorConstants.ValidABSHERVerificationStatus.includes(
                res.absherVerificationStatus
              );
          })
        )
        .subscribe({
          next: () => {
            if (this.checkABSHERVerificationRequired() && !this.isABSHERVerified)
              this.showTemplate(this.noAbsherAccountTemplate);
            else if (this.contributorType === ContributorTypesEnum.SAUDI) this.checkContributorEligibility();
            else if (this.contributorType === ContributorTypesEnum.SECONDED)
              this.contributorRoutingService.routeToAddSeconded();
            else{
              this.person=this.contributorService.getPerson;
              let identityList= this.person?.identity;
              let iqama: Iqama = new Iqama();
              iqama = { ...(<Iqama>getIdentityValue(identityList, IdentityTypeEnum.IQAMA) || iqama) };
              let borderNo=new BorderNumber()
              borderNo = { ...(<BorderNumber>getIdentityValue(identityList, IdentityTypeEnum.BORDER) || borderNo) };
              let GccId=new NationalId()
              GccId= { ...(<NationalId>getIdentityValue(identityList, IdentityTypeEnum.NATIONALID) || GccId) };
              let identifier= iqama?.iqamaNo ? iqama?.iqamaNo 
                              : borderNo?.id ? borderNo?.id 
                              : GccId?.id ? GccId?.id : null;
              this.contributorService
              .getEligibleNonSaudi(this.registrationNo,identifier).subscribe(
                res =>{
                  if(res?.isEligibleNonSaudi){
                    this.checkNonSaudiContributor();
                  }else{
                    this.alertService.showErrorByKey('CONTRIBUTOR.NON-SAUDI-CONTRIBUTOR-ELGIBILITY-MSG');
                  }
                },
                err=>{
                  this.showError(err);
                }
              )
            }
          },
          error: err => this.showError(err)
        });
    } else {
      this.showMandatoryFieldsError();
    }
  }

  /** Method to set options for person verify. */
  setOptionsForVerify(): Map<string, boolean> {
    const options: Map<string, boolean> = new Map();
    if (this.contributorType === ContributorTypesEnum.SAUDI)
      options.set('fetchAddressFromWasel', true).set('absherVerificationRequired', true);
    return options;
  }

  /** Method to check whether ABSHER verification is required. */
  checkABSHERVerificationRequired(): boolean {
    return (
      this.contributorType === ContributorTypesEnum.SAUDI &&
      this.establishment.legalEntity.english !== LegalEntitiesEnum.GOVERNMENT &&
      this.establishment.legalEntity.english !== LegalEntitiesEnum.SEMI_GOVERNMENT &&
      !this.contributorService.getPerson.deathDate?.gregorian
    );
  }

  /** Method to handle non saudi registration. */
  checkNonSaudiContributor() {
    if (this.isAppPrivate) this.showTemplate(this.gosiOnlineInfoTemplate);
    else this.contributorRoutingService.routeToAddContributor();
  }

  /** Method to check contributor eligibility. */
  checkContributorEligibility() {
    if (!this.isAppPrivate) {
      if (
        this.contributorService.getPerson.govtEmp &&
        this.establishment.legalEntity.english !== LegalEntitiesEnum.GOVERNMENT &&
        this.establishment.legalEntity.english !== LegalEntitiesEnum.SEMI_GOVERNMENT
      )
        this.alertService.showErrorByKey('CONTRIBUTOR.GOVERNMENT-EMPLOYEE-ERROR');
      else this.contributorRoutingService.routeToAddContributor();
    } else this.processSaudiDocPopup();
  }

  /**
   * Method to show confirmation message popup if saudi person is dead or gov employee
   */
  processSaudiDocPopup() {
    if (this.isAppPrivate) {
      if (this.contributorService.getPerson.deathDate?.gregorian || this.contributorService.getPerson.govtEmp) {
        this.showTemplate(this.addDocInfoTemplate);
      } else {
        this.showTemplate(this.gosiOnlineInfoTemplate);
      }
    }
  }
  /**
   *Method to continue to saudi add contibutor if saudi person is dead or gov employee
   */
  continueProcessSaudiDoc() {
    this.modalRef.hide();
    this.contributorRoutingService.routeToAddContributor();
  }
  /**Method to hide pop up */
  decline(): void {
    this.modalRef.hide();
  }
  /**
   *Method to reset person type selected on cancel of popup
   */
  reset() {
    this.alertService.clearAlerts();
    this.modalRef.hide();
    scrollToTop();
    this.gosiComponentHost.viewContainerRef.clear();
    this.loadSearchFormComponent(this.contributorType);
  }
  /**
   * Method to load search forms dynamically based on selected contributor type
   */
  loadSearchFormComponent(contributorType: string) {
    let componentRef;
    switch (contributorType) {
      case ContributorTypesEnum.SAUDI:
      case ContributorTypesEnum.SECONDED: {
        componentRef = this.resolveComponent(SearchSaudiDcComponent);
        componentRef.instance.personType = this.contributorType;
        break;
      }
      case ContributorTypesEnum.NON_SAUDI: {
        componentRef = this.resolveComponent(SearchNonSaudiDcComponent);
        if (componentRef) {
          componentRef.instance.nationalityList = this.nationalityList$;
        }
        break;
      }
      case ContributorTypesEnum.IMMIGRATED_TRIBE: {
        componentRef = this.resolveComponent(SearchImmigratedTribeDcComponent);
        break;
      }
      case ContributorTypesEnum.SPECIAL_FOREIGNER: {
        componentRef = this.resolveComponent(SearchSplForeignerDcComponent);
        if (componentRef) {
          componentRef.instance.nationalityList = this.nationalityList$;
          componentRef.instance.isSpecialResident = false;
        }
        break;
      }
      case ContributorTypesEnum.GCC: {
        componentRef = this.resolveComponent(SearchGccDcComponent);
        if (componentRef) {
          componentRef.instance.gccNationalityList = this.gccCountryList$;
        }
        break;
      }
      case ContributorTypesEnum.PREMIUM_RESIDENTS: {
        componentRef = this.resolveComponent(SearchSplForeignerDcComponent);
        if (componentRef) {
          componentRef.instance.nationalityList = this.nationalityList$;
          componentRef.instance.isSpecialResident = true;
        }
        break;
      }
      default:
        break;
    }
    componentRef.changeDetectorRef.detectChanges();
    componentRef.instance.verify.subscribe(res => {
      this.onVerify(res);
    });
    componentRef.instance.reset.subscribe(() => {
      this.showTemplate(this.resetTemplate);
    });
    componentRef.instance.error.subscribe(() => {
      this.showMandatoryFieldsError();
    });
  }
   /** Method to display description based on the selected contributor type */
   showContributorDescription(contributorType){
    switch (contributorType){
      case "SAUDI": return 'CONTRIBUTOR.SAUDI-CONTRIBUTOR-DESCRIPTION';
      
      case "non-saudi-private":
      case "non-saudi-non-private":
      case "Non_Saudi": return 'CONTRIBUTOR.NON-SAUDI-DESCRIPTION';
      
      case "Immigrated_Tribe": return 'CONTRIBUTOR.IMMIGRATED-TRIBE-DESCRIPTION';
      
      case "Special_Foreigner": return 'CONTRIBUTOR.SPECIAL-FOREIGNER-DESCRIPTION';
      
      case "GCC" : return 'CONTRIBUTOR.GCC-DESCRIPTION';
      
      case "Premium_residents" : 
      case "PREMIUM_RESIDENTS" : return 'CONTRIBUTOR.PREMIUM-RESIDENTS-DESCRIPTION';

      default: return "";
    }
  }
  /**
   * Method to resolve component and return a reference to that dynamic component
   * @param component
   */
  resolveComponent(
    component: Type<
      | SearchSaudiDcComponent
      | SearchNonSaudiDcComponent
      | SearchSplForeignerDcComponent
      | SearchImmigratedTribeDcComponent
      | SearchGccDcComponent
    >
  ) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.gosiComponentHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    return componentRef;
  }
  /**
   * This absract method is to create template based on the value
   */
  showTemplate(template: TemplateRef<HTMLElement>): void {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }

  /**
   * Method to handle tasks on component destroy
   */
  ngOnDestroy(): void {
    this.langSubscription.unsubscribe();
    this.alertService.clearAllErrorAlerts();
  }
}
