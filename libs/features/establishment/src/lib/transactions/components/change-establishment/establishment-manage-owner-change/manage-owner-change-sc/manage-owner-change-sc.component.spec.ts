import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOwnerChangeScComponent } from './manage-owner-change-sc.component';

describe('ManageOwnerChangeScComponent', () => {
  let component: ManageOwnerChangeScComponent;
  let fixture: ComponentFixture<ManageOwnerChangeScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOwnerChangeScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOwnerChangeScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
