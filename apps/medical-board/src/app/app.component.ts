import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {StorageService, LanguageToken, LoginService} from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'medical-board',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'medical-board';
  constructor(
    readonly activatedRoute: ActivatedRoute,
    @Inject(LanguageToken) private language: BehaviorSubject<string>,
    readonly storageService: StorageService,
    readonly loginService: LoginService
  ) {
    // this.getDefaultLang();
  }
  ngOnInit() {
    // this.loginService.checkLoginStatus();
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
