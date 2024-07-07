import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateVicScComponent } from './terminate-vic-sc.component';

describe('TerminateVicScComponent', () => {
  let component: TerminateVicScComponent;
  let fixture: ComponentFixture<TerminateVicScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerminateVicScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
