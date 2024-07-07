import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentScComponent } from './upload-document-sc.component';

describe('UploadDocumentScComponent', () => {
  let component: UploadDocumentScComponent;
  let fixture: ComponentFixture<UploadDocumentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadDocumentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
