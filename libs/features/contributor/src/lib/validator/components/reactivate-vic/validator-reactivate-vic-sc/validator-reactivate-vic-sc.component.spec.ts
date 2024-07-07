import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorReactivateVicScComponent } from './validator-reactivate-vic-sc.component';

describe('ValidatorReactivateVicScComponent', () => {
  let component: ValidatorReactivateVicScComponent;
  let fixture: ComponentFixture<ValidatorReactivateVicScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidatorReactivateVicScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorReactivateVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
