import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealDetailsDcComponent } from './appeal-details-dc.component';

describe('AppealDetailsDcComponent', () => {
  let component: AppealDetailsDcComponent;
  let fixture: ComponentFixture<AppealDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
