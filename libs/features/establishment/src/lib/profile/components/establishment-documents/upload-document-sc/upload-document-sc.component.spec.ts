import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, DocumentService, LookupService } from '@gosi-ui/core';
import { commonProviders } from '@gosi-ui/features/establishment/lib/change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  DocumentServiceStub,
  LookupServiceStub,
  ModalServiceStub
} from 'testing';
import { UploadDocumentScComponent } from './upload-document-sc.component';

describe('UploadDocumentScComponent', () => {
  let component: UploadDocumentScComponent;
  let fixture: ComponentFixture<UploadDocumentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [UploadDocumentScComponent],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: DocumentService, useClass: DocumentServiceStub },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        FormBuilder,
        ...commonProviders
      ]
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
