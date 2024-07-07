import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCsvScComponent } from './input-csv-sc.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalServiceStub, AlertServiceStub } from 'testing';
import { AlertService, ApplicationTypeToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';

describe('InputCsvScComponent', () => {
  let component: InputCsvScComponent;
  let fixture: ComponentFixture<InputCsvScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [InputCsvScComponent],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputCsvScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file upload', () => {
    component.handleFileUpload({ length: 0, item: null });
    expect(component.uploadCSV).toBeUndefined();
  });
  xit('should handle file upload', () => {
    let blob: any = new Blob(['name'], { type: 'text/csv;charset=utf-8;' });
    let formData = new FormData();
    formData.append('name', blob, 'name.csv');
    formData.append('type', blob, 'application/.csv');
    formData.append('lastModified', blob, new Date().toDateString());
    component.handleFileUpload({ length: 1, item: null, 0: blob });
    expect(component.uploadFailed).toBeFalsy();
  });

  it('should show pop up', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    spyOn(component['modalService'], 'show');
    component.showTemplate(modalRef);
    expect(component['modalService'].show).toHaveBeenCalled();
  });

  it('should delete document', () => {
    component.modalRef = new BsModalRef();
    component.deleteDocument();
    expect(component.uploadCSV).toBeUndefined();
  });

  it('should emit processing', () => {
    spyOn(component.process, 'emit');
    component.startProcessing();
    expect(component.process.emit).toHaveBeenCalled();
  });
});
