import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getArabicName, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { EstablishmentDetails, PenalityWavier } from '../../../../shared/models';

@Component({
  selector: 'blg-waive-est-penalty-details-dc',
  templateUrl: './waive-est-penalty-details-dc.component.html',
  styleUrls: ['./waive-est-penalty-details-dc.component.scss']
})
export class WaiveEstPenaltyDetailsDcComponent implements OnInit, OnChanges {
  //input variables
  lang = 'en';
  @Input() establishmentDetails: EstablishmentDetails;
  contributorNumber: number;
  @Input() waiverDetails: PenalityWavier;

  @Input() vicExceptionalFlag: boolean;
  englishName: string;
  arabicName: string;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  ngOnInit() {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.waiverDetails && changes.waiverDetails.currentValue) {
      if (this.waiverDetails?.contributorName?.arabic !== undefined) {
        this.contributorNumber = this.waiverDetails.contributorNumber;
        this.englishName = this.waiverDetails.contributorName.english.name;
        this.arabicName = getArabicName(changes.waiverDetails?.currentValue?.contributorName?.arabic);
      }
    }
  }
}
