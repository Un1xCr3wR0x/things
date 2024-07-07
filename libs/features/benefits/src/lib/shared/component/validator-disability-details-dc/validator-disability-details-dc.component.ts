import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { YesOrNo } from '../../enum';
import { AnnuityResponseDto } from '../../models';

@Component({
  selector: 'bnt-validator-disability-details-dc',
  templateUrl: './validator-disability-details-dc.component.html',
  styleUrls: ['./validator-disability-details-dc.component.scss']
})
export class ValidatorDisabilityDetailsDcComponent implements OnInit {
  constructor() {}
  @Input() annuityBenefitDetails: AnnuityResponseDto;
  @Output() injurySelected: EventEmitter<number> = new EventEmitter();
  yesNo = YesOrNo;
  ngOnInit(): void {}

  viewInjuryDetails(injury: number) {
    this.injurySelected.emit(injury);
  }
}
