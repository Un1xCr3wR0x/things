import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepatriationExpensesDcComponent } from './repatriation-expenses-dc.component';

describe('RepatriationExpensesDcComponent', () => {
  let component: RepatriationExpensesDcComponent;
  let fixture: ComponentFixture<RepatriationExpensesDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepatriationExpensesDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepatriationExpensesDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
