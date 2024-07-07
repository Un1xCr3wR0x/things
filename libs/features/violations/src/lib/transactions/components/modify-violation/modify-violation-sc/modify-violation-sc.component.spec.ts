import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyViolationScComponent } from './modify-violation-sc.component';

describe('ModifyViolationScComponent', () => {
  let component: ModifyViolationScComponent;
  let fixture: ComponentFixture<ModifyViolationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyViolationScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyViolationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
