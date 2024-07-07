import { async, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import {
  DocumentItem,
  DocumentService,
  EnvironmentToken,
  LanguageToken,
  AlertService,
  ApplicationTypeToken,
  ApplicationTypeEnum
} from '@gosi-ui/core';
import { IconsModule } from '@gosi-ui/foundation-theme/lib/icons.module';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { TranslateLoaderStub, BilingualTextPipeMock, AlertServiceStub } from 'testing';
import { InputFileScComponent } from './input-file-sc.component';

export class DocumentServicesStub {
  deleteDocument() {
    return of(null);
  }
}

export class StubbedModalService {
  public show(): void {}
}

describe('InputFileScComponent', () => {
  let component: InputFileScComponent;
  let fixture: ComponentFixture<InputFileScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        IconsModule
      ],
      declarations: [InputFileScComponent, BilingualTextPipeMock],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: BsModalService, useClass: StubbedModalService },
        {
          provide: DocumentService,
          useClass: DocumentServicesStub
        },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject('en')
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFileScComponent);
    component = fixture.componentInstance;
    component.document = new DocumentItem();
    component.bsModal = new BsModalRef();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check type error true', () => {
    component.document.started = true;
    component.document.uploaded = false;
    component.checkTypeError();
    expect(component.document.uploadFailed).toBeTruthy();
  });

  it('check type error false', () => {
    component.document.started = true;
    component.document.uploaded = true;
    component.checkTypeError();
    expect(component.document.uploadFailed).toBeFalsy();
  });

  it('check type error false', () => {
    component.document.started = false;
    component.document.uploaded = true;
    component.checkTypeError();
    expect(component.document.uploadFailed).toBeFalsy();
  });

  it('reset all document parameters', () => {
    component.resetDocument();
    expect(component.document.documentContent).toBe(null);
    expect(component.document.started).toBeFalsy();
    expect(component.document.valid).toBeFalsy();
    expect(component.document.fileName).toBe(null);
    expect(component.document.uploaded).toBeFalsy();
    expect(component.document.isUploading).toBeFalsy();
    expect(component.document.isScanning).toBeFalsy();
    expect(component.document.size).toBe(null);
    expect(component.document.isContentOpen).toBeFalsy();
    expect(component.document.percentageLoaded).toBe(null);
    expect(component.document.icon).toBe(null);
    expect(component.document.uploadFailed).toBeFalsy();
  });

  it('preview Document if true', () => {
    component.document.documentContent = 'thisisamockdatacontent';
    component.document.fileName = 'testfilename';

    component.previewDocument();

    expect(component.fileUrl).toBeDefined();
    expect(component.document.isContentOpen).toBeTruthy();
  });

  it('preview Document if false', () => {
    component.document.documentContent = 'NULL';
    component.document.fileName = 'testfilename';

    component.previewDocument();

    expect(component.fileUrl).toBe(null);
    expect(component.document.isContentOpen).toBeTruthy();
  });

  it('close Document', () => {
    component.closeDocument();
    expect(component.document.isContentOpen).toBeFalsy();
  });

  it('refresh Document', () => {
    let doc = null;
    component.refresh.subscribe(res => (doc = res));

    component.refreshDocument();

    expect(doc).not.toBeNull();
  });

  it('declinePopup', () => {
    spyOn(component, 'declinePopUp').and.callThrough();

    component.declinePopUp();

    expect(component.declinePopUp).toHaveBeenCalled();
  });

  it('Open Image', () => {
    component.document.documentContent = 'thisisamockdocumentcontent';
    spyOn(window, 'open').and.callThrough();

    component.openImage();

    expect(window.open).toHaveBeenCalled();
  });

  it('should delete the document', () => {
    component.deleteDocument();
    spyOn(component.documentService, 'deleteDocument').and.returnValue(of(null));
    expect(component.document.documentContent).toBeNull();
  });
  it('Set Icon', () => {
    expect(component.setIcon()).toBe(component.document.icon);
  });
});
