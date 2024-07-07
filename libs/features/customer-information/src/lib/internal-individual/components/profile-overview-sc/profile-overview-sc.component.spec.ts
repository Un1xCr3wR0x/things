import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOverviewScComponent } from './profile-overview-sc.component';

describe('ProfileOverviewScComponent', () => {
  let component: ProfileOverviewScComponent;
  let fixture: ComponentFixture<ProfileOverviewScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileOverviewScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileOverviewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
