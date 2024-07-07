import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService, LanguageToken, StartupService } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cntr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'contract-app';
  constructor(
    readonly activatedRoute: ActivatedRoute,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly storageService: StorageService,
    readonly startupService: StartupService
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
