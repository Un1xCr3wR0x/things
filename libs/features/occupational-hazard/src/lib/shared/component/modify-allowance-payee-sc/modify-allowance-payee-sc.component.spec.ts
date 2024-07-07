/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  bindToObject,
  DocumentItem,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  ComplicationMockService,
  ContributorMockService,
  documentListItemArray,
  DocumentServiceStub,
  InjuryMockService,
  ModalServiceStub,
  OhMockService,
  Form,
  genericError,
  genericErrorOh
} from 'testing';
import { ComplicationService, ContributorService, InjuryService, OhService } from '../../../shared/services';
import { InjuryConstants, OhConstants } from '../../constants';
import { ModifyAllowancePayeeScComponent } from './modify-allowance-payee-sc.component';
import { OhClaimsService } from '../../services/oh-claims.service';
let activatedRoute: ActivatedRouteStub;
activatedRoute = new ActivatedRouteStub();
activatedRoute.setParamMap({
  registrationNumber: 12334,
  socialInsuranceNo: 601336235,
  injuryId: 1001956028,
  complicationId: 223344,
  injuryNo: 11111
});

describe('ModifyAllowancePayeeScComponent', () => {
  let component: ModifyAllowancePayeeScComponent;
  let fixture: ComponentFixture<ModifyAllowancePayeeScComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BrowserDynamicTestingModule
      ],
      declarations: [ModifyAllowancePayeeScComponent],
      providers: [
        FormBuilder,
        BsModalRef,
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: ContributorService, useClass: ContributorMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: OhClaimsService, useClass: OhMockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyAllowancePayeeScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('confirm cancel', () => {
    it('should confirm cancellation', () => {
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.decline();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe(' setData', () => {
    it('should  call setData', () => {
      spyOn(component, 'setData').and.callThrough();
      component.setData();
      expect(component.setData).toHaveBeenCalled();
    });
  });

  describe('getAllowanceDetails', () => {
    it('should getAllowanceDetails', () => {
      component.getAllowanceDetails();
      expect(component.allowanceDetails).not.toBe(null);
    });
  });
  describe('getAllowanceDetails', () => {
    it('should getAllowanceDetails', () => {
      spyOn(component, 'settingPayeeForAllowance');
      component.getAllowanceDetails();
      expect(component.settingPayeeForAllowance).toHaveBeenCalled();
    });
  });
  describe('settingPayeeForAllowance', () => {
    it('should settingPayeeForAllowance', () => {
      const form = new Form();
      component.payeeListForm = form.createPayeeForm();
      component.workFlowType = 'Complication';
      component.settingPayeeForAllowance();
      expect(component.disabled).toBeTruthy();
    });
  });
  describe('settingPayeeForAllowance', () => {
    it('should settingPayeeForAllowance', () => {
      const form = new Form();
      component.payeeListForm = form.createPayeeForm();
      component.payeeT = 1;
      component.settingPayeeForAllowance();
      expect(component.payeeListForm).not.toBeNull();
    });
  });
  describe('showError', () => {
    it('should showError', () => {
      spyOn(component.alertService, 'showError');
      component.showError(genericError);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('refreshDocument', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      spyOn(component, 'refreshDocument').and.callThrough();
      component.refreshDocument(document);
      expect(component.refreshDocument).toHaveBeenCalled();
    });
  });
  describe('ngOnit', () => {
    it('ngOnit', () => {
      component.payeeList = {
        items: [
          {
            value: { english: 'Contributor', arabic: ' مشترك' },
            sequence: 1
          }
        ]
      };
      component.socialInsuranceNo = 60133625;
      component.registrationNo = 12345;
      component.injuryId = 10444213123;
      component.complicationId = 242344324;
      component.injuryNo = 21424324;
      component.ngOnInit();
      expect(component.payeeList).not.toBe(null);
    });
  });
  describe('test suite for getDocuments', () => {
    it('should get documents for allowancePayee', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getAllowanceDocumentList();
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        OhConstants.UPDATE_ALLOWANCE_PAYEE,
        InjuryConstants.UPDATE_PAYEE
      );
    });
  });
  describe('settingPayeeForAllowance', () => {
    it('should settingPayeeForAllowance', () => {
      component.workFlowType = 'Complication';
      const form = new Form();
      component.payeeListForm = form.createPayeeForm();
      component.payeeT = 2;
      component.settingPayeeForAllowance();
      expect(component.payeeListForm.getRawValue()).toBeDefined();
    });
  });
  describe('saveAllowancePayee', () => {
    it('should saveAllowancePayee', () => {
      const form = new Form();
      component.payeeListForm = form.createPayeeForm();
      component.isAppPrivate = true;
      const doc = new DocumentItem();
      doc.valid = false;
      doc.required = true;
      component.documents = [doc];
      component.saveAllowancePayee();
      expect(component.scanSucess).toBe(false);
    });
  });
  describe('saveAllowancePayee', () => {
    it('should saveAllowancePayee', () => {
      const form = new Form();
      component.payeeListForm = form.createPayeeForm();
      component.isAppPrivate = true;
      const doc = new DocumentItem();
      doc.valid = true;
      doc.required = false;
      component.documents = [doc];
      component.saveAllowancePayee();
      expect(component.scanSucess).toBe(true);
    });
  });
  describe('selectedpayeeList', () => {
    it('should selectedpayeeList', () => {
      component.selectedpayeeList('Contributor');
      expect(component.payeeListForm.getRawValue()).toBeDefined();
    });
  });
  describe('show cancel template', () => {
    it('should show cancel template', () => {
      spyOn(component.modalService, 'show');
      component.showCancelTemplate();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('saveAllowancePayee', () => {
    it('saveAllowancePayee should throw error', () => {
      component.isAppPrivate = false;
      spyOn(component.injuryService, 'saveAllowancePayee').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.saveAllowancePayee();
      expect(component.showError).toHaveBeenCalled();
    });
  });
});
