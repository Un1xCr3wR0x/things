import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAllContributorScComponent } from './transfer-all-contributor-sc.component';

describe('TransferAllContributorScComponent', () => {
  let component: TransferAllContributorScComponent;
  let fixture: ComponentFixture<TransferAllContributorScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransferAllContributorScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferAllContributorScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
