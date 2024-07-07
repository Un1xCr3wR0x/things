import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteUsDetailsScComponent } from './write-us-details-sc.component';

describe('WriteUsDetailsScComponent', () => {
  let component: WriteUsDetailsScComponent;
  let fixture: ComponentFixture<WriteUsDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WriteUsDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteUsDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
