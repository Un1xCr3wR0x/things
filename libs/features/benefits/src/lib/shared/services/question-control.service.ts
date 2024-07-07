/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';
import { EventResponseDto, HeirEvent, RequestEventType } from '../models/questions';
import { GosiCalendar, convertToYYYYMMDD, BilingualText } from '@gosi-ui/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';
import { map, catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { EventAddedFrom } from '../enum/events';
import { ActionType } from '@gosi-ui/features/benefits/lib/shared';

@Injectable({
  providedIn: 'root'
})
export class QuestionControlService {
  constructor(private http: HttpClient) {}

  getEventsFromApi(
    personId: number,
    sin: number,
    effectiveStartDate?: GosiCalendar,
    effectiveEndDate?: GosiCalendar,
    benefitType?: string,
    modifyHeir = false,
    eligibilityStartDate?: GosiCalendar
  ): Observable<EventResponseDto> {
    const url = `/api/v1/beneficiary/${personId}/benefit/${sin}/event`;

    let params = new HttpParams();
    if (benefitType) {
      params = params.set('benefitType', benefitType);
    }
    if (effectiveStartDate) {
      params = params.set(
        'effectiveStartDate',
        convertToYYYYMMDD(moment(effectiveStartDate.gregorian).toDate().toString())
      );
    }
    if (eligibilityStartDate) {
      params = params.set(
        'eligibilityDate',
        convertToYYYYMMDD(moment(eligibilityStartDate.gregorian).toDate().toString())
      );
    }
    if (effectiveEndDate) {
      params = params.set(
        'effectiveEndDate',
        convertToYYYYMMDD(moment(effectiveEndDate.gregorian).toDate().toString())
      );
    }
    params = params.set('modifyHeir', modifyHeir.toString());

    return this.http.get<EventResponseDto>(url, { params });
    //   .pipe(
    //   tap(resp => {
    //     Object.keys(resp).forEach(key=>{
    //       resp[key].map(event=>{
    //         event.eventOrigin = EventAddedFrom.API;
    //         event.actionType = ActionType.ADD;
    //         return resp;
    //       })
    //     })
    //   })
    // );
  }

  // getExistingEvents(
  //   personId: number,
  //   effectiveStartDate: GosiCalendar,
  //   effectiveEndDate: GosiCalendar = { gregorian: new Date() },
  //   benefitType?: string
  // ): Observable<HeirEvent[]>{
  //   const url = `/api/v1/beneficiary/${personId}/benefit/events`;
  //   let params = new HttpParams();
  //   if (benefitType) {
  //     params = params.set('benefitType', benefitType);
  //   }
  //   if (effectiveStartDate) {
  //     params = params.set(
  //       'effectiveStartDate',
  //       convertToYYYYMMDD(moment(effectiveStartDate.gregorian).toDate().toString())
  //     );
  //   }
  //   params = params.set('effectiveEndDate', convertToYYYYMMDD(moment(effectiveEndDate.gregorian).toDate().toString()));
  //   return this.http.get<HeirEvent[]>(url, { params });
  // }
  // getExistingEvents(personId: number): Observable<HeirEvent[]>{
  //   const url = `../../../assets/data/existing-events.json`;
  //     return this.http.get<HeirEvent[]>(url);
  //   }

  getEventTypes(getEventTypesParmas: RequestEventType, eligibleForPensionReform = false): Observable<BilingualText[]> {
    const url = `/api/v1/contributor/${getEventTypesParmas.sin}/heir/${getEventTypesParmas.heirPersonId}/event-types`;
    let params = new HttpParams();
    if (getEventTypesParmas.maritalStatus)
      params = params.set('maritalStatus', getEventTypesParmas.maritalStatus.english);
    if (getEventTypesParmas.missingDate)
      params = params.set(
        'missingDate',
        convertToYYYYMMDD(moment(getEventTypesParmas.missingDate?.gregorian).toDate().toString())
      );
    params = params.set(
      'requestDate',
      convertToYYYYMMDD(moment(getEventTypesParmas.requestDate?.gregorian).toDate().toString())
    );
    // params = params.set('personId', getEventTypesParmas.personId.toString());
    params = params.set('relationship', getEventTypesParmas.relationship.english);
    if (getEventTypesParmas?.deathDate) {
      params = params.append(
        'deathDate',
        convertToYYYYMMDD(moment(getEventTypesParmas.deathDate?.gregorian).toDate().toString())
      );
    }
    if (getEventTypesParmas.modifyHeir) {
      params = params.set('modifyHeir', 'true');
    }
    if (eligibleForPensionReform) {
      params = params.set('pensionReform', 'true');
    }
    return this.http.get<BilingualText[]>(url, { params });
  }

  getEventTypesForDependent(getEventTypesParmas: RequestEventType): Observable<BilingualText[]> {
    const url = `/api/v1/contributor/${getEventTypesParmas.sin}/dependent/${getEventTypesParmas.heirPersonId}/event-types`;
    let params = new HttpParams();
    if (getEventTypesParmas.maritalStatus)
      params = params.set('maritalStatus', getEventTypesParmas.maritalStatus.english);
    params = params.set(
      'requestDate',
      convertToYYYYMMDD(moment(getEventTypesParmas.requestDate?.gregorian).toDate().toString())
    );
    params = params.set('relationship', getEventTypesParmas.relationship.english);
    params = params.set(
      'benefitStartDate',
      convertToYYYYMMDD(moment(getEventTypesParmas.benefitStartDate?.gregorian).toDate().toString())
    );
    params = params.set(
      'benefitEligibilityDate',
      convertToYYYYMMDD(moment(getEventTypesParmas.benefitEligibilityDate?.gregorian).toDate().toString())
    );
    return this.http.get<BilingualText[]>(url, { params });
  }
}
