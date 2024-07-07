import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbmDetailsScComponent } from './cbm-details-sc.component';

describe('CbmDetailsScComponent', () => {
  let component: CbmDetailsScComponent;
  let fixture: ComponentFixture<CbmDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CbmDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbmDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
