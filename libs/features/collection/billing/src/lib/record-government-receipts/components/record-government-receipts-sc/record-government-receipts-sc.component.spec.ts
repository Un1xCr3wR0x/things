import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordGovernmentReceiptsScComponent } from './record-government-receipts-sc.component';

describe('MofPaymentReceiptsScComponent', () => {
  let component: RecordGovernmentReceiptsScComponent;
  let fixture: ComponentFixture<RecordGovernmentReceiptsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordGovernmentReceiptsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordGovernmentReceiptsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
