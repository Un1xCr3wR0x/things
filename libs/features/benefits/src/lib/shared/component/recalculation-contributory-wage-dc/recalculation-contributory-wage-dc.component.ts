/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bnt-recalculation-contributory-wage-dc',
  templateUrl: './recalculation-contributory-wage-dc.component.html',
  styleUrls: ['./recalculation-contributory-wage-dc.component.scss']
})
export class RecalculationContributoryWageDcComponent implements OnInit {
  lang = 'en';
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
}
