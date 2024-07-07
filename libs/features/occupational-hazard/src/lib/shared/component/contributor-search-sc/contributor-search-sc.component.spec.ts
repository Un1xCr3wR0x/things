/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, ApplicationTypeToken, ApplicationTypeEnum, bindToObject, LanguageToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { throwError, of, BehaviorSubject } from 'rxjs';
import {
  AlertServiceStub,
  ComplicationMockService,
  ContributorMockService,
  genericError,
  InjuryMockService,
  OhMockService,
  sinResponseData,
  injuryHistoryResponseTestData,
  injuryHistoryResponseTestDataTwo
} from 'testing';
import { OHReportTypes } from '../../enums';
import { ComplicationService, ContributorService, InjuryService, OhService } from '../../services';
import { ContributorSearchScComponent } from './contributor-search-sc.component';
import { ContributorSearchResult, InjuryHistoryResponse } from '../../models';

describe('ContributorSearchScComponent', () => {
  let component: ContributorSearchScComponent;
  let fixture: ComponentFixture<ContributorSearchScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [ContributorSearchScComponent],
      providers: [
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: ContributorService, useClass: ContributorMockService },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorSearchScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe(' ngOnInit', () => {
    it('should  ngOnInit', () => {
      spyOn(component.ohService, 'getReportType');
      component.ngOnInit();
      expect(component.ohService.getReportType).not.toBe(null);
    });
  });
  describe(' setReportType', () => {
    it('should  setReportType', () => {
      spyOn(component.ohService, 'setReportType');
      component.setReportType(OHReportTypes.Injury);
      expect(component.ohService.setReportType).toHaveBeenCalled();
    });
  });
  describe(' searchContributor', () => {
    it('should  searchContributor', () => {
      const socialinsuranceno = 601336235;
      spyOn(component.contributorService, 'getContributorSearch').and.returnValue(of(new ContributorSearchResult()));
      component.searchContributor(socialinsuranceno);
      expect(component.contributors).not.toBe(null);
    });
  });
  describe('searchContributor', () => {
    it('searchContributor should throw error', () => {
      const socialinsuranceno = 601336235;
      component.contributors = [sinResponseData];
      spyOn(component.contributorService, 'getContributorSearch').and.returnValue(throwError(genericError));
      component.searchContributor(socialinsuranceno);
      expect(component.error).toBeFalsy();
    });
  });
  describe('getInjuryList', () => {
    it('to get InjuryList', () => {
      component.checkInjuryList();
      spyOn(component.ohService, 'getOhHistory').and.returnValue(
        of(bindToObject(new InjuryHistoryResponse(), injuryHistoryResponseTestDataTwo))
      );
      expect(component.noInjuryList).not.toBe(null);
    });
  });
  describe('getInjuryList', () => {
    it('to get InjuryList', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.ohService, 'getOhHistory').and.returnValue(
        of(bindToObject(new InjuryHistoryResponse(), injuryHistoryResponseTestData))
      );
      component.checkInjuryList();
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/oh/complication/add']);
    });
  });
  describe('checkInjuryList', () => {
    it('checkInjuryList should throw error', () => {
      spyOn(component.ohService, 'getOhHistory').and.returnValue(throwError(genericError));
      component.checkInjuryList();
      expect(component.error).toBeFalsy();
    });
  });

  describe(' selectContributor', () => {
    it('should  selectContributor', () => {
      spyOn(component.alertService, 'showErrorByKey');
      component.ohService.setPersonDetails(sinResponseData);
      component.selectedType = OHReportTypes.Complication;
      component.ohService.setReportType(OHReportTypes.Complication);
      component.isValidNonSaudiContributor = false;
      component.selectContributor(sinResponseData);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
  });
  describe(' selectContributor', () => {
    it('should  selectContributor', () => {
      spyOn(component.alertService, 'showErrorByKey');
      component.ohService.setPersonDetails(sinResponseData);
      component.selectedType = OHReportTypes.Complication;
      component.ohService.setReportType(OHReportTypes.Complication);
      component.isValidSaudiContributor = false;
      component.selectContributor(sinResponseData);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
  });
  describe(' selectContributor', () => {
    it('should  selectContributor', () => {
      spyOn(component.ohService, 'setPersonDetails');
      component.ohService.setPersonDetails(sinResponseData);
      component.selectedType = OHReportTypes.Complication;
      component.ohService.setReportType(OHReportTypes.Complication);
      component.isValidSaudiContributor = false;
      component.selectContributor(sinResponseData);
      expect(component.ohService.setPersonDetails).toHaveBeenCalled();
    });
  });
  describe(' selectContributor', () => {
    it('should  selectContributor', () => {
      spyOn(component.ohService, 'setSocialInsuranceNo');
      component.ohService.setSocialInsuranceNo(sinResponseData.socialInsuranceNo);
      component.selectedType = OHReportTypes.Complication;
      component.ohService.setReportType(OHReportTypes.Complication);
      component.isValidSaudiContributor = false;
      component.selectContributor(sinResponseData);
      expect(component.ohService.setSocialInsuranceNo).toHaveBeenCalled();
    });
  });
  describe(' contributorSearchError', () => {
    it('should  contributorSearchError', () => {
      spyOn(component.alertService, 'showErrorByKey');
      component.contributorSearchError();
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
  });
  describe(' selectContributor', () => {
    it('should  selectContributor', () => {
      spyOn(component.alertService, 'showErrorByKey');
      component.ohService.setPersonDetails(sinResponseData);
      component.selectedType = OHReportTypes.Complication;
      component.ohService.setReportType(OHReportTypes.Complication);
      component.isValidGCCContributor = false;
      component.selectContributor(sinResponseData);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
  });
  describe(' selectContributor', () => {
    it('should  selectContributor', () => {
      spyOn(component.alertService, 'showErrorByKey');
      component.ohService.setPersonDetails(sinResponseData);
      component.ohService.setReportType(OHReportTypes.Injury);
      component.selectedType = OHReportTypes.Injury;
      component.isValidSaudiContributor = true;
      component.isValidGCCContributor = true;
      component.isValidNonSaudiContributor = false;
      component.selectContributor(sinResponseData);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
  });
  describe(' selectContributor', () => {
    it('should  selectContributor', () => {
      spyOn(component, 'checkNonSaudiConditions');
      component.ohService.setPersonDetails(sinResponseData);
      component.ohService.setReportType(OHReportTypes.Injury);
      component.selectedType = OHReportTypes.Injury;
      component.isValidSaudiContributor = true;
      component.isValidGCCContributor = true;
      component.isValidNonSaudiContributor = true;
      component.contributorType = 'NON_SAUDI';
      component.selectContributor(sinResponseData);
      expect(component.checkNonSaudiConditions).toHaveBeenCalled();
    });
  });
  describe(' selectContributor', () => {
    it('should  selectContributor', () => {
      spyOn(component, 'checkNonSaudiConditions');
      component.ohService.setPersonDetails(sinResponseData);
      component.ohService.setReportType(OHReportTypes.Complication);
      component.selectedType = OHReportTypes.Complication;
      component.isValidSaudiContributor = true;
      component.isValidGCCContributor = true;
      component.isValidNonSaudiContributor = true;
      component.contributorType = 'NON_SAUDI';
      component.selectContributor(sinResponseData);
      expect(component.checkNonSaudiConditions).toHaveBeenCalled();
    });
  });
  describe(' checkForGCC', () => {
    it('should  checkForGCC', () => {
      spyOn(component, 'checkForGCC');
      spyOn(component.router, 'navigate');
      component.ohService.setPersonDetails(sinResponseData);
      component.ohService.setReportType(OHReportTypes.Complication);
      component.selectedType = OHReportTypes.Complication;
      component.isValidSaudiContributor = true;
      component.isValidGCCContributor = true;
      component.isValidNonSaudiContributor = true;
      component.selectContributor(sinResponseData);
      expect(component.checkForGCC).toHaveBeenCalled();
    });
  });
  describe(' checkForGCC', () => {
    it('should  checkForGCC', () => {
      spyOn(component, 'checkForGCC');
      spyOn(component.router, 'navigate');
      component.ohService.setPersonDetails(sinResponseData);
      component.ohService.setReportType(OHReportTypes.Injury);
      component.selectedType = OHReportTypes.Injury;
      component.isValidSaudiContributor = true;
      component.isValidGCCContributor = true;
      component.isValidNonSaudiContributor = true;
      component.selectContributor(sinResponseData);
      expect(component.checkForGCC).toHaveBeenCalled();
    });
  });
  describe(' selectContributor', () => {
    it('should  selectContributor', () => {
      spyOn(component.alertService, 'showErrorByKey');
      component.ohService.setPersonDetails(sinResponseData);
      component.ohService.setReportType(OHReportTypes.Injury);
      component.selectedType = OHReportTypes.Injury;
      component.isValidSaudiContributor = false;
      component.selectContributor(sinResponseData);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
  });
  describe(' selectContributor', () => {
    it('should  selectContributor', () => {
      component.isValidGCCContributor = false;
      component.ohService.setPersonDetails(sinResponseData);
      component.selectedType = OHReportTypes.Injury;
      spyOn(component.alertService, 'showErrorByKey');
      component.ohService.setReportType(OHReportTypes.Injury);
      component.isValidGCCContributor = false;
      component.selectContributor(sinResponseData);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
  });
  describe('clearAlerts', () => {
    it('should clearAlerts', () => {
      spyOn(component.alertService, 'clearAlerts');
      component.clearAlerts();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
    });
  });
});
