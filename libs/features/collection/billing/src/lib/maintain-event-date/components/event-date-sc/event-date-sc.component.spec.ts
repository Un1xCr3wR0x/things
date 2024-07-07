import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  DocumentService,
  WorkflowService,
  bindToObject,
  TransactionReferenceData,
  UserComment,
  Alert,
  DocumentItem
} from '@gosi-ui/core';
import {
  ModalServiceStub,
  AlertServiceStub,
  eventDateListMock,
  eventDateDetailsMockData,
  pendingEventDates,
  eventDateUpdateMock,
  DocumentServiceStub,
  WorkflowServiceStub,
  ActivatedRouteStub
} from 'testing';
import { EventDateScComponent } from './event-date-sc.component';
import { EventDateService } from '../../../shared/services/event-date.service';
import { of, BehaviorSubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('EventDateScComponent', () => {
  let component: EventDateScComponent;
  let fixture: ComponentFixture<EventDateScComponent>;
  const routerValue = {
    taskId: '101',
    user: 'avijit',
    payload: JSON.stringify({ referenceNo: '269380' }),
    assigneeId: 'Karthik',
    comments: [new TransactionReferenceData()],
    userComment: new UserComment(),
    transactionId: 668574
  };
  const EventDateServiceSpy = jasmine.createSpyObj<EventDateService>('EventDateService', [
    'getEventDetailsByDate',
    'submitEventDetails',
    'getEventDetailsByApprovalStatus',
    'modifyEventDetails',
    'approveEventDate'
  ]);
  EventDateServiceSpy.getEventDetailsByDate.and.returnValue(of(eventDateListMock));
  EventDateServiceSpy.submitEventDetails.and.returnValue(of({ transactionMessage: 'Updated with ref No 1000' }));
  EventDateServiceSpy.getEventDetailsByApprovalStatus.and.returnValue(of(pendingEventDates));
  EventDateServiceSpy.modifyEventDetails.and.returnValue(of({ transactionMessage: 'Updated with ref No 1000' }));
  EventDateServiceSpy.approveEventDate.and.returnValue(of({ arabic: '', english: '' }));

  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ from: 'inbox' });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [EventDateScComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRoute
        },
        FormBuilder,
        { provide: EventDateService, useValue: EventDateServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: RouterDataToken,
          useValue: { ...bindToObject(new RouterData(), routerValue) }
        },
        { provide: WorkflowService, useClass: WorkflowServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },

        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test suite for ngOninit', () => {
    it('It should check the inital conditions for the component', () => {
      component.ngOnInit();
      component.getLang();
      component.getData();
      component.getRequiredDocument();
      component.getRouteParam();
      expect(component.selectedValues).not.toEqual(null);
    });
  });

  // describe('test suite for get data', () => {
  //   it('It should getData', () => {
  //     spyOn(component.eventService, 'getEventDetailsByDate').and.callThrough();
  //     component.getEventDate();
  //     component.getData();
  //     expect(component.eventService.getEventDetailsByDate).toHaveBeenCalled();
  //   });
  // });

  describe('test suite for getRequiredDocument', () => {
    it('It should get Required Document', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getRequiredDocument();
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalled();
    });
  });

  describe('test suite for refreshDocuments', () => {
    it('It should refresh Document', () => {
      spyOn(component.documentService, 'refreshDocument').and.callThrough();
      component.refreshDocuments(new DocumentItem(), true);
      expect(component.documentService.refreshDocument).toHaveBeenCalled();
    });
  });

  it('should get year list', () => {
    component.currentYear = 2020;
    component.previousYear = 2019;
    component.nextYear = 2021;
    component.getYearList();
    expect(component.yearListLov.items[1].value.english).toEqual(component.currentYear.toString());
  });

  // it('should get buildBpmReq', () => {
  //   component.buildBpmReq(85456);
  //   expect(component.eventBpmData).not.toEqual(null);
  // });

  it('should get getLang', () => {
    component.getLang();
    expect(component.lang).not.toEqual(null);
  });

  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showTemplate(modalRef);
    expect(component.modalRef).not.toEqual(null);
  });

  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.hideModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });

  it('should get Event Date Range', () => {
    component.dateRange = {
      fromDate: new Date().getFullYear() - 1,
      toDate: new Date().getFullYear() + 1
    };
    component.getEventDate();
    expect(component.dateRange).toEqual({
      fromDate: new Date().getFullYear() - 1,
      toDate: new Date().getFullYear() + 1
    });
  });

  it('should build bpm data', () => {
    component.buildBpmReq(routerValue);
    expect(component.eventBpmData['taskId']).toEqual(routerValue['taskId']);
  });

  it('should get selected year list', () => {
    const year = [
      { english: '2020', arabic: '2020' },
      { english: '2022', arabic: '2022' }
    ];
    component.selectedValues = [
      { english: '2020', arabic: '2020' },
      { english: '2021', arabic: '2021' }
    ];
    component.onYearSelection(year);
    expect(component.selectedyearList).toEqual(year);
    expect(component.selectedValues).toEqual([
      { english: '2020', arabic: '2020' },
      { english: '2021', arabic: '2021' },
      { english: '2022', arabic: '2022' }
    ]);
  });

  it('should hide popup', () => {
    component.modalRef = new BsModalRef();
    component.hideModal();
    expect(component.modalRef).not.toEqual(null);
  });

  xit('should submit Event details on Confirm Submit', () => {
    spyOn(component.router, 'navigate');
    component.modifyFlag = false;
    component.submitValue = eventDateDetailsMockData;
    component.modalRef = new BsModalRef();
    component.hideModal();
    component.confirmSubmit();
    expect(component.modalRef).not.toEqual(null);
  });

  xit('should modify Event details on Confirm Submit', () => {
    component.modifyFlag = true;
    component.submitValue = eventDateUpdateMock;
    component.eventBpmData = routerValue;
    component.modalRef = new BsModalRef();
    component.hideModal();
    component.confirmSubmit();
    expect(component.modalRef).not.toEqual(null);
  });

  xit('should navigate to home on cancel transaction', () => {
    component.modifyFlag = true;
    spyOn(component.billingRoutingService, 'navigateToInbox');
    spyOn(component.router, 'navigate');
    component.cancelNavigation();
    expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalled();
  });
  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showTemplate(modalRef);
    expect(component.modalRef).not.toEqual(null);
  });
  xit('cancelNavigation', () => {
    spyOn(component.billingRoutingService, 'navigateToInbox');
    component.modifyFlag = true;
    spyOn(component.router, 'navigate');
    component.cancelNavigation();
    expect(component.billingRoutingService.navigateToInbox).toHaveBeenCalled();
  });
  xit('cancelNavigation', () => {
    component.modifyFlag = false;
    spyOn(component.router, 'navigate');
    component.cancelNavigation();

    expect(component.router.navigate).toHaveBeenCalledWith(['/home']);
  });
  it('Should submit EventDate on save Click', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    spyOn(component, 'showTemplate');
    const value = eventDateDetailsMockData;
    component.transformData(value['eventDateInfo']);
    component.submitEventDate(value);
    expect(component.submitValue).toBe(value);
    component.showTemplate(modalRef);
    expect(component.showTemplate).toHaveBeenCalled();
  });
  it('Should not submitEventDate', () => {
    spyOn(component, 'checkMandatoryDocuments').and.returnValue(false);
    component.submitEventDate(eventDateDetailsMockData);
  });
  it('should confirmCancel', () => {
    component.modalRef = new BsModalRef();
    component.confirmCancel();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should refreshDocuments', () => {
    component.modifyFlag = true;
    component.refreshDocuments(
      bindToObject(new DocumentItem(), { name: { english: 'Event Date', arabic: '' } }),
      false
    );
  });
  it('Should showError', () => {
    component.showError({ error: { message: { arabic: '', english: '' }, details: [new Alert()] } });
  });
});
