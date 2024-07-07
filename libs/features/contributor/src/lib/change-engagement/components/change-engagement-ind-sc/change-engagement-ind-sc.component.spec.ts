import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEngagementIndScComponent } from './change-engagement-ind-sc.component';

describe('ChangeEngagementIndScComponent', () => {
  let component: ChangeEngagementIndScComponent;
  let fixture: ComponentFixture<ChangeEngagementIndScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeEngagementIndScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeEngagementIndScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
