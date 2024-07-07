import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ApplicationTypeEnum, ApplicationTypeToken, LanguageToken, LookupService } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PaginatePipe, PaginationService } from 'ngx-pagination';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LookupServiceStub, ModalServiceStub } from 'testing';

import { AssignSessionScComponent } from './assign-session-sc.component';

describe('AssignSessionScComponent', () => {
  let component: AssignSessionScComponent;
  let fixture: ComponentFixture<AssignSessionScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        PaginationService,
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        }
      ],
      declarations: [AssignSessionScComponent, PaginatePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSessionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
