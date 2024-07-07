import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepatriationInjuryScComponent } from './repatriation-injury-sc.component';

describe('RepatriationInjuryScComponent', () => {
  let component: RepatriationInjuryScComponent;
  let fixture: ComponentFixture<RepatriationInjuryScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepatriationInjuryScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepatriationInjuryScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
