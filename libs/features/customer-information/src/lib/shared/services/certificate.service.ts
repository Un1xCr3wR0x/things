import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CertificateService extends BaseService {
  language: string;

  constructor(readonly http: HttpClient) {
    super();
  }

  getBenefitDetailsCertificate(identifier: number, isArabic: boolean, sections: Array<string>) {
    isArabic ? (this.language = 'ar') : (this.language = 'en');

    const langHeader = new HttpHeaders({ 'Accept-Language': this.language });
    const url = `/api/v1/beneficiary/${identifier}/benefit-amount-certificate?lang=${
      this.language
    }&certSections=${sections.join(',')}`;
    return this.http.get(url, { headers: langHeader });
  }
}
