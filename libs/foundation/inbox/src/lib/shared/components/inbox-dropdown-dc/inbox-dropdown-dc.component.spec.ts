import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxDropdownDcComponent } from './inbox-dropdown-dc.component';

describe('InboxDropdownDcComponent', () => {
  let component: InboxDropdownDcComponent;
  let fixture: ComponentFixture<InboxDropdownDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InboxDropdownDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxDropdownDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
