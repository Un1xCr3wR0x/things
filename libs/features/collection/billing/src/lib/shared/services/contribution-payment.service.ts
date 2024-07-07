/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BilingualText, LovList, Lov, BPMUpdateRequest } from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionOutcome } from '../enums';
import { PaymentDetails, PaymentResponse, UpdatePayment, CancelReceiptPayload, WorkFlowStatus } from '../models';
import { BillingConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ContributionPaymentService {
  /** Properties to be used across modules. */
  private _receiptNumber: number; //Used in cancel receipt
  private _registrationNumber: number; // used in cancel receipt

  constructor(readonly http: HttpClient) {}

  /** Method to get receiptNumber. */
  get receiptNumber() {
    return this._receiptNumber;
  }

  /** Method to set receiptNumber. */
  set receiptNumber(receiptNumber: number) {
    this._receiptNumber = receiptNumber;
  }

  /** Method to get registrationNumber. */
  get registrationNumber() {
    return this._registrationNumber;
  }

  /** Method to set registrationNumer. */
  set registrationNumber(registrationNumber: number) {
    this._registrationNumber = registrationNumber;
  }

  /**
   * Method to save payment details.
   * @param registrationNumber registration number
   * @param paymentDetails payment details
   * @param isMOF MOF flag
   */
  savePaymentDetails(
    registrationNumber: number,
    paymentDetails: PaymentDetails,
    isMOF: boolean,
    isGovPayment: boolean,
    referenceNo: number
  ): Observable<PaymentResponse> {
    const savePayment = !isMOF
      ? `/api/v1/establishment/${registrationNumber}/payment`
      : `/api/v1/paying-establishment/${registrationNumber}/payment`;
    if (isGovPayment && referenceNo) {
      paymentDetails.uploadReferenceNo = referenceNo;
    }
    return this.http.post<PaymentResponse>(savePayment, paymentDetails);
  }

  /**
   * Method to submit payment details.
   * @param registrationNumber registartion number
   * @param receiptNo receipt number
   * @param updatePayload update payload
   * @param isMOF MOF flag
   */
  submitPaymentDetails(
    registrationNumber: number,
    receiptNo: number,
    updatePayload: UpdatePayment,
    isMOF: boolean,
    isGovPayment: boolean,
    referenceNo: number
  ): Observable<PaymentResponse> {
    let submitPayment = !isMOF
      ? `/api/v1/establishment/${registrationNumber}/payment/${receiptNo}`
      : `/api/v1/paying-establishment/${registrationNumber}/payment/${receiptNo}`;
    if (isGovPayment && referenceNo) {
      submitPayment += `?uploadReferenceNo=${referenceNo}`;
    }
    return this.http.patch<PaymentResponse>(submitPayment, updatePayload);
  }

  /**
   * Methiod to cancel the payment.
   * @param registrationNumber registartion number
   * @param receiptNo receipt number
   */
  cancelPayment(registrationNumber: number, receiptNo: number, payload: CancelReceiptPayload, isEditMode: boolean) {
    let cancelPayment = `/api/v1/establishment/${registrationNumber}/payment/${receiptNo}`;
    if (isEditMode) cancelPayment += `/cancellation-request`;
    else cancelPayment += `/cancel`;
    return this.http.put<PaymentResponse>(cancelPayment, payload);
  }

  /**
   * Method to update payment details.
   * @param registrationNumber registartion number
   * @param receiptNo receipt number
   * @param paymentDetails payment details
   * @param isMOF MOF flag
   */
  updatePayment(
    registrationNumber: number,
    receiptNo: number,
    paymentDetails: PaymentDetails,
    isMOF: boolean
  ): Observable<number> {
    const updatePayment = !isMOF
      ? `/api/v1/establishment/${registrationNumber}/payment/${receiptNo}`
      : `/api/v1/paying-establishment/${registrationNumber}/payment/${receiptNo}`;
    return this.http.put<PaymentResponse>(updatePayment, paymentDetails).pipe(map(res => Number(res.parentReceiptNo)));
  }

  /**
   * Method to get receipt details.
   * @param registrationNo registration number
   * @param receiptNo receipt number
   * @param isMOF MOF flag
   * @param isChildReceipt isChildReceipt
   */
  getReceiptDetails(
    registrationNo: number,
    receiptNo: number,
    isMOF: boolean,
    receiptType: string
  ): Observable<PaymentDetails> {
    const receiptDetails = !isMOF
      ? `/api/v1/establishment/${registrationNo}/payment/${receiptNo}?receiptType=${receiptType}`
      : `/api/v1/paying-establishment/${registrationNo}/payment/${receiptNo}`;
    return this.http.get<PaymentDetails>(receiptDetails);
  }

  /**
   * Method to submit paymet details after workflow edit.
   * @param taskId task d of transaction
   * @param workflowUser user
   */
  submitAfterEdit(taskId: string, workflowUser: string) {
    const submitPayment = `/api/process-manager/v1/taskservice/update`;

    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${workflowUser}`
      })
    };

    const payload = {
      taskId: taskId,
      outcome: TransactionOutcome.UPDATE
    };

    return this.http.post<BilingualText>(submitPayment, payload, httpOptions);
  }

  /**
   * Method to revert payment details on cancel.
   * @param registrationNo registration number
   * @param receiptNo receipt number
   */
  revertPaymentDetails(registrationNo: number, receiptNo: number, isMOF: Boolean): Observable<number> {
    const revertPayment = isMOF
      ? `/api/v1/paying-establishment/${registrationNo}/payment/${receiptNo}/revert`
      : `/api/v1/establishment/${registrationNo}/payment/${receiptNo}/revert`;
    return this.http.put<number>(revertPayment, null);
  }

  /**
   * Service to approve the transaction.
   * @param formData workflow details
   */
  approvePayment(formData) {
    const approvePayment = `/api/process-manager/v1/taskservice/update`;

    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${formData.user}`
      })
    };

    const payload = {
      taskId: formData.taskId,
      outcome: TransactionOutcome.APPROVE
    };

    return this.http.post<BilingualText>(approvePayment, payload, httpOptions);
  }

  /**
   * Service to reject the transaction.
   * @param formData workflow details
   */
  rejectPayment(formData) {
    const rejectPayment = `/api/process-manager/v1/taskservice/update`;

    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${formData.user}`
      })
    };

    const payload = {
      taskId: formData.taskId,
      outcome: TransactionOutcome.REJECT
    };

    return this.http.post<BilingualText>(rejectPayment, payload, httpOptions);
  }

  /**
   * Service to return the transaction.
   * @param formData workflow details
   */
  returnPayment(formData) {
    const returnPayment = `/api/process-manager/v1/taskservice/update`;

    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${formData.user}`
      })
    };

    const payload = {
      taskId: formData.taskId,
      outcome: TransactionOutcome.RETURN
    };

    return this.http.post<BilingualText>(returnPayment, payload, httpOptions);
  }

  /** Method to handle workflow actions. */
  handleWorkflowActions(data: BPMUpdateRequest) {
    const url = `/api/process-manager/v1/taskservice/update`;
    const httpOptions = {
      headers: new HttpHeaders({
        workflowUser: `${data.user}`
      })
    };

    const payload = {
      taskId: data.taskId,
      outcome: data.outcome
    };
    return this.http.post<BilingualText>(url, payload, httpOptions);
  }

  /**
   * Method to sort Lovlist.
   * @param lovList lov list
   * @param isBank bank identifier
   * @param lang language
   */
  sortLovList(lovList: LovList, isBank: boolean, lang: string) {
    let other: Lov;
    let otherExcludedList: Lov[];
    if (isBank) {
      other = lovList.items.filter(item => BillingConstants.OTHER_LIST.indexOf(item.value.english) !== -1)[0];
      otherExcludedList = lovList.items.filter(item => BillingConstants.OTHER_LIST.indexOf(item.value.english) === -1);
      lovList.items = this.sortItems(otherExcludedList, isBank, lang);
      lovList.items.push(other);
    } else {
      lovList.items = this.sortItems(lovList.items, isBank, lang);
    }
    return { ...lovList };
  }

  /**
   * Method to sort items.
   * @param list list
   * @param isBank bank identifier
   * @param lang language
   */
  sortItems(list: Lov[], isBank: boolean, lang: string) {
    if (isBank) {
      if (lang === 'en') {
        list.sort((a, b) => {
          if (a.value.english !== 'Riyad Bank' && b.value.english !== 'Riyad Bank') {
            return a.value.english
              .toLowerCase()
              .replace(/\s/g, '')
              .localeCompare(b.value.english.toLowerCase().replace(/\s/g, ''));
          }
        });
      } else {
        list.sort((a, b) => {
          if (a.value.english !== 'Riyad Bank' && b.value.english !== 'Riyad Bank') {
            return a.value.arabic.localeCompare(b.value.arabic);
          }
        });
      }
    } else {
      if (lang === 'en') {
        list.sort((a, b) =>
          a.value.english
            .toLowerCase()
            .replace(/\s/g, '')
            .localeCompare(b.value.english.toLowerCase().replace(/\s/g, ''))
        );
      } else {
        list.sort((a, b) => a.value.arabic.localeCompare(b.value.arabic));
      }
    }
    return list;
  }
  /**
   * Method to cancel payment details on cancel.
   * @param registrationNo registration number
   * @param receiptNo receipt number
   */
  cancelPaymentDetails(
    registrationNo: number,
    receiptNo: number,
    isMOF: Boolean,
    cancelDetails?: CancelReceiptPayload
  ): Observable<number> {
    const cancelPayment = isMOF
      ? `/api/v1/paying-establishment/${registrationNo}/payment/${receiptNo}/cancel`
      : `/api/v1/establishment/${registrationNo}/payment/${receiptNo}/cancel`;
    return this.http.put<number>(cancelPayment, !isMOF ? cancelDetails : null);
  }
  /**
   * Method to get workFlow status.
   * @param registrationNo registration number
   */
  getWorkFlowStatus(registrationNo: number): Observable<WorkFlowStatus[]> {
    const url = `/api/v1/establishment/${registrationNo}/workflow-status`;
    return this.http.get<WorkFlowStatus[]>(url);
  }
}
