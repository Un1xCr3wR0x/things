import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BenefitListScComponent } from './benefit-list-sc.component';
import { AdjustmentService, BeneficiaryList, BenefitDetails } from '../../../shared';
import { of } from 'rxjs';
import { benefits } from '../../../shared/test-data/adjustment';
import { BilingualTextPipeMock } from 'testing';
import { bindToObject, CoreAdjustmentService } from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('BenefitListScComponent', () => {
  let component: BenefitListScComponent;
  let fixture: ComponentFixture<BenefitListScComponent>;
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', ['getBeneficiaryList']);
  adjustmentServiceSpy.getBeneficiaryList.and.returnValue(of(bindToObject(new BeneficiaryList(), benefits)));
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'benefitType',
    'benefitDetails'
  ]);
  coreAdjustmntServiceSpy.identifier = 1234;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [BenefitListScComponent, BilingualTextPipeMock],
      providers: [
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitListScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('navigateToBenefitDetails', () => {
    it('should navigateToBenefitDetails', () => {
      spyOn(component.router, 'navigate');
      component.navigateToBenefitDetails(new BenefitDetails());
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/adjustment/benefit-details']);
    });
  });
});
