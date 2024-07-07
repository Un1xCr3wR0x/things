import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonNationalityInfoDcComponent } from './person-nationality-info-dc.component';

describe('PersonNationalityInfoDcComponent', () => {
  let component: PersonNationalityInfoDcComponent;
  let fixture: ComponentFixture<PersonNationalityInfoDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonNationalityInfoDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonNationalityInfoDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
