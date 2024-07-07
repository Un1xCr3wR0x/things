/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { WorkflowScComponent } from './workflow-sc.component';
import { IdentityManagementService } from '@gosi-ui/core';
import { identityManagementServiceStub } from 'testing';

describe('WorkflowScComponent', () => {
  let component: WorkflowScComponent;
  let fixture: ComponentFixture<WorkflowScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowScComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: IdentityManagementService,
          useClass: identityManagementServiceStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
