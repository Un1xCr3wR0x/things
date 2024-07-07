import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestorDetailsDcComponent } from './requestor-details-dc.component';

describe('RequestorDetailDcComponent', () => {
  let component: RequestorDetailsDcComponent;
  let fixture: ComponentFixture<RequestorDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestorDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestorDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
