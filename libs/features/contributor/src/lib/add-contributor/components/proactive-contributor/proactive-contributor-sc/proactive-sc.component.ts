/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Location } from '@angular/common';
import { Component, ComponentFactoryResolver, Inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  CalendarService,
  DocumentService,
  LookupService,
  Lov,
  RouterConstants,
  RouterData,
  RouterDataToken,
  WizardItem,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { concat, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  ContributorConstants,
  ContributorRoutingService,
  ContributorService,
  createContributorWizard,
  EngagementDetails,
  EngagementService,
  EstablishmentService,
  ManageWageService,
  SaveEngagementResponse
} from '../../../../shared';
import { AddContributorBaseSc } from '../../../../shared/components/base/add-contributor-base-sc';
import { ContributorConfirmationDcComponent } from '../../contributor-confirmation-dc/contributor-confirmation-dc.component';

@Component({
  selector: 'cnt-proactive-sc',
  templateUrl: './proactive-sc.component.html',
  styleUrls: ['./proactive-sc.component.scss']
})
export class ProactiveScComponent extends AddContributorBaseSc implements OnInit {
  /**Local variables */
  formWizardItems: WizardItem[] = [];
  messageToDisplay: BilingualText;
  tempEngagementDetails: EngagementDetails;

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
    readonly activatedRoute: ActivatedRoute,
    readonly location: Location,
    readonly router: Router,
    readonly workflow: WorkflowService,
    readonly manageWageService: ManageWageService,
    readonly calendarService: CalendarService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    @Inject(ApplicationTypeToken) readonly appToken: string
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

  ngOnInit() {
    this.formWizardItems = createContributorWizard();
    this.setFormWizardItems();
    this.totalTabs = 2;
    super.setLovLists();
    this.setRouteDetails();
  }

  /**
   * Method to set different flag based on the route params.
   */
  setRouteDetails() {
    if (this.router.url.indexOf('/proactive') >= 0) {
      if (this.routerDataToken.payload) {
        super.initializeFromToken();
        this.updateBpmTask.taskId = this.routerDataToken.taskId;
        this.updateBpmTask.user = this.routerDataToken.assigneeId;
        this.getDataForView();
      }
    }
  }
  /*Method to add existing specialization  to the list */
  getSpecilationLovList() {
    this.specializationList$
      .pipe(
        tap(res => {
          const items = new Lov();
          items.value = this.contributor?.person?.specialization;
          if (items.value) {
            if (!res?.items.some(item => item.value.english === items?.value.english)) {
              res.items.push(items);
            }
          }
        })
      )
      .subscribe();
  }

  /**
   * Method to set form wizard items and set first tab as active
   */
  setFormWizardItems() {
    //Check if form wizard has items and make the first item active
    this.formWizardItems[0].isDisabled = false;
    this.formWizardItems[0].isActive = true;
  }

  /** Method to retrieve data for view. */
  getDataForView() {
    return forkJoin([
      super.getEstablishmentDetails(this.registrationNo),
      super.getContributorDetails(this.registrationNo, this.socialInsuranceNo),
      super.getEngagement()
    ])
      .pipe(
        tap(([est]) => {
          this.isGccEstablishment = est?.gccCountry ? true : false;
          super.getContributorSin(this.person.personId, this.registrationNo);
          super.fetchFilterLovListForProactive();
          this.getSpecilationLovList();
        })
      )
      .subscribe();
  }

  /**
   * Method to update contributor
   * @param contributor
   */
  updateProactiveContributor(contributor) {
    if (contributor) {
      super.updateContributor(contributor, ContributorConstants.NAV_ADMIN_EDIT_SUBMIT).subscribe(
        () => {
          this.navigateToNextTab();
        },
        err => this.showAlertDetails(err)
      );
    } else {
      super.showMandatoryFieldsError();
    }
  }
  /**
   * Method to create confirmation popup for wages
   * @param engagement
   */
  onSaveEngagement(engagement): void {
    this.tempEngagementDetails = engagement;
    this.showConfirmationTemplate();
  }

  /**
   * Method to update engagement details
   * @param engagementDetails
   */
  updateEngagement(engagementDetails: EngagementDetails) {
    this.engagement.engagementPeriod = engagementDetails.engagementPeriod;
    this.engagement.workType = engagementDetails.workType;
    this.engagement.companyWorkerNumber = engagementDetails.companyWorkerNumber;
    this.updateBpmTask.outcome = WorkFlowActions.APPROVE;
    concat(super.updateEngagementDetails(), this.workflowService.updateTaskWorkflow(this.updateBpmTask)).subscribe({
      next: (res: SaveEngagementResponse) => {
        if (res?.message) this.messageToDisplay = res.message;
      },
      error: err => this.showAlertDetails(err),
      complete: () => {
        super.getEngagement().subscribe();
        this.navigateToNextTab();
      }
    });
  }
  /**
   * Method to confirm cancel
   */
  confirmCancel() {
    this.decline();
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }

  /**  * Method to hide pop up  */
  decline() {
    this.modalRef.hide();
  }
  /**
   * Method to navigate between form wizard steps while clicking on individual wizard icon
   * @param selectedWizardIndex
   */
  selectFormWizard(selectedWizardIndex) {
    this.alertService.clearAlerts();
    this.activeTab = selectedWizardIndex;
  }

  /**Method to show error alert by key */
  showAlertError(key: string): void {
    this.alertService.showErrorByKey(key);
  }
  /**Method to show confirmation pop up */
  showConfirmationTemplate() {
    const initialState = {
      person: this.person,
      engagementPeriod: this.tempEngagementDetails.engagementPeriod
    };
    this.modalRef = this.modalService.show(ContributorConfirmationDcComponent, {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState
    });

    this.modalRef.content.confirmSubmission.subscribe(value => {
      if (value === true) {
        this.updateEngagement(this.tempEngagementDetails);
      }
    });
  }

  /**
   * This method is used to show given template
   * @param template
   * @memberof EngagementDetailsDcComponent
   */
  showTemplate(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
}
