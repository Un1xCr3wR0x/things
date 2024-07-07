/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, SimpleChanges, OnChanges, HostListener } from '@angular/core';
import { CalculationWrapper } from '../../models';

@Component({
  selector: 'oh-companion-conveyance-dc',
  templateUrl: './companion-conveyance-dc.component.html',
  styleUrls: ['./companion-conveyance-dc.component.scss']
})
export class CompanionConveyanceDcComponent implements OnInit, OnChanges {
  constructor() {}
  /**
   * Input variables
   */
  @Input() calculationWrapper: CalculationWrapper;
  @Input() validatorView = false;
  @Input() isGreater = false;
  @Input() distance: string;
  /**
   * Local Variables
   */
  toAndFro: string;
  minimumValue: string;
  maximumValue: string;
  scrHeight: number;
  scrWidth: number;
  isSmallScreen = false;

  ngOnInit(): void {}
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    this.isSmallScreen = this.scrWidth <= 768 ? true : false;
  }
  /**
   * This method is for detecting changes in input
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.calculationWrapper) {
      this.calculationWrapper = changes.calculationWrapper.currentValue;
      this.getValues();
    }
    if (changes && changes.isGreater) {
      this.isGreater = changes.isGreater.currentValue;
    }
    if (changes && changes.distance) {
      this.distance = changes.distance.currentValue;
    }
  }

  /**
   * Getting values
   */
  getValues() {
    if (this.calculationWrapper && this.calculationWrapper.allowanceBreakup) {
      this.calculationWrapper.allowanceBreakup.breakUpDetails.forEach(element => {
        element.type = element.type.trim();
        if (element.type === 'Companion Conveyance To and Fro') {
          this.toAndFro = element.value;
        }
        if (element.type === 'Companion Conveyance Minimum value') {
          this.minimumValue = element.value;
        }
        if (element.type === 'Companion Conveyance Maximum distance for Minimum Companion Allowance') {
          this.maximumValue = element.value;
        }
      });
    }
  }
}
