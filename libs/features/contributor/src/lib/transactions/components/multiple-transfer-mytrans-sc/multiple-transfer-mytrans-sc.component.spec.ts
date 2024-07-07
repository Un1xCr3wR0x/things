import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleTransferMytransScComponent } from './multiple-transfer-mytrans-sc.component';

describe('MultipleTransferMytransScComponent', () => {
  let component: MultipleTransferMytransScComponent;
  let fixture: ComponentFixture<MultipleTransferMytransScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleTransferMytransScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleTransferMytransScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
