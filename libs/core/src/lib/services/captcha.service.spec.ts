/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';
import { CaptchaService } from './captcha.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationTypeToken } from '../tokens';
import { ApplicationTypeEnum } from '../enums';
import { Captcha } from '../models';

describe('TransactionService', () => {
  let service: CaptchaService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ]
    });
    service = TestBed.inject(CaptchaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('getCaptchaCode', () => {
    it('Should get Captcha Code', () => {
      const id = 1234;
      service.getCaptchaCode(id);
      expect(service.getCaptchaCode).not.toBe(null);
    });
  });
  describe('verify Captcha', () => {
    it('to verify Captcha', () => {
      const captcha = new Captcha();
      captcha.captchaId = 123;
      captcha.captcha = 'abcdef';
      const url = `/api/v1/captcha/verify?captchaId=${captcha.captchaId}&captcha=${captcha.captcha}`;
      service.verifyCaptcha(captcha).subscribe(response => {
        expect(response).toBeTruthy();
      });
      const task = httpMock.expectOne(url);
      expect(task.request.method).toBe('POST');
    });
  });
});
