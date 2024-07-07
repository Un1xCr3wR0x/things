import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleTransferDetailsDcComponent } from './multiple-transfer-details-dc.component';

describe('MultipleTransferDetailsDcComponent', () => {
  let component: MultipleTransferDetailsDcComponent;
  let fixture: ComponentFixture<MultipleTransferDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleTransferDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleTransferDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
