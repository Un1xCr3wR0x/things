import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCarousalDcComponent } from './data-carousal-dc.component';

describe('DataCarousalDcComponent', () => {
  let component: DataCarousalDcComponent;
  let fixture: ComponentFixture<DataCarousalDcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataCarousalDcComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCarousalDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
