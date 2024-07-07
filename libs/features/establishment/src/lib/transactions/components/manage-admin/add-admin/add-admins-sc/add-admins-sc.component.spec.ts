import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdminsScComponent } from './add-admins-sc.component';

describe('AddAdminsScComponent', () => {
  let component: AddAdminsScComponent;
  let fixture: ComponentFixture<AddAdminsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAdminsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdminsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
