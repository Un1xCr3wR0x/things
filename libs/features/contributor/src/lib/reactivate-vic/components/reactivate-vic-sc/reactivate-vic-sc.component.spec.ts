import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateVicScComponent } from './reactivate-vic-sc.component';

describe('ReactivateVicScComponent', () => {
  let component: ReactivateVicScComponent;
  let fixture: ComponentFixture<ReactivateVicScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactivateVicScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
