import { TestBed } from '@angular/core/testing';

import { WizardService } from './wizard.service';
import { WizardItem } from '@gosi-ui/core/lib/models/wizard-item';
import { BenefitConstants } from '../constants/benefit-constants';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('WizardService', () => {
  let service: WizardService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(WizardService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should get benefit wizard items', () => {
  //   service.getBenefitWizardItem();
  //   expect(service.getBenefitWizardItem).toBeDefined();
  // });

  // it('should restrict Progress', () => {
  //   const index = 1;
  //   const wizardItems: WizardItem[] = [];
  //   wizardItems.push(new WizardItem(BenefitConstants.DEPENDENTS_DETAILS, 'users'));
  //   wizardItems.push(new WizardItem(BenefitConstants.BENEFIT_DETAILS, 'Benefits'));
  //   service.restrictProgress(index, wizardItems);
  //   expect(service.restrictProgress).toBeDefined();
  // });

  // it('should get Retirement Pension Items', () => {
  //   expect(service.getRetirementPensionItems(null).length).toEqual(1);
  // });

  // it('should get Hier Pension Items', () => {
  //   expect(service.getHeirPensionItems().length).toEqual(2);
  // });

  // it('should add Wizard Item', () => {
  //   const wizardItems: WizardItem[] = [];
  //   wizardItems.push(new WizardItem(BenefitConstants.DEPENDENTS_DETAILS, 'users'));
  //   service.addWizardItem(wizardItems, new WizardItem(BenefitConstants.BENEFIT_DETAILS, 'Benefits'));
  //   expect(service.addWizardItem).toBeDefined();
  // });

  // it('should removeWizardItem', () => {
  //   const wizardItems: WizardItem[] = [];
  //   wizardItems.push(new WizardItem(BenefitConstants.DEPENDENTS_DETAILS, 'users'));
  //   wizardItems.push(new WizardItem(BenefitConstants.BENEFIT_DETAILS, 'Benefits'));
  //   service.removeWizardItem(BenefitConstants.BENEFIT_DETAILS, wizardItems);
  //   expect(service.removeWizardItem).toBeDefined();
  // });

  // it('should getLumpsumWizardItems', () => {
  //   const wizardItems: WizardItem[] = [];
  //   wizardItems.push(new WizardItem(BenefitConstants.BENEFIT_DETAILS, 'Benefits'));
  //   wizardItems.push(new WizardItem(BenefitConstants.UI_DOCUMENTS, 'file-alt'));
  //   expect(service.getLumpsumWizardItems(true).length).toEqual(2);
  // });
});
