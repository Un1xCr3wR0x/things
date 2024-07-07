import { Component, Inject, OnInit } from '@angular/core';
import { BilingualText, LanguageToken, Person, RouterData, RouterDataToken, getPersonArabicName, getPersonEnglishName } from '@gosi-ui/core';
import { ChangeRequestList } from '../../../shared/models/modify-nationality-details-info';
import { BehaviorSubject } from 'rxjs-compat';
import { ChangePersonService, ManagePersonService } from '../../../shared';
import { PersonDetailsDTO, SimisDocDetails } from '../../../shared/models/person-details-dto';
import moment from 'moment';


@Component({
  selector: 'cim-add-nin-details-dc',
  templateUrl: './add-nin-details-dc.component.html',
  styleUrls: ['./add-nin-details-dc.component.scss']
})
export class AddNinDetailsDcComponent implements OnInit {
  name;
  nameEnglish;
  nationality: BilingualText;
  personNationalityDetails: ChangeRequestList;
  passportNumber: any;
  passportExpiryDetails: any;
  passportIssueDetails: any;
  nationalityInfo: any;
  passport: any;
  lang: any;
  iqmaNo: any;
  borderNo: any;
  ageHij: string;
  person: any;
  ageGreg: string;
  simisDocDetails: SimisDocDetails;
  personalDetailsCurrentDto: PersonDetailsDTO = new PersonDetailsDTO();
  personalDetailsFromNicDto: PersonDetailsDTO = new PersonDetailsDTO();
  englishName: any;
  personName: string;
  ninModifyForm: any;
  personNumber: any;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>, public manageService: ManagePersonService,
  public changePersonService: ChangePersonService,@Inject(RouterDataToken) readonly routerDataToken: RouterData,) { }

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    
      let req: any = this.routerDataToken.content;
  
      this.personNumber = req.Request.Body.resourceId;
      this.changePersonService.getPersonDetails(this.personNumber).subscribe((res: any) => {
        this.person = res;
        this.name = getPersonArabicName(this.person?.name?.arabic);
        this.nameEnglish = getPersonEnglishName(this.person?.name?.english);
        
        this.language.subscribe(language => {
        this.lang = language;
        if (this.person?.birthDate) {
          if (this.lang == 'en') {
            this.ageHij = "(Age:" + this.person.ageInHijiri + ")";
            const ageValue = moment(new Date()).diff(moment(this.person.birthDate.gregorian), 'year');
            this.ageGreg = "(Age:" + ageValue + ")";
    
          } else {
            this.ageHij = "(العمر:" + this.person.ageInHijiri + ")";
            const ageValue = moment(new Date()).diff(moment(this.person.birthDate.gregorian), 'year');
            this.ageGreg = "(العمر:" + ageValue + ")";
          }
        }
        else {
          this.ageHij = null
          this.ageGreg = null
        }
        this.manageService.getsimisDocDetails(this.person.personId).subscribe(res => {
          this.simisDocDetails = res;
           });
           this.manageService.getValidatorAddNin(this.person.personId).subscribe(res => {
             let data: any = res;
             this.personalDetailsCurrentDto = data.personalDetailsCurrentDto;
             this.personalDetailsFromNicDto = data.personalDetailsFromNicDto;
           })
      });
      });
  }
  
 
}
