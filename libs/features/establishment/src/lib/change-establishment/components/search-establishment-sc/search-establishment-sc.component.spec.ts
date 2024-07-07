/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationTypeEnum, ApplicationTypeToken, bindToObject, Establishment } from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { of } from 'rxjs';
import { BilingualTextPipeMock, genericEstablishmentResponse } from 'testing';
import { EstablishmentConstants } from '../../../shared';
import { commonImports, commonProviders } from '../change-basic-details-sc/change-basic-details-sc.component.spec';
import { SearchEstablishmentScComponent } from './search-establishment-sc.component';
describe('SearchEstablishmentScComponent', () => {
  let component: SearchEstablishmentScComponent;
  let fixture: ComponentFixture<SearchEstablishmentScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchEstablishmentScComponent],
      imports: [...commonImports],
      providers: [{ provide: BilingualTextPipe, useClass: BilingualTextPipeMock }, ...commonProviders],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEstablishmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('initialise component', () => {
    it('should initialise component', () => {
      (component as any).appToken === ApplicationTypeEnum.PUBLIC;
      spyOn(component.alertService, 'clearAlerts');
      component.ngOnInit();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
    });
  });
  describe('search establishment', () => {
    it('should search establishment', () => {
      component.registrationNumber.setValue(100011182);
      spyOn(component.establishmentService, 'getEstablishmentProfileDetails').and.returnValue(
        of(bindToObject(new Establishment(), genericEstablishmentResponse))
      );
      spyOn(component.changeEstablishmentService, 'navigateToProfile');
      component.searchEstablishment();
      expect(component.establishmentService.getEstablishmentProfileDetails).toHaveBeenCalled();
    });
    it('should throw error', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage').and.callThrough();
      component.registrationNumber.setValue(null);
      component.searchEstablishment();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('Search to Profile', () => {
    it('should navigate if regNo', () => {
      component.registrationNumber.setValue(genericEstablishmentResponse.registrationNo);
      component.goToGroupProfile();
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.GROUP_PROFILE_ROUTE(genericEstablishmentResponse.registrationNo)
      ]);
    });
    it('should navigate if adminId', () => {
      component.ownerId.setValue(12123123);
      component.registrationNumber.setValue(genericEstablishmentResponse.registrationNo);
      component.goToGroupProfile();
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.GROUP_ADMIN_PROFILE_ROUTE(12123123)
      ]);
    });
  });
});
