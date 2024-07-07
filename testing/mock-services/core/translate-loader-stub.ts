import { TranslateLoader } from '@ngx-translate/core';

import { Observable } from 'rxjs';

let translations: any = { CARDS_TITLE: 'This is a test' };
let translationsAr: any = { CARDS_TITLE: 'This is a test' };

export class TranslateLoaderStub implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    if (lang === 'ar') return new Observable(translationsAr);
    return new Observable(translations);
  }
}
