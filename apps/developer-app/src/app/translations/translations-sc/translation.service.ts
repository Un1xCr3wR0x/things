import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(readonly http: HttpClient) {}
  getTranslationJson(feature: string) {
    const developerAppJsonURL = `assets/i18n/${feature}/en.json`;
    return this.http.get<any>(developerAppJsonURL);
  }
}
