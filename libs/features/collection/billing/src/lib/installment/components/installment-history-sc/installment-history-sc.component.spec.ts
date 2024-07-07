import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentHistoryScComponent } from './installment-history-sc.component';
import { InstallmentService, EstablishmentService } from '../../../shared/services';
import { InstallmentStub } from 'testing/mock-services/features/billing/installment-service-stub';
import { AlertService, LanguageToken } from '@gosi-ui/core';
import { AlertServiceStub } from 'testing/mock-services/core/alert-service-stub';
import { EstablishmentServiceStub, BilingualTextPipeMock, genericError } from 'testing';
import { BehaviorSubject, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { InstallmentConstants } from '../../../shared/constants';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('InstallmentHistoryScComponent', () => {
  let component: InstallmentHistoryScComponent;
  let fixture: ComponentFixture<InstallmentHistoryScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [InstallmentHistoryScComponent, BilingualTextPipeMock],
      providers: [
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        {
          provide: InstallmentService,
          useClass: InstallmentStub
        },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: EstablishmentService,
          useClass: EstablishmentServiceStub
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentHistoryScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test suite for ngOninit', () => {
    it('It should check the inital conditions for the component', () => {
      component.ngOnInit();
      expect(component.lang).not.toEqual(null);
      component.getInstallments(500965975);
      expect(component.installmentHistory).not.toEqual(null);
    });
  });
  describe('test suite for getInstallments', () => {
    it('It should getInstallments', () => {
      spyOn(component.installmentService, 'getInstallmentactive').and.callThrough();
      component.getInstallments(500965975);
      expect(component.installmentService.getInstallmentactive).toHaveBeenCalled();
    });
    it('It should throw err for getInstallmentDetails', () => {
      spyOn(component.installmentService, 'getInstallmentactive').and.returnValue(throwError(genericError));
      component.getInstallments(500965975);
      expect(component.installmentService.getInstallmentactive).toHaveBeenCalled();
    });
  });
  // describe('test suite for navigateToSummary ', () => {
  //   it('should navigate to navigateToSummary ', () => {
  //     spyOn(component.router, 'navigate');
  //     component.navigateToSummary(456);
  //     expect(component.router.navigate).toHaveBeenCalledWith(
  //       [InstallmentConstants.INSTALLMENT_SUMMARY]
  //     );
  //   });
  // });
});
