import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItsmReopenDcComponent } from './itsm-reopen-dc.component';

describe('ItsmReopenDcComponent', () => {
  let component: ItsmReopenDcComponent;
  let fixture: ComponentFixture<ItsmReopenDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItsmReopenDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItsmReopenDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
