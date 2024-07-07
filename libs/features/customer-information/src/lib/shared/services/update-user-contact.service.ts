import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EstablishmentSearchResponse } from '@gosi-ui/foundation-dashboard/lib/admin-dashboard/models';
import { noop,Observable,pipe } from 'rxjs';
import { ContactEstablishmentResponse, GetContactResponse, PersonContact, UpdateEmailRequest, UpdateMobileRequest, VerifyContactRequest } from '../models/person-contact';
import { AlertService } from '@gosi-ui/core';
import { catchError, switchMap, } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserContactService {
  baseUrl = '/api/v1';

  contactList: PersonContact[] = [];
  constructor(readonly http: HttpClient, private alertService: AlertService) {}

  verifyUpdateMobileOtp(personId: string, contactId: string, mobileNo: string, isdCode: string, mobileOtp: string , mobileUuid:string) {
    let url = `${this.baseUrl}/person/${personId}/contacts/${contactId}?contact-type=BUSINESS`;
    let body = {
      "mobileNo": mobileNo,
      "isdCodePrimary": isdCode,
    }
    const headers = new HttpHeaders({
      'x-mobile-otp': `${mobileUuid}:${mobileOtp}`
    })
    let options = {
      headers: headers
    }
    return this.http.put(url, body, options);
  }

  verifyUpdateEmailOtp(personId: string, contactId: string, email: string, emailOtp: string, emailUuid:string) {
    let url = `${this.baseUrl}/person/${personId}/contacts/${contactId}?contact-type=BUSINESS`;
    let body = {
      "email":email
    }
    const headers = new HttpHeaders({
      'x-email-otp': `${emailUuid}:${emailOtp}`
    })
    let options = {
      headers: headers
    }
    return this.http.put(url, body, options);
  }

  updateMobileNo(personId: string, contactId: string, mobile:string, isdCode:string) {
    let url = `${this.baseUrl}/person/${personId}/contacts/${contactId}`;
    let body = {
        "mobileNo": mobile,
        "isdCodePrimary": isdCode,
      }
    return this.http.put(url,body);
  }

  updateEmail(personId: string, contactId: string, email:string) {
    let url = `${this.baseUrl}/person/${personId}/contacts/${contactId}`;
    let body = {
        "email": email,
      }
    return this.http.put(url,body);
  }

  deleteContact(personId: string, contactId: string) {
    let url = `${this.baseUrl}/person/${personId}/contacts/${contactId}?contact-type=BUSINESS`;
    return this.http.delete(url).pipe(
      catchError(error => {
        this.alertService.showError(error.error.message);
        throw error;
      })
    )
  }
  getContactList(personId: string): Observable<GetContactResponse> {
    let url = `${this.baseUrl}/person/${personId}/contacts?contact-type=BUSINESS`;
    return this.http.get<GetContactResponse>(url);
  }

  getContactEstablishment(personId: string, contactId: string): Observable<ContactEstablishmentResponse> {
    let url = `${this.baseUrl}/admin/${personId}/contacts/${contactId}?contact-type=BUSINESS`;
    return this.http.get<ContactEstablishmentResponse>(url);
  }

  linkContactToEstablishment(personId: string, contactId: number, registrationNoList: string[]) {
    let url = `${this.baseUrl}/admin/${personId}/contacts/${contactId}?contact-type=BUSINESS`;
    return this.http.post(url, { registrationNoList: registrationNoList });
  }

  modifyContactToEstablishment(personId: string, contactId: number, registrationNoList: string[]) {
    let url = `${this.baseUrl}/admin/${personId}/contacts/${contactId}?contact-type=BUSINESS`;
    return this.http.put(url, { registrationNoList: registrationNoList });
  }

  getNoOfEstablishments(personId: string): Observable<EstablishmentSearchResponse> {
    let establishmentlistUrl = `${this.baseUrl}/admin/${personId}/dashboard`;
    return this.http.get<EstablishmentSearchResponse>(establishmentlistUrl, { headers: { ignoreLoadingBar: '' } })
      .pipe(
        switchMap(res => {
          establishmentlistUrl += `?page.pageNo=0&page.size=${res.totalRecords}`;
          return this.http.get<EstablishmentSearchResponse>(establishmentlistUrl, { headers: { ignoreLoadingBar: '' } });
        })
      )
  }
  getEstablishmentList(url: string): Observable<EstablishmentSearchResponse> {
    return this.http.get<EstablishmentSearchResponse>(url, { headers: { ignoreLoadingBar: '' } });
  }

  addMobileNo(personId: string, mobile: string, isdCode: string) {
    let url = `${this.baseUrl}/person/${personId}/contacts?contact-type=BUSINESS`;
    let body = {
      "mobileNo": mobile,
      "isdCodePrimary": isdCode
    }
    return this.http.post(url, body);
  }

  verifyMobileNo(personId: string, otp: number, mobile: string, isdCode: string, mobileUuid: string) {
    let url = `${this.baseUrl}/person/${personId}/contacts?contact-type=BUSINESS`;
    const headers = new HttpHeaders({
      'x-mobile-otp': `${mobileUuid}:${otp}`
    });
    let body = {
      "mobileNo": mobile,
      "isdCodePrimary": isdCode
    }
    let options = {
      headers: headers
    };
    return this.http.post(url, body, options);
  }

  addEmail(personId: string, email: string, mobileUuid: string, mobileOpt: number) {
    let url = `${this.baseUrl}/person/${personId}/contacts?contact-type=BUSINESS`;
    const headers = new HttpHeaders({
      'x-mobile-otp': `${mobileUuid}:${mobileOpt}`
    });
    let body = {
      "email": email,
    }
    let options = {
      headers: headers
    };
    return this.http.post(url, body, options);
  }

  verifyEmail(personId: string, mobileOpt: number, mobile: string,
    isdCodePrimary: string, mobileUuid: string, emailOtp: number, email: string, emailUuid: string) {
    let url = `${this.baseUrl}/person/${personId}/contacts?contact-type=BUSINESS`;
    const headers = new HttpHeaders({
      'x-mobile-otp': `${mobileUuid}:${mobileOpt}`,
      "x-email-otp": `${emailUuid}:${emailOtp}`
    })

    let options = {
      headers: headers
    }

    let body = {
      "email": email,
      "mobileNo": mobile,
      "isdCodePrimary": isdCodePrimary
    }
    return this.http.post(url, body, options);
  }

  resendOTP(uuid: string) {
    const otpUrl = `/api/v1/otp/resend`;
    return this.http.post(otpUrl, { uuid: uuid });
  }
}
