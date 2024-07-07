import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  BilingualText,
  ContributorStatus,
  getPersonArabicName,
  getPersonEnglishName,
  IdentityTypeEnum
} from '@gosi-ui/core';
import moment from 'moment';
import { PersonDetails, ProfileAction } from '../../../shared/models';
import { CustomerSurveyService } from '../../../shared/services/customer-survey.service';

@Component({
  selector: 'cim-profile-details-dc',
  templateUrl: './profile-details-dc.component.html',
  styleUrls: ['./profile-details-dc.component.scss']
})
export class ProfileDetailsDcComponent implements OnInit {
  @Input() contributor;
  @Input() sin: number;
  @Input() personDetails: PersonDetails;
  @Input() profileAction: ProfileAction[] = [];
  @Input() roles: Array<BilingualText> = [];

  private _personIdentifier: number;

  @Input() set personIdentifier(value: number) {
    this._personIdentifier = value;
    if(value && value !== undefined && value != null){
      this.getOverAllSatisfaction();
    }
  }
  get personIdentifier(): number {
    return this._personIdentifier;
  }; 
  arabicNameValue: string;
  englishNameValue: string;
  active = ContributorStatus.ACTIVE;
  inactive = ContributorStatus.INACTIVE;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeNin = IdentityTypeEnum.NIN;
  typePassport = IdentityTypeEnum.PASSPORT;
  typeGcc = IdentityTypeEnum.NATIONALID;
  typeBorder = IdentityTypeEnum.BORDER;
  totalAge: number;
  showOverAllSatisfaction: boolean = false;
  roundedRating: number;
  customerSatisfactionScore: number = 3;
  constructor(
    private customerSurveyService: CustomerSurveyService
  ) {}

  ngOnInit(): void {}
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.personDetails && changes.personDetails.currentValue) {
      this.personDetails = changes.personDetails.currentValue;
      this.arabicNameValue = getPersonArabicName(this.personDetails?.name?.arabic);
      this.englishNameValue = getPersonEnglishName(this.personDetails?.name?.english);
      const currentDate = new Date();
      const birthDate = new Date(this.personDetails?.dateOfBirth?.gregorian);
      this.totalAge = moment(currentDate).diff(moment(birthDate), 'years');
    }
  }

  getOverAllSatisfaction() {
    this.showOverAllSatisfaction = false;
    this.customerSurveyService.getCustomerOverallSatisfaction(this.personIdentifier).subscribe((data) => {
      if (data && data.elements && data.elements.length > 0 && data.elements[0].customersatisfaction !== undefined) {
        this.categorizeRating(data.elements[0].customersatisfaction);
        this.roundedRating = parseFloat(data.elements[0].customersatisfaction.toFixed(1));
        this.showOverAllSatisfaction = true;
      } else {
        // Handle the case when there is no data
        //console.warn('No customer satisfaction data available');
        this.showOverAllSatisfaction = false;
        this.roundedRating = null; // or some default value or action
      }
      //console.log('cim-profile-details-dc getCustomerOverallSatisfaction:',data);
    }, (error) => {
      // Handle error case
      //console.error('Error fetching customer satisfaction data:', error);
      this.showOverAllSatisfaction = false;
    });
  }
  

  categorizeRating(rating: number) {
    if (rating <= 2) {
      this.customerSatisfactionScore = 1;
    } else if (rating > 3.6) {
      this.customerSatisfactionScore = 3;
    } else {
      this.customerSatisfactionScore = 2;
    }
  }

}
