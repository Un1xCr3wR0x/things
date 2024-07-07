import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { routerTokenData } from 'testing';
import { RouterConstants } from '../constants';
import { BPMTask, RouterData } from '../models';
import { RouterDataToken } from '../tokens';
import { RouterService } from './router.service';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('RouterService', () => {
  let service: RouterService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RouterDataToken, useValue: new RouterData() }
      ]
    });
    service = TestBed.inject(RouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Set the Router Data Token from inbox', () => {
    it('should navigate to manage person edit', () => {
      service.setRouterDataToken({ ...new BPMTask(), ...routerTokenData });
    });
    it('should set Router token', () => {
      service.setRouterDataTokenOnly({ ...new BPMTask(), ...routerTokenData });
    });
  });
  describe('Navigate to modules', () => {
    it('should navigate to establishment', () => {
      expect(service.navigateToEstablishment()).toBe(routerSpy.navigate(RouterConstants.ROUTE_ESTABLISHMENT));
    });
    it('should navigate to manage person', () => {
      expect(service.navigateToManagePerson()).toBe(routerSpy.navigate(RouterConstants.ROUTE_MANAGE_PERSON));
    });
    it('should navigate to contributor', () => {
      expect(service.navigateToContributor()).toBe(routerSpy.navigate(RouterConstants.ROUTE_CONTRIBUTOR));
    });
    it('should navigate to billing', () => {
      expect(service.navigateToBilling()).toBe(routerSpy.navigate(RouterConstants.ROUTE_VALIDATOR_BILLING));
    });
    it('should navigate to reject', () => {
      expect(service.navigateToRejectOh()).toBe(routerSpy.navigate(RouterConstants.ROUTE_INJURY_REJECT_VIEW));
    });
    it('should navigate to oh', () => {
      expect(service.navigateToOh()).toBe(routerSpy.navigate(RouterConstants.ROUTE_OH));
    });
    it('should navigate to validator', () => {
      //@ts-ignore
      expect(service.navigateToValidator()).toBe(routerSpy.navigate(RouterConstants.ROUTE_VALIDATOR));
    });
  });
  describe('navigationToEdit', () => {
    const transaction = routerTokenData.resourceType;
    it('should navigate to manage person', () => {
      service.navigateToEdit();
      expect(transaction).toBe(RouterConstants.TRANSACTION_ADD_IQAMA || RouterConstants.TRANSACTION_ADD_BORDER);
      expect(service.navigateToManagePerson()).toBe(routerSpy.navigate(RouterConstants.ROUTE_MANAGE_PERSON));
    });
  });
});
