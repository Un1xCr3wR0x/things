import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken, UuidGeneratorService } from '@gosi-ui/core';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub, genericDocumentItem, genericError, RequestCertificateServiceStub } from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentKeyEnum, RequestCertificateService } from '../../../shared';
import { GosiCertificateScComponent } from './gosi-certificate-sc.component';

const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ registrationNo: 987654321 });

const td_base = {
  imports: [...commonImports],
  declarations: [GosiCertificateScComponent],
  providers: [
    ...commonProviders,
    { provide: RequestCertificateService, useClass: RequestCertificateServiceStub },
    { provide: ActivatedRoute, useValue: activatedRouteStub },
    UuidGeneratorService
  ],
  schemas: [NO_ERRORS_SCHEMA]
};
describe('GosiCertificateScComponent', () => {
  let component: GosiCertificateScComponent;
  let fixture: ComponentFixture<GosiCertificateScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(td_base).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GosiCertificateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On load', () => {
    it('component should not be accessed if application is public', () => {
      spyOn(component.location, 'back');
      component.initialise(component.route.paramMap).subscribe(() => {
        expect(component.location.back).not.toHaveBeenCalled();
      });
    });
    it('component handle error for document fetch', () => {
      spyOn(component.location, 'back');
      spyOn(component.alertService, 'showError');
      spyOn(component.documentService, 'getRequiredDocuments').and.returnValue(throwError(genericError));
      component.initialise(component.route.paramMap).subscribe(() => {
        expect(component.location.back).not.toHaveBeenCalled();
        expect(component.alertService.showError).toHaveBeenCalled();
        expect(component.documents?.length).toBe(0);
      });
    });
  });

  describe('Generate Document', () => {
    it('should successfully generate the document', () => {
      spyOn(component.alertService, 'showSuccessByKey');
      spyOn(component.requestService, 'generateCertificate').and.returnValue(of({ fileName: 'test', blob: undefined }));
      component.generateDocument();
      expect(component.alertService.showSuccessByKey).toHaveBeenCalledWith(EstablishmentKeyEnum.GENERATE_CERT_SUCCESS);
    });
    it('should handle api error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.requestService, 'getCertificateDetails').and.returnValues(throwError(genericError));
      component.generateDocument();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should throw error in documents is not scanned', () => {
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.documents = [
        {
          ...genericDocumentItem,
          uploadFailed: true,
          show: true,
          required: true,
          documentContent: null,
          fromJsonToObject: () => undefined
        }
      ];
      component.generateDocument();
      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });
  });

  describe('cancelModal', () => {
    it('should hide the modal', () => {
      spyOn(component, 'hideModal').and.callFake(() => {});
      component.cancelModal();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
});

describe('GosiCertificateScComponent in GOL', () => {
  let component: GosiCertificateScComponent;
  let fixture: ComponentFixture<GosiCertificateScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule(td_base);
    await TestBed.overrideProvider(ApplicationTypeToken, { useValue: ApplicationTypeEnum.PUBLIC });
    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GosiCertificateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('If accessed from GOL', () => {
    it(' should navigate back', () => {
      spyOn(component.location, 'back');
      component.ngOnInit();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
});
