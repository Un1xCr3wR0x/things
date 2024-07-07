import { TestBed } from '@angular/core/testing';

import { PenalityWavierService } from './penality-wavier.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import {
  PenalityWavierDetailsMockData,
  PenalityWavierBulkDetailsMockData,
  bulkPenaltyCountMockData
} from 'testing/test-data/features/billing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PenaltyWaiverRequest, PenaltyWaiverSegmentRequest } from '../models';
import { BPMUpdateRequest } from '@gosi-ui/core';
describe('PenalityWavierService', () => {
  let service: PenalityWavierService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(PenalityWavierService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get Vic Segments', () => {
    service.vicSegments.english = 'juuu'; //invokes setter method
    expect(service.vicSegments.english).toBe('juuu');
  });
  it('should get Establishment Segments', () => {
    service.establishmentSegments = 'juuu'; //invokes setter method
    expect(service.establishmentSegments).toBe('juuu');
  });
  it('should get PenalityWaiverBulkFileContent', () => {
    service.fileContent = [321]; //invokes setter method
    expect(service.fileContent).toEqual([321]);
  });
  describe('getPenalityWavierDetails', () => {
    it('to get penality details', () => {
      const fromDate = '15-10-2020';
      const toDate = '15-12-2020';
      const url = `/api/v1/establishment/200085744/penalty-waiver/quote?includeHistory=true&waiveOffType=NORMAL&waiveFrom=${fromDate}&waiveTo=${toDate}`;
      service.getWavierPenalityDetails(200085744, 'NORMAL', '15-10-2020', '15-12-2020').subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(PenalityWavierDetailsMockData);
    });
  });
  describe('submit waiver penalty Details', () => {
    it('should update the payment details', () => {
      const submitWavierPenalityDetails = `/api/v1/establishment/200085744/penalty-waiver`;
      service.submitWavierPenalityDetails(200085744, new PenaltyWaiverRequest()).subscribe(response => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(submitWavierPenalityDetails);
      expect(req.request.method).toBe('POST');
      req.flush(PenalityWavierDetailsMockData);
    });
  });
  describe('submitWavierPenalitySegmentDetails', () => {
    it('submitWavierPenalitySegmentDetails', () => {
      const submitWavierPenalitySegmentDetails = `/api/v1/bulk-penalty-waiver`;
      service.submitWavierPenalitySegmentDetails(new PenaltyWaiverRequest()).subscribe(response => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(submitWavierPenalitySegmentDetails);
      expect(req.request.method).toBe('POST');
      req.flush(PenalityWavierDetailsMockData);
    });
  });
  describe('submit waiver penalty Details', () => {
    it('should update the payment details', () => {
      const submitWavierPenalityDetails = `/api/v1/contributor/200085744/penalty-waiver`;
      service.submitVicWavierPenalityDetails(200085744, new PenaltyWaiverRequest()).subscribe(response => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(submitWavierPenalityDetails);
      expect(req.request.method).toBe('POST');
      req.flush(PenalityWavierDetailsMockData);
    });
  });
  describe('getWavierPenalityDetailsForView', () => {
    it('to get penality details', () => {
      const url = `/api/v1/establishment/200085744/penalty-waiver/5326356`;
      service.getWavierPenalityDetailsForView(200085744, 5326356).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(PenalityWavierDetailsMockData);
    });
  });
  describe('handleWorkflowActions', () => {
    it('to handle workflow actions', () => {
      const data = new BPMUpdateRequest();
      data.taskId = 'cb7914aa-ab60-468b-b576-623eee111c9b';
      data.user = 'mahesh';
      data.outcome = 'Approve';
      const workflow = `/api/process-manager/v1/taskservice/update`;
      service.handleWorkflowActions(data).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(workflow);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
  describe('submitAfterEdit', () => {
    it('to submit after editing', () => {
      const taskId = 'cb7914aa-ab60-468b-b576-623eee111c9b';
      const workflowUser = 'mahesh';
      const submitWaiverPenalty = `/api/process-manager/v1/taskservice/update`;
      service.submitAfterEditforWaivePenalty(taskId, workflowUser).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(submitWaiverPenalty);
      expect(req.request.method).toBe('POST');
      req.flush('');
    });
  });
  describe('getVicPenalityWavierDetails', () => {
    it('to get vic penality details', () => {
      const fromDate = '15-10-2020';
      const toDate = '15-12-2020';
      //const url = `/api/v1/contributor/210274677/penalty-waiver/quote?includeHistory=true&waiveOffType=SPECIAL`;

      const url = `/api/v1/contributor/210274677/penalty-waiver/quote?includeHistory=true&waiveOffType=SPECIAL&waiveFrom=${fromDate}&waiveTo=${toDate}`;

      service.getVicWavierPenalityDetails(210274677, 'SPECIAL', '15-10-2020', '15-12-2020').subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(PenalityWavierDetailsMockData);
    });
  });
  describe('submit waiver penalty Details', () => {
    it('should update the payment details', () => {
      const url = `/api/v1/establishment/200085744/penalty-waiver/123456`;
      service.submitDetailsAfterEdit(200085744, 123456, new PenaltyWaiverRequest()).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PATCH');
      req.flush(PenalityWavierDetailsMockData);
    });
  });
  describe('penaltyWaiverRevert', () => {
    it('penaltyWaiverRevert', () => {
      const url = `/api/v1/establishment/200085744/penalty-waiver/123456/revert`;
      service.penaltyWaiverRevert(200085744, 123456).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });
  describe('getExceptionalVicDetails', () => {
    it('to get vic penality details', () => {
      const url = `/api/v1/contributor/200085744/penalty-waiver/256`;
      service.getExceptionalVicDetails(200085744, 256).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(PenalityWavierDetailsMockData);
    });
  });

  describe('getExceptionalBulkDetails', () => {
    it('to get Bulk penality details', () => {
      const url = `/api/v1/bulk-penalty-waiver/56`;
      service.getExceptionalBulkDetails(56).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(PenalityWavierBulkDetailsMockData);
    });
  });
  // describe('sortLovlist', () => {
  //   it('should sort list for bank in english', () => {
  //     const list = service.sortLovList(penaltyReason, false, 'en');
  //     expect(list).toBeDefined();
  //   });
  //   it('should sort list for bank in arabic', () => {
  //     const list = service.sortLovList(penaltyReason, false, 'ar');
  //     expect(list).toBeDefined();
  //   });
  // });
  describe('getBulkPenaltyWaiverQuote', () => {
    it('to get Bulk penality details', () => {
      const segmentCriteria = 'new';
      const segmentCriteriaValues = 'test';
      const waiverEntityType = 'value';
      const url = `/api/v1/bulk-penalty-waiver/quote?segmentCriteria=${segmentCriteria}&${segmentCriteriaValues}&waiverEntityType=${waiverEntityType}`;
      service
        .getBulkPenaltyWaiverQuote(segmentCriteria, segmentCriteriaValues, waiverEntityType)
        .subscribe(response => {
          expect(response).not.toBe(null);
        });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(bulkPenaltyCountMockData);
    });
  });

  describe('getBulkPenaltyWaiverQuoteForAll', () => {
    it('to get Bulk penality details for all entity', () => {
      const segmentCriteria = 'new';
      const waiverEntityType = 'value';
      const url = `/api/v1/bulk-penalty-waiver/quote?segmentCriteria=${segmentCriteria}&waiverEntityType=${waiverEntityType}`;
      service.getBulkPenaltyWaiverQuoteForAll(segmentCriteria, waiverEntityType).subscribe(response => {
        expect(response).not.toBe(null);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(bulkPenaltyCountMockData);
    });
  });
  describe('vicExceptionalPenaltyWaiverRevert', () => {
    it('vicExceptionalPenaltyWaiverRevert', () => {
      const url = `/api/v1/contributor/200085744/penalty-waiver/123456/revert`;
      service.vicExceptionalPenaltyWaiverRevert(200085744, 123456).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });
  describe('update Vic Exceptional Penalty Det', () => {
    it('should update tupdateVicExceptionalPenaltyDet', () => {
      const updatevic = `/api/v1/contributor/1234586/penalty-waiver/45896`;
      service.updateVicExceptionalPenaltyDet(1234586, 45896, new PenaltyWaiverRequest()).subscribe(response => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(updatevic);
      expect(req.request.method).toBe('PUT');
      req.flush(PenalityWavierDetailsMockData);
    });
  });
  describe('updateEstablishmentExceptional', () => {
    it('updateEstablishmentExceptional', () => {
      const url = `/api/v1/establishment/200085744/penalty-waiver/${123456}`;
      service.updateEstablishmentExceptional(200085744, 123456, new PenaltyWaiverRequest()).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush('PenalityWavierDetailsMockData');
    });
  });
  describe('updateEstVicSegmentDetails', () => {
    it('updateEstVicSegmentDetails', () => {
      const url = `/api/v1/bulk-penalty-waiver/${123456}`;
      service.updateEstVicSegmentDetails(123456, new PenaltyWaiverSegmentRequest()).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush('PenalityWavierDetailsMockData');
    });
  });
  describe('estVicBulkExceptionalRevert', () => {
    it('estVicBulkExceptionalRevert', () => {
      const url = `/api/v1/bulk-penalty-waiver/${123456}/revert`;
      service.estVicBulkExceptionalRevert(123456).subscribe(response => {
        expect(response).toBeDefined();
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush('');
    });
  });
  describe('setPenalityWaiverReason', () => {
    it('Should setPenalityWaiverReason', () => {
      let test = { english: 'reason', arabic: 'reason' };
      service.setPenalityWaiverReason(test);
      expect(service.penalityWaiverReason).not.toBe(null);
    });
  });
  describe('getPenalityWaiverReason', () => {
    it('Should getPenalityWaiverReason', () => {
      service.getPenalityWaiverReason();
      expect(service.penalityWaiverReason).not.toBe(null);
    });
  });
  describe('getPenalityWaiverBulkFileContent', () => {
    it('Should getPenalityWaiverBulkFileContent', () => {
      service.getPenalityWaiverBulkFileContent();
      expect(service.fileContent).not.toBe(null);
    });
  });
  describe('getPenalityWaiverDetails', () => {
    it('Should getPenalityWaiverDetails', () => {
      service.getPenalityWaiverDetails();
      expect(service.penalityWaiverDetails).not.toBe(null);
    });
  });
});
