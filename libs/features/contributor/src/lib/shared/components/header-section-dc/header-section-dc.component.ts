/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cnt-header-section-dc',
  templateUrl: './header-section-dc.component.html',
  styleUrls: ['./header-section-dc.component.scss']
})
export class HeaderSectionDcComponent implements OnInit {
  /** Local Variables */
  currentLang = 'en';

  /** Input Variables. */
  @Input() heading: string;
  @Input() showBackButton = true;

  /** Output Variables. */
  @Output() goBack: EventEmitter<null> = new EventEmitter();

  /** Creates an instance of HeaderSectionDcComponent. */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  /** Method to initialize the component. */
  ngOnInit() {
    this.language.subscribe(lang => (this.currentLang = lang));
  }

  /** Method to navigate back. */
  navigateBack() {
    this.goBack.emit();
  }
}
