import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNinDetailsDcComponent } from './add-nin-details-dc.component';

describe('AddNinDetailsDcComponent', () => {
  let component: AddNinDetailsDcComponent;
  let fixture: ComponentFixture<AddNinDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNinDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNinDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
