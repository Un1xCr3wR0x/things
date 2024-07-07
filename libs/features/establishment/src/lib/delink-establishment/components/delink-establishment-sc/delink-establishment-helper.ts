/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Alert, AlertTypeEnum, BilingualText, getIdentityByType, Person, scrollToTop } from '@gosi-ui/core';
import { noop, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  ActionTypeEnum,
  Admin,
  AdminRoleEnum,
  BranchList,
  DelinkBranch,
  ErrorCodeEnum,
  EstablishmentActionEnum,
  EstablishmentConstants,
  EstablishmentEligibilityEnum,
  EstablishmentErrorKeyEnum,
  EstablishmentQueryKeysEnum,
  EstablishmentRoutesEnum,
  filterIdentities,
  getDocumentContentIds,
  QueryParam
} from '../../../shared';
import { assembleAdminToAdminDto, getAdminRole, getBranchRequest, mapAdminRolesToId } from '../../../shared/utils';
import { DelinkEstablishmentScComponent } from './delink-establishment-sc.component';

//Method to fetch the delinked branches
export const fetchDelinkedBranches = (updatedBranches: BranchList[]): DelinkBranch[] => {
  const newDelinkedBranches: DelinkBranch[] = [];
  updatedBranches.forEach(branch => {
    if (branch.recordActionType === ActionTypeEnum.ADD || branch.recordActionType === ActionTypeEnum.REMOVE) {
      newDelinkedBranches.push({ registrationNo: branch.registrationNo, recordActionType: branch.recordActionType });
    }
  });
  return newDelinkedBranches;
};
//mathod to save selected branches
export const saveBranches = (self: DelinkEstablishmentScComponent) => {
  const delinkedBranches = fetchDelinkedBranches([...self.selectedBranches, ...self.unSelectedBranches]);
  if (delinkedBranches.length === 0 && self.referenceNo) {
    if (self.isDelinkToNewGroup) {
      self.wizardTwoSelectedPage(1, false, self.wizardTwoSearchParam);
    } else {
      fetchNewLinkedGroupDetails(self);
    }
    self.selectedWizard(1);
  } else if (delinkedBranches.length === 0 && !self.referenceNo) {
    self.alertService.showErrorByKey('ESTABLISHMENT.ERROR.ERR-DELINK-NOT-SELECT');
  } else {
    self.changeGrpEstablishmentService
      .saveDelinkedEstablishment(self.mainEstablishmentRegNo, {
        branches: delinkedBranches,
        comments: self.deLinkForm.get('comments').value,
        referenceNo: self.referenceNo,
        navigationIndicator: self.changeGrpEstablishmentService.getNavigationIndicator(
          self.isDelinkToNewGroup ? EstablishmentActionEnum.DELINK_NEW_GRP : EstablishmentActionEnum.DELINK_OTHER,
          false,
          self.isValidator,
          self.appToken
        ),
        contentIds: [],
        newMainRegNo: null,
        newAdmin: null
      })
      .subscribe(
        res => {
          if (self.selectedBranches?.length > 0) {
            self.distinctLE = self.selectedBranches[0].legalEntity.english;
          }
          self.referenceNo = +res?.transactionId;
          self.unSelectedBranches = [];
          self.selectedBranches = [];
          self.selectedBranchesRegNo = [];
          if (self.newMainEstablishmentRegNo && !self.isDelinkToNewGroup) {
            fetchNewLinkedGroupDetails(self);
          } else if (self.isDelinkToNewGroup) {
            self.wizardTwoSelectedPage(1, false, self.wizardTwoSearchParam);
          }
          self.selectedWizard(1);
          scrollToTop();
        },
        err => {
          self.alertService.showError(err?.error?.message, err?.error?.details);
        }
      );
  }
};
/**
 * Method to update the new/linked group details
 * @param self
 * @param isFinalSubmit
 */
export const updateBranches = (
  self: DelinkEstablishmentScComponent,
  isFinalSubmit: boolean,
  isAdminSubmit: boolean
) => {
  self.changeGrpEstablishmentService
    .updateDelinkedEstablishment(self.mainEstablishmentRegNo, {
      branches: [],
      comments: self.deLinkForm.get('comments').value,
      referenceNo: self.referenceNo,
      navigationIndicator: self.changeGrpEstablishmentService.getNavigationIndicator(
        self.isDelinkToNewGroup ? EstablishmentActionEnum.DELINK_NEW_GRP : EstablishmentActionEnum.DELINK_OTHER,
        isFinalSubmit,
        self.isValidator,
        self.appToken
      ),
      contentIds: isFinalSubmit ? getDocumentContentIds(self.documents) : [],
      newMainRegNo: self.newMainEstablishmentRegNo,
      newAdmin: assembleAdminToAdminDto(
        isAdminSubmit
          ? self.deLinkForm?.get('chooseAdmin')?.get('english').value === self.createAdminSelection
            ? self.newGroupAdmin
            : self.parentGroupAdmin
          : self.isDelinkToNewGroup
            ? null
            : self.parentGroupAdmin
      )
    })
    .pipe(
      catchError(err => {
        self.alertService.showError(err.error.message, err.error.details);
        return throwError(err);
      }),
      tap(res => {
        if (isFinalSubmit) {
          self.transactionFeedback = res;
          if (self.isValidator) {
            self.updateBpm(self.estRouterData, self.deLinkForm.get('comments').value, res.successMessage).subscribe(
              () => {
                self.setTransactionComplete();
                self.router.navigate([EstablishmentConstants.ROUTE_TO_INBOX(self.appToken)]);
              },
              err => {
                self.alertService.showError(err?.error?.message);
              }
            );
          } else {
            self.alertService.showSuccess(self.transactionFeedback.successMessage);
            self.setTransactionComplete();
            self.location.back();
          }
        } else {
          self.referenceNo = +res?.transactionId;
          if (self.currentTab + 1 === 2 && self.isDelinkToNewGroup && self.parentGroupAdmin === undefined) {
            self.deLinkForm?.get('chooseAdmin')?.get('english').setValue(self.createAdminSelection);
          }
          if (self.isAppPrivate) {
            self.getDocuments().subscribe(() => {
              self.selectedWizard(self.currentTab + 1);
              scrollToTop();
            });
          } else {
            self.selectedWizard(self.currentTab + 1);
          }
        }
      })
    )
    .subscribe(noop, noop);
};
//Method to fetch new linked group details
export const fetchNewLinkedGroupDetails = (self: DelinkEstablishmentScComponent) => {
  if (self.establishment?.registrationNo !== self.newMainEstablishmentRegNo) {
    self.establishmentService
      .getEstablishment(self.newMainEstablishmentRegNo)
      .pipe(
        tap(establishment => {
          self.establishment = establishment;
        }),
        catchError(err => {
          self.alertService.showError(err.error.message, err.error.details);
          return of([]);
        })
      )
      .subscribe(noop, noop);
  }
  if (self.newMainEstablishmentRegNo) {
    self.wizardTwoSelectedPage(1, true, self.wizardTwoSearchParam);
  }
};
export const cancelTransaction = (self: DelinkEstablishmentScComponent) => {
  if ((self.referenceNo || self.isValidator) && self.mainEstablishmentRegNo) {
    self.changeEstablishmentService.revertTransaction(self.mainEstablishmentRegNo, self.referenceNo).subscribe(
      () => {
        self.setTransactionComplete();
        if (self.isValidator) {
          self.router.navigate([EstablishmentRoutesEnum.VALIDATOR_DELINK]);
        } else navigateOnCancel(self);
      },
      err => self.alertService.showError(err?.error?.message)
    );
  } else if (self.mainEstablishmentRegNo) {
    self.setTransactionComplete();
    navigateOnCancel(self);
  } else {
    self.setTransactionComplete();
    self.location.back();
  }
};
export const navigateOnCancel = (self: DelinkEstablishmentScComponent) => {
  self.isAppPrivate
    ? self.changeEstablishmentService.navigateToGroupProfile(self.mainEstablishmentRegNo)
    : self.location.back();
};

export const initialiseInfoMessage = (self: DelinkEstablishmentScComponent) => {
  self.infoDetails = new Alert();
  self.infoDetails.message = undefined;
  self.infoDetails.dismissible = false;
  self.infoDetails.details = [];
  self.establishmentService
    .getBranchEstablishmentsWithStatus(self.registrationNo, getBranchRequest(self.pageSize, 0, [], false), [])
    .subscribe(
      res => {
        const branchStatus = res.branchStatus;
        if (branchStatus?.closedEstablishments + branchStatus?.activeEstablishments !== branchStatus.totalBranches) {
          self.showInfo = true;
          self.infoDetails.details.push({ ...new Alert(), messageKey: 'ESTABLISHMENT.INFO.DELINK-REGISTERED-ONLY' });
        }
      },
      err => self.alertService.showError(err?.error?.message, err?.error?.details)
    );
};
export const searchEstablishment = (
  self: DelinkEstablishmentScComponent,
  registrationNo: number,
  legalEntity: string,
  searchTerm: FormControl
) => {
  const queryParams = [
    { queryKey: EstablishmentQueryKeysEnum.LEGAL_ENTITY, queryValue: legalEntity },
    { queryKey: EstablishmentQueryKeysEnum.NEW_MAIN_REG_NO, queryValue: registrationNo }
  ];
  if (self.referenceNo) {
    queryParams.push({ queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER, queryValue: self.referenceNo });
  }
  self.changeGrpEstablishmentService
    .checkEligibility(self.mainEstablishmentRegNo, queryParams)
    .pipe(
      switchMap(eligiblity => {
        const findEligiblity = eligiblity.find(status => status.key === EstablishmentEligibilityEnum.DELINK);
        if (findEligiblity && findEligiblity.eligible) {
          self.newMainEstablishmentRegNo = registrationNo;
          self.wizardTwoSelectedPage(1, true, self.wizardTwoSearchParam);
          return self.establishmentService.getEstablishment(registrationNo);
        } else if (findEligiblity) {
          return throwError({
            error: self.changeGrpEstablishmentService.mapValidationMessagesToAlert(
              findEligiblity.messages,
              AlertTypeEnum.DANGER
            )
          });
        }
      })
    )
    .subscribe(
      establishment => {
        searchTerm.disable();
        self.establishment = establishment;
      },
      err => self.alertService.showError(err?.error?.message, err?.error?.details)
    );
};
export const getSuperAdmin = (self: DelinkEstablishmentScComponent) => {
  self.establishmentService
    .getAdminsOfEstablishment(self.registrationNo)
    .pipe(
      map(res => {
        return res.admins.find(admin =>
          admin.roles.some(role => (role as BilingualText).english === AdminRoleEnum.SUPER_ADMIN)
        );
      }),
      switchMap(admin => {
        if (admin) {
          self.parentGroupAdmin = admin;
          self.parentGroupAdminIdentifier = getIdentityByType(admin.person.identity, admin.person.nationality.english);
          self.parentGroupAdminIdentifier.idType = 'ESTABLISHMENT.' + self.parentGroupAdminIdentifier.idType;
          return self.isValidator && self.isDelinkToNewGroup ? getNewSuperAdminDetail$(self) : of(undefined);
        } else {
          return of(undefined);
        }
      }),
      catchError(err => {
        return err?.error?.code === ErrorCodeEnum.ADMIN_NO_RECORD && self.isValidator && self.isDelinkToNewGroup
          ? getNewSuperAdminDetail$(self)
          : throwError(err);
      })
    )
    .subscribe(
      (newAdmin: Admin) => {
        self.newGroupAdmin = newAdmin;
        if (
          newAdmin &&
          ((self.parentGroupAdmin && newAdmin?.person?.personId !== self.parentGroupAdmin?.person?.personId) ||
            self.parentGroupAdmin === undefined)
        ) {
          self.personFormDetail.fromJsonToObject(self.newGroupAdmin.person);
          self.person = self.newGroupAdmin.person;
          self.deLinkForm.get('personExists').setValue(true);
          self.deLinkForm.get('isVerified').setValue(true);
          self.deLinkForm.get('chooseAdmin')?.get('english').setValue(self.createAdminSelection);
        }
      },
      err => {
        if (err?.error?.code === ErrorCodeEnum.ADMIN_NO_RECORD) {
          return null;
        } else {
          self.alertService.showError(err?.error?.message, err?.error?.details);
        }
      }
    );
};
export const getNewSuperAdminDetail$ = (self: DelinkEstablishmentScComponent): Observable<Admin> => {
  return self.establishmentService
    .getAdminsOfEstablishment(self.registrationNo, self.referenceNo)
    .pipe(map(res => res.admins[res.admins.length - 1]));
};
export const createDeLinkForm = (self: DelinkEstablishmentScComponent) => {
  return self.fb.group({
    comments: null,
    isVerified: false,
    isSaved: false,
    personExists: false,
    chooseAdmin: self.fb.group({
      english: [self.currentAdminSelection, { validators: Validators.required, updateOn: 'blur' }],
      arabic: null
    })
  });
};
export const getDelinkedBranchesCount = (self: DelinkEstablishmentScComponent) => {
  self.isLoading = true;
  self.isResultEmpty = false;
  self.establishmentService
    .getBranchEstablishmentsWithStatus(self.mainEstablishmentRegNo, getBranchRequest(self.pageSize, 0, [], false), [
      {
        queryKey: EstablishmentQueryKeysEnum.REFERENCE_NUMBER,
        queryValue: self.referenceNo
      },
      {
        queryKey: EstablishmentQueryKeysEnum.DELINKED_ONLY,
        queryValue: 'true'
      }
    ])
    .pipe(
      tap(branch => {
        self.isLoading = false;
        self.distinctLE = branch.branchList[0]?.legalEntity.english;
        self.delinkedBranchesCount = branch.branchStatus?.totalBranches;
        self.wizardOneSelectedPage(1, self.wizardOneSearchParam);
      }),
      catchError(err => {
        self.isLoading = false;
        if (err.error.code === ErrorCodeEnum.BRANCH_NO_RECORD) self.isResultEmpty = true;
        else self.alertService.showError(err?.error?.message, err?.error?.details);
        return of([]);
      })
    )
    .subscribe(noop, noop);
};
export const loadLovLists = (self: DelinkEstablishmentScComponent) => {
  if (self.isDelinkToNewGroup) {
    self.chooseAdminLovList = self.lookUpService.getAdminSelectionList();
    self.nationalityList$ = self.lookUpService.getNationalityList();
    self.genderList$ = self.lookUpService.getGenderList();
    self.cityList$ = self.lookUpService.getCityList();
    self.countryList$ = self.lookUpService.getCountryList();
  }
};
export const getBranches = (self: DelinkEstablishmentScComponent) => {
  self.establishmentService.getEstablishmentProfileDetails(self.registrationNo).subscribe(
    res => {
      self.mainEstablishmentRegNo = res.mainEstablishmentRegNo;
      if (self.referenceNo) {
        getDelinkedBranchesCount(self);
      } else {
        self.wizardOneSelectedPage(1, self.wizardOneSearchParam);
      }
    },
    err => {
      self.alertService.showError(err.error.message);
    }
  );
};
export const verifyAdmin = (self: DelinkEstablishmentScComponent) => {
  const admin = new Admin();
  admin.person.fromJsonToObject(self.deLinkForm.get('search').value);
  admin.person.role = EstablishmentConstants.EST_ADMIN;
  self.establishmentService
    .verifyPersonDetails(admin.person)
    .pipe(
      tap((personRes: Person) => {
        if (personRes) {
          const newGroupAdminIdentifier = getIdentityByType(personRes.identity, personRes.nationality?.english);
          if (self.parentGroupAdminIdentifier?.id === newGroupAdminIdentifier?.id) {
            self.alertService.showErrorByKey('ESTABLISHMENT.ERROR.SAME-AS-CURRENT-ADMIN');
            return throwError(null);
          } else {
            admin.person.fromJsonToObject(personRes);
            admin.roles = getAdminRole([AdminRoleEnum.SUPER_ADMIN]);
            self.deLinkForm.get('personExists').setValue(true);
          }
        } else {
          self.deLinkForm.get('personExists').setValue(false);
        }
        self.newGroupAdmin = admin;
        self.person = admin.person;
        self.personFormDetail.fromJsonToObject(self.newGroupAdmin.person);
        self.deLinkForm.get('isVerified').setValue(true);
      })
    )
    .subscribe(noop, err => {
      self.alertService.showError(err?.error?.message, err?.error?.details);
    });
};
export const saveAdmin = (self: DelinkEstablishmentScComponent, isFinalSubmit: boolean) => {
  if (self.deLinkForm.get('isVerified').value === true) {
    const newAdmin = new Admin();
    newAdmin.person = self.newGroupAdmin.person;
    if (self.deLinkForm.get('contactDetail').valid && self.deLinkForm.get('person').valid) {
      newAdmin.person?.fromJsonToObject((self.deLinkForm.get('person') as FormGroup)?.getRawValue());
      newAdmin.person.contactDetail = (self.deLinkForm.get('contactDetail') as FormGroup).getRawValue();
      newAdmin.person.identity = filterIdentities(newAdmin.person.identity);
      self.adminService
        .saveAsNewAdmin(newAdmin)
        .pipe(
          tap(res => {
            newAdmin.person.personId = res;
            newAdmin.roles = getAdminRole([AdminRoleEnum.SUPER_ADMIN]);
            self.newGroupAdmin = newAdmin;
            updateBranches(self, isFinalSubmit, true);
          })
        )
        .subscribe(noop, err => {
          self.alertService.showError(err?.error?.message, err?.error?.details);
        });
    } else {
      self.alertService.showMandatoryErrorMessage();
    }
  } else {
    self.alertService.showErrorByKey(EstablishmentErrorKeyEnum.VERIFY_ADMIN);
  }
};
export const getBranchEstablishmentsWithStatus = (
  self: DelinkEstablishmentScComponent,
  pageIndex: number,
  queryParams: QueryParam[],
  isLink: boolean,
  registrationNo: number,
  hideMol: boolean,
  statusFilter: BilingualText[],
  isWizardOne: boolean,
  searchParam: string
) => {
  self.isLoading = true;
  self.isResultEmpty = false;
  const adminId = !self.isAppPrivate ? self.changeGrpEstablishmentService?.loggedInAdminId : 0;
  const roles = getAdminRole([self.establishmentService.loggedInAdminRole]);
  const role = self.isAppPrivate ? undefined : mapAdminRolesToId(roles) ? mapAdminRolesToId(roles)[0] : undefined;
  self.establishmentService
    .getBranchEstablishmentsWithStatus(
      registrationNo,
      getBranchRequest(self.pageSize, pageIndex - 1, statusFilter, hideMol, searchParam, [], undefined, adminId, role),
      queryParams
    )
    .subscribe(
      branches => {
        self.isLoading = false;
        if (isWizardOne) {
          branches.branchList.forEach(branch => {
            if (branch.delinked) {
              self.selectedBranches.push(branch);
              self.selectedBranchesRegNo.push(branch.registrationNo);
              self.delinkedBranchesCount++;
            }
          });
          self.branches = branches.branchList;
          self.totalSearchBranchCount = branches.branchStatus?.totalBranches;
          if (!searchParam) {
            self.totalBranchCount = self.totalSearchBranchCount;
          }
          self.wizardOnePageDetails.currentPage = pageIndex;
        } else {
          if (isLink) {
            self.searchNewMainResult = branches.branchList;
            self.newGroupBranchesCount = branches?.branchStatus?.totalBranches;
          } else {
            self.delinkedBranches = branches.branchList;
            self.delinkedBranchesCount = branches?.branchStatus?.totalBranches;
            if (self.delinkedBranchesCount === 1) {
              self.onSelectMainEstablishment(self.delinkedBranches[0]);
            }
            self.delinkedBranches.map(branchItem => {
              if (branchItem.establishmentType.english === self.main) {
                branchItem.establishmentType.english = self.branch;
              }
              if (self.newMainEstablishmentRegNo === branchItem.registrationNo) {
                branchItem.establishmentType.english = self.main;
              }
              return branchItem;
            });
          }
          self.wizardTwoPageDetails.currentPage = pageIndex;
        }
      },
      err => {
        self.isLoading = false;
        if (err.error.code === ErrorCodeEnum.BRANCH_NO_RECORD) self.isResultEmpty = true;
        else self.alertService.showError(err?.error?.message, err?.error?.details);
      }
    );
};
