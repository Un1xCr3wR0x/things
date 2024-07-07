import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LovList } from '@gosi-ui/core';
import { InspectionChannel, ViolationsEnum } from '../../../../shared/enums';
import { ChangeViolationValidator, ViolationTransaction } from '../../../../shared/models';

@Component({
  selector: 'vol-validator-violations-details-dc',
  templateUrl: './validator-violations-details-dc.component.html',
  styleUrls: ['./validator-violations-details-dc.component.scss']
})
export class ValidatorViolationsDetailsDcComponent implements OnInit, OnChanges {
  constructor(private fb: FormBuilder) {}
  payeeListForm: FormGroup;
  amount = 2000;
  violationsForm: FormGroup;
  channelRased = InspectionChannel.RASED;
  channelSimis = InspectionChannel.SIMIS;
  channelE_Inspection = InspectionChannel.E_INSPECTION;

  @Input() isCancelViolation: boolean;
  @Input() isCancelEngagement: boolean;
  @Input() isModifyTerminationDate: boolean;
  @Input() isModifyViolation: boolean;
  @Input() isModifyJoiningDate: boolean;
  @Input() isaddEngagement: boolean;
  @Input() isIncorrectWage: boolean;
  @Input() isIncorrectReason: boolean;
  @Input() transactionDetails: ViolationTransaction;
  @Input() parentForm: FormGroup;
  @Input() booleanList: LovList;
  @Input() assigneeIndex: number;
  @Input() isReturn: boolean;
  @Input() assigneeId: string;
  @Input() violationDetails: ChangeViolationValidator;
  @Input() isRaiseViolationFo: boolean;
  @Input() isViolatingProvision: boolean;
  @Input() isRaiseVioFoVcm: boolean = false;
  @Input() isViolatingProvisions: boolean;
  @Input() isInjuryViolation: boolean;

  @Output() profileNavigation: EventEmitter<number> = new EventEmitter();
  @Output() navigateToTrasaction: EventEmitter<number> = new EventEmitter();

  ngOnInit(): void {
    this.violationsForm = this.createViolationsForm();
    if (this.parentForm) {
      this.parentForm.addControl('violations', this.violationsForm);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.booleanList) this.booleanList = changes.booleanList.currentValue;
    if (changes && changes.transactionDetails) {
      this.transactionDetails = changes.transactionDetails.currentValue;
      this.assigneeIndex = this.transactionDetails?.penaltyInfo.findIndex(res => res.memberId === this.assigneeId);
    }
    if (this.assigneeIndex >= 0 && this.booleanList && this.violationsForm) {
      if (this.transactionDetails.penaltyInfo[this.assigneeIndex]?.establishmentProactiveAction === true) {
        this.violationsForm.get('correction')?.get('english')?.setValue(ViolationsEnum.BOOLEAN_YES);
      } else if (this.transactionDetails.penaltyInfo[this.assigneeIndex]?.establishmentProactiveAction === false) {
        this.violationsForm.get('correction')?.get('english')?.setValue(ViolationsEnum.BOOLEAN_NO);
      }
      this.violationsForm.get('correction').updateValueAndValidity();
    }
  }

  /**
   * This method is used to initialise the form template
   */
  createViolationsForm() {
    return this.fb.group({
      correction: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  violationHappened() {
    if (this.parentForm) this.parentForm.addControl('violations', this.violationsForm);
  }
  /**
   * MEthod to check if correction happened
   * @param correction
   */
  correctionHappened() {
    if (this.parentForm) this.parentForm.addControl('violations', this.violationsForm);
  }
  /**
   * Method to get the violation type
   */
  getViolationType() {
    if (this.transactionDetails) {
      const type = this.transactionDetails.repeatedViolation;
      if (!type) {
        return 'VIOLATIONS.NO';
      } else {
        return 'VIOLATIONS.YES';
      }
    }
  }
}
