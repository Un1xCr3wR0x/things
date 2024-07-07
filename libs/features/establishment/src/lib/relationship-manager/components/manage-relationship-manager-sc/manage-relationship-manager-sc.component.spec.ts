import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRelationshipManagerScComponent } from './manage-relationship-manager-sc.component';

describe('ManageRelationshipManagerScComponent', () => {
  let component: ManageRelationshipManagerScComponent;
  let fixture: ComponentFixture<ManageRelationshipManagerScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageRelationshipManagerScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRelationshipManagerScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
