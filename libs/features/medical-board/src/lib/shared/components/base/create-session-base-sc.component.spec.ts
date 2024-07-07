import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken, bindToObject, RouterData, RouterDataToken } from '@gosi-ui/core';
import { of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub, RegularSessionForms, rescheduleData } from 'testing';
import { RescheduleSessionData } from '../../models';
import { CreateSessionBaseScComponent } from './create-session-base-sc.component';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
@Component({
  selector: 'create-session-base-derived'
})
export class DerivedCreateSessionBaseScComponent extends CreateSessionBaseScComponent {}
describe('CreateSessionBaseScComponent', () => {
  let component: DerivedCreateSessionBaseScComponent;
  let fixture: ComponentFixture<CreateSessionBaseScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DerivedCreateSessionBaseScComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BsModalService, useClass: ModalServiceStub },
        DatePipe
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DerivedCreateSessionBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get session data', () => {
    const sessionId = 107;
    spyOn(component.statusService, 'getRescheduleSessionData').and.returnValue(
      of(bindToObject(new RescheduleSessionData(), rescheduleData))
    );
    component.getSessionData(sessionId);
    expect(sessionId).not.toEqual(null);
  });
  it('should reset page', () => {
    const forms = new RegularSessionForms();
    component.regularSessionForm = forms.SessionForm();
    component.resetPage();
    expect(component).toBeTruthy();
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.decline();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should hide modal', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.confirmCancel();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('should show modal reference', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.onCancel(modalRef);
    expect(component).toBeTruthy();
  });
  it('should select specialty', () => {
    const specialty = null;
    const value = { speciality: specialty, index: 1 };
    component.onSpecialitySelect(value);
    expect(component).toBeTruthy();
  });
  it('should select specialty', () => {
    const specialty = {
      value: { english: 'Cardiology', arabic: 'Cardiology' },
      sequence: 1
    };
    const value = { speciality: specialty, index: 1 };
    component.onSpecialitySelect(value);
    expect(component).toBeTruthy();
  });
});
