import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteUsScComponent } from './write-us-sc.component';

describe('WriteUsScComponent', () => {
  let component: WriteUsScComponent;
  let fixture: ComponentFixture<WriteUsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WriteUsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteUsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
