/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApplicationTypeToken } from '@gosi-ui/core';
import { MedicalBoardService } from './medical-board.service';
import { MemberRequest } from '../models';
import { boardMembersListMock, genericError } from 'testing';
import { throwError } from 'rxjs';

describe('MedicalBoardService', () => {
  let service: MedicalBoardService;
  let httpMock: HttpTestingController;
  let memberRequest: MemberRequest = <MemberRequest>{};
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: 'PRIVATE'
        }
      ]
    });
    service = TestBed.inject(MedicalBoardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch medical board members list', () => {
    memberRequest.listOfDoctorType = [
      {
        arabic: 'طبيب متعاقد',
        english: 'Nurse'
      }
    ];
    memberRequest.listOfRegion = [
      {
        arabic: 'الكويت',
        english: 'Kuwait'
      }
    ];
    memberRequest.listOfSpecialty = [
      {
        arabic: 'التخدير',
        english: 'Anesthesia'
      }
    ];
    memberRequest.listOfStatus = [
      {
        arabic: 'معتمد',
        english: 'Active'
      }
    ];
    memberRequest.searchKey = '7';
    const url = `/api/v1/medical-professional?listOfDoctorType=Nurse&listOfStatus=Active&listOfSpecialty=Anesthesia&listOfRegion=Kuwait&searchKey=7&pageNo=0&pageSize=10&sortOrder=Desc`;
    service.getTransactions(memberRequest).subscribe(res => {
      expect(res.mbList.length).toBeGreaterThan(0);
    });
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(boardMembersListMock);
  });
});
