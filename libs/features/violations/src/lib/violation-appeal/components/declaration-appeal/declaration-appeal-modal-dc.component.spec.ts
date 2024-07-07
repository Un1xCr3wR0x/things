import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationAppealModalDcComponent } from './declaration-appeal-modal-dc.component';

describe('DeclarationAppealComponent', () => {
  let component: DeclarationAppealModalDcComponent;
  let fixture: ComponentFixture<DeclarationAppealModalDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclarationAppealModalDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclarationAppealModalDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
