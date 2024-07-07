import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstLegalentityChangeScComponent } from './est-legalentity-change-sc.component';

describe('EstLegalentityChangeScComponent', () => {
  let component: EstLegalentityChangeScComponent;
  let fixture: ComponentFixture<EstLegalentityChangeScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstLegalentityChangeScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstLegalentityChangeScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
