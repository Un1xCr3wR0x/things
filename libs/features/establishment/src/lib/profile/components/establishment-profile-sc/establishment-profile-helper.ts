/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { TemplateRef } from '@angular/core';
import {
  Alert,
  ApplicationTypeEnum,
  BilingualText,
  bindToObject,
  dayDifference,
  Establishment,
  EstablishmentProfile,
  EstablishmentStatusEnum,
  getIdentityByType,
  GosiErrorWrapper,
  RoleIdEnum,
  TransactionStatus
} from '@gosi-ui/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  Admin,
  AdminRoleEnum,
  AdminWrapper,
  ControlPerson,
  DocumentTransactionTypeEnum,
  ErrorCodeEnum,
  EstablishmentActionEnum,
  EstablishmentErrorKeyEnum,
  EstablishmentQueryKeysEnum,
  EstablishmentWarningKeyEnum,
  EstablishmentWorkFlowStatus,
  FlagQueryParam,
  GenericValidationKey,
  getEstablishmentStatusErrorKey,
  internalRoles,
  isEstFromMolMci,
  isEstMain,
  isEstRegPending,
  isGccEstablishment,
  isGovOrSemiGov,
  isLegalEntityPartnership,
  isLegalEntitySame,
  LegalEntityEnum,
  mapAdminToControlPersons,
  mciEstablishment,
  NavigationIndicatorEnum,
  OHQueryParam,
  Owner,
  PatchBasicDetails,
  QueryParam,
  SafetyInspectionConstants,
  ValidationMessage,
  ViolationCount,
  WorkFlowStatusType
} from '../../../shared';
import { canViewManageAdmin } from '../establishment-group-profile-sc/group-profile-helper';
import { EstablishmentProfileScComponent } from './establishment-profile-sc.component';

export const checkTerminateRestrictStatus$ = (self: EstablishmentProfileScComponent): Observable<boolean> => {
  return self.changeGroupEstablishmentService
    .checkEligibility(self.establishment.registrationNo, [
      {
        queryKey: EstablishmentQueryKeysEnum.ACTION,
        queryValue: EstablishmentQueryKeysEnum.TERMINATE_ACTION
      }
    ])
    .pipe(
      map(eligibilityResponse => {
        const eligibilityRule = eligibilityResponse.find(
          rule =>
            rule.key === self.changeGroupEstablishmentService.mapActionToEligibility(EstablishmentActionEnum.CLOSE_EST)
        );
        if (eligibilityRule && eligibilityRule.eligible) {
          return true;
        } else {
          self.terminateRestrictMsg = self.changeGroupEstablishmentService.mapValidationMessagesToAlert(
            eligibilityRule?.messages
          );
          return false;
        }
      })
    );
};
export const mapBilingualToAlert = (self: EstablishmentProfileScComponent, BilingualMsg: BilingualText[]): Alert => {
  const msg = new ValidationMessage();
  msg.details = BilingualMsg;
  return self.changeGroupEstablishmentService.mapValidationMessagesToAlert(msg);
};
export const checkCloseNavigation = (self: EstablishmentProfileScComponent) => {
  if (!self.isCloseNavigationInProgress) {
    //To prevent multiple close event
    if (self.canCloseEstablsihment) {
      self.isCloseNavigationInProgress = true;
      checkTerminateRestrictStatus$(self).subscribe(
        status => {
          if (status) {
            self.navigateToClose();
            self.isCloseNavigationInProgress = false;
          } else {
            self.isCloseNavigationInProgress = false;
            self.showModal(self.terminateRestrictTemplate, 'lg');
          }
        },
        err => {
          self.isCloseNavigationInProgress = false;
          self.alertService.showError(err?.error?.message);
        }
      );
    } else if (!self.canCloseEstablsihment && self.canCloseEstablsihment !== undefined) {
      self.showModal(self.terminateRestrictTemplate, 'lg');
    }
  }
};

export function checkIfOutOfMarket(self: EstablishmentProfileScComponent, workflowRes: EstablishmentWorkFlowStatus[]) {
  self.canCloseEstablsihment = !workflowRes.some(e => e.type === WorkFlowStatusType.CLOSE_ESTABLISHMENT);
  const closeWorkflowDetails = workflowRes.find(e => e.type === WorkFlowStatusType.CLOSE_ESTABLISHMENT);
  self.closureTransactionId = closeWorkflowDetails?.referenceNo;
  self.terminateRestrictMsg = self.canCloseEstablsihment
    ? null
    : (self.terminateRestrictMsg = mapBilingualToAlert(self, [closeWorkflowDetails.message]));
}
/**
 * Method to check if the establishment can be edited for registered status
 * Check if already workflows are there for transactions such as
 * modify est details, idetnfier, contact ,address, bank , owners
 */
export function canEditEstablishment(
  self: EstablishmentProfileScComponent,
  establishmentProfile: EstablishmentProfile
) {
  const workflow$ = self.workflowsInProgress
    ? of(self.workflowsInProgress)
    : self.establishmentService.getWorkflowsInProgress(establishmentProfile.registrationNo, true).pipe(
        catchError(() => of([] as EstablishmentWorkFlowStatus[])),
        tap(res => (self.workflowsInProgress = res))
      );
  workflow$.pipe(map(res => res.filter(item => !item.isDraft))).subscribe(
    workflowRes => {
      checkIfOutOfMarket(self, workflowRes);
      if (
        establishmentProfile.status.english === EstablishmentStatusEnum.REGISTERED ||
        establishmentProfile.status.english === EstablishmentStatusEnum.REOPEN ||
        establishmentProfile.status.english === EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS
      ) {
        self.canEditIdentifier = !workflowRes.some(e => e.type === WorkFlowStatusType.IDENTIFIER);
        self.identifierReferenceNo = workflowRes.find(e => e.type === WorkFlowStatusType.IDENTIFIER)?.referenceNo;
        self.editIdentifierDetailsMsg = self.canEditIdentifier
          ? ''
          : self.establishmentTranslateModule + '.IDENTIFIER-WORKFLOW';

        self.canEditBasicDetails = !workflowRes.some(e => e.type === WorkFlowStatusType.BASICDETAILS);
        self.basicReferenceNo = workflowRes.find(e => e.type === WorkFlowStatusType.BASICDETAILS)?.referenceNo;
        self.editBasicDetailsMsg = self.canEditBasicDetails
          ? ''
          : self.establishmentTranslateModule + '.BASIC-WORKFLOW';

        self.canEditBankDetails = !workflowRes.some(e => e.type === WorkFlowStatusType.BANKDETAILS);
        self.bankReferenceNo = workflowRes.find(e => e.type === WorkFlowStatusType.BANKDETAILS)?.referenceNo;
        self.editBankDetailsMsg = self.canEditBankDetails ? '' : self.establishmentTranslateModule + '.BANK-WORKFLOW';

        self.canEditContactDetails = !workflowRes.some(e => e.type === WorkFlowStatusType.CONTACTDETAILS);
        self.contactReferenceNo = workflowRes.find(e => e.type === WorkFlowStatusType.CONTACTDETAILS)?.referenceNo;
        self.editContactDetailsMsg = self.canEditContactDetails
          ? ''
          : self.establishmentTranslateModule + '.CONTACT-WORKFLOW';

        self.canEditAddressDetails = !workflowRes.some(e => e.type === WorkFlowStatusType.ADDRESSDETAILS);
        self.addressReferenceNo = workflowRes.find(e => e.type === WorkFlowStatusType.ADDRESSDETAILS)?.referenceNo;
        self.editAddressDetailsMsg = self.canEditAddressDetails
          ? ''
          : self.establishmentTranslateModule + '.ADDRESS-WORKFLOW';
        const lateFee = workflowRes?.find(item => item.type === WorkFlowStatusType.LATE_FEE);
        const legalEntity = workflowRes?.find(item => item.type === WorkFlowStatusType.LEGALENTITY);
        if (lateFee || legalEntity) {
          self.referenceNumber = lateFee?.referenceNo || legalEntity?.referenceNo;
          self.editLateFeeWarning =
            self.establishmentTranslateModule +
            (lateFee?.referenceNo ? '.LATE-FEE-WORKFLOW' : '.LEGAL-ENTITY-WORKFLOW');
        }
      }
    },
    err => {
      self.alertService.showError(err.error.message);
    }
  );
}
export const enableCertificate = (self: EstablishmentProfileScComponent): void => {
  if (!isGccEstablishment(self.establishment)) {
    self.showCertificates = true;
  }
};
//Method to get the number of active flags
export const getFlagDetails = (self: EstablishmentProfileScComponent, regNo: number) => {
  const params = new FlagQueryParam();
  params.status = EstablishmentQueryKeysEnum.ACTIVE;
  self.flagEstablishmentService.getFlagDetails(regNo, params).subscribe(
    res => {
      self.flags = res;
      self.flagMap = self.groupByFlagType(self.flags, flag => flag.flagType.english);
      self.noOfActiveFlags = self.flagMap.size;
    },
    err => self.alertService.showError(err.error.message)
  );
};
//Method to get safety regulation complaint status
export const getSafetyDetails = (self: EstablishmentProfileScComponent, regNo: number) => {
  const params = new OHQueryParam();
  params.excludeHistory = false;
  self.safetyInspectionService
    .getEstablishmentOHRate(regNo, params)
    .pipe(
      switchMap(OhRateDetails => {
        self.OhRateDetails = OhRateDetails;
        self.safetyInspectionService.estbalishmentOHRate = OhRateDetails;
        self.isCompliant = self.OhRateDetails.compliant;
        self.setSafetyCheckAction();
        if (
          OhRateDetails.currentOhRate - OhRateDetails.baseRate !== SafetyInspectionConstants.DELTA_VALUES()['min'] &&
          OhRateDetails?.inspectionId
        ) {
          return self.safetyInspectionService.getEstablishmentInspectionDetails(regNo, [
            {
              queryKey: EstablishmentQueryKeysEnum.INSPECTION_ID,
              queryValue: OhRateDetails?.inspectionId
            }
          ]);
        } else {
          return of(null);
        }
      })
    )
    .subscribe(
      safetyInspectionDetails => {
        self.safetyInspectionDetails = safetyInspectionDetails;
        self.safetyInspectionService.inspectionDetails = safetyInspectionDetails;
      },
      err =>
        err?.error?.code !== ErrorCodeEnum.NO_INSPECTION_ID ? self.alertService.showError(err?.error?.message) : ''
    );
};
export const showRestrictAddFlagModal = (self: EstablishmentProfileScComponent) => {
  self.showModal(self.addFlagRestrictTemplate, 'lg');
};
export const showModal = (self: EstablishmentProfileScComponent, template: TemplateRef<HTMLElement>) => {
  self.bsModalRef = self.bsModalService.show(template, Object.assign({}, { class: 'modal-lg' }));
};
export function getAdminsOfEstablishment(self: EstablishmentProfileScComponent): Observable<ControlPerson[]> {
  return self.establishmentService.getAdminsOfEstablishment(self.establishmentProfile.registrationNo).pipe(
    catchError(() => {
      return of({ admins: [] });
    }),
    tap((res: AdminWrapper) => {
      self.activeAdmins = res?.admins;
      if (self.establishment.status.english == EstablishmentStatusEnum.REGISTERED) checkForActiveAdmin(self);
      if (self.appToken === ApplicationTypeEnum.PUBLIC && !self.establishmentService.loggedInAdminRole) {
        self.establishmentService.loggedInAdminRole = res?.admins.find(admin => {
          const identity = getIdentityByType(admin?.person?.identity, admin?.person?.nationality?.english);
          return identity?.id === self.adminId;
        })?.roles?.[0]?.english;
      }
      enableManageAdminRoute(self, res?.admins);

      //  filtering active admins from response
      //  self.activeAdmins = res?.admins.filter(
      //   admin => !admin.person.deathDate
      // );
    }),
    map(res => mapAdminToControlPersons(res))
  );
}
export function enableManageAdminRoute(self: EstablishmentProfileScComponent, admins: Admin[]) {
  if (self.appToken === ApplicationTypeEnum.PUBLIC) {
    self.showAdminButton = canViewManageAdmin(
      self.appToken,
      self.establishmentService,
      self.establishment?.gccCountry,
      self.establishmentService.loggedInAdminRole,
      false,
      self.isPpa
    );
  } else {
    if (self.adminId) {
      const superAdmin = admins?.find(
        admin =>
          admin.roles[0]?.english === AdminRoleEnum.SUPER_ADMIN || admin.roles[0]?.english === AdminRoleEnum.GCC_ADMIN
      );
      if (superAdmin) {
        self.showAdminButton = canViewManageAdmin(
          self.appToken,
          self.establishmentService,
          self.establishment?.gccCountry,
          undefined,
          false,
          self.isPpa
        );
      } else {
        self.showAddSuperAdmin = canViewManageAdmin(
          self.appToken,
          self.establishmentService,
          self.establishment?.gccCountry,
          undefined,
          true,
          self.isPpa
        );
      }
    } else {
      //Consider if profile is accessed by csr without admin id then manage admin should be shown only if there are super admins
      const superAdmin = admins?.find(
        admin =>
          admin.roles[0]?.english === AdminRoleEnum.SUPER_ADMIN || admin.roles[0]?.english === AdminRoleEnum.GCC_ADMIN
      );
      if (superAdmin) {
        self.showAdminButton = canViewManageAdmin(
          self.appToken,
          self.establishmentService,
          self.establishment?.gccCountry,
          undefined,
          false,
          self.isPpa
        );
        self.establishmentService.loggedInAdminRole = superAdmin?.roles[0]?.english;
        self.adminId = getIdentityByType(superAdmin.person?.identity, superAdmin.person?.nationality?.english)?.id;
      } else {
        if (self.mainEstablishment?.status?.english === EstablishmentStatusEnum.REGISTERED) {
          self.showAddSuperAdmin = canViewManageAdmin(
            self.appToken,
            self.establishmentService,
            self.establishment?.gccCountry,
            undefined,
            true,
            self.isPpa
          );
        }
      }
    }
  }
}
/**
 * Handle the profile access based on establishment status
 * @param self
 * @param status
 * @param terminateInProgress
 */
export function enableEstablishmentAccess(
  self: EstablishmentProfileScComponent,
  status: string,
  terminateInProgress: boolean
): Observable<boolean | never> {
  if (
    status === EstablishmentStatusEnum.REGISTERED ||
    status === EstablishmentStatusEnum.REOPEN ||
    status === EstablishmentStatusEnum.REOPEN_CLOSING_IN_PROGRESS
  ) {
    return of(true);
  }
  const validateStatus: GenericValidationKey = getEstablishmentStatusErrorKey(status);
  if (status === EstablishmentStatusEnum.CLOSING_IN_PROGRESS) {
    self.viewMode = true;
  }
  if (validateStatus.valid) {
    //After Establishment is terminated user comes to est profile page
    if (!(terminateInProgress === true && status === EstablishmentStatusEnum.CLOSING_IN_PROGRESS)) {
      self.alertService.showErrorByKey(validateStatus.key, null, null, null, false);
    }
    return of(true);
  } else {
    return throwError(generateGosiError(ErrorCodeEnum.NO_PROFILE_ACCESS, validateStatus.key));
  }
}
export function handleErrors(err: GosiErrorWrapper, self: EstablishmentProfileScComponent) {
  if (err?.error?.code === ErrorCodeEnum.NO_PROFILE_ACCESS) {
    self.isFromRoute = true;
    if (self.profileAccessErrorTemplate) {
      self.profileAccessErrorKey = err?.error?.key;
      self.showModal(self.profileAccessErrorTemplate, 'md', true);
    }
  } else if (err?.error?.code === ErrorCodeEnum.EST_REG_PENDING) {
    return of(null);
  } else if (err?.error?.code === ErrorCodeEnum.LE_MISMATCH) {
    self.alertService.showWarningByKey(err?.error?.key, null, null, null, false);
  } else if (err?.error?.code !== ErrorCodeEnum.EST_CLOSED) {
    self.alertService.showError(err?.error?.message);
    self.navigateBack();
  }
  return of(null);
}
export function setStateVariables(self: EstablishmentProfileScComponent) {
  const estProfile = self.establishmentProfile;
  const est = self.establishment;
  self.changeEstablishmentService.selectedRegistrationNo = estProfile.registrationNo;
  self.changeEstablishmentService.selectedEstablishment = self.establishment;
  if (estProfile.gccEstablishment === true) {
    self.isGcc = true;
  }

  self.branchDropDown$ = self.getBranches(estProfile.registrationNo, estProfile.noOfBranches);
  self.transactionDetails$ = self.establishmentService
    .getComments([
      {
        queryKey: EstablishmentQueryKeysEnum.BUSINESS_KEY,
        queryValue: estProfile?.registrationNo
      },
      {
        queryKey: EstablishmentQueryKeysEnum.TYPE,
        queryValue: DocumentTransactionTypeEnum.REGISTER_ESTABLISHMENT
      }
    ])
    .pipe(catchError(() => of([])));
  self.isProactive = isEstFromMolMci(est);
  self.showMofPaymentDetails = isGovOrSemiGov(est?.legalEntity?.english);
  self.showLateFeeIndicator =
    isGovOrSemiGov(est?.legalEntity?.english) && self.appToken === ApplicationTypeEnum.PRIVATE;
  if (estProfile.gccEstablishment === true && self.isPpa === true) {
    self.showMofPaymentDetails = false;
    self.showLateFeeIndicator = false;
  }
}
export function generateGosiError(code?: ErrorCodeEnum, key?: string, message?: BilingualText): GosiErrorWrapper {
  const gosiError = new GosiErrorWrapper();
  gosiError.error.code = code;
  gosiError.error.message = message;
  gosiError.error.key = key;
  return gosiError;
}
export function handleOwners(self: EstablishmentProfileScComponent): Observable<ControlPerson[]> {
  const legalEntity = self.establishment?.legalEntity?.english;
  if (isLegalEntityPartnership(legalEntity) || legalEntity === LegalEntityEnum.INDIVIDUAL) {
    const queryParams: QueryParam[] = [];
    queryParams.push({ queryKey: EstablishmentQueryKeysEnum.ESTABLISHMENT_OWNERS, queryValue: true });
    return self.establishmentService.getPersonDetailsOfOwners(self.establishment.registrationNo, queryParams).pipe(
      tap(res => {
        self.noActiveOwnerFlag = setOwnerActiveFlag(res, self);
      }),
      map(res => self.establishmentService.mapPartyAndPeopleToControlPeople(res)),
      tap(owners => {
        self.establishmentOwners = owners;
      }),
      catchError(() => {
        return of([]);
      })
    );
  } else {
    self.showOwnerSection = false;
    return of([]);
  }
}
export function handleAdminOwnerAndLegalEntity(self: EstablishmentProfileScComponent) {
  const admins$ = getAdminsOfEstablishment(self).pipe(
    catchError(() => of([])),
    tap(admins => {
      self.establishmentAdmins = admins;
    })
  );
  const owners$ = handleOwners(self);
  const legalEntity$ = self.establishmentService.getWorkflowsInProgress(self.establishment.registrationNo, true).pipe(
    catchError(() => of([] as EstablishmentWorkFlowStatus[])),
    tap(workflows => {
      self.canEditLegalEntity = true;
      self.workflowsInProgress = workflows;
    })
  );
  return forkJoin([admins$, owners$, legalEntity$]);
}
export function handleProfileState(self: EstablishmentProfileScComponent): Observable<never | null> {
  self.hasDifferentLE = !isLegalEntitySame(
    self.establishmentProfile.legalEntity.english,
    self.mainEstablishment.legalEntity.english
  );
  if (self.establishmentProfile?.status?.english === EstablishmentStatusEnum.CLOSED) {
    return throwError(generateGosiError(ErrorCodeEnum.EST_CLOSED));
  }
  if (
    isEstRegPending(self.establishment) &&
    self.establishmentProfile?.status?.english == EstablishmentStatusEnum.REGISTERED
  ) {
    self.canEditLegalEntity = false;
    self.isProactivePending = true;
    self.completeRegMessage = EstablishmentErrorKeyEnum.EST_REG_PENDING;
    const proactiveWorkflow = self.workflowsInProgress.find(
      workflow =>
        workflow?.type === WorkFlowStatusType.COMPLETE_PROACTIVE &&
        workflow?.transactionStatus == TransactionStatus.IN_PROGRESS
    );
    self.proactiveTransactioninDraft = self.workflowsInProgress.find(
      workflow =>
        workflow.type === WorkFlowStatusType.COMPLETE_PROACTIVE &&
        workflow.transactionStatus == TransactionStatus.DRAFT &&
        workflow?.isSameLoggedInUser
    );
    self.DraftTransactionNo = self.proactiveTransactioninDraft?.referenceNo;
    self.canCompleteEstDetails = self.establishmentService.isUserEligible(
      self.proactiveAccessRoles,
      self.establishmentProfile?.registrationNo
    );
    checkIfOutOfMarket(self, self.workflowsInProgress);
    if (proactiveWorkflow) {
      self.proactiveInWorkflow = true;
      if (self.previousUrl.indexOf('/missing-details') === -1) {
        self.completeRegMessage = undefined;
        self.completeRegInWorkflow = proactiveWorkflow.message;
      } else {
        self.isProactivePending = false;
        return of(null);
      }
    }
    return throwError(generateGosiError(ErrorCodeEnum.EST_REG_PENDING, EstablishmentErrorKeyEnum.EST_REG_PENDING));
  }
  if (self.hasDifferentLE) {
    if (self.establishment.outOfMarket) {
      checkIfOutOfMarket(self, self.workflowsInProgress);
    } // to show termination status even if legal entity is difference
    return throwError(
      generateGosiError(ErrorCodeEnum.LE_MISMATCH, EstablishmentErrorKeyEnum.LEGAL_ENTITY_MISMATCH, undefined)
    );
  } else {
    return of(null);
  }
}
export function getEstablishmentAndMain(self: EstablishmentProfileScComponent) {
  //Get Establishment and Main Establishment Details
  return self.establishmentService
    .getEstablishment(self.establishmentProfile.registrationNo, { includeMainInfo: true })
    .pipe(
      tap(res => {
        self.establishment = bindToObject(new Establishment(), res);
        self.mainEstablishment = res?.mainEstablishment;
        self.isPpa = res?.ppaEstablishment;
        self.establishmentService.isPpaEstablishment = res?.ppaEstablishment;
        if (isEstMain(res)) {
          self.isMain = true;
        }
        if (!self.isMain) {
          self.isMainRegistered =
            self.mainEstablishment?.status?.english === EstablishmentStatusEnum.REGISTERED ||
            self.mainEstablishment?.status?.english === EstablishmentStatusEnum.REOPEN;
        }
        return of(res);
      })
    );
}
export function getRelationshipManager(self: EstablishmentProfileScComponent) {
  return self.establishmentService.getRelationshipManager(self.establishmentProfile.registrationNo).subscribe(res => {
    self.relationshipManager = res;
    if (self.relationshipManager?.employeeId) {
      self.getUserDetailsFromIam(self.relationshipManager?.employeeId);
    }
  });
}

export const handleViolations = (self: EstablishmentProfileScComponent) => {
  const accessRoles = [...internalRoles, RoleIdEnum.SUPER_ADMIN, RoleIdEnum.GCC_ADMIN, RoleIdEnum.BRANCH_ADMIN];
  if (self.establishmentService.isUserEligible(accessRoles, self.establishment?.registrationNo) && !self.isGcc) {
    return self.establishmentService.getViolationsCount(self.regNo).pipe(
      catchError(err => {
        if (err?.error?.message) {
          self.alertService.showError(err?.error?.message);
        }
        return of(new ViolationCount());
      }),
      tap(res => {
        if (res.paidCount === 0 && res.unPaidCount === 0 && res.donotImposePenaltyCount === 0)
          self.showViolations = false;
        else {
          self.showViolations = true;
          self.violationUnpaidCount = res.unPaidCount;
          self.violationNoPenaltyCount = res.donotImposePenaltyCount;
        }
      })
    );
  }
  return of(new ViolationCount());
};
export function setOwnerActiveFlag(owners: Owner[], self: EstablishmentProfileScComponent): boolean {
  if (self.establishment.legalEntity.english === LegalEntityEnum.INDIVIDUAL) {
    if (owners.length > 0) {
      let noActiveOwner = true;
      owners.forEach(owner => {
        if (owner?.endDate === null || owner?.endDate?.gregorian === null) noActiveOwner = false;
      });
      return noActiveOwner;
    } else return true;
  } else return false;
}
export function checkForActiveAdmin(self: EstablishmentProfileScComponent) {
  if (self.activeAdmins?.length > 0) {
    let superAdmin = null;
    self.noActiveAdminFlag = false;
    superAdmin = self.activeAdmins?.find(admin => admin.roles[0]?.english === AdminRoleEnum.SUPER_ADMIN);
    if (!superAdmin && !self.isGcc) {
      self.adminMessageKey = EstablishmentWarningKeyEnum.NO_CURRENT_ACTIVE_SUPER_ADMIN;
      self.noActiveAdminFlag = true;
    }
  } else {
    self.noActiveAdminFlag = true;
    if (self.isGcc) {
      self.adminMessageKey = EstablishmentWarningKeyEnum.NO_CURRENT_ACTIVE_GCC_ADMIN;
    } else {
      self.adminMessageKey = EstablishmentWarningKeyEnum.NO_CURRENT_ACTIVE_SUPER_ADMIN;
    }
  }
  self.thereIsNoAdmin.messageKey = self.adminMessageKey;
  self.thereIsNoAdmin.messageParam = self.adminMessageParam;
}
// export function setAdminActiveFlag(admins: Admin[],self: EstablishmentProfileScComponent): boolean {
//   if (self.establishment.legalEntity.english ===LegalEntityEnum.INDIVIDUAL) {
//     if (admins.length>0){
//       admins.forEach(admin => {
//         if (admin?.roles[])
//         return false;
//       });
//       return true;
//     } else return true;
//   } else return false
// }

export function extractPatchBasicDetailsFromEstablishment(establishment: Establishment): PatchBasicDetails {
  let basicDetails = {} as PatchBasicDetails;

  basicDetails.activityType = establishment.activityType;
  basicDetails.comments = establishment.comments;
  basicDetails.gccEstablishment = establishment.gccEstablishment;
  basicDetails.name = establishment.name;
  basicDetails.nationalityCode = establishment.nationalityCode;
  basicDetails.navigationIndicator = NavigationIndicatorEnum.CSR_CHANGE_BASIC_DETAILS_SUBMIT;
  basicDetails.startDate = establishment.startDate;

  return basicDetails;
}

export function canRefresh(self: EstablishmentProfileScComponent): boolean {
  return (
    !self.isAppPrivate &&
    mciEstablishment(self.establishment) &&
    dayDifference(new Date(), new Date(self.establishment?.mciVerifiedDate?.gregorian)) !== 0
  );
}
