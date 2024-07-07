import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadbodyRepatriationDcComponent } from './deadbody-repatriation-dc.component';

describe('DeadbodyRepatriationDcComponent', () => {
  let component: DeadbodyRepatriationDcComponent;
  let fixture: ComponentFixture<DeadbodyRepatriationDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeadbodyRepatriationDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadbodyRepatriationDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
