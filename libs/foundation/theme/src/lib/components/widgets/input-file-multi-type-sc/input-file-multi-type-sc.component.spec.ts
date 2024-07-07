import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFileMultiTypeScComponent } from './input-file-multi-type-sc.component';

describe('InputFileMultiTypeScComponent', () => {
  let component: InputFileMultiTypeScComponent;
  let fixture: ComponentFixture<InputFileMultiTypeScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputFileMultiTypeScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFileMultiTypeScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
