import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDocumentScComponent } from './add-document-sc.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { DatePipe } from '@angular/common';
import {
  AlertService,
  DocumentService,
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  UuidGeneratorService,
  DocumentItem,
  CoreAdjustmentService
} from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock,
  documentResonseItemListStub
} from 'testing';
import { AdjustmentService, ThirdpartyAdjustmentService, Adjustment, AdjustmentDetails } from '../../../../shared';
import { of } from 'rxjs';
import { activeAdjustments } from '../../../../shared/test-data/adjustment';
import { TemplateRef } from '@angular/core';
describe('AddDocumentScComponent', () => {
  let component: AddDocumentScComponent;
  let fixture: ComponentFixture<AddDocumentScComponent>;
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ adjustmentId: 1600765 });

  const thirdPartyAdjustmentServiceSpy = jasmine.createSpyObj<ThirdpartyAdjustmentService>(
    'ThirdpartyAdjustmentService',
    ['revertTransaction', 'getTpaAdjustmentsDetails']
  );
  thirdPartyAdjustmentServiceSpy.revertTransaction.and.returnValue(of({}));
  thirdPartyAdjustmentServiceSpy.getTpaAdjustmentsDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments }] })
  );
  const uuidGeneratorServiceSpy = jasmine.createSpyObj<UuidGeneratorService>('UuidGeneratorService', ['getUuid']);
  uuidGeneratorServiceSpy.getUuid.and.returnValue('2A');
  const docList = documentResonseItemListStub.map((d: DocumentItem) => {
    return {
      ...d,
      documentContent: '',
      documentTypeId: 1234,
      required: false,
      identifier: '1234',
      fromJsonToObject: json => json
    };
  });
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'benefitType',
    'benefitDetails'
  ]);
  const adjustmentId = 1234;
  const identifier = 1234;
  coreAdjustmntServiceSpy.identifier = identifier;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: ThirdpartyAdjustmentService, useValue: thirdPartyAdjustmentServiceSpy },
        { provide: UuidGeneratorService, useValue: uuidGeneratorServiceSpy },
        DatePipe
      ],
      declarations: [AddDocumentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigateBack', () => {
    component.navigateBack();
  });
  it('should saveDocs', () => {
    component.documents = docList;
    component.documentList = docList;
    component.saveDocs();
  });
  it('should show modal', () => {
    component.modalRef = new BsModalRef();
    const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
    component.modalRef = new BsModalRef();
    spyOn(component.modalService, 'show');
    component.showModal(templateRef);
    expect(component.modalRef).not.toEqual(null);
  });
  it('should cancelPage', () => {
    component.documentList = docList;
    component.modalRef = new BsModalRef();
    component.cancelPage();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should getAdjustmentDetails', () => {
    component.adjustmentId = adjustmentId;
    component.identifier = identifier;
    component.getAdjustmentDetails();
    expect(component.adjustment).not.toEqual(null);
  });
  it('should getDocuments', () => {
    component.transactionName = '';
    component.transactionType = '';
    component.getDocuments();
    expect(component.documentTypes).not.toEqual(null);
  });
  it('should addDocument', () => {
    component.documentTypes = docList;
    component.documentList = docList;
    component.addDocument(1234);
    expect(component.documentList).not.toEqual(null);
  });
  it('should showErrorMessage', () => {
    component.showErrorMessage({ error: { details: [] } });
  });
  it('should showErrorMessage', () => {
    component.showErrorMessage({ error: { details: [{ english: '', arabic: '' }] } });
  });
});
