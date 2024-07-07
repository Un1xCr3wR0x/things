/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { BaseComponent, LanguageToken, AppConstants } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gosi-footer-dc',
  templateUrl: './footer-dc.component.html',
  styleUrls: ['./footer-dc.component.scss']
})
export class FooterDcComponent extends BaseComponent implements OnInit {
  systemYear: number;
  bodyHeight: number;
  scrollHeight: number;
  scroll = false;
  termsOfUseUrl: string;
  privacyPolicyUrl: string;
  /**
   * Creates an instance of FooterComponent
   * @memberof  FooterDcComponent
   *
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }
  ngOnInit() {
    this.language.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.termsOfUseUrl = AppConstants.TERMS_OF_USE_URL.replace('{lang}', lang);
      this.privacyPolicyUrl = AppConstants.PRIVACY_POLICY_URL.replace('{lang}', lang);
    });
    this.systemYear = new Date().getFullYear();
  }

  @HostListener('window:scroll', ['$event'])
  onscroll() {
    this.bodyHeight = document.getElementsByTagName('body')[0].offsetHeight;
    this.scrollHeight = document.documentElement.scrollHeight;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.scroll = true;
    } else this.scroll = false;
  }
}
