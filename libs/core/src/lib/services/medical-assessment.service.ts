import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable,forkJoin,of } from 'rxjs';
import { MedicalAssessment, BilingualText, DocumentItem } from '../models';
import { ApplicationTypeEnum } from '../enums';
import { ApplicationTypeToken } from '../tokens';
import { switchMap,catchError,map} from 'rxjs/operators'
import { DocumentService } from './document.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalAssessmentService {
  fromMb = false;
  constructor(private http: HttpClient,readonly documentService: DocumentService, @Inject(ApplicationTypeToken) readonly appToken: string) {}

  /** Method to get inivitation details. */
  getAssessmentDetails(identifier?): Observable<MedicalAssessment[]> {
    const url = `/api/v1/participant/${identifier}/participant-invitation-details`;
    return this.http.get<MedicalAssessment[]>(url);
  }
  /** Method to get the invitation details */

  acceptAssessmentInvite(sessionId: number, inviteId: number): Observable<BilingualText> {
    const url = `/api/v1/mb-session/${sessionId}/invite/${inviteId}/accept-invitation`;
    return this.http.put<BilingualText>(url, []);
  }

  acceptAssessmentRescheduleInvite(sessionId: number, inviteId: number): Observable<BilingualText> {
    let url = '';
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      url = `/api/v1/mb-session/${sessionId}/invite/${inviteId}/reschedule-participant?loginType=Reschedule,P`;
    } else {
      url = `/api/v1/mb-session/${sessionId}/invite/${inviteId}/reschedule-participant`;
    }
    return this.http.put<BilingualText>(url, []);
  }
  public set isFromMb(fromMb){
    this.fromMb = fromMb
  }
  public get isFromMb(){
    return this.fromMb
  }
  /** To get all documents in a medical board request */
  getMedicalBoardDocuments(identifier:number, disabilityAssessmentId: number) {
    let params = new HttpParams();
    const url =`/api/v1/participant/${identifier}/assessment/${disabilityAssessmentId}/scanned-documents`
    return this.http
      .get<DocumentItem[]>(url, { params })
      .pipe(
        switchMap(res => {
          return forkJoin(
            res.map(document => {
              if (document?.id) {
                return this.documentService.getDocumentContent(document?.id)
                  .pipe(
                    map(documentResponse => {
                      return this.documentService.setContentToDocument(document, documentResponse);
                    })
                  )
                  .pipe(catchError(errr => of(errr)));
              } else {
                return of(document);
              }
            })
          ).pipe(catchError(error => of(error)));
        })
      )
      .pipe(catchError(err => of(err)));
  }
}
