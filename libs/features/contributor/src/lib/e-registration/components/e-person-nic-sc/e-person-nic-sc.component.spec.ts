import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPersonNicScComponent } from './e-person-nic-sc.component';

describe('EPersonNicScComponent', () => {
  let component: EPersonNicScComponent;
  let fixture: ComponentFixture<EPersonNicScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPersonNicScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EPersonNicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
