import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPassportDeailsDcComponent } from './add-passport-deails-dc.component';

describe('AddPassportDeailsDcComponent', () => {
  let component: AddPassportDeailsDcComponent;
  let fixture: ComponentFixture<AddPassportDeailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPassportDeailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPassportDeailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
