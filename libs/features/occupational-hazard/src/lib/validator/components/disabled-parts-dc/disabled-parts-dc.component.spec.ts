import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledPartsDcComponent } from './disabled-parts-dc.component';

describe('DisabledPartsDcComponent', () => {
  let component: DisabledPartsDcComponent;
  let fixture: ComponentFixture<DisabledPartsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisabledPartsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledPartsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
