import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterContributorScComponent } from './register-contributor-sc.component';

describe('RegisterContributorScComponent', () => {
  let component: RegisterContributorScComponent;
  let fixture: ComponentFixture<RegisterContributorScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterContributorScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterContributorScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
