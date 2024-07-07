import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BenefitIdentifierScComponent } from './benefit-identifier-sc.component';
import { AdjustmentService, AdjustmentDetails } from '../../../shared';
import { activeAdjustments } from '../../../shared/test-data/adjustment';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { bindToObject, CoreAdjustmentService } from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('BenefitIdentifierScComponent', () => {
  let component: BenefitIdentifierScComponent;
  let fixture: ComponentFixture<BenefitIdentifierScComponent>;
  const adjustmentServiceSpy = jasmine.createSpyObj<AdjustmentService>('AdjustmentService', ['getAdjustmentsByStatus']);
  adjustmentServiceSpy.getAdjustmentsByStatus.and.returnValue(
    of(bindToObject(new AdjustmentDetails(), activeAdjustments))
  );
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'benefitType',
    'benefitDetails'
  ]);
  coreAdjustmntServiceSpy.identifier = 1234;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [BenefitIdentifierScComponent],
      providers: [
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitIdentifierScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('SearchAdjustment', () => {
    it('should SearchAdjustment', () => {
      spyOn(component.router, 'navigate');
      component.SearchAdjustment();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
});
