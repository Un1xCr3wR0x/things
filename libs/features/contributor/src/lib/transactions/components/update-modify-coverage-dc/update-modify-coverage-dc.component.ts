import { Component, Input, OnInit } from '@angular/core';
import { BilingualText } from '@gosi-ui/core';
import { UpdatedWageDetails } from '../../../shared/models';

@Component({
  selector: 'cnt-update-modify-coverage-dc',
  templateUrl: './update-modify-coverage-dc.component.html',
  styleUrls: ['./update-modify-coverage-dc.component.scss']
})
export class UpdateModifyCoverageDcComponent implements OnInit {
  @Input() updatedModifyCoverageDetails: UpdatedWageDetails;

  constructor() {}

  ngOnInit(): void {}

  /**
   * Check if the coverageType has annuity
   * @param wagePeriods
   */
  isAnnuityCoverage(coverageType: BilingualText[]) {
    if (coverageType) {
      for (const coverage of coverageType) {
        if (coverage.english === 'Annuity') {
          return true;
        }
      }
    }
    return false;
  }
  /**
   * Check if the coverageType has OH
   * @param wagePeriods
   */
  isOHCoverage(coverageType: BilingualText[]) {
    if (coverageType) {
      for (const coverage of coverageType) {
        if (coverage.english === 'Occupational Hazard') {
          return true;
        }
      }
    }
    return false;
  }
  /**
   * Check if the coverageType has UI
   * @param wagePeriods
   */
  isUICoverage(coverageType: BilingualText[]) {
    if (coverageType) {
      for (const coverage of coverageType) {
        if (coverage.english === 'Unemployment Insurance') {
          return true;
        }
      }
    }
    return false;
  }
}
