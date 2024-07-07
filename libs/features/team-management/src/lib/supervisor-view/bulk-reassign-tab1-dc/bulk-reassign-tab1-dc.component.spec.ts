import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkReassignTab1DcComponent } from './bulk-reassign-tab1-dc.component';

describe('BulkReassignTab1DcComponent', () => {
  let component: BulkReassignTab1DcComponent;
  let fixture: ComponentFixture<BulkReassignTab1DcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkReassignTab1DcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkReassignTab1DcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
