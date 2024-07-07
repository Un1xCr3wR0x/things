import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'css-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'customer-survey';
  constructor(
    readonly activatedRoute: ActivatedRoute,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly storageService: StorageService
  ) {
    this.getDefaultLang();
  }
  /** Method to set language by quer param locale */
  getDefaultLang() {
    this.activatedRoute.queryParams.subscribe(defaultLang => {
      if (defaultLang.locale) {
        this.language.next(defaultLang.locale.toLowerCase());
        this.storageService.setLocalValue('lang', defaultLang.locale.toLowerCase());
      }
    });
  }
}
