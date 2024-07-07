/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  EstablishmentRouterData,
  EstablishmentToken,
  RouterConstants,
  RouterData,
  RouterDataToken,
  TransactionService
} from '@gosi-ui/core';
import { TransactionServiceStub } from 'testing';
import { EstablishmentConstants } from '../constants';
import { EstablishmentRoutesEnum } from '../enums';
import { EstablishmentRoutingService } from './establishment-routing.service';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('EstablishmentRoutingService', () => {
  let service: EstablishmentRoutingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: EstablishmentToken, useValue: new EstablishmentRouterData() },
        { provide: TransactionService, useValue: TransactionServiceStub }
      ]
    });
    service = TestBed.inject(EstablishmentRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('navigate To Validator', () => {
    it('should navigate To Validator basic details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_BASIC_DETAILS;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_BASIC_DETAILS]);
    });
    it('should navigate To Validator identifier details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_IDENTIFIER_DETAILS;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_IDENTIFIERS]);
    });
    it('should navigate To Validator bank details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_BANK_DETAILS;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_BANK_DETAILS]);
    });
    it('should navigate To Validator address details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_ADDRESS_DETAILS;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_ADDRESS_DETAILS]);
    });
    it('should navigate To Validator contact details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_CONTACT_DETAILS;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_CONTACT_DETAILS]);
    });
    it('should navigate To Validator owner details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_OWNER;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_CHANGE_OWNER]);
    });
    it('should navigate To Validator legal entity details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_LEGAL_ENTITY;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_LEGAL_ENTITY]);
    });
    it('should navigate To Validator register establishment', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_REGISTER_ESTABLISHMENT;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_REGISTER_ESTABLISHMENT]);
    });
    it('should navigate To Validator change main to branch establishment', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_MAIN_ESTABLISHMENT;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_CHANGE_MAIN_EST]);
    });
    it('should navigate To Validator delink establishment', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_DELINK_ESTABLISHMENT;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_DELINK]);
    });
    it('should navigate To Validator link establishment', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_LINK_ESTABLISHMENT;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_LINK_EST]);
    });
    it('should navigate To Validator replace super admin establishment', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_REPLACE_SUPER_ADMIN;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_REPLACE_SUPER_ADMIN]);
    });
    it('should navigate To Validator terminate establishment', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_TERMINATE_ESTABLISHMENT;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_TERMINATE]);
    });
    it('should navigate To Validator flag details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_FLAG_ESTABLISHMENT;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_FLAG]);
    });
    it('should navigate To Validator modify flag details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_MODIFY_FLAG_ESTABLISHMENT;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_FLAG]);
    });
    it('should navigate To Validator inspection details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_INSPECTION;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.INSURANCE_OP_HEAD_INSPECTION]);
    });
    it('should navigate To Validator modify latefee details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_LATE_FEE;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_LATE_FEE]);
    });
    it('should navigate To Validator add super admin', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_ADD_SUPER_ADMIN;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_REGISTER_SUPER_ADMIN]);
    });
    it('should navigate To Validator chnage mof payment details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_MOF_PAYMENT_DETAILS;
      service.navigateToValidator();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_CHANGE_MOF_PAYMENT]);
    });
  });
  describe('navigate To Edit', () => {
    it('should navigate To Edit basic details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_BASIC_DETAILS;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_BASIC_DETAILS]);
    });
    it('should navigate To Edit identifier details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_IDENTIFIER_DETAILS;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([
        EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_IDENTIFIER_DETAILS
      ]);
    });
    it('should navigate To Edit bank details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_BANK_DETAILS;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_BANK_DETAILS]);
    });
    it('should navigate To Edit contact details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_CONTACT_DETAILS;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_CONTACT_DETAILS]);
    });
    it('should navigate To Edit address details', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_ADDRESS_DETAILS;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_ADDRESS_DETAILS]);
    });
    it('should navigate To Edit add owner', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_EST_OWNER;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_OWNER]);
    });
    it('should navigate To Edit legal entity', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_LEGAL_ENTITY;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.ADMIN_EDIT_CHANGE_LEGAL_ENTITY]);
    });
    it('should navigate To register mol establishment', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_PROACTIVE_FEED;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentConstants.PROACTIVE_ADMIN_REENTER_ROUTE()]);
    });
    it('should navigate To edit change main to branch establishment', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_CHANGE_MAIN_ESTABLISHMENT;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.CHANGE_MAIN]);
    });
    it('should navigate To edit terminate establishment', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_TERMINATE_ESTABLISHMENT;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_TERMINATE]);
    });
    it('should navigate To edit replace super admin', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_REPLACE_SUPER_ADMIN;
      service.establishmentToken.registrationNo = 123456;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.REPLACE_SUPER_ADMIN_ROUTE(service.establishmentToken.registrationNo)
      ]);
    });
    it('should navigate To edit terminate gol establishment', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_GOL_TERMINATE_ESTABLISHMENT;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.VALIDATOR_TERMINATE_ADMIN_MODIFY]);
    });
    it('should navigate To edit flag establishment', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_FLAG_ESTABLISHMENT;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.ADD_FLAG]);
    });
    it('should navigate To edit modify flag establishment', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_MODIFY_FLAG_ESTABLISHMENT;
      service.establishmentToken.registrationNo = 123456;
      service.establishmentToken.flagId = 123456;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.MODIFY_FLAG_ROUTE(
          service.establishmentToken.registrationNo,
          service.establishmentToken.flagId
        )
      ]);
    });
    it('should navigate To edit add super admin', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_ADD_SUPER_ADMIN;
      service.establishmentToken.registrationNo = 123456;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.ROUTE_REGISTER_SUPER_ADMIN(service.establishmentToken.registrationNo)
      ]);
    });
    it('should navigate To edit late fee', () => {
      service.establishmentToken.resourceType = RouterConstants.TRANSACTION_LATE_FEE;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.MODIFY_LATE_FEE]);
    });
    it('should navigate To edit rased document', () => {
      service.establishmentToken.resourceType = RouterConstants.RASED_DOCUMENT_UPLOAD;
      service.navigateToEdit();
      expect(service.router.navigate).toHaveBeenCalledWith([EstablishmentRoutesEnum.RASED_DCOUMENT_UPLOAD]);
    });
  });
});
