import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeViolationValidator, ViolationTransaction } from '../../../../shared/models';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'vol-validator-establishment-details-dc',
  templateUrl: './validator-establishment-details-dc.component.html',
  styleUrls: ['./validator-establishment-details-dc.component.scss']
})
export class ValidatorEstablishmentDetailsDcComponent implements OnInit {
  @Input() transactionDetails: ViolationTransaction;
  @Input() isModifyViolation: boolean;
  @Input() isCancelViolation: boolean;
  @Input() violationDetails: ChangeViolationValidator;
  @Input() isRaiseViolationFo: boolean;
  @Input() canEdit: boolean;
  @Output() estProfile: EventEmitter<number> = new EventEmitter();
  @Output() viewPreviousForEstablishmentViolations: EventEmitter<number> = new EventEmitter();
  @Output() onEdit: EventEmitter<null> = new EventEmitter();
  lang: string;

  /**
   * @param router
   */
  constructor(readonly router: Router, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
  }

  /**
   * Method to navigate to establishment profile page
   */
  navigateToProfile(registrationNo) {
    this.estProfile.emit(registrationNo);
  }
  /**Method to view previous violations */
  viewPreviousViolations() {
    this.viewPreviousForEstablishmentViolations.emit();
  }
  onEditClick() {
    this.onEdit.emit();
  }
}
