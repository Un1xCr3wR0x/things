import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNinDcComponent } from './add-nin-dc.component';

describe('AddNinDcComponent', () => {
  let component: AddNinDcComponent;
  let fixture: ComponentFixture<AddNinDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNinDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNinDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
