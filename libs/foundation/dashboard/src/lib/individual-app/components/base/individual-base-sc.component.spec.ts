/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IndividualBaseScComponent } from './individual-base-sc.component';
@Component({
  selector: 'individual-app-base-derived'
})
export class DerivedIndividualAppBaseScComponent extends IndividualBaseScComponent {}
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('IndividualAppBaseScComponent', () => {
  let component: DerivedIndividualAppBaseScComponent;
  let fixture: ComponentFixture<DerivedIndividualAppBaseScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [DerivedIndividualAppBaseScComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedIndividualAppBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
