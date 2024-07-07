import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentScComponent } from './development-sc.component';

describe('DevelopmentScComponent', () => {
  let component: DevelopmentScComponent;
  let fixture: ComponentFixture<DevelopmentScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DevelopmentScComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
