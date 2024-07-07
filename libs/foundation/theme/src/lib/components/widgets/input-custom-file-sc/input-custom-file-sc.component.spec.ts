import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCustomFileScComponent } from './input-custom-file-sc.component';

describe('InputCustomFileScComponent', () => {
  let component: InputCustomFileScComponent;
  let fixture: ComponentFixture<InputCustomFileScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputCustomFileScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputCustomFileScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
