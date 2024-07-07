/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BenefitEstimationScComponent } from './benefit-estimation-sc.component';

describe('BenefitEstimationScComponent', () => {
  let component: BenefitEstimationScComponent;
  let fixture: ComponentFixture<BenefitEstimationScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [FormBuilder],
      declarations: [BenefitEstimationScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitEstimationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should setHeading wl', () => {
    component.setHeading('Woman Lumpsum');
    expect(component.heading).toEqual('BENEFITS.WOMAN-LUMPSUM');
  });
  it('should setHeading rb', () => {
    component.setHeading('Retirement Benefit');
    expect(component.heading).toEqual('BENEFITS.RETIREMENT-BENEFIT');
  });
  it('should setHeading noc', () => {
    component.setHeading('Non Occupational Disablity Benefit');
    expect(component.heading).toEqual('BENEFITS.NON-OCC-DISABILITY-BENEFIT');
  });
  it('should setHeading jc', () => {
    component.setHeading('Jailed Contributor Benefit');
    expect(component.heading).toEqual('BENEFITS.JAILED-CONTRIBUTOR-BENEFIT');
  });
});
