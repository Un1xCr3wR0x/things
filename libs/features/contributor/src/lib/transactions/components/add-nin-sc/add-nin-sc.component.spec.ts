import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNinDetailsScComponent } from './add-nin-sc.component';

describe('AddNinScComponent', () => {
  let component: AddNinDetailsScComponent;
  let fixture: ComponentFixture<AddNinDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNinDetailsScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNinDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
