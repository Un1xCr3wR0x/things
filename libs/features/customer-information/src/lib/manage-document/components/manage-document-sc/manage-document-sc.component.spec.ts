import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  CoreContributorService,
  DocumentService,
  RouterDataToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  CoreContributorSerivceStub,
  DocumentServiceStub,
  genericRouteData,
  ManageDocumentServiceStub,
  ManagePersonFeatureServiceStub,
  ManagePersonRoutingServiceStub,
  ModalServiceStub
} from 'testing';
import { ManageDocumentService, ManagePersonRoutingService, ManagePersonService } from '../../../shared';
import { ManageDocumentScComponent } from './manage-document-sc.component';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ManageDocumentScComponent', () => {
  let component: ManageDocumentScComponent;
  let fixture: ComponentFixture<ManageDocumentScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageDocumentScComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: CoreContributorService,
          useClass: CoreContributorSerivceStub
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: ManagePersonService,
          useClass: ManagePersonFeatureServiceStub
        },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: Router, useValue: routerSpy },
        {
          provide: ManagePersonRoutingService,
          useClass: ManagePersonRoutingServiceStub
        },
        { provide: RouterDataToken, useValue: genericRouteData },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: ManageDocumentService,
          useClass: ManageDocumentServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDocumentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
