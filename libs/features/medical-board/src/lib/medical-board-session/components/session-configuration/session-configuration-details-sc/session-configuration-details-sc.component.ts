import { Component, OnInit, TemplateRef, Inject, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertService, BilingualText, LanguageToken, LookupService, LovList, RoleIdEnum } from '@gosi-ui/core';
import { DropDownItems } from '@gosi-ui/features/contributor';
import { StopSessionDetails, HoldSessionDetails } from '../../../../shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfigurationBaseScComponent } from '../../../../shared/components';
import { MBConstants, MbRouteConstants } from '../../../../shared/constants';
import { SessionConfigurationService, SessionStatusService } from '../../../../shared/services';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mb-session-configuration-details-sc',
  templateUrl: './session-configuration-details-sc.component.html',
  styleUrls: ['./session-configuration-details-sc.component.scss']
})
export class SessionConfigurationDetailsScComponent extends ConfigurationBaseScComponent implements OnInit {
  /**
   * Local Variables
   */
  specialityList: LovList;
  reasonList: LovList;
  modalRef: BsModalRef;
  stopSessionForm: FormGroup = new FormGroup({});
  templateId: number;
  lang = 'en';
  allowedSessionOfficerRole = [RoleIdEnum.BOARD_OFFICER];
  allowedMbofficer = [RoleIdEnum.BOARD_OFFICER, RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER];

  @ViewChild('stopSessionModal') stopSessionModal: TemplateRef<HTMLElement>;
  /**
   *
   * @param lookupService
   * @param router
   * @param activatedRoute
   * @param modalService
   * @param sessionConfigurationService
   */
  constructor(
    readonly sessionStatusService: SessionStatusService,

    readonly lookupService: LookupService,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly location: Location,
    readonly sessionConfigurationService: SessionConfigurationService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    super(sessionStatusService, lookupService, activatedRoute, sessionConfigurationService, alertService);
  }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.alertService.clearAlerts();
    this.sessionDropDown = new Array<DropDownItems>();
    this.initializeView();
    this.sessionDropDown.push({ id: 1, key: 'MEDICAL-BOARD.MODIFY-CONFIGURATION' });
    if (this.isRegular) this.sessionDropDown.push({ id: 2, key: 'MEDICAL-BOARD.STOP-CONFIGURATION' });
  }

  navigateBack() {
    this.router.navigate([MBConstants.ROUTE_MEDICAL_BOARD_SESSION_DETAILS]);
  }
  /**
   * Method to show stop session modal
   */
  stopSessionPopup(template) {
    const size = 'md';
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-${size} modal-dialog-centered` };
    this.modalRef = this.modalService.show(template, config);
  }
  holdSessionPopup(templateValues) {
    const sizeValue = templateValues.size;
    const configuration = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: `modal-${sizeValue} modal-dialog-centered`
    };
    this.modalRef = this.modalService.show(templateValues.modal, configuration);
  }
  // Method to hide modal.
  hideModal(): void {
    if (this.modalRef) this.modalRef.hide();
  }
  /**
   * Method to navigate to stopSession
   * @param stopSessionObject
   */
  stopSession(stopSessionObject: StopSessionDetails) {
    this.alertService.clearAlerts();
    if (this.stopSessionForm?.get('stopSessionForm')?.valid) {
      this.configurationService
        .onStopMbSession(this.isRegular ? this.templateId : this.sessionId, stopSessionObject)
        .subscribe(
          (response: BilingualText) => {
            if (response) {
              this.hideModal();
              this.alertService.showSuccess(response);
              this.getIndividualSessionDetails(this.templateId);
            }
          },
          err => {
            this.hideModal();
            this.alertService.showError(err.error?.message);
          }
        );
    }
  }
  /**
   * Method to navigate to session details page
   * @param id
   * @param templateRef
   */
  navigateToSession(id: number, templateRef: TemplateRef<HTMLElement>) {
    if (id === 1) {
      this.isRegular
        ? this.router.navigate([MBConstants.MODIFY_REGULAR_SESSION_ROUTE], {
            queryParams: {
              templateId: this.templateId,
              sessionType: this.sessionType
            }
          })
        : this.router.navigate([MBConstants.MODIFY_ADHOC_SESSION_ROUTE], {
            queryParams: {
              sessionId: this.sessionId,
              sessionType: this.sessionType
            }
          });
    } else if (id === 2) {
      this.stopSessionPopup(templateRef);
      this.getStopReasonList();
      this.stopSessionForm.getRawValue();
    }
  }
  /**
   * Method to hold session
   * @param holdSessionDetails
   */
  holdSession(holdSessionDetails: HoldSessionDetails) {
    this.alertService.clearAlerts();
    if (this.stopSessionForm?.get('holdSessionForm')?.valid) {
      this.configurationService.onHoldMbSession(this.templateId, holdSessionDetails).subscribe(
        (response: BilingualText) => {
          if (response) {
            this.hideModal();
            this.alertService.clearAlerts();
            this.alertService.showSuccess(response);
            this.getIndividualSessionDetails(this.templateId);
          }
        },
        err => {
          this.hideModal();
          this.alertService.showError(err.error?.message);
        }
      );
    }
  }
  /**
   * Method to remove hold
   * @param holdSessionDetails
   */
  removeHold(holdSessionDetails: HoldSessionDetails) {
    this.alertService.clearAlerts();
    this.configurationService
      .removeHoldSession(this.templateId, holdSessionDetails)
      .subscribe((response: BilingualText) => {
        if (response) {
          this.hideModal();
          this.alertService.showSuccess(response);
          this.getIndividualSessionDetails(this.templateId);
        }
      });
  }
  getHoldDetails(templateValues) {
    this.holdSessionPopup(templateValues);
    this.getHoldReasonList();
  }
  navigateTo(identity: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identity)]);
  }
  navigateToParticipantProfile(identificationNo: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PARTICIPANT_PROFILE(identificationNo)]);
    this.hideModal();
  }
}
