import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalManagerComponent } from './legal-manager.component';

describe('LegalManagerComponent', () => {
  let component: LegalManagerComponent;
  let fixture: ComponentFixture<LegalManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
