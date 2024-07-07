/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorViewScComponent } from './supervisor-view-sc.component';
import { TranslateModule } from '@ngx-translate/core';

describe('SupervisorViewScComponent', () => {
  let component: SupervisorViewScComponent;
  let fixture: ComponentFixture<SupervisorViewScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SupervisorViewScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorViewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
