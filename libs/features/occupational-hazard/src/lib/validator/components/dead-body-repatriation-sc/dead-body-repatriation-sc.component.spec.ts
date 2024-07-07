import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadBodyRepatriationScComponent } from './dead-body-repatriation-sc.component';

describe('DeadBodyRepatriationScComponent', () => {
  let component: DeadBodyRepatriationScComponent;
  let fixture: ComponentFixture<DeadBodyRepatriationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeadBodyRepatriationScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadBodyRepatriationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
