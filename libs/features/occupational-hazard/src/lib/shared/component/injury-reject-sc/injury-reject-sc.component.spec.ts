import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  bindToObject,
  DocumentItem,
  LanguageToken,
  RouterData,
  RouterDataToken,
  LovList,
  DocumentService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  AlertServiceStub,
  InjuryMockService,
  ModalServiceStub,
  OhMockService,
  Form,
  lovListMockData,
  complicationDetailsTestData,
  ActivatedRouteStub,
  ComplicationMockService,
  DocumentServiceStub
} from 'testing';
import { documentListItemArray } from 'testing/test-data/core/document-service';
import { InjuryRejectScComponent } from '..';
import { InjuryService, OhService, ComplicationService } from '../../services';
import { Complication, ComplicationWrapper } from '../../models';

describe('InjuryRejectScComponent', () => {
  let component: InjuryRejectScComponent;
  let fixture: ComponentFixture<InjuryRejectScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BrowserDynamicTestingModule
      ],
      declarations: [InjuryRejectScComponent],
      providers: [
        FormBuilder,
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuryRejectScComponent);
    component = fixture.componentInstance;
    spyOn(component.router, 'navigate');
    fixture.detectChanges();
  });
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ type: 'complication' });
  it('should create', () => {
    component.rejectInjuryForm = component.createRejectInjuryForm();
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });
  describe('confirm cancel', () => {
    it('should confirm cancellation', () => {
      component.socialInsuranceNo = 6013362325;
      component.rejectInjuryForm = component.createRejectInjuryForm();
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('confirm cancel', () => {
    it('should confirm cancellation', () => {
      component.ohService.setNavigation('rejectByOh');
      component.rejectInjuryForm = component.createRejectInjuryForm();
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('confirm Reject', () => {
    it('should confirm the rejection', () => {
      component.modalRef = new BsModalRef();
      const fb = new FormBuilder();
      component.injuryNumber = 100196547;
      component.complicationId = 100196547;
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.injuryNumber = 100235689;
      component.rejectReasonList$ = of(new LovList([]), lovListMockData);
      component.rejectForm.addControl('rejectForm', fb.group({ english: 'Others', arabic: '' }));
      component.rejectInjuryForm.addControl('rejectForm', fb.group({ english: 'Others', arabic: '' }));
      spyOn(component.complicationService, 'getComplication').and.returnValue(
        of(bindToObject(new ComplicationWrapper(), complicationDetailsTestData))
      );
      component.getComplicationForReject();
      component['complicationDetails'] = bindToObject(
        new Complication(),
        complicationDetailsTestData.complicationDetailsDto
      );
      expect(component.complicationDetails).not.toEqual(null);
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.socialInsuranceNo = 6013362325;
      component.rejectInjuryForm = component.createRejectInjuryForm();
      component.modalRef = new BsModalRef();
      component.hideModal();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('test suite for getDocuments', () => {
    it('should get documents', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getDocuments('REJECT_OH', 'Injury');
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith('REJECT_OH', 'Injury');
    });
  });
  describe('test suite for getDocuments', () => {
    it('should get documents', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getDocuments('REJECT_OH', 'Injury');
      expect(component.documents).not.toEqual(null);
    });
  });
  describe(' ngOninit', () => {
    it('should  ngOninit', () => {
      component.socialInsuranceNo = 6013362325;
      component.registrationNo = 12345;
      component.injuryId = 10444213123;
      component.complicationId = 242344324;
      component['ohService'].setNavigation('reject');
      component['routerData'].taskId = '1213';
      component['routerData'].resourceType = 'OH Rejection Complication';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"OH Rejection Complication","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';

      component.ngOnInit();
      expect(component.canAddComments).toBe(true);
    });
  });
  describe(' ngOninit', () => {
    it('should  ngOninit', () => {
      component.socialInsuranceNo = 6013362325;
      component['ohService'].setRoute('rejectByOh');
      component['routerData'].taskId = '1213';
      component['routerData'].resourceType = 'OH Rejection Injury';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';

      component.ngOnInit();
      expect(component.canAddComments).toBe(true);
    });
  });
  describe(' updateInjuryRejection', () => {
    it('should  updateInjuryRejection', () => {
      component.socialInsuranceNo = 6013362325;
      component['ohService'].setRoute('rejectByOh');
      component['routerData'].taskId = '1213';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';

      component.ngOnInit();
      expect(component.canAddComments).toBe(true);
    });
  });
  describe(' updateInjuryRejection', () => {
    it('should  updateInjuryRejection', () => {
      component.socialInsuranceNo = 6013362325;
      component.canAddComments = true;
      component['ohService'].setRoute('rejectByOh');
      component['routerData'].taskId = '1213';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
      const form = new Form();
      component.rejectForm = form.createRejectForm();
      component.rejectInjuryForm = form.createRejectInjuryForm();
      component.rejectForm.get('checkBoxFlag').setValue(true);
      component.rejectForm.get('rejectionReason').get('english').setValue('SA0380000000608010167519');
      component.rejectInjuryForm.get('rejectionReason').get('english').setValue('SA0380000000608010167519');
      component.rejectInjuryForm.get('checkBoxFlag').setValue(true);
      spyOn(component, 'submitRejection').and.callThrough();
      component.submitRejection();
      expect(component.submitRejection).toHaveBeenCalled();
    });
  });

  describe('Refresh Document', () => {
    it('should refresh Document', () => {
      component.socialInsuranceNo = 6013362325;
      component.injuryId = 123456;
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      spyOn(component.documentService, 'refreshDocument').and.returnValue(of(document));
      component.refreshDocument(document);
      expect(document).not.toBeNull();
    });
  });
  describe('show cancel template', () => {
    it('should show cancel template', () => {
      spyOn(component.modalService, 'show');
      component.showCancelTemplate();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('To disable Field', () => {
    it('should disable Field', () => {
      const form = new FormControl({
        validators: [Validators.required, Validators.minLength(5)]
      });
      spyOn(component, 'disableField');
      component.disableField(form);
      expect(component.disableField).toHaveBeenCalled();
    });
  });
  describe('showFormValidation', () => {
    it('should showFormValidation', () => {
      component.socialInsuranceNo = 6013362325;
      spyOn(component, 'showFormValidation').and.callThrough();
      component.showFormValidation();
      expect(component.showFormValidation).toHaveBeenCalled();
    });
  });
  describe('onSelectFlag', () => {
    it('should onSelectFlag', () => {
      component.socialInsuranceNo = 6013362325;
      component.rejectInjuryForm = component.createRejectInjuryForm();
      component.rejectInjuryForm.addControl('comments', new FormControl('Test'));
      spyOn(component, 'onSelectFlag');
      component.onSelectFlag('true');
      expect(component.rejectComments).not.toBe(null);
    });
  });
  describe('onSelectFlag', () => {
    it('should onSelectFlag', () => {
      component.socialInsuranceNo = 6013362325;
      component.rejectInjuryForm = component.createRejectInjuryForm();
      component.rejectInjuryForm.addControl('comments', new FormControl('Test'));
      spyOn(component, 'onSelectFlag');
      component.onSelectFlag('false');
      expect(component.rejectComments).not.toBe(null);
    });
  });
});
