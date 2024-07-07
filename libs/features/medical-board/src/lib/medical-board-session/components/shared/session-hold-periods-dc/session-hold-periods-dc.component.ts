import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { BilingualText, convertToYYYYMMDD, LanguageToken, LovList, startOfDay, RoleIdEnum } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup } from '@angular/forms';
import { IndividualSessionDetails, HoldSessionDetails } from '../../../../shared/models';
import moment from 'moment';
import { MBConstants } from '../../../../shared/constants';
import { GeneralEnum } from '../../../../shared/enums';

@Component({
  selector: 'mb-session-hold-periods-dc',
  templateUrl: './session-hold-periods-dc.component.html',
  styleUrls: ['./session-hold-periods-dc.component.scss']
})
export class SessionHoldPeriodsDcComponent implements OnInit, OnChanges {
  //Local Variables
  lang = 'en';
  modalRef: BsModalRef;
  index: number;
  removeMessage: BilingualText;
  action: string;
  allowedMedicalOfficerRole = [RoleIdEnum.BOARD_OFFICER, RoleIdEnum.APPEAL_MEDICAL_BOARD_OFFICER];
  isDisableHold = false;
  isAmpOffice = false;
  commentsPresent = false;
  canHide: boolean;
  disableholdTime: boolean;
  dateSession: string;
  currentDate = startOfDay(new Date());
  //Input Variables
  @Input() individualSessionDetails: IndividualSessionDetails;
  @Input() holdReasonList: LovList;
  @Input() holdSessionForm: FormGroup = new FormGroup({});

  //Output Variables
  @Output() holdSessionDetails: EventEmitter<HoldSessionDetails> = new EventEmitter();
  @Output() hide: EventEmitter<null> = new EventEmitter();
  @Output() remove: EventEmitter<HoldSessionDetails> = new EventEmitter();
  @Output() open: EventEmitter<{ modal: TemplateRef<HTMLElement>; size: string }> = new EventEmitter();

  @ViewChild('holdSessionModal') holdSessionModal: TemplateRef<HTMLElement>;
  /**
   *
   * @param language
   * @param modalService
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => (this.lang = language));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.individualSessionDetails) {
      this.individualSessionDetails = changes.individualSessionDetails.currentValue;
      this.isAmpOffice = this.individualSessionDetails?.fieldOfficeCode === 0 ? true : false;
      if (
        this.individualSessionDetails.isAmbUser &&
        this.individualSessionDetails?.medicalBoardType?.english === GeneralEnum.AMB &&
        this.isAmpOffice &&
        this.individualSessionDetails.status.english !== 'Stopped'
      )
        this.isDisableHold = false;
      else if (
        !this.individualSessionDetails.isAmbUser &&
        this.individualSessionDetails?.medicalBoardType?.english === GeneralEnum.PMB &&
        !this.isAmpOffice &&
        this.individualSessionDetails.status.english !== 'Stopped'
      )
        this.isDisableHold = false;
      else this.isDisableHold = true;
      this.individualSessionDetails.holdDetails = changes?.individualSessionDetails?.currentValue?.holdDetails;
      this.initializeTheViewDetails();
    }
    this.commentsPresent = false;
    this.individualSessionDetails?.holdDetails?.some(a => {
      if (a.comments !== null) {
        this.commentsPresent = true;
      }
    });

    if (changes && changes.holdSessionForm) this.holdSessionForm = changes.holdSessionForm.currentValue;
  }

  /**
   * Method to open hold session modal
   */
  openHoldSessionModal(template: TemplateRef<HTMLElement>, action: string, size: string) {
    this.open.emit({ modal: template, size: size });
    this.action = action;
  }
  setIndex(i: number) {
    this.index = i;
    if (moment(this.individualSessionDetails?.holdDetails[i].holdEndDate?.gregorian).isBefore(new Date())) {
      this.individualSessionDetails.holdDetails[i].canHold = false;
    } else this.individualSessionDetails.holdDetails[i].canHold = true;
    this.removeMessage = MBConstants.REMOVEHOLD(
      convertToYYYYMMDD(
        moment(this.individualSessionDetails?.holdDetails[i].holdStartDate?.gregorian).toDate().toString()
      ),
      convertToYYYYMMDD(
        moment(this.individualSessionDetails?.holdDetails[i].holdEndDate?.gregorian).toDate().toString()
      )
    );
  }

  /**
   * Method tohide add hold period button based on current date and start date
   */

  initializeTheViewDetails() {
    this.dateSession = convertToYYYYMMDD(
      moment(startOfDay(this.individualSessionDetails?.startDate?.gregorian)).toDate().toString()
    );
    const sessionDate = moment(startOfDay(this.individualSessionDetails?.startDate?.gregorian));
    if (moment(sessionDate).isBefore(this.currentDate)) {
      this.canHide = true;
    } else {
      this.canHide = false;
    }
  }
  showDot(i: number) {
    if (moment(this.individualSessionDetails?.holdDetails[i].holdEndDate?.gregorian).isBefore(new Date())) {
      return true;
    } else {
      return false;
    }
  }

  removeHold() {
    const removeHoldItem: HoldSessionDetails = {
      id: this.individualSessionDetails?.holdDetails[this.index].id,
      comments: '',
      endDate: this.individualSessionDetails?.holdDetails[this.index].holdEndDate,
      holdReason: this.individualSessionDetails?.holdDetails[this.index].holdReason,
      startDate: this.individualSessionDetails?.holdDetails[this.index].holdStartDate
    };
    this.individualSessionDetails?.holdDetails?.splice(this.index, 1);
    this.remove.emit(removeHoldItem);
    this.hideModal();
  }
  holdSession(data: HoldSessionDetails) {
    const formData = new HoldSessionDetails();
    formData.comments = data.comments;
    formData.startDate = data.startDate;
    formData.startDate.gregorian = data.startDate.gregorian;
    formData.endDate = data.endDate;
    formData.endDate.gregorian = data.endDate.gregorian;
    if (this.action === 'modify') formData.id = data.id;
    formData.holdReason = data.holdReason;
    this.holdSessionDetails.emit(formData);
  }

  // Method to hide modal.
  hideModal(): void {
    this.hide.emit();
  }
}
