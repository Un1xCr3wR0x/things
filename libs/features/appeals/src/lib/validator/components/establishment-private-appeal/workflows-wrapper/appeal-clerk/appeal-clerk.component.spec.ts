import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealClerkComponent } from './appeal-clerk.component';

describe('AppealClerkComponent', () => {
  let component: AppealClerkComponent;
  let fixture: ComponentFixture<AppealClerkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealClerkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealClerkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
