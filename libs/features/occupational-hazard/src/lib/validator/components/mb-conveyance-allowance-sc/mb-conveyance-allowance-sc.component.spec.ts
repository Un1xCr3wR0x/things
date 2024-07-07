import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MbConveyanceAllowanceScComponent } from './mb-conveyance-allowance-sc.component';

describe('MbConveyanceAllowanceScComponent', () => {
  let component: MbConveyanceAllowanceScComponent;
  let fixture: ComponentFixture<MbConveyanceAllowanceScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MbConveyanceAllowanceScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MbConveyanceAllowanceScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
