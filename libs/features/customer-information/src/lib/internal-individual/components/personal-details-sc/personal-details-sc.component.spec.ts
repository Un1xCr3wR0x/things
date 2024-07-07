import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailsScComponent } from './personal-details-sc.component';

describe('PersonalDetailsScComponent', () => {
  let component: PersonalDetailsScComponent;
  let fixture: ComponentFixture<PersonalDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
