import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentsTransaction } from './upload-documents-sc.component';

describe('UploadDocumentsTransaction', () => {
  let component: UploadDocumentsTransaction;
  let fixture: ComponentFixture<UploadDocumentsTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadDocumentsTransaction]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentsTransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
