import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealModalDcComponent } from './appeal-modal-dc.component';

describe('AppealFormDcComponent', () => {
  let component: AppealModalDcComponent;
  let fixture: ComponentFixture<AppealModalDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealModalDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealModalDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
