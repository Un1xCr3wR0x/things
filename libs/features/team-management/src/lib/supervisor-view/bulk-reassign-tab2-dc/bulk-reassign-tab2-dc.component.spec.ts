import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkReassignTab2DcComponent } from './bulk-reassign-tab2-dc.component';

describe('BulkReassignTab2DcComponent', () => {
  let component: BulkReassignTab2DcComponent;
  let fixture: ComponentFixture<BulkReassignTab2DcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkReassignTab2DcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkReassignTab2DcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
