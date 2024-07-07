import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyFlagEstablishmentScComponent } from './modify-flag-establishment-sc.component';

describe('ModifyFlagEstablishmentScComponent', () => {
  let component: ModifyFlagEstablishmentScComponent;
  let fixture: ComponentFixture<ModifyFlagEstablishmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyFlagEstablishmentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyFlagEstablishmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
