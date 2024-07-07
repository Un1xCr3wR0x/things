import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ContributionCategory } from '../../../../shared/enums';
import { EstablishmentShare } from '../../../../shared/models';
import { ContributionProductBreakups } from '../../../../shared/models/contribution-product-breakup';

@Component({
  selector: 'blg-contributor-breakup-table-view-dc',
  templateUrl: './contributor-breakup-table-view-dc.component.html',
  styleUrls: ['./contributor-breakup-table-view-dc.component.scss']
})
export class ContributorBreakupTableViewDcComponent {

  // Input variables
  @Input() contributionProductBreakups: ContributionProductBreakups[];
  @Input() exchangeRate = 1;
  @Input() isPPA : boolean;
  // local variables
  typeAnnuity = ContributionCategory.annuity;
  typeUnemployment = ContributionCategory.ui;
  typeOh = ContributionCategory.oh;
  typePension = ContributionCategory.pension;
  typePPA = ContributionCategory.ppa;
  rows = [];
  values = {}
  nonSaudi = false;

  constructor() { }
  /**
   * Method to detect changes in inputs.
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if(changes.contributionProductBreakups && changes.contributionProductBreakups.currentValue ){
      this.convertproductDataToObject()
    }
    this.contributionProductBreakups.forEach(item => {
    if(item.type.english === 'Non Saudi'){
      this.nonSaudi = true;
    }
  })
}
  
  // Method used to convert api res & bind data to table
  convertproductDataToObject() {
    this.rows=[];
    this.contributionProductBreakups.forEach(item => {
      this.values['nationality']=item.type.english == "Saudi Arabia"? 'BILLING.SAUDI-CONTRIBUTOR-BREAKUP': 'BILLING.NON-SAUDI-CONTRIBUTOR-BREAKUP';
      this.values['total']=item.totalNoOfContributors;
      this.values['annuityCount'] = "-";
      this.values['annuityWage'] = "-";
      this.values['UICount'] = "-";
      this.values['UIWage'] = "-";
      this.values['OHCount'] = "-";
      this.values['OHWage'] = "-";
      this.values['PPACount'] = '-';
      this.values['PPAWage'] = '-';
      this.values['PensionCount'] ='-';
      this.values['PensionWage'] ='-';
       item.contributionDetails.forEach(product => {
        switch (product.productType.english) {
          case this.typeAnnuity:
            this.values['annuityCount'] = product.noOfContributor !== 0 ? product.noOfContributor : '-';
            this.values['annuityWage'] = product.totalContributorsWage !== 0 ? product.totalContributorsWage : '-';
           
            break;
          case this.typeUnemployment:
            this.values['UICount'] = product.noOfContributor !== 0 ? product.noOfContributor : '-';
            this.values['UIWage'] = product.totalContributorsWage !== 0 ? product.totalContributorsWage : '-';
            break;
          case this.typeOh:
            this.values['OHCount'] = product.noOfContributor !== 0 ? product.noOfContributor : '-';
            this.values['OHWage'] = product.totalContributorsWage !== 0 ? product.totalContributorsWage : '-';
            break;
          case this.typePension: 
          this.values['PensionCount'] = product.noOfContributor !== 0 ? product.noOfContributor : '-';
          this.values['PensionWage'] = product.totalContributorsWage !== 0 ? product.totalContributorsWage : '-';
            break;
          case this.typePPA:
            this.values['PPACount'] = product.noOfContributor !== 0 ? product.noOfContributor : '-';
          this.values['PPAWage'] = product.totalContributorsWage !== 0 ? product.totalContributorsWage : '-';
        } 
        
      }
      )
      this.rows.push(this.values);
      this.values={};
    })
  }
}

