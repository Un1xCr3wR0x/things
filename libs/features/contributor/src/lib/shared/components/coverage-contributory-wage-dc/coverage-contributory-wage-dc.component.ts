import { Component, Inject, Input, OnInit } from '@angular/core';
import { EngagementPeriod } from '../../models';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cnt-coverage-contributory-wage-dc',
  templateUrl: './coverage-contributory-wage-dc.component.html',
  styleUrls: ['./coverage-contributory-wage-dc.component.scss']
})
export class CoverageContributoryWageDcComponent  {

 /** Input variables  */
 @Input() engagementPeriod: EngagementPeriod;
 @Input() displayIcon = false;
 @Input() isTotalShare = false;
 @Input() isIndividualProfile = false;
 @Input() isVic?: boolean;

 /**Local Variables */
 lang: string;

 /**This method is used to create a instance of CoverageContributoryWageSectionDcComponent */
 constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
   this.language.subscribe((lan: string) => {
     this.lang = lan;
   });
 }
}

