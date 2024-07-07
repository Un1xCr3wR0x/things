import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualProfileScComponent } from './individual-profile-sc.component';

describe('IndividualProfileScComponent', () => {
  let component: IndividualProfileScComponent;
  let fixture: ComponentFixture<IndividualProfileScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualProfileScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualProfileScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
