/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { LanguageToken, BilingualText } from '@gosi-ui/core';
import { Router } from '@angular/router';
import { EstablishmentRoutesEnum } from '../../enums';

/**
 * Component for showing the feedback
 *
 * @export
 * @class FeedbackDcComponent *
 * @implements {OnInit}
 */
@Component({
  selector: 'est-feedback-dc',
  templateUrl: './feedback-dc.component.html',
  styleUrls: ['./feedback-dc.component.scss']
})
export class FeedbackDcComponent implements OnInit {
  lang: string;
  @Input() transactionMessage: BilingualText = null;
  @Input() isProactive = false;
  @Input() editEstablishment = false;

  /**
   * Creates an instance of FeedbackDcComponent
   * @param language
   * @memberof  FeedbackDcComponent
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>, private router: Router) {}

  /**
   * This method handles the initialization tasks.
   *
   * @memberof FeedbackDcComponent
   */
  ngOnInit() {
    this.language.subscribe(language => (this.lang = language));
  }

  navigate() {
    this.router.navigate([EstablishmentRoutesEnum.VERIFY_REG_ESTABLISHMENT]);
  }
}
