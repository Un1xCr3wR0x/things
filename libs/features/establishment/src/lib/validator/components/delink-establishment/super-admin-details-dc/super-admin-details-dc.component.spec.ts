/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminDetailsDcComponent } from './super-admin-details-dc.component';

describe('SuperAdminDetailsDcComponent', () => {
  let component: SuperAdminDetailsDcComponent;
  let fixture: ComponentFixture<SuperAdminDetailsDcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SuperAdminDetailsDcComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
