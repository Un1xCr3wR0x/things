import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngagementsDetailsScComponent } from './engagements-details-sc.component';

describe('EngagementsDetailsScComponent', () => {
  let component: EngagementsDetailsScComponent;
  let fixture: ComponentFixture<EngagementsDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EngagementsDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngagementsDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
