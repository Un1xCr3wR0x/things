/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  WizardItem
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { BenefitConstants } from '..';
import { BenefitDocumentService } from './benefit-document.service';
import { switchMap, delay } from 'rxjs/operators';

describe('BenefitDocumentService', () => {
  let service: BenefitDocumentService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, BrowserDynamicTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        DatePipe
      ]
    });
    service = TestBed.inject(BenefitDocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should addDocumentIcon', () => {
    const wizardItems: WizardItem[] = [];
    wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
    expect(service.addDocumentIcon).toBeTruthy();
  });
  it('should  getAllDocuments', () => {
    expect(service.getAllDocuments(1234)).not.toEqual(null);
  });
  it('should downloadAddCommitment', () => {
    expect(service.downloadAddCommitment(1234)).not.toEqual(null);
  });
  it('should getStopBenefitDocuments', () => {
    expect(service.getStopBenefitDocuments(1234, 234554, 333444, '3432', 'wdsfd')).not.toEqual(null);
  });
  it('should  getModifyPayeeDocuments', () => {
    expect(service.getModifyPayeeDocuments(1234, 234554, 333444, '3432', 'wdsfd')).not.toEqual(null);
  });
  it('should  getUploadedDocuments', () => {
    expect(service.getUploadedDocuments(1234, '3432', 'wdsfd', 454545)).not.toEqual(null);
  });
  it('should getValidatorDocuments', () => {
    expect(service.getValidatorDocuments(1234, 4556, 23232, '3432', 'wdsfd')).not.toEqual(null);
  });
  it('should getRequiredDocuments', () => {
    const isBackdated = false;
    expect(service.getRequiredDocuments(1234, 4556, 23232, isBackdated)).not.toEqual(null);
  });
  it('should getReqDocs', () => {
    const isBackdated = false;
    expect(service.getReqDocs(1234, 4556, 23232, isBackdated)).not.toEqual(null);
  });
  it('should fetchDocs', () => {
    expect(service.fetchDocs(1234, 4556, '23232', 'ssddff')).not.toEqual(null);
  });
});
