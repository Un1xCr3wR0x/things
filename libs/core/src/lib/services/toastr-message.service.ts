import { Injectable, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { BilingualText } from '../models';
import { LanguageToken } from '../tokens';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * This service to manage toastr service
 */
export class ToastrMessageService {
  //local variable
  private lang: string;
  /**
   * This method is initiate ToastrMessageService class
   * @param toastrService
   * @param translate
   */
  constructor(
    private toastrService: ToastrService,
    private translate: TranslateService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }

  /**
   * This method is to create toast with bilingual text as input
   * @param message
   */
  show(message: BilingualText) {
    this.toastrService.show(this.lang === 'en' ? message.english : message.arabic, null, {
      positionClass: 'toast-top-full-width',
      closeButton: true
    });
  }

  /**
   * This method is to create toast with bilingual text as input
   * @param message
   */
  showSuccess(message: BilingualText) {
    this.toastrService.success(this.lang === 'en' ? message.english : message.arabic, null, {
      positionClass: 'toast-top-full-width',
      closeButton: true
    });
  }

  /**
   * This method is to create toast with translation key and param(optional)
   * @param key
   * @param param
   */
  showByKey(key: string, param?, isError = false) {
    this.translate.get(key, param).subscribe((message: string) => {
      isError
        ? this.toastrService.error(message, null, {
            positionClass: 'toast-top-full-width',
            closeButton: true
          })
        : this.toastrService.success(message, null, {
            positionClass: 'toast-top-full-width',
            closeButton: true
          });
    });
  }
}
