import { Component, Inject, Input, OnInit } from '@angular/core';
import { EngagementPeriod, VicEngagementPeriod } from '../../../shared';
import { LanguageToken } from '@gosi-ui/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'cnt-reactivate-coverage-wage-dc',
  templateUrl: './reactivate-coverage-wage-dc.component.html',
  styleUrls: ['./reactivate-coverage-wage-dc.component.scss']
})
export class ReactivateCoverageWageDcComponent {
/** Input variables  */
@Input() engagementPeriod: VicEngagementPeriod;
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
