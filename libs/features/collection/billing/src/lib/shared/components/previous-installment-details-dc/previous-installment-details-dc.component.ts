import { Component, Inject, Input, OnInit } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { PreviousInstallment } from '../../../shared/models';

@Component({
  selector: 'blg-previous-installment-details-dc',
  templateUrl: './previous-installment-details-dc.component.html',
  styleUrls: ['./previous-installment-details-dc.component.scss']
})
export class PreviousInstallmentDetailsDcComponent implements OnInit {
  @Input() previousInstallment: PreviousInstallment[];
  lang = 'en';

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
  }
}
