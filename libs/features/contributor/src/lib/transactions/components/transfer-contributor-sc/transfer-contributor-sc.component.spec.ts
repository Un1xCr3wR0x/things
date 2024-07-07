import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferContributorScComponent } from './transfer-contributor-sc.component';

describe('TransferContributorScComponent', () => {
  let component: TransferContributorScComponent;
  let fixture: ComponentFixture<TransferContributorScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransferContributorScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferContributorScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
