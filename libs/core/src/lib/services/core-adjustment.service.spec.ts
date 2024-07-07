import { TestBed } from '@angular/core/testing';

import { CoreAdjustmentService } from './core-adjustment.service';

describe('CoreAdjustmentService', () => {
  let service: CoreAdjustmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreAdjustmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should set identifier', () => {
    service.identifier = 1034681524;
    expect(service['idNumber']).toEqual(1034681524);
  });
  it('should get identifier', () => {
    service['idNumber'] = 1034681524;
    expect(service.identifier).toEqual(1034681524);
  });
  it('should set benefitType', () => {
    service.benefitType = 1034681524;
    expect(service['type']).toEqual(1034681524);
  });
  it('should get benefitType', () => {
    service['type'] = 1034681524;
    expect(service.benefitType).toEqual(1034681524);
  });
  it('should set benefitDetails', () => {
    service.benefitDetails = 1034681524;
    expect(service['benefits']).toEqual(1034681524);
  });
  it('should get benefitDetails', () => {
    service['benefits'] = 1034681524;
    expect(service.benefitDetails).toEqual(1034681524);
  });
});
