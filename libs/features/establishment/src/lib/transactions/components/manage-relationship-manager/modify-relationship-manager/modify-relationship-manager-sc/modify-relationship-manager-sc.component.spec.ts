import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyRelationshipManagerScComponent } from './modify-relationship-manager-sc.component';

describe('ModifyRelationshipManagerScComponent', () => {
  let component: ModifyRelationshipManagerScComponent;
  let fixture: ComponentFixture<ModifyRelationshipManagerScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyRelationshipManagerScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyRelationshipManagerScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
