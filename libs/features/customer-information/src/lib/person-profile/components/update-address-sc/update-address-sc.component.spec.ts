import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LookupService, AlertService } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  LookupServiceStub,
  ManagePersonFeatureServiceStub,
  AlertServiceStub,
  feedbackMessageResponse,
  Forms,
  genericPersonResponse,
  genericError,
  contributorSearchResponse
} from 'testing';
import { UpdateAddressScComponent } from './update-address-sc.component';
import { ManagePersonService, PatchPersonAddressDetails } from '../../../shared';
import { AddressDcComponentMock } from 'testing';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import { of, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';

describe('UpdateAddressScComponent', () => {
  let component: UpdateAddressScComponent;
  let fixture: ComponentFixture<UpdateAddressScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [UpdateAddressScComponent],
      providers: [
        {
          provide: ManagePersonService,
          useClass: ManagePersonFeatureServiceStub
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: AddressDcComponent,
          useClass: AddressDcComponentMock
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAddressScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialise view', () => {
    it('should initialise view ', () => {
      component.person$ = of(contributorSearchResponse.person);
      component.ngOnInit();
      expect(component.cityList).toBeDefined();
    });
  });

  describe('save address', () => {
    it('should save address', () => {
      const forms = new Forms();
      component.addressDcComponent = ({ getAddressValidity: () => false } as unknown) as AddressDcComponent;
      component.addressForms = forms.createMockEditAddressDetailsForm();
      component.addressForms.addControl('saudiAddress', new FormGroup({}));
      spyOn(component.alertService, 'showMandatoryErrorMessage').and.callThrough();
      component.saveAddress();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
    it('should save address', () => {
      const forms = new Forms();
      component.addressDcComponent = ({ getAddressValidity: () => true } as unknown) as AddressDcComponent;
      component.addressForms = forms.createMockEditAddressDetailsForm();
      component.addressForms.addControl('saudiAddress', new FormGroup({}));
      spyOn(component.managePersonService, 'patchPersonAddressDetails').and.returnValue(of(feedbackMessageResponse));
      component.saveAddress();
      expect(component.managePersonService.patchPersonAddressDetails).toHaveBeenCalled();
    });
    it('should save address throw error', () => {
      const forms = new Forms();
      component.addressDcComponent = ({ getAddressValidity: () => true } as unknown) as AddressDcComponent;
      component.addressForms = forms.createMockEditAddressDetailsForm();
      component.addressForms.addControl('saudiAddress', new FormGroup({}));
      spyOn(component.managePersonService, 'patchPersonAddressDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError').and.callThrough();
      component.saveAddress();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
});
