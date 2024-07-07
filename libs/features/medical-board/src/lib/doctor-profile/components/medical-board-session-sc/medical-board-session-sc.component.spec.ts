import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  LookupService,
  BilingualText,
  Alert,
  RouterDataToken,
  RouterData
} from '@gosi-ui/core';
import {
  AlertServiceStub,
  ActivatedRouteStub,
  genericError,
  LookupServiceStub,
  DoctorServiceStub,
  MemberServiceStub,
  ModalServiceStub
} from 'testing';
import { MedicalBoardSessionScComponent } from './medical-board-session-sc.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../shared/services/doctor.service';
import { MemberService } from '../../../shared/services';
import { FormBuilder } from '@angular/forms';
const routerSpy = {
  navigate: jasmine.createSpy('navigate'),
  url: 'home/medical-board/medical-board-session/adhoc-session'
};

describe('MbSessionsScComponent', () => {
  let component: MedicalBoardSessionScComponent;
  let fixture: ComponentFixture<MedicalBoardSessionScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalBoardSessionScComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        { provide: MemberService, useClass: MemberServiceStub },
        { provide: DoctorService, useClass: DoctorServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(MedicalBoardSessionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showModal(modalRef);
    expect(component.modalRef).not.toEqual(null);
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.hideModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should confirm withdrwa', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    const session = {
      startDate: {
        gregorian: new Date('2020-11-21T00:00:00.000Z'),
        hijiri: '1442-04-06'
      },
      sessionID: 12345,
      status: { english: 'Scheduled', arabic: 'Scheduled' },
      startTime: '9::00',
      endTime: '12::00',
      fee: 500,
      paymentStatus: { english: 'Not Paid', arabic: 'Not Paid' },
      transactionID: 1003126,
      type: { english: 'Regular', arabic: 'Regular' },
      channel: { english: 'GOSI Office', arabic: 'GOSI Office' },
      fieldOffice: { english: 'Riyadh', arabic: 'Riyadh' }
    };
    component.confirmWithdraw(session);
    expect(component.modalRef.hide).toHaveBeenCalled();
    expect(component.modalRef).not.toEqual(null);
  });
});
