import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UuidGeneratorService } from '@gosi-ui/core';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub, genericDocumentItem, genericError, RequestCertificateServiceStub } from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentKeyEnum, RequestCertificateService } from '../../../shared';
import { ZakatCertificateScComponent } from './zakat-certificate-sc.component';
const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ registrationNo: 987654321 });

describe('ZakatCertificateScComponent', () => {
  let component: ZakatCertificateScComponent;
  let fixture: ComponentFixture<ZakatCertificateScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ZakatCertificateScComponent],
      providers: [
        ...commonProviders,
        { provide: RequestCertificateService, useClass: RequestCertificateServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        UuidGeneratorService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZakatCertificateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On load', () => {
    it('component should fetch the registration number and uuid', () => {
      component.registrationNo = undefined;
      component.initialise(component.route.paramMap).subscribe(() => {
        expect(component.uuid).toBeDefined();
      });
    });
    it('component should handle document fetch error', () => {
      component.registrationNo = undefined;
      spyOn(component.alertService, 'showError');
      spyOn(component.documentService, 'getRequiredDocuments').and.returnValue(throwError(genericError));
      component.initialise(component.route.paramMap).subscribe(() => {
        expect(component.uuid).toBeDefined();
        expect(component.documents.length).toBe(0);
        expect(component.alertService.showError).toHaveBeenCalled();
      });
    });
    it('component should only load document if application is private', () => {
      spyOn(component, 'createForm');
      component.initialise(component.route.paramMap).subscribe(() => {
        expect(component.isPrivateChannel).toBeTrue();
        expect(component.isMain).toBeFalse();
        expect(component.createForm).toHaveBeenCalled();
      });
    });
  });

  describe('Generate Document', () => {
    beforeEach(() => {
      component.form = component.createForm();
    });
    it('should successfully generate the document', () => {
      component.form.get('fromDate').get('gregorian').setValue('15/05/2021');
      component.form.get('toDate').get('gregorian').setValue(new Date());
      spyOn(component.alertService, 'showSuccessByKey');
      spyOn(component.requestService, 'generateCertificate').and.returnValue(of({ fileName: 'test', blob: undefined }));
      component.registrationNo = 652315489;
      component.generateDocument();
      expect(component.alertService.showSuccessByKey).toHaveBeenCalledWith(EstablishmentKeyEnum.GENERATE_CERT_SUCCESS);
    });
    it('should throw form validation', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      spyOn(component.requestService, 'getCertificateDetails').and.returnValues(throwError(genericError));
      component.generateDocument();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
    it('should throw document validation', () => {
      component.form.get('fromDate').get('gregorian').setValue('15/05/2021');
      component.form.get('toDate').get('gregorian').setValue(new Date());
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.registrationNo = 652315489;
      component.isPrivateChannel = true;
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
});
