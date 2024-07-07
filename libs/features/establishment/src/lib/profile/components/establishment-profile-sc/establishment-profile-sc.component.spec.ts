/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import {
  Alert,
  AppConstants,
  ApplicationTypeEnum,
  BilingualText,
  Establishment,
  EstablishmentProfile,
  EstablishmentStatusEnum,
  getIdentityByType,
  MenuService,
  ProactiveStatusEnum,
  RoleIdEnum,
  RouterConstants,
  StorageService,
  WorkflowService
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { noop, of, throwError } from 'rxjs';
import {
  BilingualTextPipeMock,
  branchEligibilityResponse,
  branchListItemGenericResponse,
  establishmentProfileResponse,
  establishmentResponse,
  EstablishmentServiceStub,
  flagDetailsMock,
  FlagEstablishmentStubService,
  genericAdminWrapper,
  genericError,
  genericEstablishmentResponse,
  genericGccEstablishment,
  genericInspectionResponse,
  genericMainEstInfo,
  genericOhRateResponse,
  genericOwnerReponse,
  genericPersonResponse,
  mainEstablishmentMockData,
  MenuServiceStub,
  StorageServiceStub,
  terminateResponseMock,
  workflowRequest,
  WorkflowServiceStub
} from 'testing';
import {
  commonImports,
  commonProviders,
  routerSpy
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import {
  AdminRoleEnum,
  AdminWrapper,
  BranchEligibility,
  ErrorCodeEnum,
  EstablishmentActionEnum,
  EstablishmentConstants,
  EstablishmentEligibilityEnum,
  EstablishmentErrorKeyEnum,
  EstablishmentRoutesEnum,
  EstablishmentRoutingService,
  EstablishmentService,
  EstablishmentTypeEnum,
  EstablishmentWorkFlowStatus,
  FlagEstablishmentService,
  getEstablishmentStatusErrorKey,
  isEstRegPending,
  LegalEntityEnum,
  mapAdminRolesToId,
  OHRate,
  ProfileConstants,
  WorkFlowStatusType
} from '../../../shared';
import { canEditAnyEstTransaction, checksBeforeTransaction } from '../../../shared/utils/workflow-helper';
import { activatedRouteStub } from '../establishment-group-profile-sc/establishment-group-profile-sc.component.spec';
import {
  canEditEstablishment,
  checkCloseNavigation,
  enableEstablishmentAccess,
  enableManageAdminRoute,
  getAdminsOfEstablishment,
  getEstablishmentAndMain,
  getFlagDetails,
  getSafetyDetails,
  handleAdminOwnerAndLegalEntity,
  handleOwners,
  handleProfileState,
  handleViolations,
  mapBilingualToAlert,
  setStateVariables,
  showModal,
  showRestrictAddFlagModal
} from './establishment-profile-helper';
import { EstablishmentProfileScComponent } from './establishment-profile-sc.component';
import { getTerminateStatus } from './establishment-terminate-helper';

class EstablishmentRoutingServiceStub {
  previousUrl$ = of(null);
}
describe('EstablishmentProfileScComponent', () => {
  let component: EstablishmentProfileScComponent;
  let fixture: ComponentFixture<EstablishmentProfileScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstablishmentProfileScComponent],
      imports: [...commonImports],
      providers: [
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        {
          provide: EstablishmentService,
          useClass: EstablishmentServiceStub
        },
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        ...commonProviders,
        {
          provide: StorageService,
          useClass: StorageServiceStub
        },
        {
          provide: FlagEstablishmentService,
          useClass: FlagEstablishmentStubService
        },
        {
          provide: MenuService,
          useClass: MenuServiceStub
        },
        {
          provide: EstablishmentRoutingService,
          useClass: EstablishmentRoutingServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentProfileScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ng On init', () => {
    it('should initialise view ', () => {
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.returnValue(
        of({
          ...establishmentProfileResponse,
          ...{ status: { english: EstablishmentStatusEnum.REGISTERED, arabic: 'test' } }
        })
      );
      spyOn(component, 'navigateBack');
      component.storageService.setSessionValue(AppConstants.ESTABLISHMENT_REG_KEY, undefined);
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({
          registrationNo: genericEstablishmentResponse.registrationNo,
          adminId: genericPersonResponse.personId
        })
      );
      component.ngOnInit();
      expect(component.navigateBack).toHaveBeenCalled();
    });
    xit('should initialise view for establishment admin', () => {
      component.storageService.setSessionValue(
        AppConstants.ESTABLISHMENT_REG_KEY,
        genericEstablishmentResponse.registrationNo
      );
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.returnValue(
        of(establishmentProfileResponse)
      );
      spyOn(component, 'navigateBack');
      component.ngOnInit();
      expect(component.navigateBack).toHaveBeenCalled();
    });
    it('should initialise for validator', () => {
      component.estRouterData.taskId = 'test';
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_ADDRESS_DETAILS;
      component.ngOnInit();
      expect(component.viewMode).toBeTruthy();
    });
  });

  describe('Admin logs in and enter establishment profile screen', () => {
    xit('If Branches Account Manager then should show manage admin button and fetch the required establishment from the registration number in route', () => {
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({
          registrationNo: genericEstablishmentResponse.registrationNo,
          adminId: genericOwnerReponse.ownerId
        })
      );
      routerSpy.url = 'profile/user';
      component.establishmentService.loggedInAdminRole = AdminRoleEnum.SUPER_ADMIN;
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.returnValue(
        of(establishmentProfileResponse)
      );
      spyOn(component, 'navigateBack');
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
        of({
          ...genericEstablishmentResponse,
          status: { english: EstablishmentStatusEnum.REGISTERED, arabic: '' },
          outOfMarket: true
        })
      );
      component.initialiseWithRoute();
      expect(component.navigateBack).toHaveBeenCalled();
    });
    it('without registraion number in route in gosi online should get the value from session storage', () => {
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({
          adminId: genericOwnerReponse.ownerId
        })
      );
      component.storageService.setSessionValue(
        AppConstants.ESTABLISHMENT_REG_KEY,
        genericEstablishmentResponse.registrationNo
      );
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.establishmentService.loggedInAdminRole = AdminRoleEnum.SUPER_ADMIN;
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      spyOn(component.location, 'back').and.callFake(() => {});
      component.initialiseWithRoute();
      expect(component.alertService.showError).toHaveBeenCalled();
      expect(component.location.back).toHaveBeenCalled();
    });
  });

  describe('Get Owners of the establishment', () => {
    it('Fetch the owner of establishment', () => {
      component.establishment = {
        ...genericEstablishmentResponse,
        legalEntity: { english: LegalEntityEnum.INDIVIDUAL, arabic: '' }
      };
      spyOn(component.establishmentService, 'getOwnerDetails').and.returnValue(
        of({ owners: [genericOwnerReponse], molOwnerPersonId: [] })
      );
      handleOwners(component).subscribe(() => {
        expect(component.showOwnerSection).toBeTrue();
      });
    });
    it('If legal entity of establishment other than partnership or individual do not fetch owners or show owner section', () => {
      component.establishment = {
        ...genericEstablishmentResponse,
        legalEntity: { english: LegalEntityEnum.GOVERNMENT, arabic: '' }
      };
      handleOwners(component).subscribe(res => {
        expect(res?.length).toHaveSize(0);
        expect(component.showOwnerSection).toBeFalse();
      });
    });
    it('handle error', () => {
      component.establishment = {
        ...genericEstablishmentResponse,
        legalEntity: { english: LegalEntityEnum.PARTNERSHIP, arabic: '' }
      };
      spyOn(component.establishmentService, 'getOwnerDetails').and.returnValue(throwError(genericError));
      handleOwners(component).subscribe(res => {
        expect(res?.length).toHaveSize(0);
        expect(component.showOwnerSection).toBeTrue();
      });
    });
  });

  describe('Check for main and branch legal entities', () => {
    it('should throw an error if different', () => {
      component.mainEstablishment = {
        ...genericEstablishmentResponse,
        legalEntity: { english: LegalEntityEnum.PARTNERSHIP, arabic: '' }
      };
      component.establishmentProfile = {
        ...establishmentProfileResponse,
        legalEntity: { english: LegalEntityEnum.GOVERNMENT, arabic: '' }
      };
      handleProfileState(component).subscribe(noop, err => {
        expect(err.error.code).toBe(ErrorCodeEnum.LE_MISMATCH);
      });
    });
    it('If establishment is closed then throw error', () => {
      component.establishmentProfile = {
        ...establishmentProfileResponse,
        status: { english: EstablishmentStatusEnum.CLOSED, arabic: '' }
      };
      component.mainEstablishment = {
        ...genericEstablishmentResponse,
        legalEntity: { english: LegalEntityEnum.PARTNERSHIP, arabic: '' }
      };
      handleProfileState(component).subscribe(noop, err => {
        expect(err.error.code).toBe(ErrorCodeEnum.EST_CLOSED);
      });
    });
    it('Success if legal entity is same', () => {
      component.mainEstablishment = {
        ...genericEstablishmentResponse,
        legalEntity: { english: LegalEntityEnum.GOVERNMENT, arabic: '' }
      };
      component.establishmentProfile = {
        ...establishmentProfileResponse,
        legalEntity: { english: LegalEntityEnum.GOVERNMENT, arabic: '' }
      };
      handleProfileState(component).subscribe(res => {
        expect(res).toBeNull();
      });
    });

    it('should throw error if establishment is in pending for complete details', () => {
      component.mainEstablishment = {
        ...genericEstablishmentResponse,
        legalEntity: { english: LegalEntityEnum.GOVERNMENT, arabic: '' }
      };
      component.establishmentProfile = {
        ...establishmentProfileResponse,
        legalEntity: { english: LegalEntityEnum.GOVERNMENT, arabic: '' },
        status: undefined
      };
      const pendingEst = { ...genericEstablishmentResponse, proactiveStatus: 1 };
      component.workflowsInProgress = [getWorkflowResponseOfType(WorkFlowStatusType.COMPLETE_PROACTIVE)];
      expect(isEstRegPending(pendingEst)).toBe(true);
      handleProfileState(component).subscribe(noop, err => {
        expect(err?.error?.key).toBe(EstablishmentErrorKeyEnum.EST_REG_PENDING);
        expect(component.proactiveInWorkflow).toBeTrue();
        expect(component.completeRegMessage).toBeUndefined();
        expect(component.completeRegInWorkflow).toBeDefined();
      });
    });

    it('should show workflow request message in profile after complete proactive transaction', () => {
      const pendingEst = { ...genericEstablishmentResponse, proactiveStatus: 1 };
      component.mainEstablishment = {
        ...genericEstablishmentResponse,
        legalEntity: { english: LegalEntityEnum.GOVERNMENT, arabic: '' }
      };
      component.establishmentProfile = {
        ...establishmentProfileResponse,
        legalEntity: { english: LegalEntityEnum.GOVERNMENT, arabic: '' }
      };
      component.workflowsInProgress = [getWorkflowResponseOfType(WorkFlowStatusType.COMPLETE_PROACTIVE)];
      component.previousUrl = EstablishmentConstants.REGISTER_PROACTIVE_ROUTE(pendingEst.registrationNo);
      expect(isEstRegPending(pendingEst)).toBe(true);
      handleProfileState(component).subscribe(() => {
        expect(component.isProactivePending).toBeFalse();
      });
    });
  });

  describe('Get admin owners and check if legal entity can be changed', () => {
    it('handle api responses', () => {
      component.establishmentService.getAdminsOfEstablishment;
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(of(undefined));
      spyOn(component.establishmentService, 'getOwnerDetails').and.returnValue(
        of({ molOwnerPersonId: [], owners: [] })
      );
      spyOn(component.establishmentService, 'getWorkflowsInProgress').and.returnValue(of([]));
      component.establishmentProfile = { ...establishmentProfileResponse };
      component.establishment = { ...genericEstablishmentResponse };
      component.mainEstablishment = { ...genericEstablishmentResponse };
      handleAdminOwnerAndLegalEntity(component).subscribe(res => {
        expect(res?.length).toBe(3);
      });
    });
  });

  describe('Fetch Main and Branch establishments', () => {
    it('should fetch main if profile is of a branch', () => {
      const branchEst: Establishment = {
        ...genericEstablishmentResponse,
        registrationNo: 123,
        establishmentType: { english: EstablishmentTypeEnum.BRANCH, arabic: '' }
      };
      component.establishmentProfile = { ...establishmentProfileResponse };
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
        of({ ...branchEst, mainEstablishment: genericMainEstInfo })
      );
      getEstablishmentAndMain(component).subscribe(() => {
        expect(component.isMain).toBeFalse();
        expect(component.isMainRegistered).toBeTrue();
      });
    });
    it('should fetch main if profile is of a branch and check if est is closed', () => {
      const branchEst: Establishment = {
        ...genericEstablishmentResponse,
        registrationNo: 123,
        establishmentType: { english: EstablishmentTypeEnum.BRANCH, arabic: '' }
      };
      const mainEst: Establishment = {
        ...genericEstablishmentResponse,
        establishmentType: { english: EstablishmentTypeEnum.MAIN, arabic: '' },
        status: { english: EstablishmentStatusEnum.CLOSED, arabic: '' }
      };
      component.establishmentProfile = { ...establishmentProfileResponse };
      spyOn(component.establishmentService, 'getEstablishment').and.returnValues(of(branchEst), of(mainEst));
      getEstablishmentAndMain(component).subscribe(() => {
        expect(component.isMain).toBeFalse();
        expect(component.isMainRegistered).toBeFalse();
      });
    });
    it('do not fetch main if profile is of a main', () => {
      const branchEst: Establishment = {
        ...genericEstablishmentResponse,
        registrationNo: 123,
        mainEstablishmentRegNo: 123,
        establishmentType: { english: EstablishmentTypeEnum.MAIN, arabic: '' }
      };
      component.establishmentProfile = { ...establishmentProfileResponse };
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(branchEst));
      getEstablishmentAndMain(component).subscribe(() => {
        expect(component.isMain).toBeTrue();
      });
    });
  });

  describe('Validate for Legal Entity Change', () => {
    beforeEach(() => {
      component.workflowsInProgress = [];
    });
    it('should pass all criteria for a stand alone main ', () => {
      const testRegNo = 60355486;
      component.establishment = {
        ...establishmentResponse,
        registrationNo: testRegNo,
        status: { english: EstablishmentStatusEnum.REGISTERED, arabic: '' },
        proactiveStatus: 0
      };
      component.mainEstablishment = {
        legalEntity: genericEstablishmentResponse.legalEntity,
        registrationNo: testRegNo,
        status: { english: EstablishmentStatusEnum.REGISTERED, arabic: '' }
      };
      component.establishmentProfile = { ...establishmentProfileResponse, noOfBranches: 1 };
      const template = { key: 'testing' } as unknown as TemplateRef<HTMLElement>;
      component.navigateToLegalEntityChange(template, template);
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.CHANGE_LEGAL_ENTITY]);
    });
    it('should pass all criteria with no branches', () => {
      component.establishment = genericEstablishmentResponse;
      component.mainEstablishment = genericEstablishmentResponse;
      component.establishmentProfile = { ...establishmentProfileResponse, noOfBranches: 0 };
      const template = { key: 'testing' } as unknown as TemplateRef<HTMLElement>;
      component.navigateToLegalEntityChange(template, template);
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.CHANGE_LEGAL_ENTITY]);
    });
    it('should pass all criteria for different legal entity', () => {
      component.establishment = genericGccEstablishment;
      component.mainEstablishment = mainEstablishmentMockData;
      component.establishmentProfile = { ...establishmentProfileResponse, noOfBranches: 0 };
      const template = { key: 'testing' } as unknown as TemplateRef<HTMLElement>;
      component.navigateToLegalEntityChange(template, template);
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.CHANGE_LEGAL_ENTITY]);
    });
    it('should pass all criterias', () => {
      const est = { ...genericEstablishmentResponse };
      est.mainEstablishmentRegNo = est.registrationNo;
      component.establishment = component.mainEstablishment = est;
      component.establishmentProfile = { ...establishmentProfileResponse, noOfBranches: 0 };
      const template = { key: 'testing' } as unknown as TemplateRef<HTMLElement>;
      component.navigateToLegalEntityChange(template, template);
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.CHANGE_LEGAL_ENTITY]);
    });
    it('should pass since there are no brancehs', () => {
      const est = { ...genericEstablishmentResponse };
      est.mainEstablishmentRegNo = est.registrationNo;
      component.establishment = component.mainEstablishment = est;
      component.establishmentProfile = { ...establishmentProfileResponse, noOfBranches: 0 };
      const template = { key: 'testing' } as unknown as TemplateRef<HTMLElement>;
      component.navigateToLegalEntityChange(template, template);
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.CHANGE_LEGAL_ENTITY]);
    });
    it('cannot edit legal entity becauselegal entity already in workflow', () => {
      // const branches = 0;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      const legalEntityWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.LEGALENTITY);
      const ownerWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.OWNER);
      const basicWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.BASICDETAILS);
      const identifierWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.IDENTIFIER);
      const delinkWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.DELINK);
      const cbmWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.CBM);
      const linkWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.LINK_ESTABLISHMENT);
      const paymentWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.RECEIVE_CONT_PAYMENT);
      const cancelWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.CANCEL_RECEIPT);
      const penaltyWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.PENALTY_WAIVER);
      const creditWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.CREDIT_TRANSFER);
      const installmentWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.INSTALLMENT);
      component.establishment = component.mainEstablishment = genericEstablishmentResponse;
      component.establishmentProfile = { ...establishmentProfileResponse, noOfBranches: 0 };
      component.workflowsInProgress = [
        legalEntityWorkflow,
        ownerWorkflow,
        paymentWorkflow,
        installmentWorkflow,
        creditWorkflow,
        cancelWorkflow,
        penaltyWorkflow,
        basicWorkflow,
        identifierWorkflow,
        delinkWorkflow,
        linkWorkflow,
        cbmWorkflow
      ];
      const template = { key: 'testing' } as unknown as TemplateRef<HTMLElement>;
      component.navigateToLegalEntityChange(template, template);
      expect(
        component.editWarningMsg?.find(alert => alert.messageKey === 'ESTABLISHMENT.WARNING.LEGAL-ENTITY-WORKFLOW')
      ).toBeDefined();
    });
    it('For MOL Establishments legal entity cannot be changed', () => {
      const molEstablishment = {
        ...genericEstablishmentResponse,
        status: { english: EstablishmentStatusEnum.REGISTERED, arabic: '' },
        proactiveStatus: ProactiveStatusEnum.PENDING_MOL_OR_MCI
      };
      spyOn(component, 'showModal');
      component.establishment = component.mainEstablishment = molEstablishment;
      component.establishmentProfile = { ...establishmentProfileResponse, noOfBranches: 0 };
      const template = { key: 'testing' } as unknown as TemplateRef<HTMLElement>;
      component.navigateToLegalEntityChange(template, template);
      expect(component.showModal).toHaveBeenCalled();
    });
    it('For Main Establishment with having branches legal entity cannot be changed', () => {
      component.mainEstablishment = component.establishment = {
        ...genericEstablishmentResponse,
        status: { english: EstablishmentStatusEnum.REGISTERED, arabic: '' },
        proactiveStatus: ProactiveStatusEnum.NON_MOL
      };
      spyOn(component, 'showModal');
      component.establishment = genericEstablishmentResponse;
      component.establishmentProfile = { ...establishmentProfileResponse, noOfBranches: 3 };
      const template = { key: 'testing' } as unknown as TemplateRef<HTMLElement>;
      component.navigateToLegalEntityChange(template, template);
      expect(component.showModal).toHaveBeenCalled();
    });
    it('For Establishment Legal Entity same as that of main legal entity cannot be changed', () => {
      component.establishment = {
        ...genericEstablishmentResponse,
        legalEntity: { english: LegalEntityEnum.INDIVIDUAL, arabic: '' },
        proactiveStatus: 2,
        status: { english: EstablishmentStatusEnum.REGISTERED, arabic: '' }
      };
      component.mainEstablishment = {
        status: genericEstablishmentResponse?.status,
        legalEntity: { english: LegalEntityEnum.INDIVIDUAL, arabic: '' },
        registrationNo: 123
      };
      spyOn(component, 'showModal');
      component.establishmentProfile = { ...establishmentProfileResponse, noOfBranches: 0 };
      const template = { key: 'testing' } as unknown as TemplateRef<HTMLElement>;
      component.navigateToLegalEntityChange(template, template);
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('Check the workflow', () => {
    it('should not allow to edit any details', () => {
      const workflows: EstablishmentWorkFlowStatus[] = [];
      const establishment: EstablishmentProfile = {
        ...new EstablishmentProfile(),
        ...establishmentProfileResponse,
        status: { english: EstablishmentStatusEnum.REGISTERED, arabic: '' }
      };
      workflows.push(getWorkflowResponseOfType(WorkFlowStatusType.BASICDETAILS));
      workflows.push(getWorkflowResponseOfType(WorkFlowStatusType.IDENTIFIER));
      workflows.push(getWorkflowResponseOfType(WorkFlowStatusType.BANKDETAILS));
      workflows.push(getWorkflowResponseOfType(WorkFlowStatusType.CONTACTDETAILS));
      workflows.push(getWorkflowResponseOfType(WorkFlowStatusType.ADDRESSDETAILS));
      workflows.push(getWorkflowResponseOfType(WorkFlowStatusType.LEGALENTITY));
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.returnValue(
        of(establishmentProfileResponse)
      );
      component.establishment = genericEstablishmentResponse;
      component.mainEstablishment = genericEstablishmentResponse;
      spyOn(component.establishmentService, 'getWorkflowsInProgress').and.returnValue(of(workflows));
      canEditEstablishment(component, establishment);
      expect(component.canEditAddressDetails).toBeFalsy();
      expect(component.canEditBankDetails).toBeFalsy();
      expect(component.canEditBasicDetails).toBeFalsy();
      expect(component.canEditContactDetails).toBeFalsy();
      expect(component.canEditIdentifier).toBeFalsy();
    });
    it('If establishment closed and already contact and address in workflow then dont edit', () => {
      const workflows: EstablishmentWorkFlowStatus[] = [];
      component.establishment = genericEstablishmentResponse;
      component.mainEstablishment = genericEstablishmentResponse;
      const establishment: EstablishmentProfile = {
        ...new EstablishmentProfile(),
        ...establishmentProfileResponse,
        status: { english: EstablishmentStatusEnum.CLOSED, arabic: '' }
      };
      workflows.push(getWorkflowResponseOfType(WorkFlowStatusType.CONTACTDETAILS));
      workflows.push(getWorkflowResponseOfType(WorkFlowStatusType.ADDRESSDETAILS));
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.returnValue(
        of(establishmentProfileResponse)
      );
      spyOn(component.establishmentService, 'getWorkflowsInProgress').and.returnValue(of(workflows));
      canEditEstablishment(component, establishment);
      expect(component.canEditContactDetails).toBeFalsy();
      expect(component.canEditAddressDetails).toBeFalsy();
    });
  });

  describe('Navigate to establishment profile', () => {
    it('should navigate to profile with route', () => {
      component.branchList = [...[branchListItemGenericResponse]];
      component.branchList[0].status.english = EstablishmentStatusEnum.REGISTERED;
      component.navigateToProfile(branchListItemGenericResponse.registrationNo);
      expect(getEstablishmentStatusErrorKey(branchListItemGenericResponse.status.english)).toBeUndefined();
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.EST_PROFILE_ROUTE(branchListItemGenericResponse.registrationNo)
      ]);
    });
    it('should show restrict the navigation and inform the user ', () => {
      component.branchList = [...[branchListItemGenericResponse]];
      spyOn(component, 'showModal');
      component.branchList[0].status.english = EstablishmentStatusEnum.OPENING_IN_PROGRESS;
      component.navigateToProfile(branchListItemGenericResponse.registrationNo);
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('Can Establishment be viewed', () => {
    it('for closing in progress can view ', () => {
      const estProfile = { ...establishmentProfileResponse };
      estProfile.status.english = EstablishmentStatusEnum.CLOSING_IN_PROGRESS;
      spyOn(component.alertService, 'showErrorByKey');
      enableEstablishmentAccess(component, estProfile?.status?.english, true).subscribe(() => {
        expect(component.alertService.showErrorByKey).not.toHaveBeenCalled();
      });
    });
    it('opening in progress cannot view profile', () => {
      const estProfile = { ...establishmentProfileResponse };
      spyOn(component, 'showModal');
      estProfile.status.english = EstablishmentStatusEnum.OPENING_IN_PROGRESS;
      component.profileAccessErrorTemplate = { key: 'testing' } as unknown as TemplateRef<HTMLElement>;
      enableEstablishmentAccess(component, estProfile?.status?.english, true).subscribe(noop, err => {
        expect(err.error.code).toBe(ErrorCodeEnum.NO_PROFILE_ACCESS);
        expect(getEstablishmentStatusErrorKey(estProfile.status.english).valid).toBeFalsy();
      });
    });
  });

  describe('Navigate', () => {
    it('to back', () => {
      spyOn(component.location, 'back').and.callFake(() => {});
      component.navigateBack();
      expect(component.location.back).toHaveBeenCalled();
    });
    it('to route', () => {
      component.establishment = genericEstablishmentResponse;
      component.workflowsInProgress = [];
      component.isMainRegistered = true;
      component.hasDifferentLE = false;
      component.navigateToChange(WorkFlowStatusType.BANKDETAILS);
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.CHANGE_BANK_DETAILS]);
    });
  });
  describe('check before transaction', () => {
    it('should check before transaction for basic details', () => {
      component.workflowsInProgress = workflowRequest;
      component.isMainRegistered = true;
      component.hasDifferentLE = false;
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      checksBeforeTransaction(component, WorkFlowStatusType.BASICDETAILS, templateRef);
      expect(canEditAnyEstTransaction(component.isMainRegistered, component.hasDifferentLE)).toBeDefined();
    });
    it('should check before transaction for basic details', () => {
      component.workflowsInProgress = workflowRequest;
      component.isMainRegistered = false;
      component.hasDifferentLE = true;
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      checksBeforeTransaction(component, WorkFlowStatusType.BASICDETAILS, templateRef);
      expect(canEditAnyEstTransaction(component.isMainRegistered, component.hasDifferentLE)).toBeDefined();
    });
    it('should check before transaction for basic details diff LE', () => {
      const legalEntityWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.LEGALENTITY);
      const basicWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.BASICDETAILS);
      component.workflowsInProgress = [basicWorkflow, legalEntityWorkflow];
      component.isMainRegistered = true;
      component.hasDifferentLE = true;
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      checksBeforeTransaction(component, WorkFlowStatusType.BASICDETAILS, templateRef);
      expect(canEditAnyEstTransaction(component.isMainRegistered, component.hasDifferentLE)).toBeDefined();
    });
    it('should check before transaction for identifier details', () => {
      const legalEntityWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.LEGALENTITY);
      const identifierWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.IDENTIFIER);
      component.workflowsInProgress = [identifierWorkflow, legalEntityWorkflow];
      component.isMainRegistered = true;
      component.hasDifferentLE = false;
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      checksBeforeTransaction(component, WorkFlowStatusType.IDENTIFIER, templateRef);
      expect(canEditAnyEstTransaction(component.isMainRegistered, component.hasDifferentLE)).toBeDefined();
    });
    it('should check before transaction for bank details', () => {
      const bankWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.BANKDETAILS);
      const creditWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.CREDIT_TRANSFER);
      const creditRefundWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.CREDIT_REFUND_ESTABLISHMENT);
      component.workflowsInProgress = [bankWorkflow, creditRefundWorkflow, creditWorkflow];
      component.isMainRegistered = true;
      component.hasDifferentLE = false;
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      checksBeforeTransaction(component, WorkFlowStatusType.BANKDETAILS, templateRef);
      expect(canEditAnyEstTransaction(component.isMainRegistered, component.hasDifferentLE)).toBeDefined();
    });
    it('should check before transaction for contact details', () => {
      component.workflowsInProgress = workflowRequest;
      component.isMainRegistered = true;
      component.hasDifferentLE = false;
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      checksBeforeTransaction(component, WorkFlowStatusType.CONTACTDETAILS, templateRef);
      expect(canEditAnyEstTransaction(component.isMainRegistered, component.hasDifferentLE)).toBeDefined();
    });
    it('should check before transaction for address details', () => {
      component.workflowsInProgress = workflowRequest;
      component.isMainRegistered = false;
      component.hasDifferentLE = false;
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      checksBeforeTransaction(component, WorkFlowStatusType.ADDRESSDETAILS, templateRef);
      expect(canEditAnyEstTransaction(component.isMainRegistered, component.hasDifferentLE)).toBeDefined();
    });
  });
  describe('navigate to flag', () => {
    it('to navigate to flag', () => {
      component.establishment = genericEstablishmentResponse;
      component.navigateToFlags();
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentConstants.ADD_FLAG_ROUTE()]);
    });
  });
  describe('User Click On Group Action Item', () => {
    beforeEach(() => {
      component.establishment = new Establishment();
    });
    it('Close Establishment with canCloseEstablsihment as false', () => {
      component.isCloseNavigationInProgress = false;
      component.canCloseEstablsihment = false;
      spyOn(component.changeGroupEstablishmentService, 'checkEligibility').and.returnValue(
        of(branchEligibilityResponse)
      );
      component.navigateToFunctionality(EstablishmentActionEnum.CLOSE_EST);
      expect(component.changeGroupEstablishmentService.checkEligibility).not.toHaveBeenCalled();
    });
    it('Close Establishment', () => {
      component.isCloseNavigationInProgress = false;
      component.canCloseEstablsihment = true;
      spyOn(component.changeGroupEstablishmentService, 'checkEligibility').and.returnValue(
        of(branchEligibilityResponse)
      );
      component.navigateToFunctionality(EstablishmentActionEnum.CLOSE_EST);
      expect(component.changeGroupEstablishmentService.checkEligibility).toHaveBeenCalled();
    });
    it('Close Establishment with eligibility false', () => {
      component.isCloseNavigationInProgress = false;
      component.canCloseEstablsihment = true;
      const branchEligibilityResp = branchEligibilityResponse;
      branchEligibilityResp[1].eligible = false;
      spyOn(component.changeGroupEstablishmentService, 'checkEligibility').and.returnValue(
        of(branchEligibilityResponse)
      );
      component.navigateToFunctionality(EstablishmentActionEnum.CLOSE_EST);
      expect(component.changeGroupEstablishmentService.checkEligibility).toHaveBeenCalled();
    });
  });

  describe('getFlagDetails', () => {
    it('should call getFlagDetails', () => {
      const registrationNo = 200085744;
      spyOn(component.flagEstablishmentService, 'getFlagDetails').and.returnValue(of([flagDetailsMock]));
      getFlagDetails(component, registrationNo);
      expect(component.flagEstablishmentService.getFlagDetails).toHaveBeenCalled();
      expect(component.flags).toBeDefined();
    });
    it('should call getFlagDetails with error', () => {
      const registrationNo = 200085744;
      spyOn(component.flagEstablishmentService, 'getFlagDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      getFlagDetails(component, registrationNo);
      expect(component.flagEstablishmentService.getFlagDetails).toHaveBeenCalled();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('Get the admins', () => {
    it('handle the admin api failure', () => {
      const profileResponse: EstablishmentProfile = { ...establishmentProfileResponse };
      component.establishmentProfile = profileResponse;
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(throwError(genericError));
      getAdminsOfEstablishment(component).subscribe(admins => {
        expect(admins.length).toBe(0);
      });
    });
    it('If CSR Logs in without adminid', () => {
      component.adminId = undefined;
      const profileResponse: EstablishmentProfile = { ...establishmentProfileResponse };
      component.establishmentProfile = profileResponse;
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(of(genericAdminWrapper));
      getAdminsOfEstablishment(component).subscribe(admins => {
        expect(admins.length).not.toBe(0);
      });
    });
    it('If CSR Logs with registration number and get super admin id', () => {
      component.adminId = undefined;

      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      const profileResponse: EstablishmentProfile = { ...establishmentProfileResponse };
      component.establishmentProfile = profileResponse;
      const superAdminWrapper: AdminWrapper = new AdminWrapper();
      superAdminWrapper.admins = [
        { person: { ...genericPersonResponse }, roles: [{ english: AdminRoleEnum.SUPER_ADMIN, arabic: '' }] }
      ];
      const adminId = getIdentityByType(genericPersonResponse.identity, genericPersonResponse?.nationality?.english);
      spyOn(component.establishmentService, 'getAdminsOfEstablishment').and.returnValue(of(superAdminWrapper));
      getAdminsOfEstablishment(component).subscribe(admins => {
        expect(admins.length).not.toBe(0);
        expect(component.adminId).toEqual(adminId.id);
      });
    });
  });

  describe('On clicking close establishment', () => {
    it('should navigate to close establishment transaction', () => {
      spyOn(component, 'hideModal');
      component.navigateToClose();
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.CLOSE_ESTABLISHMENT]);
      expect(component.hideModal).toHaveBeenCalled();
    });
  });

  describe('Set the dropdown for NON MOL registered establishment', () => {
    it('dropdown should consists of terminate functionality', () => {
      component.isProactive = false;
      const regEst = {
        ...genericEstablishmentResponse,
        status: { english: EstablishmentStatusEnum.REGISTERED, arabic: '' }
      };
      component.establishment = regEst;
      component.setActions(regEst);
      expect(component.actionDropdown?.length).toEqual(ProfileConstants.establishmentActionsDropdown?.length);
    });
  });

  describe('Map Bilingual Message to Alert', () => {
    it('should return Alert', () => {
      expect(mapBilingualToAlert(component, [new BilingualText()])).toBeInstanceOf(Alert);
    });
  });

  describe(' enable manage admin route', () => {
    it('should enable manage admin route', () => {
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.establishmentService.loggedInAdminRole = 'Branches Account Manager';
      enableManageAdminRoute(component, genericAdminWrapper.admins);
      expect(component.showAdminButton).toBe(true);
    });
    it('should hide manage admin route for other admins', () => {
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.establishmentService.loggedInAdminRole = AdminRoleEnum.REG_ADMIN;
      enableManageAdminRoute(component, genericAdminWrapper.admins);
      expect(component.showAdminButton).toBe(false);
      expect(mapAdminRolesToId([{ english: AdminRoleEnum.REG_ADMIN, arabic: '' }])?.[0]).toBe(RoleIdEnum.REG_ADMIN);
    });
  });

  describe('Check for close navigation', () => {
    it('close navigation not in progress', () => {
      component.isCloseNavigationInProgress = false;
      component.canCloseEstablsihment = true;
      component.establishment = { ...genericEstablishmentResponse };
      const closeEligibility = new BranchEligibility();
      closeEligibility.key = EstablishmentEligibilityEnum.CLOSE_EST;
      closeEligibility.eligible = true;
      spyOn(component.changeGroupEstablishmentService, 'checkEligibility').and.returnValue(of([closeEligibility]));
      checkCloseNavigation(component);
      expect(component.isCloseNavigationInProgress).toBeFalse();
    });
    it('handle eror', () => {
      component.isCloseNavigationInProgress = false;
      component.canCloseEstablsihment = true;
      const closeEligibility = new BranchEligibility();
      closeEligibility.key = EstablishmentEligibilityEnum.CLOSE_EST;
      closeEligibility.eligible = true;
      component.establishment = { ...genericEstablishmentResponse };
      spyOn(component.changeGroupEstablishmentService, 'checkEligibility').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      checkCloseNavigation(component);
      expect(component.isCloseNavigationInProgress).toBeFalse();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('Show Restict Flag Modal', () => {
    it('should show modal', () => {
      spyOn(component, 'showModal');
      showRestrictAddFlagModal(component);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('navigate  to late fee', () => {
    it('cannot edit late fee beacuse late fee already in workflow', () => {
      // const branches = 0;
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      const legalEntityWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.LEGALENTITY);
      const lateFeeWorkflow = getWorkflowResponseOfType(WorkFlowStatusType.LATE_FEE);
      component.workflowsInProgress = [legalEntityWorkflow, lateFeeWorkflow];
      component.establishment = genericEstablishmentResponse;
      component.establishmentProfile = { ...establishmentProfileResponse, noOfBranches: 0 };
      component.navigateToModifyLateFee({ key: 'testing' } as unknown as TemplateRef<HTMLElement>);
      expect(component.editWarningMsg).toBeDefined();
    });
  });
  describe('navigate  to  mof payment', () => {
    it('navigate  to payment', () => {
      (component as any).appToken = ApplicationTypeEnum.PRIVATE;
      component.establishment = genericEstablishmentResponse;
      component.establishmentProfile = { ...establishmentProfileResponse, noOfBranches: 0 };
      component.navigateToViewMofPayment();
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VIEW_MOF_PAYMENT]);
    });
  });
  describe('Show Modal', () => {
    it('should trigger popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      showModal(component, modalRef);
      expect(modalRef).not.toEqual(null);
    });
  });
  describe('get Terminate Status', () => {
    it('should get terminate status', () => {
      component.establishment = genericEstablishmentResponse;
      component.establishment.outOfMarket = true;
      component.isEligibleUserMof = true;
      spyOn(component.terminateService, 'terminateEstablishment').and.returnValue(of(terminateResponseMock));
      getTerminateStatus(component, component.establishment);
      expect(component.terminateService.terminateEstablishment).toHaveBeenCalled();
    });
    it('should get terminate status with api error', () => {
      component.establishment = genericEstablishmentResponse;
      component.establishment.outOfMarket = true;
      component.isEligibleUserMof = true;
      spyOn(component.alertService, 'showError');
      spyOn(component.terminateService, 'terminateEstablishment').and.returnValue(throwError(genericError));
      getTerminateStatus(component, component.establishment);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('Get OH Rate details', () => {
    it('should get current oh rate', () => {
      const regNo = genericEstablishmentResponse.registrationNo;
      const ohRateDetails: OHRate = { ...genericOhRateResponse, baseRate: 2 };
      spyOn(component.safetyInspectionService, 'getEstablishmentOHRate').and.returnValue(of(ohRateDetails));
      getSafetyDetails(component, regNo);
      expect(component.safetyInspectionService.getEstablishmentOHRate).toHaveBeenCalled();
    });
    it('should handle error while getting current oh rate', () => {
      const regNo = genericEstablishmentResponse.registrationNo;
      spyOn(component.safetyInspectionService, 'getEstablishmentOHRate').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      getSafetyDetails(component, regNo);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('if oh rate is not 2 get the rased inspection details', () => {
      const regNo = genericEstablishmentResponse.registrationNo;
      const ohRateDetails: OHRate = { ...genericOhRateResponse, baseRate: 2, currentOhRate: 4 };
      spyOn(component.safetyInspectionService, 'getEstablishmentOHRate').and.returnValue(of(ohRateDetails));
      spyOn(component.safetyInspectionService, 'getEstablishmentInspectionDetails').and.returnValue(
        of(genericInspectionResponse)
      );
      getSafetyDetails(component, regNo);
      expect(component.safetyInspectionService.getEstablishmentInspectionDetails).toHaveBeenCalled();
    });
    it('should handle error while getting rased inspection details', () => {
      const regNo = genericEstablishmentResponse.registrationNo;
      const ohRateDetails: OHRate = { ...genericOhRateResponse, baseRate: 2, currentOhRate: 4 };
      spyOn(component.safetyInspectionService, 'getEstablishmentOHRate').and.returnValue(of(ohRateDetails));
      spyOn(component.safetyInspectionService, 'getEstablishmentInspectionDetails').and.returnValue(
        throwError(genericError)
      );
      spyOn(component.alertService, 'showError');
      getSafetyDetails(component, regNo);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('Handle Establishment Violations', () => {
    it('if not a gcc establishment and logged in user has access get the count of violations', () => {
      component.isGcc = false;
      component.establishment = genericEstablishmentResponse;
      const violationCount = { paidCount: 2, total: 11, unPaidCount: 4, donotImposePenaltyCount: 5 };
      spyOn(component.establishmentService, 'getViolationsCount').and.returnValue(of(violationCount));
      handleViolations(component).subscribe(() => {
        expect(component.showViolations).toBeTrue();
        expect(component.establishmentService.getViolationsCount).toHaveBeenCalled();
      }, noop);
    });
    it('Handle error for count', () => {
      component.isGcc = false;
      component.establishment = genericEstablishmentResponse;
      spyOn(component.alertService, 'showError');
      spyOn(component.establishmentService, 'getViolationsCount').and.returnValue(throwError(genericError));
      handleViolations(component).subscribe(() => {
        expect(component.showViolations).toBeTrue();
        expect(component.alertService.showError).toHaveBeenCalled();
      }, noop);
    });
    it('if  a gcc establishment or logged in user has no access do not show violation count', () => {
      component.isGcc = true;
      spyOn(component.establishmentService, 'isUserEligible').and.returnValue(false);
      spyOn(component.establishmentService, 'getViolationsCount');
      component.establishment = genericEstablishmentResponse;
      handleViolations(component).subscribe(() => {
        expect(component.showViolations).toBeFalse();
        expect(component.establishmentService.getViolationsCount).not.toHaveBeenCalled();
      }, noop);
    });
  });

  describe('Set State', () => {
    beforeEach(() => {
      component.establishment = { ...genericEstablishmentResponse, molEstablishmentIds: null, proactiveStatus: 0 };
      component.establishmentProfile = { ...establishmentProfileResponse, gccEstablishment: false };
    });
    it('should set establishment details Check if gcc establishment', () => {
      component.establishmentProfile.gccEstablishment = true;
      component.establishment.legalEntity.english = LegalEntityEnum.PARTNERSHIP;
      setStateVariables(component);
      expect(component.isGcc).toBeTrue();
      expect(component.isProactive).toBeFalse();
      expect(component.showMofPaymentDetails).toBeFalse();
      expect(component.showLateFeeIndicator).toBeFalse();
    });
    it('should set establishment details and check if registered through from mol or mci', () => {
      component.establishment.proactiveStatus = ProactiveStatusEnum.REG_MOL_OR_MCI;
      component.establishment.legalEntity.english = LegalEntityEnum.PARTNERSHIP;
      setStateVariables(component);
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      expect(component.isGcc).toBeUndefined();
      expect(component.isProactive).toBeTrue();
      expect(component.showMofPaymentDetails).toBeFalse();
      expect(component.showLateFeeIndicator).toBeFalse();
    });
    it('should show late fee indicator if non gcc and govt/semi govt establishment and app is private', () => {
      component.establishment.legalEntity.english = LegalEntityEnum.GOVERNMENT;
      setStateVariables(component);
      expect(component.isGcc).toBeUndefined();
      expect(component.isProactive).toBeFalse();
      expect(component.showMofPaymentDetails).toBeTrue();
      expect(component.showLateFeeIndicator).toBeTrue();
    });
  });
});

export function getWorkflowResponseOfType(type: WorkFlowStatusType): EstablishmentWorkFlowStatus {
  return {
    type: type,
    message: {
      english: 'workflow',
      arabic: 'workflow'
    },
    referenceNo: 12345,
    count: 0
  };
}
