import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTabScComponent } from './transaction-tab-sc.component';
import { ApplicationTypeToken, ApplicationTypeEnum, EnvironmentToken, MenuService, LanguageToken } from '@gosi-ui/core';
import { MenuServiceStub } from 'testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

describe('TransactionTabScComponent', () => {
  let component: TransactionTabScComponent;
  let fixture: ComponentFixture<TransactionTabScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTabScComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: MenuService, useClass: MenuServiceStub },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: EnvironmentToken, useValue: "{'baseUrl':'localhost:8080/'}" }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTabScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
