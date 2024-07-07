import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseEstablishmentScComponent } from './close-establishment-sc.component';

describe('CloseEstablishmentScComponent', () => {
  let component: CloseEstablishmentScComponent;
  let fixture: ComponentFixture<CloseEstablishmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloseEstablishmentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseEstablishmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
