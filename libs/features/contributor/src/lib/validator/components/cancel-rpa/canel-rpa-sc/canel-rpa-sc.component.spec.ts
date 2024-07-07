import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanelRpaScComponent } from './canel-rpa-sc.component';

describe('CanelRpaScComponent', () => {
  let component: CanelRpaScComponent;
  let fixture: ComponentFixture<CanelRpaScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanelRpaScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanelRpaScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
