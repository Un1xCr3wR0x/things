/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IdentityTypeEnum,
  LanguageToken,
  LovList,
  markFormGroupTouched,
  RoleIdEnum,
  BilingualText
} from '@gosi-ui/core';
import moment from 'moment-timezone';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContributorConstants } from '../../../../shared/constants';
import { EngagementType } from '../../../../shared/enums';
import { Contributor, DropDownItems, EngagementDetails, Establishment } from '../../../../shared/models';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'cnt-engagement-details-dc',
  templateUrl: './engagement-details-dc.component.html',
  styleUrls: ['./engagement-details-dc.component.scss']
})
export class EngagementDetailsDcComponent implements OnInit, OnChanges {
  /** Local variables. */
  engagementDetailsForm: FormGroup;
  descriptionContent;
  modalRef: BsModalRef;
  minDateGreg: Date;
  maxDateGreg: Date;
  currentDate: string;
  engagementStatus: string;
  /** Constants */
  ENGAGEMENT_INACTIVE = ContributorConstants.ENGAGEMENT_INACTIVE_STATUS;
  ENGAGEMENT_ACTIVE = ContributorConstants.ENGAGEMENT_ACTIVE_STATUS;
  ENGAGEMENT_CANCELLED = ContributorConstants.ENGAGEMENT_CANCELLED_STATUS;
  CANCEL_IN_PROGRESS = ContributorConstants.CANCEL_ENGAGEMENT_PROGRESS_STATUS;
  addContractAccessRoles = [RoleIdEnum.CSR, RoleIdEnum.GCC_CSR];
  private fb: FormBuilder = new FormBuilder();
  /** Input  variables. */
  @Input() index: number;
  @Input() isOpenInitially: boolean;
  @Input() engagement: EngagementDetails;
  @Input() contributorData: Contributor;
  @Input() actionList: DropDownItems[];
  @Input() establishment: Establishment;
  @Input() isUnifiedProfile: boolean;
  @Input() leavingReason: LovList;
  @Input() engagementType: string;
  @Input() lang: string;
  @Input() newEngagementDate: any;
  @Input() engagementLeavingReason: BilingualText = new BilingualText();
  @Input() engagementDetails: EngagementDetails;
  /** Output variables. */
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() save: EventEmitter<Object> = new EventEmitter();
  /** Creates an instancce of EngagementAccordianViewDcComponent. */
  constructor(
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    private modalService: BsModalService,
    readonly activatedRoute: ActivatedRoute,
    readonly datePipe: DatePipe
  ) {}

  /** Method to initialize the commponent. */
  ngOnInit(): void {
    if (this.newEngagementDate) {
      this.engagementDetailsForm.get('engagementDate').get('gregorian').patchValue(this.newEngagementDate);
      this.engagementDetailsForm.get('leavingReason').patchValue(this.engagementLeavingReason);
    } else {
      this.engagementDetailsForm = this.createEngagementDetailsForm();
    }
    this.setEngagementStatus();
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      if (params)
        if (params.EngagementType == 'LeavingDate') {
          this.minDateGreg = new Date(params.joiningDate);
          this.maxDateGreg = new Date(params.leavingDate);
        } else if (params.EngagementType == 'Terminateengagement') {
          this.minDateGreg = new Date(params.joiningDate);
          this.maxDateGreg = new Date(this.currentDate);
        } else if (params.EngagementType == 'JoiningDate') {
          if (params.leavingDate) {
            this.minDateGreg = this.subtractMonths(new Date(params.joiningDate), 24);
            this.maxDateGreg = new Date(params.leavingDate);
          } else {
            this.minDateGreg = this.subtractMonths(new Date(params.joiningDate), 24);
            this.maxDateGreg = new Date(this.currentDate);
          }
        }
    });
  }

  /** Method for subtracting months to a date */
  subtractMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() - months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  /** Method to create Adjustment Details Form */
  createEngagementDetailsForm() {
    return this.fb.group({
      engagementDate: this.fb.group({
        gregorian: [null, { validators: this.engagementType !== 'Cancelengagement' ? Validators.required : null }],
        hijiri: [null]
      }),
      description: this.fb.group({
        english: [
          'I hereby acknowledge that all the information provided are correct and valid. I also acknowledge of the penalties provided by the GOSI laws for the incorrect and invalidity of the information given. In addition to the provided penalties in other schemes with which been approved under the two articles(6,5) of Anti-Forgery Law that is subject to imprison to a period of five years and a financial penalty of ten thousand S.R. for any proved fraudulent or false and acknowledged as true.',
          { validators: Validators.required }
        ],
        arabic: [
          'أقر وأتعهد بصحة المعلومات المقدمة، مقراً بعلمي بالعقوبات المنصوص عليها في نظام التأمينات الاجتماعية المترتبة على ثبوت عدم صحة هذه المعلومات، بالإضافة إلى العقوبات المنصوص عليها في الأنظمة الأخرى والتي من ضمنها ما تم إقراره بموجب المادتين (6،5) من نظام مكافحة التزوير من السجن بسنة إلى خمس سنوات وغرامة مالية من ألف إلى عشرة آلاف ريال لكل من اثبت وقائع أو أقوال كاذبة على أنها وقائع صحيحة ومعترف بها',
          { validators: Validators.required }
        ]
      }),
      checkBoxFlag: [null, { validators: Validators.requiredTrue }],
      leavingReason: this.fb.group({
        english: [null, { validators: this.engagementType === 'Terminateengagement' ? Validators.required : null }],
        arabic: [null, { validators: this.engagementType === 'Terminateengagement' ? Validators.required : null }]
      })
    });
  }
  /** Method to detect changes in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.engagementType && changes.engagementType.currentValue) {
      this.engagementType = changes.engagementType.currentValue;
      this.engagementDetailsForm = this.createEngagementDetailsForm();
    }
    if (changes && changes.lang && changes.lang.currentValue) {
      this.lang = changes.lang.currentValue;
    }
    if (changes && changes.engagementDetails && changes.engagementDetails.currentValue) {
      this.engagementDetails = changes.engagementDetails.currentValue;
      this.setEngagementStatus();
    }
  }
  /**
   * Method to set engagement status.
   */
  setEngagementStatus() {
    if (
      this.engagementDetails?.status === 'LIVE' ||
      this.engagementDetails?.status === 'TERMINATION_IN_PROGRESS' ||
      this.engagementDetails?.status === 'CANCEL_IN_PROGRESS'
    ) {
      this.engagementStatus = 'Active';
    } else {
      this.engagementStatus = 'Inactive';
    }
  }
  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.cancel.emit();
  }
  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }
  /** Method to save payment details. */
  saveAndNext() {
    markFormGroupTouched(this.engagementDetailsForm);
    if (this.engagementDetailsForm.valid) this.save.emit(this.engagementDetailsForm);
    this.engagementDetailsForm.patchValue({
      engagementDate: this.engagementDetailsForm.value.engagementDate.gregorian
    });
  }
}
