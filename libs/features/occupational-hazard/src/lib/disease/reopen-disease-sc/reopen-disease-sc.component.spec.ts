import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReopenDiseaseScComponent } from './reopen-disease-sc.component';

describe('ReopenDiseaseScComponent', () => {
  let component: ReopenDiseaseScComponent;
  let fixture: ComponentFixture<ReopenDiseaseScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReopenDiseaseScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReopenDiseaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
