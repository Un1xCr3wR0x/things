import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteToUsScComponent } from './write-to-us-sc.component';

describe('WriteToUsScComponent', () => {
  let component: WriteToUsScComponent;
  let fixture: ComponentFixture<WriteToUsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WriteToUsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteToUsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
