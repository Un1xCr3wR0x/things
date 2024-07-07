import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsDcComponent } from './questions-dc.component';

describe('QuestionsDcComponent', () => {
  let component: QuestionsDcComponent;
  let fixture: ComponentFixture<QuestionsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
