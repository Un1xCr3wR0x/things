import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentService,
  EnvironmentToken,
  EstablishmentRouterData,
  EstablishmentToken,
  LanguageToken,
  LookupService,
  MenuService,
  WorkflowService
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  BilingualTextPipeMock,
  ChangeEstablishmentServiceStub,
  DocumentServiceStub,
  EstablishmentStubService,
  LookupServiceStub,
  ModalServiceStub,
  WorkflowServiceStub
} from 'testing';
import { ChangeEstablishmentService, EstablishmentService } from './services';

export const routeStub: ActivatedRouteStub = new ActivatedRouteStub({ registrationNo: 987654321 });
export const routerSpy = { url: '', navigate: jasmine.createSpy('navigate') };
const httpSpy = { get: jasmine.createSpy('get'), post: jasmine.createSpy('post') };
export const menuStub = {
  provide: MenuService,
  useValue: {
    getRoles() {
      return [];
    }
  }
};

//FIXME some issue when importing
export const commonServiceStubs = [menuStub, { provide: BsModalService, useClass: ModalServiceStub }];

//FIXME some issue when importing
export const unusedImports = [
  FormBuilder,
  {
    provide: HttpClient,
    useValue: httpSpy
  },

  {
    provide: Router,
    useValue: routerSpy
  },
  {
    provide: EstablishmentService,
    useClass: EstablishmentStubService
  },
  {
    provide: ChangeEstablishmentService,
    useClass: ChangeEstablishmentServiceStub
  },
  {
    provide: AlertService,
    useClass: AlertServiceStub
  },
  {
    provide: LookupService,
    useClass: LookupServiceStub
  },
  {
    provide: DocumentService,
    useClass: DocumentServiceStub
  },

  { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
  { provide: LanguageToken, useValue: new BehaviorSubject('en') },
  { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
  { provide: EstablishmentToken, useValue: new EstablishmentRouterData() },
  { provide: WorkflowService, useClass: WorkflowServiceStub },
  {
    provide: EnvironmentToken,
    useValue: "{'baseUrl':'localhost:8080/'}"
  }
];
