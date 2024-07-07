import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkReassignTabDcComponent } from './bulk-reassign-tab-dc.component';

describe('BulkReassignTabDcComponent', () => {
  let component: BulkReassignTabDcComponent;
  let fixture: ComponentFixture<BulkReassignTabDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkReassignTabDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkReassignTabDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
