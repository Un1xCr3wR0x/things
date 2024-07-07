import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileScComponent } from './my-profile-sc.component';

describe('MyProfileScComponent', () => {
  let component: MyProfileScComponent;
  let fixture: ComponentFixture<MyProfileScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyProfileScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
