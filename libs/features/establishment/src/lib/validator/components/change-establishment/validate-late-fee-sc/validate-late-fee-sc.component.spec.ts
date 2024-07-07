import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { WorkflowService } from '@gosi-ui/core';
import {
  commonImports,
  commonProviders
} from '@gosi-ui/features/establishment/lib/change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { WorkflowServiceStub } from 'testing';
import { ValidateLateFeeScComponent } from './validate-late-fee-sc.component';

describe('ValidateLateFeeScComponent', () => {
  let component: ValidateLateFeeScComponent;
  let fixture: ComponentFixture<ValidateLateFeeScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...commonImports],
      declarations: [ValidateLateFeeScComponent],
      providers: [
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        },
        ...commonProviders,
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateLateFeeScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
