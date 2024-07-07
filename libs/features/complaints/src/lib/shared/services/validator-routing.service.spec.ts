/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed, inject } from '@angular/core/testing';
import { ValidatorRoutingService } from './validator-routing.service';
import { RouterDataToken, RouterData, ApplicationTypeToken, ApplicationTypeEnum, RouterConstants } from '@gosi-ui/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoryEnum } from '../enums';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
export const routerSpy = { url: '', navigate: jasmine.createSpy('navigate') };

describe('ValidatorRoutingService', () => {
  let service: ValidatorRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: Router, useValue: routerSpy },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(ValidatorRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('setRouterToken', () => {
    it('navigate to validator if complaints', inject([RouterDataToken], (token: RouterData) => {
      token.resourceType = 'Complaint';
      service.routerData.resourceType = 'Complaint';
      service.setRouterToken();
      expect(token).toBeDefined();
      expect(token.resourceType).toEqual(CategoryEnum.COMPLAINT);
      service.navigateTo();
      expect(RouterConstants).toBeDefined();
      expect(service.routerData).toBeDefined();
      expect(service.routerData.resourceType).toBeDefined();
    }));
    it('navigate to validator if enquiry', inject([RouterDataToken], (token: RouterData) => {
      token.resourceType = 'Enquiry';
      service.routerData.resourceType = 'Enquiry';
      service.setRouterToken();
      expect(token).toBeDefined();
      expect(token.resourceType).toEqual(CategoryEnum.ENQUIRY);
      service.navigateTo();
      expect(RouterConstants).toBeDefined();
      expect(service.routerData).toBeDefined();
      expect(service.routerData.resourceType).toBeDefined();
    }));
    it('navigate to validator if appeal', inject([RouterDataToken], (token: RouterData) => {
      token.resourceType = 'Appeal';
      service.routerData.resourceType = 'Appeal';
      service.setRouterToken();
      expect(token).toBeDefined();
      expect(token.resourceType).toEqual(CategoryEnum.APPEAL);
      service.navigateTo();
      expect(RouterConstants).toBeDefined();
      expect(service.routerData).toBeDefined();
      expect(service.routerData.resourceType).toBeDefined();
    }));
    it('navigate to validator if plea', inject([RouterDataToken], (token: RouterData) => {
      token.resourceType = 'Plea';
      service.routerData.resourceType = 'Plea';
      service.setRouterToken();
      expect(token).toBeDefined();
      expect(token.resourceType).toEqual(CategoryEnum.PLEA);
      service.navigateTo();
      expect(RouterConstants).toBeDefined();
      expect(service.routerData).toBeDefined();
      expect(service.routerData.resourceType).toBeDefined();
    }));
    it('navigate to validator if suggestion', inject([RouterDataToken], (token: RouterData) => {
      token.resourceType = 'Suggestion';
      service.routerData.resourceType = 'Suggestion';
      service.setRouterToken();
      expect(token).toBeDefined();
      expect(token.resourceType).toEqual(RouterConstants.TRANSACTION_SUGGESTION);
      service.navigateTo();
      expect(RouterConstants).toBeDefined();
      expect(service.routerData).toBeDefined();
      expect(service.routerData.resourceType).toBeDefined();
    }));
  });
});
