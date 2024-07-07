import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterRpaDetailsDcComponent } from './enter-rpa-details-dc.component';

describe('EnterRpaDetailsDcComponent', () => {
  let component: EnterRpaDetailsDcComponent;
  let fixture: ComponentFixture<EnterRpaDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterRpaDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterRpaDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
