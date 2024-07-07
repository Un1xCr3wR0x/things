import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReopenEstablishmentScComponent } from './reopen-establishment-sc.component';

describe('ReopenEstablishmentScComponent', () => {
  let component: ReopenEstablishmentScComponent;
  let fixture: ComponentFixture<ReopenEstablishmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReopenEstablishmentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReopenEstablishmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
