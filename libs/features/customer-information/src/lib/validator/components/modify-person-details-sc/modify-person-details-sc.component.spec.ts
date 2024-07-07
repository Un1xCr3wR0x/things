import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPersonDetailsScComponent } from './modify-person-details-sc.component';

describe('ModifyPersonDetailsScComponent', () => {
  let component: ModifyPersonDetailsScComponent;
  let fixture: ComponentFixture<ModifyPersonDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyPersonDetailsScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyPersonDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
