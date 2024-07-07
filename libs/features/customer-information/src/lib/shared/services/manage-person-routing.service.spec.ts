/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IdentityTypeEnum, Role, RouterConstants, RouterDataToken } from '@gosi-ui/core';
import { genericRouteData } from 'testing';
import { CimRoutesEnum } from '../enums';
import { ManagePersonRoutingService } from './manage-person-routing.service';

const routerSpy = { navigate: jasmine.createSpy('navigate') };
describe('ManagePersonRoutingService', () => {
  let service: ManagePersonRoutingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RouterDataToken, useValue: genericRouteData }
      ]
    });
    service = TestBed.inject(ManagePersonRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Copy the global token to local token', () => {
    it('should set local token task id to null', () => {
      service.routerData.taskId = undefined;
      spyOn(service, 'navigateTo');
      service.setToLocalToken();
      expect(service.navigateTo).not.toHaveBeenCalled();
    });
    it('should navigate to edit state when task id is not null', () => {
      const taskId = 'a08b0620-c027-41a3-9325-e1c6e42db559';
      service.routerData.taskId = taskId;
      spyOn(service, 'navigateTo');
      service.setToLocalToken();
      expect(service.navigateTo).toHaveBeenCalled();
    });
  });

  describe('navigate To Validator', () => {
    it('should navigate To Validator', () => {
      service.navigateToValidator(IdentityTypeEnum.BORDER);
      expect(service.router.navigate).toHaveBeenCalledWith([CimRoutesEnum.VALIDATOR_ADD_BORDER]);
    });
  });
  describe('navigate To validator add border', () => {
    it('should navigate To validator add border', () => {
      service.navigateToValidatorAddBorder();
      expect(service.router.navigate).toHaveBeenCalledWith([CimRoutesEnum.VALIDATOR_ADD_BORDER]);
    });
  });
  describe('navigate To validator add iqama', () => {
    it('should navigate To validator add iqama', () => {
      service.navigateToValidatorAddIqama();
      expect(service.router.navigate).toHaveBeenCalledWith([CimRoutesEnum.VALIDATOR_ADD_IQAMA]);
    });
  });
  describe('navigate To contributor search', () => {
    it('should navigate To contributor search', () => {
      service.navigateToContributorSearch();
      expect(service.router.navigate).toHaveBeenCalledWith([CimRoutesEnum.CONTRIBUTOR_SEARCH]);
    });
  });
  describe('navigate To user search', () => {
    it('should navigate To user search', () => {
      service.navigateToUserSearch();
      expect(service.router.navigate).toHaveBeenCalledWith([CimRoutesEnum.USER_SEARCH]);
    });
  });
  describe('navigate To update address', () => {
    it('should navigate To update address', () => {
      service.navigateToUpdateAddress();
      expect(service.router.navigate).toHaveBeenCalledWith([CimRoutesEnum.USER_UPDATE_ADDRESS]);
    });
  });
  describe('Navigate To', () => {
    it('should route to add-iqama', () => {
      service.routerData.assignedRole = Role.EST_ADMIN;
      service.navigateTo(RouterConstants.TRANSACTION_ADD_IQAMA);
      expect(service.router.navigate).toHaveBeenCalledWith([CimRoutesEnum.CONTRIBUTOR_PROFILE_ADD_IQAMA]);
    });
    it('should route to add-border', () => {
      service.routerData.assignedRole = Role.EST_ADMIN;
      service.navigateTo(RouterConstants.TRANSACTION_ADD_BORDER);
      expect(service.router.navigate).toHaveBeenCalledWith([CimRoutesEnum.CONTRIBUTOR_PROFILE_ADD_BORDER]);
    });
  });
});
