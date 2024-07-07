import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserContactScComponent } from './update-user-contact-sc.component';

describe('UpdateUserContactScComponent', () => {
  let component: UpdateUserContactScComponent;
  let fixture: ComponentFixture<UpdateUserContactScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserContactScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserContactScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
