/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Alert,
  AlertTypeEnum,
  ApplicationTypeEnum,
  DocumentItem,
  DocumentService,
  TransactionFeedback
} from '@gosi-ui/core';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EstablishmentActionEnum, EstablishmentEligibilityEnum, NavigationIndicatorEnum } from '../enums';
import {
  BranchEligibility,
  BranchEligibilityWrapper,
  DelinkRequest,
  QueryParam,
  ValidationMessage,
  ValidityCheck
} from '../models';
import { ChangeMainRequest } from '../models/change-main-request';

@Injectable({
  providedIn: 'root'
})
export class ChangeGroupEstablishmentService {
  registrationNo: number;
  groupEligibilty: Map<EstablishmentActionEnum, boolean> = new Map();
  isCbmEligible: boolean;
  isDelinkEligible: boolean;
  loggedInAdminId: number;

  constructor(readonly http: HttpClient, readonly documentService: DocumentService) {}

  /**
   * Method to save the new main establishment details
   * @param registrationNo
   * @param changeMainRequest
   */
  saveMainEstablishment(registrationNo: number, changeMainRequest: ChangeMainRequest) {
    //TODO Put return type
    const url = `/api/v1/establishment/${registrationNo}/convert`;
    return this.http.put<TransactionFeedback>(url, changeMainRequest);
  }

  /**
   * Method to check the eligibility to change the main banch of establishmen group
   * @param registrationNo
   */
  checkEligibility(registrationNo: number, queryParams?: QueryParam[]): Observable<BranchEligibility[]> {
    let params = new HttpParams();
    if (queryParams) {
      queryParams.forEach(queryParam => {
        params = params.append(queryParam.queryKey, queryParam.queryValue.toString());
      });
    }

    const getEligiblity = `/api/v1/establishment/${registrationNo}/eligible`;
    return this.http.get<BranchEligibilityWrapper>(getEligiblity, { params }).pipe(map(res => res.eligibility));
  }

  /**
   * Method to save delinked branches
   * @param registrationNo
   * @param delinkRequest
   */
  saveDelinkedEstablishment(registrationNo: number, delinkRequest: DelinkRequest): Observable<TransactionFeedback> {
    const url = `/api/v1/establishment/${registrationNo}/delink`;
    return this.http.post<TransactionFeedback>(url, delinkRequest);
  }
  /**
   * Method to save delinked branches
   * @param registrationNo
   * @param delinkRequest
   */
  updateDelinkedEstablishment(registrationNo: number, delinkRequest: DelinkRequest): Observable<TransactionFeedback> {
    const url = `/api/v1/establishment/${registrationNo}/delink`;
    return this.http.put<TransactionFeedback>(url, delinkRequest);
  }

  /**
   * Method to check if the establishment groups is eligible for the particular action
   * @param eligibilityStatus
   * @param action
   */
  isGroupEligibleForAction(eligibilityStatus: BranchEligibility[], action: EstablishmentActionEnum): ValidityCheck {
    const isValid: ValidityCheck = new ValidityCheck();
    this.groupEligibilty.clear();
    this.groupEligibilty.set(action, false);
    isValid.valid = false;
    if (eligibilityStatus) {
      const eligibilityRules: BranchEligibility[] = [];
      eligibilityRules.push(eligibilityStatus.find(rule => rule.key === this.mapActionToEligibility(action)));
      if (action === EstablishmentActionEnum.DELINK_NEW_GRP) {
        eligibilityRules.push(eligibilityStatus.find(rule => rule.key === EstablishmentEligibilityEnum.DELINK_ONLY));
      }
      if (eligibilityRules.some(eligibilityRule => eligibilityRule?.eligible === false)) {
        isValid.valid = false;
        this.groupEligibilty.set(action, isValid.valid);
        eligibilityRules.map(eligibilityRule => {
          isValid.messages.message = eligibilityRule.messages.message;
          isValid.messages.details = [...isValid.messages.details, ...eligibilityRule.messages.details];
        });
        return isValid;
      }
      this.groupEligibilty.set(action, true);
      isValid.valid = true;
      return isValid;
    }
    return isValid;
  }

  /**
   * Method to map the action against its eligibility
   * @param action
   */
  mapActionToEligibility(action: EstablishmentActionEnum): EstablishmentEligibilityEnum {
    if (action === EstablishmentActionEnum.CHG_MAIN_EST) {
      return EstablishmentEligibilityEnum.CBM;
    } else if (
      action === EstablishmentActionEnum.DELINK_NEW_EST ||
      action === EstablishmentActionEnum.DELINK_OTHER ||
      action === EstablishmentActionEnum.DELINK_NEW_GRP
    ) {
      return EstablishmentEligibilityEnum.DELINK;
    } else if (action === EstablishmentActionEnum.CLOSE_EST) {
      return EstablishmentEligibilityEnum.CLOSE_EST;
    }
  }

  mapValidationMessagesToAlert(
    validationMessage: ValidationMessage,
    type: AlertTypeEnum = AlertTypeEnum.WARNING
  ): Alert {
    const alert = new Alert();
    alert.message = undefined;
    alert.type = type;
    alert.dismissible = false;
    alert.details = validationMessage?.details.map(validationDetails => {
      return { ...new Alert(), ...{ message: validationDetails } };
    });
    return alert;
  }

  /**
   * method to get the navigation indicator
   * @param isFinal
   */
  getNavigationIndicator(type: string, isFinalSubmit: boolean, isValidator: boolean, appToken?: string): number {
    if (type === EstablishmentActionEnum.DELINK_NEW_GRP || type === EstablishmentActionEnum.DELINK_OTHER) {
      const isDelinkToNewGroup = type === EstablishmentActionEnum.DELINK_NEW_GRP;
      if (appToken === ApplicationTypeEnum.PRIVATE) {
        if (isFinalSubmit) {
          return isValidator
            ? isDelinkToNewGroup
              ? NavigationIndicatorEnum.VALIDATOR_ESTABLISHMENT_TRANSFER_DELINK_FINAL_SUBMIT
              : NavigationIndicatorEnum.VALIDATOR_ESTABLISHMENT_TRANSFER_LINK_FINAL_SUBMIT
            : isDelinkToNewGroup
            ? NavigationIndicatorEnum.CSR_ESTABLISHMENT_TRANSFER_DELINK_FINAL_SUBMIT
            : NavigationIndicatorEnum.CSR_ESTABLISHMENT_TRANSFER_LINK_FINAL_SUBMIT;
        } else {
          return isValidator
            ? isDelinkToNewGroup
              ? NavigationIndicatorEnum.VALIDATOR_ESTABLISHMENT_TRANSFER_DELINK_SUBMIT
              : NavigationIndicatorEnum.VALIDATOR_ESTABLISHMENT_TRANSFER_LINK_SUBMIT
            : isDelinkToNewGroup
            ? NavigationIndicatorEnum.CSR_ESTABLISHMENT_TRANSFER_DELINK_SUBMIT
            : NavigationIndicatorEnum.CSR_ESTABLISHMENT_TRANSFER_LINK_SUBMIT;
        }
      } else {
        if (isFinalSubmit) {
          return isDelinkToNewGroup
            ? NavigationIndicatorEnum.ESTADMIN_ESTABLISHMENT_TRANSFER_DELINK_FINAL_SUBMIT
            : NavigationIndicatorEnum.ESTADMIN_ESTABLISHMENT_TRANSFER_LINK_FINAL_SUBMIT;
        } else {
          return isDelinkToNewGroup
            ? NavigationIndicatorEnum.ESTADMIN_ESTABLISHMENT_TRANSFER_DELINK_SUBMIT
            : NavigationIndicatorEnum.ESTADMIN_ESTABLISHMENT_TRANSFER_LINK_SUBMIT;
        }
      }
    } else if (type === EstablishmentActionEnum.CHG_MAIN_EST) {
      if (appToken === ApplicationTypeEnum.PRIVATE) {
        if (isFinalSubmit) {
          return isValidator
            ? NavigationIndicatorEnum.VALIDATOR_CHANGE_BRANCH_TO_MAIN_FINAL_SUBMIT
            : NavigationIndicatorEnum.CSR_CHANGE_BRANCH_TO_MAIN_FINAL_SUBMIT;
        } else {
          return isValidator
            ? NavigationIndicatorEnum.VALIDATOR_CHANGE_BRANCH_TO_MAIN_SUBMIT
            : NavigationIndicatorEnum.CSR_CHANGE_BRANCH_TO_MAIN_SUBMIT;
        }
      } else {
        return NavigationIndicatorEnum.ADMIN_CHANGE_BRANCH_TO_MAIN_FINAL_SUBMIT;
      }
    }
  }

  /**
   * This method is used to get the document uploaded or scanned from DB
   * @param transactionKey
   * @param transationType
   * @param identifier
   */
  getDocuments(
    transactionKey: string,
    transationType: string | string[],
    identifier: number,
    referenceNo?: number,
    status?: string
  ): Observable<DocumentItem[]> {
    return this.documentService.getRequiredDocuments(transactionKey, transationType).pipe(
      switchMap(res => {
        return forkJoin(
          res?.map(doc => {
            return this.documentService.refreshDocument(doc, identifier, undefined, undefined, referenceNo, status);
          })
        );
      }),
      map(res => this.documentService.removeDuplicateDocs(res))
    );
  }
}
