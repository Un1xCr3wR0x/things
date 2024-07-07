/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { BilingualText, AlertService } from '@gosi-ui/core';
import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  IterableDiffers,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  ContractedMembers,
  RescheduleSessionData,
  SessionRequest,
  SessionStatusDetails,
  UnAvailableMemberListResponse
} from '../../models';
import { SessionStatusService } from '../../services';
import { GeneralEnum, PersonTypeEnum } from '../../enums';
import { MbRouteConstants } from '../../constants';

@Component({
  selector: 'mb-medical-board-member-table-dc',
  templateUrl: './medical-board-member-table-dc.component.html',
  styleUrls: ['./medical-board-member-table-dc.component.scss']
})
export class MedicalBoardMemberTableDcComponent implements OnInit, OnChanges {
  sessionStatusDetails: SessionStatusDetails = new SessionStatusDetails();
  isAmb: boolean;
  doctorname: BilingualText = new BilingualText();
  modalRef: BsModalRef;
  canAmbRemove: boolean;
  canPmbRemove: boolean;
  message: BilingualText;
  noOfConctractedDr = 0;
  noOfGosiDr = 0;
  dateSession: string;
  contractedMembers: ContractedMembers[];
  sessionRequest: SessionRequest = new SessionRequest();
  index = 0;
  showErrors: boolean;
  totalResponse: number;
  removeMemberMessage: BilingualText = {
    english: 'Are you sure want to remove this Member',
    arabic: 'هل أنت متأكد من إزالة هذا العضو ؟'
  };
  // @Input() canPmbRemove: boolean;
  @Input() sessionData: RescheduleSessionData;
  @Input() unAvailableMemberList: UnAvailableMemberListResponse[];
  @Input() isCompleted = false;
  @Input() isPmbo = false;
  @Output() addMember: EventEmitter<null> = new EventEmitter();
  @Output() addDoctor: EventEmitter<null> = new EventEmitter();
  @Output() removeMember: EventEmitter<number> = new EventEmitter();

  constructor(
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly sessionStatusService: SessionStatusService,
    readonly router: Router,
    private iterableDiffers: IterableDiffers
  ) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.sessionData.currentValue) {
      this.sessionData = changes.sessionData.currentValue;
      this.setData();
    }
  }
  addMembersModal() {}
  onAddContractedMembers() {
    this.addMember.emit();
  }
  onAddGosiDoctors() {
    this.addDoctor.emit();
  }
  onRemoveMember(index) {
    this.sessionData?.mbList.splice(index, 1);
    let unAvailable = false;
    this.sessionData?.mbList.forEach(item => {
      if (item.isUnAvailable) unAvailable = true;
    });
    if (!unAvailable) this.unAvailableMemberList = [];
  }
  navigateToProfile(identificationNo: number) {
    this.router.navigate([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(identificationNo)]);
  }
  setData() {
    //Defect 540463- not able to remove gosi dr and nurse while reschedule session even minimum number member condition satisfies
    // Adhoc session should have a minimum of
    //   PMB - 1 contracted doctor and 1 GOSI doctor  or 2 gosi doctor
    //   AMB - 3 contracted doctors
    // regular session should have a minimum of
    //   PMB - 1 contracted 1 gosi
    //   AMB - 3 contracted doctor
    if (this.sessionData.medicalBoardType.english === GeneralEnum.AMB) this.isAmb = true;
    else this.isAmb = false;
    const noOfGosiDr = this.sessionData?.mbList.filter(
      val => val.contractType?.english === PersonTypeEnum.GosiDoctor
    )?.length;
    const noOfConctractedDr = this.sessionData?.mbList.filter(
      val => val.contractType?.english === PersonTypeEnum.ContractedDoctor
    )?.length;
    if (!this.isAmb) {
      // For Primary Medical Board
      this.sessionData?.mbList.forEach(value => {
        if (value.contractType.english === PersonTypeEnum.Nurse) {
          value.canPmbRemove = true;
        } else if (this.sessionData.sessionType.english === 'Regular') {
          //For Regular Session
          if (value.contractType.english === PersonTypeEnum.ContractedDoctor) {
            if (noOfConctractedDr > 1) {
              value.canPmbRemove = true;
            } else value.canPmbRemove = false;
          } else if (value.contractType.english === PersonTypeEnum.GosiDoctor) {
            if (noOfGosiDr > 1) {
              value.canPmbRemove = true;
            } else value.canPmbRemove = false;
          }
        } else {
          // For AdHoc session
          if (value.contractType.english === PersonTypeEnum.ContractedDoctor) {
            if (noOfConctractedDr > 1 || noOfGosiDr > 1) {
              value.canPmbRemove = true;
            } else value.canPmbRemove = false;
          } else if (value.contractType.english === PersonTypeEnum.GosiDoctor) {
            if ((noOfGosiDr > 2 && noOfConctractedDr === 0) || (noOfGosiDr > 1 && noOfConctractedDr > 0)) {
              value.canPmbRemove = true;
            } else value.canPmbRemove = false;
          }
        }
      });
    } else {
      //Appeal Medical Board
      this.sessionData?.mbList.forEach(value => {
        if (value.contractType.english === PersonTypeEnum.ContractedDoctor) {
          if (noOfConctractedDr > 3) {
            //for Regular Session and Adhoc Session
            value.canAmbRemove = true;
          } else value.canAmbRemove = false;
        } else {
          value.canAmbRemove = true;
        }
      });
    }
  }

  // Method to hide modal.
  hideModal(): void {
    this.sessionRequest = new SessionRequest();
    if (this.modalRef) this.modalRef.hide();
    this.showErrors = false;
  }
  removeMedicalMember(mbProfessionalId) {
    this.removeMember.emit(mbProfessionalId);
    // this.sessionData?.mbList.splice(this.index, 1);
    this.modalRef?.hide();
    this.setData();
  }
  showRemoveModal(index: number, template: TemplateRef<HTMLElement>) {
    this.showModal(template);
  }
  showModal(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  setIndex(index) {
    this.index = index;
  }
  cancelRemoving() {
    this.modalRef?.hide();
  }
}
