import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Params } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { noop, Observable, of, throwError } from 'rxjs';
import { ActivatedRouteStub, BilingualTextPipeMock, genericError, RequestCertificateServiceStub } from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { CertificateEnum, RequestCertificateService } from '../../../shared';
import { CertificateIneligibilityScComponent } from './certificate-ineligibility-sc.component';

const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub(
  { registrationNo: 987654321 },
  { certificateType: CertificateEnum.GOSI, isMain: false }
);

describe('CertificateIneligibilityScComponent', () => {
  let component: CertificateIneligibilityScComponent;
  let fixture: ComponentFixture<CertificateIneligibilityScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...commonImports, NgxPaginationModule],
      providers: [
        ...commonProviders,
        { provide: RequestCertificateService, useClass: RequestCertificateServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      declarations: [CertificateIneligibilityScComponent, BilingualTextPipeMock],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateIneligibilityScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Check if valid Route', () => {
    it('should return true if registration no exists in route and certificate type is GOSI', () => {
      const queryParams: Params = { certificateType: CertificateEnum.GOSI, isMain: false };
      component.hasRegNoAndType(params$({ registrationNo: 987654321 }), params$(queryParams)).subscribe(res => {
        expect(res).toBeTrue();
        expect(component.certificateType).toBe(CertificateEnum.GOSI);
        expect(component.isMain).toBe(false);
      });
    });
    it('should return true if registration no exists in route and certificate type is GOSI and should be of main', () => {
      const queryParams: Params = { certificateType: CertificateEnum.GOSI, isMain: 'true' };
      component.hasRegNoAndType(params$({ registrationNo: 987654321 }), params$(queryParams)).subscribe(res => {
        expect(res).toBeTrue();
        expect(component.isMain).toBe(true);
      });
    });
    it('should return false if registration no doesnot exists in route and certificate type is GOSI', () => {
      const queryParams: Params = { certificateType: CertificateEnum.GOSI, isMain: false };
      component.hasRegNoAndType(of(undefined), params$(queryParams)).subscribe(noop, err => {
        expect(err).toBeDefined();
      });
    });
    it('should return false if certificate type doesnot exists', () => {
      const queryParams: Params = { isMain: false };
      component.hasRegNoAndType(params$({ registrationNo: 987654321 }), params$(queryParams)).subscribe(noop, err => {
        expect(err).toBeDefined();
      });
    });
  });

  describe('Initialise', () => {
    it('should initialise for zakat certificate', () => {
      component.certificateType = CertificateEnum.ZAKAT;
      spyOn(component, 'hasRegNoAndType').and.returnValue(of(true));
      component.initialise().subscribe(() => {
        expect(component.heading).toBe('ESTABLISHMENT.ZAKAT-INELIGIBILITY');
      });
    });
    it('should initialise for zakat certificate for main', () => {
      component.certificateType = CertificateEnum.ZAKAT;
      component.isMain = true;
      spyOn(component, 'hasRegNoAndType').and.returnValue(of(true));
      component.initialise().subscribe(() => {
        expect(component.heading).toBe('ESTABLISHMENT.ZAKAT-INELIGIBILITY-MAIN');
      });
    });
    it('should initialise for zakat certificate for main', () => {
      component.certificateType = CertificateEnum.ZAKAT_GROUP;
      component.isMain = true;
      spyOn(component, 'hasRegNoAndType').and.returnValue(of(true));
      component.initialise().subscribe(() => {
        expect(component.heading).toBe('ESTABLISHMENT.ZAKAT-INELIGIBILITY-GROUP');
      });
    });
    it('should handle get eligibilty error', () => {
      component.certificateType = CertificateEnum.ZAKAT_GROUP;
      component.isMain = true;
      spyOn(component.alertService, 'showError');
      spyOn(component, 'hasRegNoAndType').and.returnValue(of(true));
      spyOn(component.requestService, 'getCertificateEligibilty').and.returnValue(throwError(genericError));
      component.initialise().subscribe(() => {
        expect(component.alertService.showError).toHaveBeenCalled();
      });
    });
    it('handle null response', () => {
      component.certificateType = CertificateEnum.ZAKAT_GROUP;
      component.isMain = true;
      spyOn(component, 'hasRegNoAndType').and.returnValue(of(true));
      spyOn(component.requestService, 'getCertificateEligibilty').and.returnValue(of(undefined));
      component.initialise().subscribe(() => {
        expect(component.reasons).toBeUndefined();
        expect(component.totalReasons).toBeUndefined();
      });
    });
  });

  describe('Navigate Back', () => {
    it('should go back to previous page in browser history', () => {
      spyOn(component.location, 'back').and.callFake(() => {});
      component.navigateBack();
      expect(component.location.back).toHaveBeenCalled();
    });
  });

  describe('Select Page', () => {
    it('should go to selected page no', () => {
      expect(component.currentPage).toBe(1);
      component.selectPage(2);
      expect(component.currentPage).toBe(2);
    });
  });
});

const params$ = (keyValue): Observable<ParamMap> => {
  return of(convertToParamMap(keyValue));
};
