import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, BilingualText, LanguageToken, LovList } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import {
  AddMemberFilterRequest,
  AddParticipantsList,
  BulkParticipants,
  IndividualSessionDetails,
  MBConstants,
  ParticipantsDetails,
  SessionRequest,
  DropDownItems,
  ParticipantSpeciality,
  SessionStatusService
} from '../../../shared';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ThirdPartyContributionShare } from '@gosi-ui/features/collection/billing/lib/shared/models/thirdParty-contribution-share';

@Component({
  selector: 'mb-participant-details-dc',
  templateUrl: './participant-details-dc.component.html',
  styleUrls: ['./participant-details-dc.component.scss']
})
export class ParticipantDetailsDcComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;

  ParticipantcheckForm: FormArray = new FormArray([]);
  selectcheckbox = 0;
  lang = 'en';
  paginationId = 'participantsList';
  @Input() participantsInQueue: ParticipantsDetails;
  @Input() selectedMembers: ParticipantsDetails;

  @Input() itemsPerPage: number;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  bsModalRef: BsModalRef;
  modalRef: BsModalRef;
  //@Output() selectPageEvent: EventEmitter<number> = new EventEmitter();
  @Output() checkparticipantSelected: EventEmitter<{ selected: true; data }> = new EventEmitter<{
    selected: true;
    data;
  }>();
  @ViewChild('cancelTemplate', { static: true })
  cancelTemplate: TemplateRef<HTMLElement>;
  //heading
  @Input() locationLists: LovList;
  @Input() assessmentTypeLists: LovList;
  @Input() specialtyLists: LovList;
  @Output() searchParticipants: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() filterMembers: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() filter: EventEmitter<AddMemberFilterRequest> = new EventEmitter();
  @Output() participantSpecialityEmit = new EventEmitter<ParticipantSpeciality>();
  @Output() onSpecialityClicked = new EventEmitter<string>();
  actionDropDown: DropDownItems[];
  configurationDetails: IndividualSessionDetails;
  selectParticipants: AddParticipantsList[] = [];
  @Input() checkboxSelected = false;
  primarySpeciality: BilingualText[] = [];
  //@Input() secondarySpeciality: BilingualText[] = [];
  sessionRequest: SessionRequest = new SessionRequest();
  participantSpeciality: ParticipantSpeciality = new ParticipantSpeciality();
  bulkParticipants: BulkParticipants[] = [];
  isSearched = false;
  @Input() searchParams = '';
  @Input() index = 0;
  count = 0;
  isDisabled = true;
  specialityArray: BilingualText[] = [];
  subspecialityArray = [];
  memberContractId: number;
  @Input() id: string;
  @Input() currentPage: number;
  @Input() pageSize: number;
  @Input() totalItems: number;
  @Input() isPmb = false;
  @Input() fieldLocationList:LovList;
  cancelButton = false;

  constructor(
    readonly fb: FormBuilder,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly bsModalService: BsModalService,
    readonly sessionStatusService: SessionStatusService,
    readonly alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes?.checkboxSelected) {
      this.checkboxSelected = changes?.checkboxSelected?.currentValue;
    }
    if (changes && changes?.participantsInQueue) {
      this.participantsInQueue = changes?.participantsInQueue?.currentValue;
      for (let participant = 0; participant < this.participantsInQueue?.count; participant++) {
        this.ParticipantcheckForm.push(this.createCheckboxForm());
      }
    }
    /* this.specialityArray.forEach((val, h) => {
      if (val?.contractId === this.memberContractId)  this.specialityArray.splice(h, 1);
    });*/
  }
  createCheckboxForm() {
    return this.fb.group({
      checkBoxFlag: [false]
    });
  }
  appendSelectedspecialities(primarySpeciality: BilingualText[]) {
    this.primarySpeciality.push(...primarySpeciality);
  }

  selectMember(value, participant: AddParticipantsList, i) {
    // this.index = this.participantsInQueue?.participantsList.findIndex(participantItem => participantItem.identityNumber = participant.identityNumber);
    this.index = i;
    if (value === 'true') {
      const bulkParticipant: BulkParticipants = {
        participantId: participant?.participantId,
        assessmentType: participant?.assessmentType,
        noOfDaysInQueue: participant?.noOfDaysInQueue,
        mobileNumber: participant?.mobileNumber,
        identityNumber: participant?.identityNumber,
        location: participant?.location
      };
      this.bulkParticipants.push(bulkParticipant);
      this.selectParticipants.push(participant);
      this.ParticipantcheckForm.controls[this.pageSize * (this.currentPage - 1) + this.index]
        .get('flag')
        ?.setValue(true);
      this.count++;

      if (participant?.specialityId) {
        this.participantSpeciality.specialitynumber.push(participant?.specialityId);
      }
      if (participant?.subSpecialityId) {
        this.participantSpeciality.subSpecialitynumber.push(participant?.subSpecialityId);
      }
      if (participant?.primarySpecialty) {
        this.participantSpeciality.primarySpeciality.push(...participant?.primarySpecialty);
      }
      if (participant?.fieldOffice) {
        this.participantSpeciality.fieloffice.push(participant.fieldOffice);
      }
      if (participant?.noOfDaysInQueue) {
        this.participantSpeciality.noOfDaysInQueueparticipant.push(participant?.noOfDaysInQueue);
      }
      if (participant?.assessmentType) {
        this.participantSpeciality.assessmentType.push(participant?.assessmentType);
      }
      if (participant?.identityNumber) {
        this.participantSpeciality.identityNumber.push(participant?.identityNumber);
      }
      if (participant?.location) {
        this.participantSpeciality.location.push(participant?.location);
      }
      if (participant?.mobileNumber) {
        this.participantSpeciality.mobileNumber.push(participant?.mobileNumber);
      }
      if (participant?.mbAssessmentRequestId) {
        this.participantSpeciality.participantId.push(participant?.mbAssessmentRequestId);
      }
      if (participant?.name) {
        this.participantSpeciality.name.push(participant?.name);
      }
      if (this.participantSpeciality.specialitynumber && this.participantSpeciality.specialitynumber.length > 0) {
        this.participantSpeciality.specialitynumber.forEach(() => {});
      }
      if (this.count >= 1) this.isDisabled = false;
      this.getCancelEnable();
    } else {
      this.ParticipantcheckForm.controls[this.pageSize * (this.currentPage - 1) + this.index]
        .get('flag')
        ?.setValue(false);
      this.count--;
      if (this.count === 0) this.isDisabled = true;
      // to remove selected from list
      this.bulkParticipants?.forEach((val, k) => {
        if (val?.identityNumber === participant?.identityNumber) this.bulkParticipants?.splice(k, 1);
      });
      this.getCancelEnable();
    }
  }
  getCancelEnable() {
    const occAssessment = ['Occupational Disability','Occupational Disability Reassessment','Non-Occupational Disability Reassessment','Heir Disability Reassessment','Dependent Disability Reassessment'];
    this.cancelButton = this.bulkParticipants.some(data=>occAssessment.includes(data.assessmentType.english));
  }
  onCheckboxSelected(selected: boolean) {
    this.checkboxSelected = selected;
  }
  onSearchMember(value: string) {
    if (value && (value.length >= 3 || value === null)) {
      this.searchParticipants.emit(value);
      this.isSearched = true;
      this.searchParams = value;
    }
  }
  onSearchEnable(key: string) {
    if (!key && this.isSearched) {
      this.isSearched = false;
      this.searchParams = key;
      this.searchParticipants.emit(key);
    }
  }
  onResetSearch() {
    this.searchParticipants.emit(null);
  }
  onFilter(filterValue: AddMemberFilterRequest) {
    this.filter.emit(filterValue);
  }
  /*selectPage(page: number) {
    this.selectPageEvent.emit(page);
  }*/
  unCheckAll() {
    this.count = 0;
    this.ParticipantcheckForm.reset();
    if (this.participantsInQueue)
      for (let participant = 0; participant < this.participantsInQueue?.count; participant++) {
        this.ParticipantcheckForm.push(this.createCheckboxForm());
      }
  }
  onSpecialty(speciality: string) {
    this.onSpecialityClicked.emit(speciality.split('=')[0]);
  }
  getAssessmentType(assessmentType: BilingualText): BilingualText {
    let type: BilingualText = new BilingualText();
    if (assessmentType && assessmentType?.english?.includes('Reassessment')) {
      type = { english: assessmentType?.english?.split('Reassessment')[0], arabic: assessmentType?.arabic };
    } else if (assessmentType) {
      type = assessmentType;
    }
    return type;
  }
  /**Method to handle tasks when component is destroyed*/
  ngOnDestroy(): void {
    this.unCheckAll();
  }
  showModal(template: TemplateRef<HTMLElement>, size: string = 'md', ignoreBackdrop: boolean = false): void {
    if (template) {
      this.bsModalRef = this.bsModalService.show(
        template,
        Object.assign({}, { class: 'modal-' + size, ignoreBackdropClick: ignoreBackdrop })
      );
    }
  }
  hideModal(): void {
    this.bsModalRef?.hide();
  }
  confirmCancel() {
    this.sessionStatusService.cancelParticipantQueue(this.bulkParticipants).subscribe(
      res => {
        this.alertService.showSuccess(res);
      },
      err => {
        this.alertService.showError(err?.error?.message);
      }
    );
    this.modalRef?.hide();
    this.hideModal();
  }
  cancel(TemplateRef: TemplateRef<HTMLElement>) {
    this.showModal(TemplateRef, 'md');
  }
  assignToSeesion() {
    const statedata = {
      bulkParticipants: this.bulkParticipants
    };
    const adhocdata = {
      participantSpeciality: this.selectParticipants
    };
    if (!this.isDisabled) {
      this.participantSpecialityEmit.emit(this.participantSpeciality);
      this.router.navigate([MBConstants.ROUTE_ASSIGN_SESSION], { state: { statedata, adhocdata } });
    }
  }
  createNewSession() {
    const adhocdata = {
      participantSpeciality: this.selectParticipants
    };
    this.router.navigate([MBConstants.ROUTE_ADHOC_SESSION_DETAILS], { state: { adhocdata } });
  }
}
