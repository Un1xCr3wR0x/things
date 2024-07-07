/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Directive } from '@angular/core';
import {
  AlertService,
  AppConstants,
  BilingualText,
  DocumentItem,
  DocumentService,
  Establishment,
  EstablishmentProfile,
  EstablishmentRouterData,
  WorkFlowActions,
  WorkflowService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, iif, noop, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EstablishmentBranchWrapper } from '../models';
import { ChangeEstablishmentService, EstablishmentService } from '../services';
import { getBranchRequest } from '../utils';
import { EstablishmentScBaseComponent } from './establishment-sc.base-component';
@Directive()
export abstract class ChangeEstablishmentScBaseComponent extends EstablishmentScBaseComponent {
  ownersCount: number;
  establishmentToChange: Establishment = new Establishment();
  establishmentProfile: EstablishmentProfile = new EstablishmentProfile();
  commentsMaxLength = AppConstants.MAXLENGTH_COMMENTS;
  establishmentBeforeChange: Establishment = new Establishment();

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly changeEstablishmentService: ChangeEstablishmentService,
    readonly alertService: AlertService,
    readonly bsModalService: BsModalService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService
  ) {
    super(bsModalService, workflowService);
  }
  /**
   * Method to get the document content
   * @param document
   * @param identifier
   * @param documentType
   */
  refreshDocumentContent(
    document: DocumentItem,
    identifier: number,
    documentType: string,
    referenceNo?: number,
    uuid?: string
  ) {
    this.documentService
      .refreshDocument(
        document,
        identifier,
        documentType,
        documentType,
        referenceNo,
        undefined,
        referenceNo ? undefined : uuid
      )
      .subscribe(res => {
        document = res;
      });
  }

  /**
   * Method to update bpm with the workflow status
   * @param estToken
   * @param comments
   * @param successMessage
   */
  updateBpm(
    estToken: EstablishmentRouterData,
    comments: string,
    successMessage: BilingualText,
    outcome: WorkFlowActions = WorkFlowActions.UPDATE
  ): Observable<BilingualText> {
    return this.updateBpmTransaction(estToken, comments, outcome).pipe(
      tap(() => {
        this.alertService.showSuccess(successMessage);
      })
    );
  }

  /**
   * Method to fetch comments
   */
  fetchComments(routerData: EstablishmentRouterData) {
    this.comments$ = this.getAllComments(routerData);
  }

  /**
   * Method to get establishment with reference number
   */
  getEstablishmentWithWorkflowData(
    estRouterData: EstablishmentRouterData,
    initialiseView: () => void,
    navigateToValidator: () => void,
    loadEstProfile = true,
    getMain = false,
    getEst = false
  ) {
    this.changeEstablishmentService
      .getEstablishmentFromTransient(estRouterData.registrationNo, estRouterData.referenceNo)
      .pipe(
        switchMap(est =>
          iif(() => getMain === true, this.establishmentService.getEstablishment(est.mainEstablishmentRegNo), of(est))
        ),
        catchError(err => {
          navigateToValidator();
          return throwError(err);
        }),
        tap(res => {
          this.establishmentToChange = res;
          if (loadEstProfile) {
            this.getEstablishmentProfile(this.establishmentToChange.registrationNo)
              .pipe(
                switchMap(est =>
                  iif(
                    () => getEst === true,
                    this.establishmentService
                      .getEstablishment(this.establishmentToChange.registrationNo)
                      .pipe(tap(estRes => (this.establishmentBeforeChange = estRes))),
                    of(est)
                  )
                ),
                tap(() => {
                  initialiseView();
                })
              )
              .subscribe(noop, err => {
                this.alertService.showError(err?.error?.message);
              });
          } else {
            initialiseView();
          }
          this.fetchComments(estRouterData);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(noop, noop);
  }

  /**
   * method to get the details of the establishment profile before editing
   * @param registrationNo
   */
  getEstablishmentProfile(registrationNo: number) {
    return this.establishmentService.getEstablishmentProfileDetails(registrationNo).pipe(
      takeUntil(this.destroy$),
      tap(res => {
        this.establishmentProfile = res;
        this.establishmentProfile.name.english = this.establishmentProfile.name.english
          ? this.establishmentProfile.name.english
          : this.establishmentProfile.name.arabic;
      })
    );
  }

  /**
   * This method is used to get establishments in a group
   * @param registrationNo
   */
  getBranchEstablishments(
    registrationNo: number,
    pageSize: number,
    currentPage: number,
    StatusFilter: BilingualText[],
    hideMol: boolean,
    setBranch: (branches: EstablishmentBranchWrapper, profileDetails: EstablishmentProfile) => void, 
    excludePPA = false) {
    forkJoin([
      this.establishmentService.getBranchEstablishmentsWithStatus(
        registrationNo,
        getBranchRequest(pageSize, currentPage, StatusFilter, hideMol),[],excludePPA
      ),
      this.establishmentService.getEstablishmentProfileDetails(registrationNo)
    ]).subscribe(
      ([braches, profileDetails]) => {
        setBranch(braches, profileDetails);
      },
      err => {
        this.alertService.showError(err.error.message);
      }
    );
  }
}
