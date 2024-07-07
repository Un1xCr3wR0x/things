/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordScComponent } from './change-password-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApplicationTypeToken, bindToObject, LoginService } from '@gosi-ui/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalServiceStub, ChangePasswordData } from 'testing';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordInfoDcComponent } from '..';
import { ChangePasswordForm } from 'testing';
import { of } from 'rxjs';
import { ChangePasswordResponse } from '../../../shared/models/change-password-response';

describe('ChangePasswordScComponent', () => {
  let component: ChangePasswordScComponent;
  let fixture: ComponentFixture<ChangePasswordScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LoginService, useValue: { doLogout: () => {} } },
        FormBuilder
      ],
      declarations: [ChangePasswordScComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('should confirm cancel', () => {
    it('should confirm cancellation of modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirmCancel();
      expect(component.modalRef.hide).toHaveBeenCalled();
      spyOn(component.location, 'back').and.callFake(() => {});
      component.confirmCancel();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
  describe('should decline', () => {
    it('should decline', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.decline();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  describe('should cancel', () => {
    it('should cancel', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      spyOn(component.modalService, 'show');
      component.cancel(modalRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('should change password', () => {
    it('should change password', () => {
      const fb = new ChangePasswordForm();
      component.changePasswordForm = fb.changePasswordForm();
      spyOn(component.userActivityService, 'changePassword').and.returnValue(
        of(bindToObject(new ChangePasswordResponse(), ChangePasswordData))
      );
      component.changePassword();
      expect(fb).toBeDefined();
    });
  });
  describe('should newPasswordchanges', () => {
    it('should newPasswordchanges', () => {
      const value = '';
      component.newPasswordInfo = new PasswordInfoDcComponent();
      spyOn(component.newPasswordInfo, 'checkValidity');
      component.newPasswordchanges(value);
      expect(component.newPasswordInfo).toBeDefined();
    });
  });
  describe('should changeSuggestion', () => {
    it('should changeSuggestion', () => {
      spyOn(component, 'clearAlerts');
      component.changeSuggestion(true);
      expect(component.clearAlerts).toHaveBeenCalled();
    });
  });
});
