/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Inject } from '@angular/core';
import { BranchList } from '../../models';
import { establishmentStatus } from '../../enums/establishment-status';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'est-branch-list-dc',
  templateUrl: './branch-list-dc.component.html',
  styleUrls: ['./branch-list-dc.component.scss']
})
export class BranchListDcComponent implements OnInit {
  /**
   * Local variables
   */
  establishmentStatus = establishmentStatus;
  lang = 'en';
  rotatedeg = 90;
  textdir = 'right';

  /**
   * Input variables
   */
  @Input() establishmentbranchList: BranchList[] = [];

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
      if (this.lang === 'ar') {
        this.rotatedeg = 270;
        this.textdir = 'left';
      } else {
        this.rotatedeg = 90;
        this.textdir = 'right';
      }
    });
  }
}
