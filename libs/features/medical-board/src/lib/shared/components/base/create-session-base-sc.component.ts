/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  LookupService,
  Lov,
  LovList,
  RouterConstants,
  RouterData,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { noop, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { MedicalMembersBaseScComponent } from './medical-members-base-sc.component';
import { ConfigurationFilterConstants, MBConstants } from '../../constants';
import { ConfigurationTypeEnum, GeneralEnum, PersonTypeEnum } from '../../enums';
import { ContractedMembers, RescheduleSessionData, UnAvailableMemberListResponse } from '../../models';
import { CreateSessionService, SessionConfigurationService, SessionStatusService } from '../../services';
import { ContributorBPMRequest } from '@gosi-ui/features/contributor';

@Directive()
export abstract class CreateSessionBaseScComponent extends MedicalMembersBaseScComponent {
  /**
   * Local Variables
   */
  configurationId: number;
  isRegular: boolean;
  isSubspeciality = false;
  modalRef: BsModalRef;
  sessionData: RescheduleSessionData;
  sessionFrequencyList: LovList;
  sessionId: number;
  sessionType: string;
  specialityList: LovList;
  subspecialityList: LovList[] = new Array<LovList>();
  templateId: number;
  unAvailableMemberList = new Array<UnAvailableMemberListResponse>();
  selectedMembers: ContractedMembers[] = [];
  originalList: ContractedMembers[] = [];
  sessionDataLovList: LovList;
  sessionDataLovListTemp: LovList;
  sessionGosiDrLovList: LovList;
  getSessionChannel: BilingualText;
  doctorList: LovList;
  /**
   *
   * @param router
   * @param activatedRoute
   * @param lookupService
   * @param modalService
   * @param statusService
   * @param alertService
   * @param sessionService
   * @param configurationService
   */
  constructor(
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    readonly lookupService: LookupService,
    readonly modalService: BsModalService,
    readonly statusService: SessionStatusService,
    readonly alertService: AlertService,
    readonly sessionService: CreateSessionService,
    readonly workflowService: WorkflowService,
    readonly configurationService: SessionConfigurationService
  ) {
    super(alertService, statusService, modalService, lookupService, router, sessionService);
  }
  getEditMode() {
    if (this.router.url.indexOf('/edit') >= 0) {
      this.isEditMode = true;
      this.activatedRoute.queryParams.subscribe(res => {
        this.sessionType = res.sessionType;
        const sessionFilterType = ConfigurationFilterConstants.FILTER_FOR_SESSION_TYPE[0]?.value?.english;
        if (this.sessionType === sessionFilterType) {
          this.templateId = Number(res.templateId);
          this.configurationId = this.templateId;
          this.isRegular = true;
        } else if (res.sessionId) {
          this.isRegular = false;
          this.sessionId = Number(res.sessionId);
          this.configurationId = this.sessionId;
        }
        this.getSessionInWorkflow(this.configurationId, this.sessionType);
      });
    } else this.isEditMode = false;
  }
  /**
   * Method to getSpecialityList
   */
  getSpecialityList() {
    this.lookupService.getSpecialityList().subscribe(res => {
      if (res) this.specialityList = res;
    });
  }
  /**
   * Method to getSessionFrequency
   */
  getSessionFrequency() {
    this.lookupService.getSessionFrequencyList().subscribe(res => {
      if (res) this.sessionFrequencyList = res;
    });
  }
  /**
   * Method to get the selected speciality
   * @param values
   */
  onSpecialitySelect(values) {
    if (values?.speciality === null) {
      this.subspecialityList[values?.index] = new LovList([]);
      this.isSubspeciality = false;
    } else {
      this.subspecialityList[values?.index] = new LovList(values?.speciality?.items);
      this.isSubspeciality = true;
    }
  }

  getSessionInWorkflow(templateId: number, sessionType: string) {
    this.configurationService
      .getIndividualSessionDetails(templateId, sessionType)
      .pipe(
        tap(res => {
          this.configurationDetails = res;
          this.getSessionChannel = this.configurationDetails.sessionChannel;
          this.setSelectedMemberList();
          if (this.configurationDetails?.medicalBoardType?.english === GeneralEnum.PMB) {
            this.isPrimaryMedicalBoard = true;
            this.isAdhocAmb = false;
          } else {
            this.isPrimaryMedicalBoard = false;
            this.isAdhocAmb = true;
          }
        }),
        switchMap(() => {
          return this.getMbDetails();
        }),
        catchError(err => {
          this.handleError(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  handleError(err) {
    this.alertService.showError(err?.error?.message, err?.error?.details);
  }
  setSelectedMemberList() {
    this.configurationDetails?.memberDetails?.forEach(item => {
      const editModeSelectedMembers = {
        contractType: item.memberType,
        doctorName: item.doctorName,
        inviteeId: item?.inviteeId,
        nationalId: item.nationalId,
        speciality: item.speciality,
        contractId: null,
        location: null,
        isAvailable: null,
        mbProfessionalId: null,
        memberType: item.memberType,
        medicalBoardType: null,
        mobileNumber: item.contactNumber,
        subSpeciality: item.subSpeciality,
        nationalIdType: null,
        isUnavailableDr: item.isUnavailableDr,
        professionalId: item.professionalId
      };
      this.selectedMembers.push(editModeSelectedMembers);
      this.originalList = this.selectedMembers.slice(0);
    });
  }
  /**
   * Method of cancel template
   */
  onCancel(template: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(template, config);
  }
  /**
   * Method to hide modal
   */
  decline() {
    this.modalRef?.hide();
  }
  /**
   * method to confirm cancel
   */
  confirmCancel() {
    this.router.navigate([MBConstants.ROUTE_MEDICAL_BOARD_SESSION_DETAILS]);
    this.modalRef?.hide();
  }
  resetPage() {
    this.regularSessionForm.get('medicalForm').reset();
  }
  getSessionData(sessionId: number) {
    this.statusService.getRescheduleSessionData(sessionId).subscribe(res => {
      this.sessionData = res;
      this.sessionType = this.sessionData.sessionType.english;
      if (this.sessionType === MBConstants.ADHOC) {
        this.isRegular = false;
        this.configurationId = this.sessionId;
      } else if (this.sessionService.getTemplateId()) {
        this.isRegular = true;
        this.configurationId = this.sessionService.getTemplateId();
      }
      if (this.configurationId && this.sessionType) {
        this.getSessionInWorkflow(this.configurationId, this.sessionType);
      }
      this.sessionData.startTimeAmOrPm = this.getAMorPM(this.sessionData.startTime);
      this.sessionData.endTimeAmOrPm = this.getAMorPM(this.sessionData.endTime);
      this.sessionData.startTime = this.getTimeFromString(this.sessionData.startTime);
      this.sessionData.endTime = this.getTimeFromString(this.sessionData.endTime);
      if (this.sessionData?.medicalBoardType?.english === GeneralEnum.AMB) this.isAmb = true;
      else this.isAmb = false;
      this.sessionDataLovList = new LovList(
        this.sessionData.mbList.filter(list => list?.contractType?.english !== 'Nurse').map((item, i) => {
            return {
              ...new Lov(),
              value: {
                english: item.name.english ? item.name.english : item.name.arabic,
                arabic: item.name.arabic ? item.name.arabic : item.name.english
              },
              sequence: i + 1,
              code: item.mbProfessionId
            };
          })
      );
      this.sessionGosiDrLovList = new LovList(
        this.sessionData.mbList
          .filter(list => list?.contractType?.english === 'Gosi Doctor')
          .map((item, i) => {
            return {
              ...new Lov(),
              value: {
                english: item.name.english ? item.name.english : item.name.arabic,
                arabic: item.name.arabic ? item.name.arabic : item.name.english
              },
              sequence: i + 1,
              code: item.mbProfessionId
            };
          })
      );
      const notNurse = this.sessionData?.mbList?.filter(val => val?.contractType?.english !== 'Nurse');
      const notNurseList = notNurse.map((val, i) => {
        return {
          value: {
            english: val.name.english ? val.name.english : val.name.arabic,
            arabic: val.name.arabic ? val.name.arabic : val.name.english
          },
          sequence: i + 1,
          code: val?.mbProfessionId
        };
      });
      this.doctorList = new LovList(notNurseList);
      this.sessionDataLovListTemp = { ...this.sessionDataLovList };
    });
  }
  removeMember(value) {
    const selectedpersonIndex = this.sessionData?.mbList.findIndex(data => data.mbProfessionId === value);
    const inviteeId = this.sessionData?.mbList[selectedpersonIndex]?.inviteeId;
    this.removeMedicalMember(this.sessionId, inviteeId, ConfigurationTypeEnum.REMOVE_MEMBER);
    this.sessionData.mbList.splice(selectedpersonIndex, 1);
    this.modalRef?.hide();
    this.getSessionstatusDetails(this.sessionId);
  }
  /**
   * Method to save workflow details.
   * @param data workflow data
   */
  saveWorkflow(data: ContributorBPMRequest): void {
    this.workflowService
      .updateTaskWorkflow(data)
      .pipe(
        tap(() => {
          this.alertService.showSuccessByKey(this.getSuccessMessage(data.outcome));
          this.backToInbox();
        }),
        catchError(err => {
          this.handleError(err);
          return throwError(err);
        })
      )
      .subscribe(noop, noop);
  }
  /** Method to navigate to inbox. */
  backToInbox(): void {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  getSuccessMessage(outcome: string) {
    let messageKey: string;
    switch (outcome) {
      case WorkFlowActions.APPROVE:
        messageKey = 'MEDICAL-BOARD.WORKFLOW-FEEDBACKS.TRANSACTION-APPROVAL-MESSAGE';
        break;
      case WorkFlowActions.SUBMIT:
        messageKey = 'MEDICAL-BOARD.WORKFLOW-FEEDBACKS.TRANSACTION-APPROVAL-MESSAGE';
        break;
      case WorkFlowActions.REJECT:
        messageKey = 'MEDICAL-BOARD.WORKFLOW-FEEDBACKS.TRANSACTION-REJECTION-MESSAGE';
        break;
      case WorkFlowActions.RETURN:
        messageKey = 'MEDICAL-BOARD.WORKFLOW-FEEDBACKS.TRANSACTION-RETURN-MESSAGE';
        break;
      case WorkFlowActions.REQUEST_CLARIFICATION_FROM_CONTRIBUTOR:
      case WorkFlowActions.MODIFY_VISITING_DOCTOR:
        messageKey = 'MEDICAL-BOARD.WORKFLOW-FEEDBACKS.TRANSACTION-APPROVAL-MESSAGE';
        break;
    }
    return messageKey;
  }
  /** Method to set workflow details. */
  setWorkflowData(routerData: RouterData, action: string, comment): ContributorBPMRequest {
    const datas = new ContributorBPMRequest();
    datas.comments = comment;
    datas.taskId = routerData.taskId;
    datas.user = routerData.assigneeId;
    datas.outcome = action;
    return datas;
  }
}
