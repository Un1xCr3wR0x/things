import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAdminsScComponent } from './modify-admins-sc.component';

describe('ModifyAdminsScComponent', () => {
  let component: ModifyAdminsScComponent;
  let fixture: ComponentFixture<ModifyAdminsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyAdminsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyAdminsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
