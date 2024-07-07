import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscationReactivateVicScComponent } from './transcation-reactivate-vic-sc.component';

describe('TranscationReactivateVicScComponent', () => {
  let component: TranscationReactivateVicScComponent;
  let fixture: ComponentFixture<TranscationReactivateVicScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranscationReactivateVicScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscationReactivateVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
