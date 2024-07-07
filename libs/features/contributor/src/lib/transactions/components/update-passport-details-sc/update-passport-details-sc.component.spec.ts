import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePassportDetailsScComponent } from './update-passport-details-sc.component';

describe('UpdatePassportDetailsScComponent', () => {
  let component: UpdatePassportDetailsScComponent;
  let fixture: ComponentFixture<UpdatePassportDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePassportDetailsScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePassportDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
