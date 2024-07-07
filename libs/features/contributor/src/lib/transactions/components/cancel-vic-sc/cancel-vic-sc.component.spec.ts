import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelVicScComponent } from './cancel-vic-sc.component';

describe('CancelVicScComponent', () => {
  let component: CancelVicScComponent;
  let fixture: ComponentFixture<CancelVicScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelVicScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
