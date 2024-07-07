import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventDate } from '../models';
import { BilingualText } from '@gosi-ui/core';
import { TransactionOutcome } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class EventDateService {
  constructor(readonly http: HttpClient) {}

  /**
   * Method to get event date details.
   * @param approvalStatus Approval Status
   */
  getEventDetails(): Observable<EventDate> {
    const eventDetails = `/api/v1/contribution-event-date?approvalStatus=PENDING_APPROVAL`;
    return this.http.get<EventDate>(eventDetails);
  }
  /**
   * Service to approve the transaction.
   * @param formData workflow details
   */
  approveEventDate(formData, outcomeValue) {
    const approveEventDate = `/api/process-manager/v1/taskservice/update`;

    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${formData.user}`
      })
    };

    const payload = {
      taskId: formData.taskId,
      outcome: outcomeValue
    };

    return this.http.post<BilingualText>(approveEventDate, payload, httpOptions);
  }

  /**
   * Service to return the transaction.
   * @param formData workflow details
   */
  returnEventDate(formData) {
    const returnEventDate = `/api/process-manager/v1/taskservice/update`;

    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${formData.user}`
      })
    };

    const payload = {
      taskId: formData.taskId,
      outcome: TransactionOutcome.RETURN
    };

    return this.http.post<BilingualText>(returnEventDate, payload, httpOptions);
  }
  /**
   * Service to return the transaction.
   * @param formData workflow details
   */
  rejectEventDate(formData) {
    const returnEventDate = `/api/process-manager/v1/taskservice/update`;

    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${formData.user}`
      })
    };

    const payload = {
      taskId: formData.taskId,
      outcome: TransactionOutcome.REJECT
    };

    return this.http.post<BilingualText>(returnEventDate, payload, httpOptions);
  }

  getEventDetailsByApprovalStatus(approvalStatus) {
    const eventDetailsByStatus = `/api/v1/contribution-event-date?approvalStatus=${approvalStatus}`;
    return this.http.get(eventDetailsByStatus);
  }

  getEventDetailsByDate(fromYear?: number, fromMonth?: number, toYear?: number, toMonth?: number, status?: string) {
    let eventDetailsByYear = `/api/v1/contribution-event-date?`;
    eventDetailsByYear = fromYear && fromYear !== 0 ? eventDetailsByYear + `fromYear=${fromYear}` : eventDetailsByYear;
    eventDetailsByYear =
      fromMonth && fromMonth !== 0 ? eventDetailsByYear + `&fromMonth=${fromMonth}` : eventDetailsByYear;
    eventDetailsByYear = toYear && toYear !== 0 ? eventDetailsByYear + `&toYear=${toYear}` : eventDetailsByYear;
    eventDetailsByYear = toMonth && toMonth !== 0 ? eventDetailsByYear + `&toMonth=${toMonth}` : eventDetailsByYear;
    if (status) eventDetailsByYear = eventDetailsByYear + `&approvalStatus=${status}`;
    return this.http.get<EventDate>(eventDetailsByYear);
  }

  submitEventDetails(value) {
    const submitEventDateUrl = `/api/v1/contribution-event-date`;
    return this.http.post(submitEventDateUrl, value);
  }

  modifyEventDetails(updatedvalue) {
    const editEventDateUrl = `/api/v1/contribution-event-date`;
    return this.http.put(editEventDateUrl, updatedvalue);
  }
}
