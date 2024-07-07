/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentItem, DocumentService, LanguageToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { ContractAuthenticationServiceStub, DocumentServiceStub } from 'testing';
import { ContractAuthenticationService } from '../../../shared';
import { ContractDocumentScComponent } from './contract-document-sc.component';

describe('ContractDocumentScComponent', () => {
  let component: ContractDocumentScComponent;
  let fixture: ComponentFixture<ContractDocumentScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [ContractDocumentScComponent],
      providers: [
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: ContractAuthenticationService, useClass: ContractAuthenticationServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDocumentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get documents', () => {
    component.getDocuments();
    expect(component.documents).not.toBeNull();
  });

  it('should get document type', () => {
    const doc = new DocumentItem();
    doc.fileName = 'Employer processes form';
    expect(component.getDocumentType(doc)).toBeDefined();
  });

  it('should navigate to contract details', () => {
    spyOn(component.router, 'navigate');
    component.navigateToContractDetails();
    expect(component.router.navigate).toHaveBeenCalled();
  });
});
