import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VicWageUpdateScComponent } from './vic-wage-update-sc.component';

describe('VicWageUpdateScComponent', () => {
  let component: VicWageUpdateScComponent;
  let fixture: ComponentFixture<VicWageUpdateScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VicWageUpdateScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VicWageUpdateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
