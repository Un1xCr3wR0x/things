import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWageScComponent } from './manage-wage-sc.component';

describe('ManageWageScComponent', () => {
  let component: ManageWageScComponent;
  let fixture: ComponentFixture<ManageWageScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageWageScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWageScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
