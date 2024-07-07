import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorSearchScComponent } from './contributor-search-sc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { AlertServiceStub } from 'testing';
import { AlertService } from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ContributorSearchScComponent', () => {
  let component: ContributorSearchScComponent;
  let fixture: ComponentFixture<ContributorSearchScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [ContributorSearchScComponent],
      providers: [{ provide: AlertService, useClass: AlertServiceStub }, FormBuilder],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorSearchScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
