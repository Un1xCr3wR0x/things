import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNinScComponent } from './add-nin-sc.component';

describe('AddNinScComponent', () => {
  let component: AddNinScComponent;
  let fixture: ComponentFixture<AddNinScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNinScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNinScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
