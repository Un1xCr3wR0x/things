import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BilingualText, LovList } from '@gosi-ui/core';
import { DisabiliyDtoList } from '@gosi-ui/features/medical-board';
@Component({
  selector: 'oh-early-disability-details-dc',
  templateUrl: './early-disability-details-dc.component.html',
  styleUrls: ['./early-disability-details-dc.component.scss']
})
export class EarlyDisabilityDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Input Variables
   */
  @Input() earlyDisabilityForm: FormGroup = new FormGroup({});
  @Input() parentForm: FormGroup;
  @Input() isReturn: boolean;
  @Input() disabilityDetails: DisabiliyDtoList;
  @Input() reasonList: LovList;
  /*
   *Local Variables
   */
  disabilityMaxLength = 1500;
  constructor(readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.toPatchValues();
    this.earlyDisabilityForm = this.createEarlyDisabilityForm();
    if (this.parentForm) {
      this.parentForm.addControl('earlyDisabilityForm', this.earlyDisabilityForm);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.disabilityDetails) this.toPatchValues();
  }
  toPatchValues() {
    if (this.disabilityDetails) {
      this.earlyDisabilityForm.get('disabilityDescription').patchValue(this.disabilityDetails.descriptionEarly);
      this.earlyDisabilityForm.get('earlyReason').get('english').patchValue(this.disabilityDetails.reasonEarly.english);
      this.earlyDisabilityForm.get('earlyReason').get('arabic').patchValue(this.disabilityDetails.reasonEarly.arabic);
      this.earlyDisabilityForm.get('specificComments').patchValue(this.disabilityDetails?.commentsEarly);
    }
  }
  onSelect(selectedReason: BilingualText) {
    if (selectedReason.english === 'Other') {
      this.earlyDisabilityForm.get('specificComments').setValidators([Validators.required]);
      this.earlyDisabilityForm.get('specificComments').updateValueAndValidity();
    } else if (selectedReason.english !== 'Others') {
      this.earlyDisabilityForm.get('specificComments').clearValidators();
      this.earlyDisabilityForm.get('specificComments').updateValueAndValidity();
    }
    if (this.earlyDisabilityForm.get('earlyReason').get('english').valueChanges) {
      this.earlyDisabilityForm.get('specificComments').reset();
    }
  }
  onChange(nullValue) {
    if (nullValue === undefined || this.earlyDisabilityForm.get('earlyReason')?.value?.english === null) {
      this.earlyDisabilityForm.get('specificComments').reset();
      this.earlyDisabilityForm.get('specificComments').clearValidators();
      this.earlyDisabilityForm.get('specificComments').updateValueAndValidity();
    }
  }
  createEarlyDisabilityForm() {
    return this.fb.group({
      earlyReason: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      disabilityDescription: [null, Validators.required],
      specificComments: [null]
    });
  }
}
