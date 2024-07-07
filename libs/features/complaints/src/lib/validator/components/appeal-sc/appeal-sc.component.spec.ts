import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealScComponent } from './appeal-sc.component';

describe('AppealScComponent', () => {
  let component: AppealScComponent;
  let fixture: ComponentFixture<AppealScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
