import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateScComponent } from './reactivate-sc.component';

describe('ReactivateScComponent', () => {
  let component: ReactivateScComponent;
  let fixture: ComponentFixture<ReactivateScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactivateScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
