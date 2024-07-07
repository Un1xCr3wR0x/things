/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalServiceStub } from 'testing';
import { ManageWageTabsScComponent } from './manage-wage-tabs-sc.component';

/** Mock components for child components. */
@Component({
  selector: 'cnt-multiple-wage-update-sc',
  template: ''
})
export class MultipleWageUpdateScMock {
  parentForm: FormGroup = new FormGroup({});
}

@Component({
  selector: 'cnt-bulk-wage-update-sc',
  template: ''
})
export class BulkWageUpdateScMock {
  bulkWageForm: FormGroup = new FormGroup({});
}

describe('ManageWageTabsScComponent', () => {
  let component: ManageWageTabsScComponent;
  let fixture: ComponentFixture<ManageWageTabsScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      providers: [{ provide: BsModalService, useClass: ModalServiceStub }],
      declarations: [ManageWageTabsScComponent, MultipleWageUpdateScMock, BulkWageUpdateScMock],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWageTabsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize for custom list', () => {
    component.contributorRouting.previousUrl = '/home/contributor/wage/bulk/custom-list';
    component.ngOnInit();
    expect(component.currentTab).toBe(1);
  });

  it('should toggle tabs', () => {
    component.toggleTabs(0);
    expect(component.currentTab).toBe(0);
  });

  it('should check for changes for first tab', () => {
    component.currentTab = 0;
    spyOn(component, 'checkWageFormStatus').and.returnValue(true);
    spyOn(component, 'showModal').and.callThrough();
    component.checkForChanges();
    expect(component.showModal).toHaveBeenCalled();
  });

  xit('should check for changes for second tab', () => {
    component.currentTab = 1;
    const fb = new FormBuilder();
    component.bulkUpdate.bulkWageForm.addControl('uploadForm', fb.group({ changed: true }));
    spyOn(component, 'showModal');
    component.checkForChanges();
    expect(component.showModal).toHaveBeenCalled();
  });

  it('should check wage form status', () => {
    const formArray = new FormArray([]);
    const fb = new FormBuilder();
    formArray.push(fb.group({ identity: 0 }));
    component.multipleUpdate.parentForm.addControl('wageForms', formArray);
    const flag = component.checkWageFormStatus();
    expect(flag).toBeFalsy();
  });

  it('should navigate to dashboard', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.router, 'navigate');
    component.navigateBack();
    expect(component.router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
