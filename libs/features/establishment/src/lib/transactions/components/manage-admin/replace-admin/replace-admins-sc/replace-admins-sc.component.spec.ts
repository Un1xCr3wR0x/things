import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceAdminsScComponent } from './replace-admins-sc.component';

describe('ReplaceAdminsScComponent', () => {
  let component: ReplaceAdminsScComponent;
  let fixture: ComponentFixture<ReplaceAdminsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReplaceAdminsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceAdminsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
