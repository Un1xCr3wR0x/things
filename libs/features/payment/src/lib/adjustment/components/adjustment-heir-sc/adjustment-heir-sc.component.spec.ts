import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AdjustmentService } from '../../../shared';
import { of } from 'rxjs';
import { AlertService, DocumentService, RouterDataToken, RouterData, CoreAdjustmentService } from '@gosi-ui/core';
import { AlertServiceStub, DocumentServiceStub, ModalServiceStub, Form, ActivatedRouteStub } from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AdjustmentHeirScComponent } from './adjustment-heir-sc.component';
import { heirAdjustment } from '../../../shared/test-data/adjustment-repayment';
import { ActivatedRoute } from '@angular/router';

describe('AdjustmentHeirScComponent', () => {
  let component: AdjustmentHeirScComponent;
  let fixture: ComponentFixture<AdjustmentHeirScComponent>;
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', [
    'getHeirAdjustments',
    'getHeirAdjustmentById',
    'submitHeirAdjustmentDetails'
  ]);
  adjustmentServiceSpy.getHeirAdjustments.and.returnValue(of(heirAdjustment));
  adjustmentServiceSpy.getHeirAdjustmentById.and.returnValue(of(heirAdjustment));
  adjustmentServiceSpy.submitHeirAdjustmentDetails.and.returnValue(of({ message: { english: '', arabic: '' } }));
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'sin',
    'benefitRequestId',
    'benefitType'
  ]);
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ from: 'csr' });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [AdjustmentHeirScComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentHeirScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should getHeirList', () => {
    component.sin = 1234;
    component.benefitRequestId = 1234;
    component.adjustmentAddForm = new FormGroup({ heirPersonIdList: new FormArray([]) });
    component.getHeirList();
    expect(component.heirAdjustments).not.toEqual(null);
  });
  it('should getHeirById', () => {
    component.sin = 1234;
    component.benefitRequestId = 1234;
    component.adjustmentModificationId = 1234;
    component.getHeirById();
    expect(component.activeHeirAdjustments).not.toEqual(null);
  });
  it('should onSubmitDocuments', () => {
    component.sin = 1234;
    component.adjustmentModificationId = 1234;
    component.referenceNumber = 1234;
    component.parentForm = new FormGroup({ documentsForm: new FormGroup({ comments: new FormControl('') }) });
    component.benefitRequestId = 1234;
    component.onSubmitDocuments();
  });
});
