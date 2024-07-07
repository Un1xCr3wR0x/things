import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdentifierSearchScComponent } from './identifier-search-sc.component';
import { activeAdjustments } from '../../../shared/test-data/adjustment';
import { AdjustmentService, AdjustmentDetails } from '../../../shared';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { bindToObject, ApplicationTypeToken, CoreAdjustmentService } from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('IdentifierSearchScComponent', () => {
  let component: IdentifierSearchScComponent;
  let fixture: ComponentFixture<IdentifierSearchScComponent>;
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
      declarations: [IdentifierSearchScComponent],
      providers: [
        { provide: AdjustmentService, useValue: adjustmentServiceSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifierSearchScComponent);
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
      expect(component.router.navigate).toHaveBeenCalledWith(['/home/adjustment/adjustment-details']);
    });
  });
});
