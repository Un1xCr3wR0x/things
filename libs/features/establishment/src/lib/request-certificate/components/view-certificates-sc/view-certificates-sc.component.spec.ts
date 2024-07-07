import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ApplicationTypeEnum, RouterData, RouterDataToken } from '@gosi-ui/core';
import { noop, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { establishmentProfileResponse, genericError, RequestCertificateServiceStub } from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { activatedRouteStub } from '../../../profile/components/establishment-group-profile-sc/establishment-group-profile-sc.component.spec';
import {
  CertificateEnum,
  EstablishmentConstants,
  EstablishmentRoutingService,
  RequestCertificateService
} from '../../../shared';
import { ViewCertificatesScComponent } from './view-certificates-sc.component';

describe('ViewCertificatesScComponent', () => {
  let component: ViewCertificatesScComponent;
  let fixture: ComponentFixture<ViewCertificatesScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ViewCertificatesScComponent],
      providers: [
        ...commonProviders,
        { provide: RequestCertificateService, useClass: RequestCertificateServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        EstablishmentRoutingService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCertificatesScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the required eligible criterias if not eligible', () => {
    component.establishmentProfile = { ...establishmentProfileResponse };
    spyOn(component, 'showModal');
    component
      .getCertificateEligibility()
      .pipe(
        tap(() => {
          component.showEligibiltyCriteria(CertificateEnum.GOSI);
          component.showEligibiltyCriteria(CertificateEnum.ZAKAT);
          expect(component.router.navigate).toHaveBeenCalled();
        })
      )
      .subscribe(noop, noop);
  });

  it('error from eligibilty api should be handled', () => {
    component.establishmentProfile = { ...establishmentProfileResponse };
    spyOn(component.requestService, 'getCertificateEligibilty').and.returnValue(throwError(genericError));
    spyOn(component.alertService, 'showError');
    component.getCertificateEligibility().subscribe(() => {
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  it('should generate gosi certificate in gol', () => {
    component.establishmentProfile = { ...establishmentProfileResponse };
    spyOn(component, 'generateDocument');
    (component.appToken as any) = ApplicationTypeEnum.PUBLIC;
    component.generate(CertificateEnum.GOSI);
    expect(component.generateDocument).toHaveBeenCalled();
  });
  it('should navigate to  gosi certificate transaction in FO', () => {
    component.establishmentProfile = { ...establishmentProfileResponse };
    component.registrationNo = component.establishmentProfile.registrationNo;
    spyOn(component.authTokenService, 'getEntitlements').and.returnValue([
      {
        establishment: undefined,
        role: [101]
      }
    ]);
    spyOn(component, 'generateDocument');
    component.generate(CertificateEnum.GOSI);
    expect(component.generateDocument).not.toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith([
      EstablishmentConstants.GOSI_CERTIFICATE_ROUTE(component.establishmentProfile.registrationNo)
    ]);
  });
  it('should navigate to  zakat certificate transaction in FO', () => {
    component.establishmentProfile = {
      ...establishmentProfileResponse,
      registrationNo: 654897212,
      mainEstablishmentRegNo: 654897213,
      establishmentType: { english: 'Branch', arabic: '' }
    };
    component.registrationNo = component.establishmentProfile.registrationNo;
    component.isMain = false;
    spyOn(component.authTokenService, 'getEntitlements').and.returnValue([
      {
        establishment: undefined,
        role: [101]
      }
    ]);
    spyOn(component, 'generateDocument');
    component.generate(CertificateEnum.ZAKAT);
    expect(component.generateDocument).not.toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith([
      EstablishmentConstants.ZAKAT_CERTIFICATE_ROUTE(component.establishmentProfile.registrationNo)
    ]);
  });
  it('should navigate to  zakat certificate transaction in FO for main', () => {
    component.establishmentProfile = {
      ...establishmentProfileResponse
    };
    component.registrationNo = component.establishmentProfile.registrationNo;
    component.isMain = true;
    spyOn(component.authTokenService, 'getEntitlements').and.returnValue([
      {
        establishment: undefined,
        role: [101]
      }
    ]);
    spyOn(component, 'generateDocument');
    component.generate(CertificateEnum.ZAKAT);
    expect(component.generateDocument).not.toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith([
      EstablishmentConstants.ZAKAT_CERTIFICATE_MAIN_ROUTE(component.establishmentProfile.registrationNo)
    ]);
  });

  it('should show an error message if user is unauthorized to generate certificate', () => {
    (component.appToken as any) = ApplicationTypeEnum.PRIVATE;
    spyOn(component.authTokenService, 'getEntitlements').and.returnValue([
      {
        establishment: undefined,
        role: [103]
      }
    ]);
    spyOn(component, 'showModal');
    component.generate(CertificateEnum.GOSI);
    expect(component.showModal).toHaveBeenCalled();
  });

  describe('Generate Document', () => {
    it('should generate document as pdf', () => {
      component.establishmentProfile = {
        ...establishmentProfileResponse
      };
      spyOn(component.alertService, 'showSuccessByKey');
      spyOn(component.requestService, 'generateCertificate');
      component.registrationNo = component.establishmentProfile.registrationNo;
      component.isMain = true;
      component.downloadCertificate().subscribe(() => {
        expect(component.requestService.generateCertificate).toHaveBeenCalled();
      });
    });
  });
});
