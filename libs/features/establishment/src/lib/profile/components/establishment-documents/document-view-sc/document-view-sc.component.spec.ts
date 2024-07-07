import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, DocumentService } from '@gosi-ui/core';
import { commonProviders } from '@gosi-ui/features/establishment/lib/change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { EstablishmentService } from '@gosi-ui/features/establishment/lib/shared';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AlertServiceStub, DocumentServiceStub, EstablishmentServiceStub } from 'testing';

import { DocumentViewScComponent } from './document-view-sc.component';

describe('DocumentViewScComponent', () => {
  let component: DocumentViewScComponent;
  let fixture: ComponentFixture<DocumentViewScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [DocumentViewScComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: EstablishmentService, useClass: EstablishmentServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              paramMap: of({
                get: () => 12345
              })
            }
          }
        },
        ...commonProviders
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentViewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
