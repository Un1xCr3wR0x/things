import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualEngagementsDetailsScComponent } from './individual-engagements-details-sc.component';

describe('IndividualEngagementsScComponent', () => {
  let component: IndividualEngagementsDetailsScComponent;
  let fixture: ComponentFixture<IndividualEngagementsDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualEngagementsDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualEngagementsDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
