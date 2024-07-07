/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LandingScComponent } from './landing-sc.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationTypeToken, ApplicationTypeEnum, AuthTokenService } from '@gosi-ui/core';
import { BilingualTextPipeMock, AuthTokenServiceStub } from 'testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
describe('LandingScComponent', () => {
  let component: LandingScComponent;
  let fixture: ComponentFixture<LandingScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: AuthTokenService,
          useClass: AuthTokenServiceStub
        }
      ],
      declarations: [LandingScComponent, BilingualTextPipeMock],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
