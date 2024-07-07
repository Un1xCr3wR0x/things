import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TerminateEngagementIndScComponent } from './terminate-engagement-ind-sc.component';

describe('TerminateEngagementIndScComponent', () => {
  let component: TerminateEngagementIndScComponent;
  let fixture: ComponentFixture<TerminateEngagementIndScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerminateEngagementIndScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateEngagementIndScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
