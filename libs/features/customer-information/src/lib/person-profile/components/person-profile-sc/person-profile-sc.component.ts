/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  convertToStringDDMMYYYY,
  CoreContributorService,
  DocumentService,
  EstablishmentProfile,
  IdentityTypeEnum,
  LegalEntitiesEnum,
  RoleIdEnum,
  RouterData,
  RouterDataToken,
  startOfDay,
  UuidGeneratorService,
  WorkflowService,
  ContributorToken,
  ContributorTokenDto,
  ApplicationTypeEnum,
  formatDate,
  LanguageToken
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, noop, BehaviorSubject } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import {
  ChangePersonService,
  ManagePersonConstants,
  ManagePersonRoutingService,
  ManagePersonScBaseComponent,
  ManagePersonService
} from '../../../shared';
import { InfoModalDcComponent } from '../../../shared/components';
import { Engagement, TerminatePayload, EngagementDetails } from '../../../shared/models';

@Component({
  selector: 'cim-person-profile-sc',
  templateUrl: './person-profile-sc.component.html',
  styleUrls: ['./person-profile-sc.component.scss']
})
export class PersonProfileScComponent extends ManagePersonScBaseComponent implements OnInit, OnDestroy {
  //Local Variables
  typeNin = IdentityTypeEnum.NIN;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeBorder = IdentityTypeEnum.BORDER;
  typePassport = IdentityTypeEnum.PASSPORT;
  typeGcc = IdentityTypeEnum.NATIONALID;
  modalRef: BsModalRef;
  isBeneficiary: boolean;
  currentEngagement: Engagement;
  overAllEngagement: EngagementDetails[];
  legalEntity: BilingualText;
  accessRoles = [RoleIdEnum.CSR, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN];
  accessRolesAddPassport = [RoleIdEnum.SUPER_ADMIN, RoleIdEnum.BRANCH_ADMIN, RoleIdEnum.GCC_ADMIN, RoleIdEnum.REG_ADMIN, RoleIdEnum.OH_ADMIN, RoleIdEnum.CNT_ADMIN];
  lang = 'en';
  isIndividual = false;

  //Input variables
  @Input() isUserLoggedIn = false;
  @Input() isCsr = false;

  //Output Variables
  @Output() isModal: EventEmitter<boolean> = new EventEmitter();
  @Output() onEstablishmentFetch: EventEmitter<EstablishmentProfile> = new EventEmitter();
  @Output() isValid: EventEmitter<boolean> = new EventEmitter(); //Event to notify whether the contributor profile can be loaded

  @ViewChild('addIqamaModal', { static: false }) addIqamaTemplate: TemplateRef<HTMLElement>;
  @ViewChild('addBorderModal', { static: false })
  addBorderTemplate: TemplateRef<HTMLElement>;

  /**
   * Creates an instance of PersonProfileScComponent
   * @memberof  PersonProfileScComponent
   *
   */
  constructor(
    public contributorService: CoreContributorService,
    public manageService: ManagePersonService,
    public changePersonService: ChangePersonService,
    readonly alertService: AlertService,
    public documentService: DocumentService,
    @Inject(RouterDataToken)
    readonly routerDataToken: RouterData,
    readonly workflowService: WorkflowService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(ContributorToken) readonly contributorToken: ContributorTokenDto,
    public managePersonRoutingService: ManagePersonRoutingService,
    readonly route: ActivatedRoute,
    readonly modalService: BsModalService,
    readonly uuidService: UuidGeneratorService,
    readonly location: Location,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super(
      contributorService,
      manageService,
      changePersonService,
      alertService,
      documentService,
      routerDataToken,
      workflowService,
      appToken,
      managePersonRoutingService,
      uuidService,
      location
    );
  }

  /** This method handles the initialization tasks. */
  ngOnInit() {
    this.alertService.clearAllErrorAlerts();
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.fetchInitialData();
  }

  /**  Method to fetch the initial data. */
  fetchInitialData() {
    this.route.paramMap
      .pipe(
        filter(params => Object.keys(params).length !== 0),
        switchMap(params => {
          if (params.get('registrationNo')  && params.get('registrationNo') !== "0" && params.get('sin')) {
            this.socialInsuranceNo = Number(params.get('sin'));
            this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
            if (this.isAppPrivate) {
              this.getOverallEngagement();
            }
            return forkJoin([
              this.manageService.searchContributor(params.get('registrationNo'), params.get('sin'), true),
              this.manageService.getEstablishmentProfile(Number(params.get('registrationNo')))
            ]).pipe(
              tap(estProfile => {
                this.legalEntity = estProfile[1].legalEntity;
                this.manageService.registrationNo = estProfile[1].registrationNo;
                this.onEstablishmentFetch.emit(estProfile[1]);
              }),
              switchMap(() => this.initialiseTheView()),
              tap(() => {
                this.isValid.emit(true);
              })
            );
          } else if (params.get('sin')) {
            return this.manageService.searchContributor(params.get('registrationNo'), params.get('sin'), true).pipe(
              switchMap(() => {
                //reseting establishment details if already present (for unified profile)
                this.manageService.clearEstablishmentProfileSubject();
                this.isIndividual = true;
                this.socialInsuranceNo = Number(params.get('sin'));
                this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
                if (this.isAppPrivate) {
                  this.getOverallEngagement();
                }
                return this.initialiseTheView();
              }),
              tap(() => {
                this.isValid.emit(true);
              })
            );
          } else {
            this.isValid.emit(true);
            this.isIndividual = false;
            return this.manageService.establishmentProfile$.pipe(
              tap(estProfile => {
                this.manageService.registrationNo = estProfile.registrationNo;
                this.onEstablishmentFetch.emit(estProfile);
              }),
              switchMap(() => this.initialiseTheView())
            );
          }
        })
      )
      .subscribe(noop, err => {
        this.alertService.showError(err?.error?.message);
      });
  }

  navigateToAddPassport(){
    console.log('navigate')
    this.managePersonRoutingService.navigateToAddPassport();

  }
  /** This method is used to show the the iqama template ref as modal. */
  navigateToAddIqama() {
    if (this.isIqamaReturned) {
      this.manageService.isEdit = true;
      this.managePersonRoutingService.resetLocalToken();
    } else {
      this.manageService.isEdit = false;
    }
    this.managePersonRoutingService.navigateToAddIqama();
    this.alertService.clearAlerts();
  }

  /** This method is used to show the the border template ref as modal. */
  navigateToAddBorder() {
    if (this.isBorderReturned) {
      this.manageService.isEdit = true;
      this.managePersonRoutingService.resetLocalToken();
    } else {
      this.manageService.isEdit = false;
    }
    this.managePersonRoutingService.navigateToAddBorder();
  }

  /** Method to check whether engagement needs to be terminated. */
  //******** DONOT USE CALL THIS METHOD - CAUSED PERFORMANCE ISSUES IN PRODUCTION ********
  // TO BE REMOVED IN RELEASE 2.1 #ProductionFix
  checkTerminationRequired() {
    //If a contributor is dead or govt employee and has active engagements, terminate the active engagements.
    if (this.active) {
      const payload = new TerminatePayload();
      if (this.contributor.person.deathDate && this.contributor.person.deathDate.gregorian) {
        payload.leavingDate.gregorian = startOfDay(this.contributor.person.deathDate.gregorian);
        payload.leavingReason.english = ManagePersonConstants.DEAD_PERSON_LEAVING_REASON;
        //Fetch latest engagement if contributor is dead (only for normal contributor)
        if (this.registrationNo) this.getCurrentEngagement().subscribe();
        this.terminateContriutor(payload);
      } else if (
        this.contributor.person.govtEmp &&
        this.legalEntity?.english !== LegalEntitiesEnum.GOVERNMENT &&
        this.legalEntity?.english !== LegalEntitiesEnum.SEMI_GOVERNMENT
      ) {
        //Terminate only if esatblishment is not govt or semi government for a govt employee
        payload.leavingDate.gregorian = startOfDay(new Date());
        payload.leavingReason.english = ManagePersonConstants.GOVT_EMPLOYEE_LEAVING_REASON;
        this.terminateContriutor(payload);
      } else this.isValid.emit(true);
    } else this.isValid.emit(true);
  }

  /** Method to show the template. */
  showTemplate(content) {
    const initialState = {
      contentKey: content?.key,
      deathDate: content?.date,
      heading: content?.heading
    };
    this.modalRef = this.modalService.show(InfoModalDcComponent, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered',
      initialState
    });
    this.modalRef?.content?.ok.subscribe((value: boolean) => {
      if (value) this.modalRef.hide();
    });
  }

  /** Method to terminate the contributor. */
  //NO NEED FOR THIS METHOD TO BE CALLED - TO BE REMOVED IN RELEASE 2.1 #ProductionFix
  terminateContriutor(payload: TerminatePayload) {
    this.manageService.terminateAllActiveEngagements(this.registrationNo, this.socialInsuranceNo, payload).subscribe(
      res => {
        this.isValid.emit(true);
        this.changeContributorActiveStatus();
        //Death date before joining date: If the contributor has no active engagement in the current establishment;
        //and engagement active in some other establishment got cancelled, pop up is not needed.
        const showTemplate = res && this.currentEngagement?.leavingDate?.gregorian ? false : true;
        if (showTemplate) this.showTemplate(this.createTemplateContent(res));
      },
      err => this.alertService.showError(err?.error?.message)
    );
  }

  /** Method to create template content */
  createTemplateContent(flag: boolean) {
    const content = {};
    content['heading'] = this.getTemplateHeading(flag);
    if (this.contributor.person.govtEmp)
      content['key'] = flag
        ? ManagePersonConstants.ACTIVE_GOVT_EMPLOYEE_CANCEL_MESSAGE_KEY
        : ManagePersonConstants.ACTIVE_GOVT_EMPLOYEE_TERMINATE_MESSAGE_KEY;
    else if (this.contributor.person.deathDate && this.contributor.person.deathDate.gregorian) {
      content['key'] = flag
        ? this.getContentForDeadContributorCancel()
        : ManagePersonConstants.ACTIVE_DEAD_PERSON_TERMINATE_MESSAGE_KEY;
      content['date'] = convertToStringDDMMYYYY(this.contributor.person.deathDate.gregorian.toString());
    }
    return content;
  }

  /** Method to get template heading. */
  getTemplateHeading(flag: boolean): string {
    //If contributor is dead and current engagement joining is after death, engagement gets cancelled;otherwise terminated
    return flag
      ? this.currentEngagement &&
        this.contributor.person.deathDate &&
        moment(this.contributor.person.deathDate.gregorian).isSameOrAfter(
          this.currentEngagement.joiningDate.gregorian,
          'day'
        )
        ? 'CUSTOMER-INFORMATION.TERMINATE-CONTRIBUTOR'
        : 'CUSTOMER-INFORMATION.CANCEL-ENGAGEMENT'
      : 'CUSTOMER-INFORMATION.TERMINATE-CONTRIBUTOR';
  }

  /** Method to get content for dead contributor if any engagement gets cancelled. */
  getContentForDeadContributorCancel(): string {
    //Death date before joining date: Engagement gets cancelled otherwise terminated.
    //Setting the message based on current engagement of the contribuor for the  above scenario.
    if (this.currentEngagement) {
      if (
        (moment(this.contributor.person.deathDate.gregorian).isBefore(this.currentEngagement.joiningDate.gregorian),
        'day')
      )
        return ManagePersonConstants.DEAD_BEFORE_JOINING_CANCEL_MESSAGE_KEY;
      else return ManagePersonConstants.ACTIVE_DEAD_PERSON_TERMINATE_MESSAGE_KEY;
    } else return ManagePersonConstants.ACTIVE_DEAD_PERSON_CANCEL_MESSAGE_KEY;
  }

  /** Method to get current engagement */
  getCurrentEngagement() {
    return this.manageService
      .getEngagements(this.registrationNo, this.socialInsuranceNo)
      .pipe(tap(res => (res.length > 0 ? (this.currentEngagement = res[0]) : (this.currentEngagement = undefined))));
  }
  /** Method to get current engagement */
  getOverallEngagement() {
    return this.manageService.getOverAllEngagements(this.socialInsuranceNo).subscribe({
      next: res => {
        res.every(item => item.engagementType === 'vic')
          ? this.contributorToken.setOtherEngagements(false)
          : this.contributorToken.setOtherEngagements(true);
      }
    });
  }
  /** Method to change active status of contributor. */
  changeContributorActiveStatus() {
    this.active = false;
    this.contributor.active = false;
  }
  /** Method to get date format */
  getDateFormat(lang) {
    return formatDate(lang);
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
