import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelationshipManagerScComponent } from './add-relationship-manager-sc.component';

describe('AddRelationshipManagerScComponent', () => {
  let component: AddRelationshipManagerScComponent;
  let fixture: ComponentFixture<AddRelationshipManagerScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRelationshipManagerScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRelationshipManagerScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
