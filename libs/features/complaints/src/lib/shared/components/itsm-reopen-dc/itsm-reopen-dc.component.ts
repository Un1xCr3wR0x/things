import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { TransactionSummary } from '../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITSMDetails } from '../../models/itsm-details';
import { BilingualText, LanguageToken, markFormGroupTouched } from '@gosi-ui/core';
import { Location } from '@angular/common';
import { RouterConstants } from '../../constants';
import { TypeSubtypeArEnum, TypeSubtypeEngEnum } from '../../enums/itsm-type-subtype';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gosi-ui-itsm-reopen-dc',
  templateUrl: './itsm-reopen-dc.component.html',
  styleUrls: ['./itsm-reopen-dc.component.scss']
})
export class ItsmReopenDcComponent implements OnInit {
  /**
   * local variables
   */
  raiseItsmForm: FormGroup;
  backPath: string;
  lang = 'en';
  category: BilingualText = new BilingualText();
  typeBil: BilingualText = new BilingualText();
  subtypeBil: BilingualText = new BilingualText();

  @Input() transactionSummary: TransactionSummary;
  @Input() itsmDetails: ITSMDetails;

  @Output() onSubmit1: EventEmitter<any> = new EventEmitter();
  @Output() onBackToITSM1: EventEmitter<any> = new EventEmitter();

  constructor(readonly fb: FormBuilder,
    readonly location: Location,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>) { }

  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.itsmDetails) {
      this.itsmDetails = changes.itsmDetails.currentValue;
      if(this.itsmDetails) {
        if (this.itsmDetails.category) {
          if (this.itsmDetails.category == 'Enquiry') {
            this.backPath = RouterConstants.ROUTE_VALIDATOR_ENQUIRY;
          }
          else if(this.itsmDetails.category == 'Complaint') {
            this.backPath = RouterConstants.ROUTE_VALIDATOR_COMPLAINT;
          }
          else if(this.itsmDetails.category == 'Suggestion') {
            this.backPath = RouterConstants.ROUTE_VALIDATOR_SUGGESTION;
          }
          else if(this.itsmDetails.category == 'Plea') {
            this.backPath = RouterConstants.ROUTE_VALIDATOR_PLEA;
          }
        }
        switch (this.itsmDetails.category) {
          case TypeSubtypeEngEnum.Complaint:
            this.category.english = TypeSubtypeEngEnum.Complaint,
              this.category.arabic = TypeSubtypeArEnum.Complaint
            break;
          case TypeSubtypeEngEnum.Suggestion:
            this.category.english = TypeSubtypeEngEnum.Suggestion,
              this.category.arabic = TypeSubtypeArEnum.Suggestion
            break;
          case TypeSubtypeEngEnum.Appeal:
            this.category.english = TypeSubtypeEngEnum.Appeal,
              this.category.arabic = TypeSubtypeArEnum.Appeal
            break;
          case TypeSubtypeEngEnum.Plea:
            this.category.english = TypeSubtypeEngEnum.Plea,
              this.category.arabic = TypeSubtypeArEnum.Plea
            break;
          case TypeSubtypeEngEnum.Enquiry:
            this.category.english = TypeSubtypeEngEnum.Enquiry,
              this.category.arabic = TypeSubtypeArEnum.Enquiry
            break;
        }
      }
      this.raiseItsmForm = this.createRaiseItsmForm();
      this.bindToForm();
    }
    if (changes && changes.transactionSummary) this.transactionSummary = changes.transactionSummary.currentValue;
  }

  bindToForm() {
    if (this.itsmDetails) {
      switch (this.itsmDetails.type) {
        case TypeSubtypeEngEnum.AmeenBenefits:
          this.typeBil.arabic = TypeSubtypeArEnum.AmeenBenefits,
            this.typeBil.english = TypeSubtypeEngEnum.AmeenBenefits
          break;
        case TypeSubtypeEngEnum.AmeenCRM:
          this.typeBil.arabic = TypeSubtypeArEnum.AmeenCRM,
            this.typeBil.english = TypeSubtypeEngEnum.AmeenCRM
          break;
        case TypeSubtypeEngEnum.AmeenContributionCollection:
          this.typeBil.arabic = TypeSubtypeArEnum.AmeenContributionCollection,
            this.typeBil.english = TypeSubtypeEngEnum.AmeenContributionCollection
          break;
        case TypeSubtypeEngEnum.AmeenContributors:
          this.typeBil.arabic = TypeSubtypeArEnum.AmeenContributors,
            this.typeBil.english = TypeSubtypeEngEnum.AmeenContributors
          break;
        case TypeSubtypeEngEnum.AmeenCore:
          this.typeBil.arabic = TypeSubtypeArEnum.AmeenCore,
            this.typeBil.english = TypeSubtypeEngEnum.AmeenCore
          break;
        case TypeSubtypeEngEnum.AmeenEstablishments:
          this.typeBil.arabic = TypeSubtypeArEnum.AmeenEstablishments,
            this.typeBil.english = TypeSubtypeEngEnum.AmeenEstablishments
          break;
        case TypeSubtypeEngEnum.AmeenOH:
          this.typeBil.arabic = TypeSubtypeArEnum.AmeenOH,
            this.typeBil.english = TypeSubtypeEngEnum.AmeenOH
          break;
        case TypeSubtypeEngEnum.AmeenViolations:
          this.typeBil.arabic = TypeSubtypeArEnum.AmeenViolations,
            this.typeBil.english = TypeSubtypeEngEnum.AmeenViolations
          break;
        case TypeSubtypeEngEnum.AmeenVoluntaryContributors:
          this.typeBil.arabic = TypeSubtypeArEnum.AmeenVoluntaryContributors,
            this.typeBil.english = TypeSubtypeEngEnum.AmeenVoluntaryContributors
          break;
      }
      switch (this.itsmDetails.subType) {
        case TypeSubtypeEngEnum.Establishments:
          this.subtypeBil.arabic = TypeSubtypeArEnum.Establishments,
            this.subtypeBil.english = TypeSubtypeEngEnum.Establishments
          break;
        case TypeSubtypeEngEnum.Contract:
          this.subtypeBil.arabic = TypeSubtypeArEnum.Contract,
            this.subtypeBil.english = TypeSubtypeEngEnum.Contract
          break;
        case TypeSubtypeEngEnum.Contributors:
          this.subtypeBil.arabic = TypeSubtypeArEnum.Contributors,
            this.subtypeBil.english = TypeSubtypeEngEnum.Contributors
          break;
        case TypeSubtypeEngEnum.OccupationHazards:
          this.subtypeBil.arabic = TypeSubtypeArEnum.OccupationHazards,
            this.subtypeBil.english = TypeSubtypeEngEnum.OccupationHazards
          break;
        case TypeSubtypeEngEnum.CRM:
          this.subtypeBil.arabic = TypeSubtypeArEnum.CRM,
            this.subtypeBil.english = TypeSubtypeEngEnum.CRM
          break;
        case TypeSubtypeEngEnum.Coreservices:
          this.subtypeBil.arabic = TypeSubtypeArEnum.Coreservices,
            this.subtypeBil.english = TypeSubtypeEngEnum.Coreservices
          break;
        case TypeSubtypeEngEnum.Violations:
          this.subtypeBil.arabic = TypeSubtypeArEnum.Violations,
            this.subtypeBil.english = TypeSubtypeEngEnum.Violations
          break;
        case TypeSubtypeEngEnum.Heirssupport:
          this.subtypeBil.arabic = TypeSubtypeArEnum.Heirssupport,
            this.subtypeBil.english = TypeSubtypeEngEnum.Heirssupport
          break;
        case TypeSubtypeEngEnum.BeneficiariesSupport:
          this.subtypeBil.arabic = TypeSubtypeArEnum.BeneficiariesSupport,
            this.subtypeBil.english = TypeSubtypeEngEnum.BeneficiariesSupport
          break;
      }
      this.raiseItsmForm.get('itsmtype').get('english').setValue(this.typeBil.english);
      this.raiseItsmForm.get('itsmtype').get('arabic').setValue(this.typeBil.arabic);
      this.raiseItsmForm.get('itsmtype').get('english').updateValueAndValidity();
      this.raiseItsmForm.get('itsmtype').get('arabic').updateValueAndValidity();
      this.raiseItsmForm.get('itsmsubtype').get('english').setValue(this.subtypeBil.english);
      this.raiseItsmForm.get('itsmsubtype').get('arabic').setValue(this.subtypeBil.arabic);
      this.raiseItsmForm.updateValueAndValidity();
      this.raiseItsmForm.get('note').setValue(this.itsmDetails.notes);
      this.raiseItsmForm.updateValueAndValidity();
    }
  }
  /**
  *  Method to create itsm form
  * */
  createRaiseItsmForm(): FormGroup {
    return this.fb.group({
      // reason: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      note: [null, { validators: Validators.compose([Validators.required, Validators.maxLength(1200)]) }],
      itsmtype: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      itsmsubtype: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      additionalNote: [null]
    });
  }

  onSubmit() {
    if (this.raiseItsmForm.valid) {
      this.onSubmit1.emit(this.raiseItsmForm);
    }
    else {
      markFormGroupTouched(this.raiseItsmForm);
    }
  }

  onCancel() {
    this.location.back();
  }

  onBack() {
    this.onBackToITSM1.emit();
  }
}
