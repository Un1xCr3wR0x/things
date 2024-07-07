import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEstablishmentTransactionsScComponent } from './register-establishment-transactions-sc.component';

describe('RegisterEstablishmentTransactionsScComponent', () => {
  let component: RegisterEstablishmentTransactionsScComponent;
  let fixture: ComponentFixture<RegisterEstablishmentTransactionsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterEstablishmentTransactionsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEstablishmentTransactionsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
