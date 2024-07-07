import { Component, OnInit, Inject } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bnt-funeral-grant-active-sc',
  templateUrl: './funeral-grant-active-sc.component.html',
  styleUrls: ['./funeral-grant-active-sc.component.scss']
})
export class FuneralGrantActiveScComponent implements OnInit {
  lang = 'en';
  constructor(readonly location: Location, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  onPaymentHistoryTabSelected() {}
  onTransactionTabSelected() {}
  onDocumentTabSelected() {}

  routeBack() {
    this.location.back();
  }
}
