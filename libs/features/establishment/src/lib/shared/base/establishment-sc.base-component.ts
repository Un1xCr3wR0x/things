/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpHeaders } from '@angular/common/http';
import { Directive, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  BaseComponent,
  BilingualText,
  BpmHeaders,
  BPMUpdateRequest,
  EstablishmentRouterData,
  Role,
  TransactionReferenceData,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FlagDetails } from '../models';
import { approveMessage, rejectMessage, returnMessage } from '../utils';

interface BPM {
  body: BPMUpdateRequest;
  headers: HttpHeaders;
}

@Directive()
export abstract class EstablishmentScBaseComponent extends BaseComponent implements OnDestroy {
  bsModalRef: BsModalRef;
  comments$: Observable<TransactionReferenceData[]> = of([]);
  constructor(readonly bsModalService: BsModalService, readonly workflowService: WorkflowService) {
    super();
  }

  showModal(template: TemplateRef<HTMLElement>, size: string = 'md', ignoreBackdrop: boolean = false): void {
    if (template) {
      this.bsModalRef = this.bsModalService.show(
        template,
        Object.assign({}, { class: 'modal-' + size + ' modal-dialog-centered', ignoreBackdropClick: ignoreBackdrop })
      );
    }
  }

  //Method to show modal with 700px
  showMedModal(template: TemplateRef<HTMLElement>, ignoreBackdrop: boolean = false): void {
    if (template) {
      this.bsModalRef = this.bsModalService.show(
        template,
        Object.assign({}, { class: 'modal-med modal-dialog-centered', ignoreBackdropClick: ignoreBackdrop })
      );
    }
  }

  hideModal(): void {
    this.bsModalRef?.hide();
  }

  /**
   * Method to group flags based on flagtype
   * @param array
   * @param keyGetter
   */
  groupByFlagType(array, keyGetter): Map<string, FlagDetails[]> {
    const flagMap = new Map();
    array.forEach(item => {
      const key = keyGetter(item);
      const collection = flagMap.get(key);
      if (!collection) {
        flagMap.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return flagMap;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  /**
   * Method to approve the BPM transaction
   * @param routerData
   * @param form
   */
  approveBpmTransaction(routerData: EstablishmentRouterData, form: FormGroup): Observable<BilingualText> {
    return this.submitWorkflow(this.assembleBpmRequest(routerData, WorkFlowActions.APPROVE, form)).pipe(
      map(() => approveMessage()),
      tap(() => {
        routerData.fromJsonToObject(new EstablishmentRouterData());
      })
    );
  }
  //Method to reject the bpm transaction
  rejectBpmTransaction(routerData: EstablishmentRouterData, form: FormGroup): Observable<BilingualText> {
    return this.submitWorkflow(this.assembleBpmRequest(routerData, WorkFlowActions.REJECT, form)).pipe(
      map(() => rejectMessage()),
      tap(() => {
        routerData.fromJsonToObject(new EstablishmentRouterData());
      })
    );
  }
  //method to return the bpm transaction
  returnBpmTransaction(routerData: EstablishmentRouterData, form: FormGroup): Observable<BilingualText> {
    return this.submitWorkflow(this.assembleBpmRequest(routerData, WorkFlowActions.RETURN, form)).pipe(
      map(() => returnMessage()),
      tap(() => {
        routerData.fromJsonToObject(new EstablishmentRouterData());
      })
    );
  }
  // method to edit and approve the transaction
  updateBpmTransaction(
    routerData: EstablishmentRouterData,
    comments: string,
    outcome: WorkFlowActions = WorkFlowActions.UPDATE
  ): Observable<BilingualText> {
    return this.submitWorkflow(this.assembleBpmRequest(routerData, outcome, undefined, comments)).pipe(
      tap(() => {
        routerData.fromJsonToObject(new EstablishmentRouterData());
      })
    );
  }
  /**
   * Method to submit the transaction to BPM with correct outcome
   * @param requestData
   */
  private submitWorkflow(requestData: BPM) {
    const { body, headers } = requestData;
    return this.workflowService.updateTaskWorkflow(body, undefined, headers);
  }

  /**
   * Assmeble the BPM Request with router data and related values
   * @param estRouterData
   * @param outcome
   * @param form
   * @param comments
   */
  private assembleBpmRequest(
    estRouterData: EstablishmentRouterData,
    outcome: WorkFlowActions,
    form?: FormGroup,
    comments?: string
  ): BPM {
    const request = new BPMUpdateRequest();
    request.referenceNo = estRouterData.referenceNo?.toString();
    request.comments = comments || form?.get('comments')?.value;
    request.outcome = outcome;
    request.rejectionReason = form?.get('rejectionReason')?.value;
    request.returnReason = form?.get('returnReason')?.value;
    request.taskId = estRouterData.taskId;
    request.user = this.userRole(estRouterData);
    if (
      (estRouterData.assignedRole === Role.VALIDATOR && outcome !== WorkFlowActions.APPROVE) ||
      estRouterData.assignedRole === Role.EST_ADMIN_OH
    ) {
      request.isExternalComment = true;
    }
    return { body: request, headers: this.assembleHttpHeaders(this.assembleBpmHeaders(estRouterData)) };
  }

  private assembleHttpHeaders(headers: BpmHeaders): HttpHeaders {
    return Object.keys(headers)?.reduce((headerMap, key, index) => {
      if (index === 0) {
        return headerMap.set(key, headers[key]);
      } else {
        return headerMap.append(key, headers[key]);
      }
    }, new HttpHeaders());
  }

  private userRole(taskDetails?: EstablishmentRouterData): string {
    return taskDetails.user;
  }

  /**
   * Method to assemble the BPM Headers
   * @param estRouterData
   */
  private assembleBpmHeaders(estRouterData: EstablishmentRouterData): BpmHeaders {
    return {
      bpmTaskId: estRouterData.taskId,
      workflowUser: this.userRole(estRouterData)
    };
  }

  /**
   * Method to get the comments from BPM
   */
  getAllComments(estRouterData: EstablishmentRouterData): Observable<TransactionReferenceData[]> {
    return of(estRouterData.comments);
  }
}
