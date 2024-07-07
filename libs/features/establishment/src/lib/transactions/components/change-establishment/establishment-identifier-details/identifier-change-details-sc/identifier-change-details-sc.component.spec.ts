import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifierChangeDetailsScComponent } from './identifier-change-details-sc.component';

describe('IdentifierChangeDetailsScComponent', () => {
  let component: IdentifierChangeDetailsScComponent;
  let fixture: ComponentFixture<IdentifierChangeDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdentifierChangeDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifierChangeDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
