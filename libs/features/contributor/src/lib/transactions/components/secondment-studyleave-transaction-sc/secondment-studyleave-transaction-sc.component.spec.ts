import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondmentStudyleaveTransactionScComponent } from './secondment-studyleave-transaction-sc.component';

describe('SecondmentStudyleaveTransactionScComponent', () => {
  let component: SecondmentStudyleaveTransactionScComponent;
  let fixture: ComponentFixture<SecondmentStudyleaveTransactionScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecondmentStudyleaveTransactionScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondmentStudyleaveTransactionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
