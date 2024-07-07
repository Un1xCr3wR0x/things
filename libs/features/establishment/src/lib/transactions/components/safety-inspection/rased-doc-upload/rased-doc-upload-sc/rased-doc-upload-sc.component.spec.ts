import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RasedDocUploadScComponent } from './rased-doc-upload-sc.component';

describe('RasedDocUploadScComponent', () => {
  let component: RasedDocUploadScComponent;
  let fixture: ComponentFixture<RasedDocUploadScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RasedDocUploadScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RasedDocUploadScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
