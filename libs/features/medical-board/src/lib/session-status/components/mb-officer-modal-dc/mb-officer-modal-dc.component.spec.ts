import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbOfficerModalDcComponent } from './mb-officer-modal-dc.component';

describe('MbOfficerModalDcComponent', () => {
  let component: MbOfficerModalDcComponent;
  let fixture: ComponentFixture<MbOfficerModalDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MbOfficerModalDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MbOfficerModalDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
