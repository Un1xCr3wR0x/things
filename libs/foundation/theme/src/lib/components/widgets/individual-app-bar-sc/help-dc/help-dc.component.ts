import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AppConstants, ApplicationTypeEnum, LanguageEnum, RouterConstants } from '@gosi-ui/core';
import { Router } from '@angular/router';

@Component({
  selector: 'gosi-help-dc',
  templateUrl: './help-dc.component.html',
  styleUrls: ['./help-dc.component.scss']
})
export class IndividualHelpDcComponent implements OnInit, OnChanges {
  @Input() selectedLang: LanguageEnum;
  @Input() selectedApp: ApplicationTypeEnum;
  @Input() isAppIndividual = false;
  @Output() navigateContactUs: EventEmitter<null> = new EventEmitter();
  helpUrl: string;
  constructor(readonly router: Router) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.selectedLang?.currentValue) {
      this.selectedLang = changes.selectedLang.currentValue;
    }
    this.helpUrl =
      this.selectedApp === ApplicationTypeEnum.PUBLIC
        ? this.selectedLang === LanguageEnum.ENGLISH
          ? AppConstants.HELP_PUBLIC_EN_URL
          : AppConstants.HELP_PUBLIC_AR_URL
        : AppConstants.HELP_PRIVATE_URL;
  }
  navigateToContactUs() {
    this.navigateContactUs.emit();
  }
}
