import { Component, Inject, OnInit } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { TranslationService } from './translation.service';
@Component({
  selector: 'dev-translations-sc',
  templateUrl: './translations-sc.component.html',
  styleUrls: ['./translations-sc.component.scss']
})
export class TranslationsScComponent implements OnInit {
  //Local variables
  features = [];
  keys: string[] = [];
  constructor(
    private translate: TranslateService,
    private translationService: TranslationService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}
  englishValues = [];
  arabicValues = [];
  ngOnInit(): void {
    this.features = [
      'billing',
      'contributor',
      'core',
      'dashboard',
      'establishment',
      'form-fragments',
      'inbox',
      'customer-information',
      'occupational-hazard',
      'theme',
      'ui'
    ];

    this.features.sort();
  }
  /**
   * This method is to get the translations and display it in a table
   * @param name
   */
  selectedItem(name) {
    const feature = name.target.value;
    this.translationService.getTranslationJson(feature).subscribe(res => {
      this.keys = [];
      Object.keys(res).forEach(key => {
        const valueObj = res[key];
        if (typeof valueObj === 'object') {
          Object.keys(valueObj).forEach(subKey => {
            this.keys.push(`${String(feature).toUpperCase()}.${key}.${subKey}`);
          });
        } else {
          this.keys.push(`${String(feature).toUpperCase()}.${key}`);
        }
      });

      this.keys.sort();

      this.translate.use('en');
      this.translate.get(this.keys).subscribe(enResult => {
        this.englishValues = enResult;
      });
      this.translate.use('ar');
      this.translate.get(this.keys).subscribe(arResult => {
        this.arabicValues = arResult;
      });
    });
  }
}
