import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Environment, EnvironmentToken, LanguageToken } from '@gosi-ui/core';
import { ContributorService } from '@gosi-ui/features/contributor';
import { BehaviorSubject } from 'rxjs';
import { IPensionReformEligibility, IPensionReformEngagement, PensionReformEligibility } from '../../../shared';

@Component({
  selector: 'cim-pension-reform',
  templateUrl: './pension-reform.component.html',
  styleUrls: ['./pension-reform.component.scss']
})
export class PensionReformComponent implements OnInit {
  isLoadingData: boolean = true;
  isEligible: boolean = true;
  showEligibilityToast: boolean = true;
  personId: number;
  lang: string = 'ar';
  engagements: IPensionReformEngagement[] = [];
  pensionReformEligibility: IPensionReformEligibility;
  constructor(
    readonly contributorService: ContributorService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly activatedRoute: ActivatedRoute,
    @Inject(EnvironmentToken) private environment: Environment
  ) {
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      this.personId = +params.get('personId');
    });
  }
  ngOnInit(): void {
    this.showEligibilityToast = this.environment.unifyEngTimeLine.showEligibilityChecking;
    if (this.personId) {
      this.checkEligibility();
      this.getEngagementSummary();
    }
    this.language.subscribe(lang => (this.lang = lang));
  }

  getEngagementSummary(): void {
    this.contributorService.getEngagementSummary(this.personId).subscribe(res => {
      this.engagements = res.engagements as IPensionReformEngagement[];
    });
  }

  checkEligibility(): void {
    this.contributorService.checkEligibility(this.personId).subscribe(res => {
      this.pensionReformEligibility = res;
      if (res.pensionReformEligible === PensionReformEligibility.Not_Eligible) {
        this.isEligible = false;
      } else {
        this.isEligible = true;
      }
      this.isLoadingData = false;
    });
  }
}
