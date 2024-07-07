import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ERegisterEngagementScComponent } from './e-register-engagement-sc.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {
  DocumentItem,
  bindToObject
} from '@gosi-ui/core';
import { FormControl} from '@angular/forms';
import {
  Contributor,
  PersonalInformation
} from '../../../shared';
import {
  engagement,
  personalDetailsTestData,
} from 'testing';
fdescribe('ERegisterEngagementScComponent', () => {
  let component: ERegisterEngagementScComponent;
  let fixture: ComponentFixture<ERegisterEngagementScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ERegisterEngagementScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ERegisterEngagementScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should make tab active', () => {
    component.selectFormWizard(1);
    expect(component.activeTab).toBe(1);
  });
  it('should check edit mode', inject([ActivatedRoute], route => {
    route.url = of([{ path: 'edit' }]);
    component.checkEditMode();
    expect(component.isEditMode).toBeTruthy();
  }));
  it('should throw error on refersh documents', () => {
    spyOn(component.documentService, 'refreshDocument').and.callThrough();
    component.refreshDocumentItem(new DocumentItem());
    expect(component.documentService.refreshDocument).toHaveBeenCalled();
  });
  it('should save personal details', () => {
    component.parentForm.addControl('personDetails', new FormControl());
    spyOn(component, 'navigateToNextTab');
    component.onSavePersonalDetails(bindToObject(new PersonalInformation(), personalDetailsTestData));
    expect(component.navigateToNextTab).toHaveBeenCalled();
  });
  it('should save engagement details', () => {
    component.contributor = new Contributor();
    spyOn(component, 'navigateToNextTab');
    component.onSaveEngagementDetails({ engagementDetails: engagement, wageDetails: engagement.engagementPeriod });
    expect(component.navigateToNextTab).toHaveBeenCalled();
  });
  it('should cancel the newly added contributor if the transaction is cancelled', () => {
    spyOn(component, 'navigateBack');
    component.cancelAddedContributor();
    expect(component.navigateBack).toHaveBeenCalled();
  });
  it('should create alert error', () => {
    spyOn(component.alertService, 'showErrorByKey');
    component.showAlertError('ERROR');
    expect(component.alertService.showErrorByKey).toHaveBeenCalled();
  });
  it('should save the complete details on submit', () => {
    component.isEditMode = true;
    component.valDetailSubmit();
    expect(component.hideModal).toHaveBeenCalled();
  });
  it('should save the complete details on submit', () => {
    component.isEditMode = false;
    expect(component.navigateToHome).toHaveBeenCalled();
  });
  
});
