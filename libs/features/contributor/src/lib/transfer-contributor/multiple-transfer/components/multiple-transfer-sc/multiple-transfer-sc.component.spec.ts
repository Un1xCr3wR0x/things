import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleTransferScComponent } from './multiple-transfer-sc.component';

describe('MultipleTransferScComponent', () => {
  let component: MultipleTransferScComponent;
  let fixture: ComponentFixture<MultipleTransferScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleTransferScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleTransferScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
