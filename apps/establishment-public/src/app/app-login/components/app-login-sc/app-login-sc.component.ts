import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageToken, RouterConstantsBase, StorageKeyEnum, StorageService } from '@gosi-ui/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'est-app-login-sc',
  templateUrl: './app-login-sc.component.html',
  styleUrls: ['./app-login-sc.component.scss']
})
export class AppLoginScComponent implements OnInit {
  loginForm: FormGroup;
  selectedLang = 'en';

  constructor(
    private formBuilder: FormBuilder,
    readonly router: Router,
    readonly storageService: StorageService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
    this.language.subscribe(lang => (this.selectedLang = lang));
    if (this.storageService.getLocalValue('lang')) {
      this.selectedLang = this.storageService.getLocalValue('lang');
    }
    this.changeLang(this.selectedLang);
  }

  /**
   * Method to create login form
   */
  createLoginForm(): FormGroup {
    return this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required]
      },
      { updateOn: 'blur' }
    );
  }

  doLogin() {
    this.storageService.setLocalValue(StorageKeyEnum.IS_MOBILE_APP, 'yes');
    window.location.href =
      'https://login.gosi.gov.sa/oauth2/rest/authorize?response_type=token&client_id=PublicEstablishment&domain=PublicDomain&scope=PublicRServer.read&redirect=https://ameen.gosi.gov.sa/establishment-public/oauth2/callback';
  }

  changeLang(lang: string) {
    const html: Element = document.querySelector('html');
    if (lang === 'en') {
      this.translate.use('en');
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
    } else {
      this.translate.use('ar');
      html.setAttribute('lang', 'ar');
      html.setAttribute('dir', 'rtl');
    }
    this.selectedLang = lang;
    this.language.next(lang);
    this.storageService.setLocalValue('lang', lang);
  }
}
