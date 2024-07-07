import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChangePersonService } from '../../../shared';
import { AlertService, ContributorToken, ContributorTokenDto, IdentityTypeEnum, LanguageToken, LookupService, LovList, Passport, Person, RegistrationNoToken, RegistrationNumber, RouterConstants, StorageService } from '@gosi-ui/core';
import { RequestLimit, RequestSort, SearchRequest } from '@gosi-ui/foundation-dashboard';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/lib/search/services';
import { IndividualSortConstants } from '@gosi-ui/foundation-dashboard/lib/search/constants';
import { invoiceData } from 'testing';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertDetailsArray } from '../../../shared/models/add-modify-person-details';
import { ContributorService } from '@gosi-ui/features/contributor';

@Component({
  selector: 'cim-add-passport-deails-dc',
  templateUrl: './add-passport-deails-dc.component.html',
  styleUrls: ['./add-passport-deails-dc.component.scss']
})
export class AddPassportDeailsDcComponent implements OnInit {
  @Input() passportDetails: Passport;
  @Input() person: Person = new Person();
  typePassport = IdentityTypeEnum.PASSPORT;
  searchRequest: SearchRequest = new SearchRequest();
  searchKey = null;
  showAlert: boolean = false;
  personDetails: Person[] = [];
  detailsArray: AlertDetailsArray[] = []
  typeNin = IdentityTypeEnum.NIN;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeBorder = IdentityTypeEnum.BORDER;
  typeGcc = IdentityTypeEnum.NATIONALID;
  valueList: any[] = []
  alertArray: any[] = [];
  lang;
  message: string;
  idName: string;
  nationalityList$: Observable<LovList> = new Observable<LovList>(null);
  nationalityLovList: LovList = new LovList([]);
  id: any;
  personIdentifier: number;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>
    , readonly lookupService: LookupService, readonly dashboardSearchService: DashboardSearchService, readonly router: Router, readonly changePersonService: ChangePersonService, readonly alertService: AlertService,
     readonly storageService: StorageService,
    readonly contributorService: ContributorService,
    @Inject(ContributorToken) readonly contributorToken: ContributorTokenDto,
    @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber
    ) { }

  ngOnInit(): void {


  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.passportDetails && changes.passportDetails.currentValue) {
      this.passportDetails = changes.passportDetails.currentValue
     
    }
    if (changes && changes.person && changes.person.currentValue) {
      this.person = changes.person.currentValue;
      
      let nationality;
      this.lookupService.getNationalityList().subscribe(res => {
        nationality = res?.items.find(data => data.value.english === this.person.nationality.english)
        if(nationality?.code !=undefined){
          this.searchPerson(this.passportDetails.passportNo, nationality?.code)

        }
  
      })
     
    
    }
  }
  searchPerson(passportNo, code) {
    let requestLimit=new RequestLimit();
    requestLimit.pageSize=20;
    this.searchRequest.limit=requestLimit;
    this.searchRequest.sort = new RequestSort();
    this.searchRequest.sort.column = IndividualSortConstants.SORT_FOR_CONTRIBUTOR[0].column;
    this.searchRequest.sort.direction = 'ASC';

    this.searchKey = null;
    this.searchRequest.searchParam.passportNo = passportNo
    this.searchRequest.searchParam.nationalityCode = code
    this.changePersonService.setSearchRequest(this.searchRequest);
    this.alertService.clearAllErrorAlerts();
    this.dashboardSearchService.searchIndividual(this.searchRequest, false).subscribe(res => {
      this.personDetails = res.listOfPersons;

      const priorityOrder = [{ idType: 'IQAMA',english:'IqamaNo', arabic: 'الإقامة' },
      { idType: 'NIN', english:'National Id',arabic: 'رقم الهوية الوطنية' },
      { idType: 'BORDERNO',english:'Border Number', arabic: ' رقم الحدود' },
      { idType: 'PASSPORT', english:'Passport',arabic: 'جواز سفر' }];

      for (const item of this.personDetails) {
        for (const idType of priorityOrder) {
          const value = item.identity.find(sub => sub.idType === idType.idType);
          if (value) {
            this.detailsArray.push({ idName: { english: idType.english, arabic: idType.arabic }, idType:idType.idType,value: value[this.getVariableName(value.idType)], personId: item.personId ,person:item});
            break;
          }
        }
      }

      this.showAlert = true;

      //  const idList = this.personDetails.flatMap(item => item.identity) .filter(data => data.idType === "iqama") .map(data => data.iqamaNo);
      this.language.subscribe(language => {
        this.lang = language;
        if (this.lang == 'en') {
          this.idName = 'IQAMA'
          this.message = `The entered Passport number is already existing with another Individual (  `;
        }
        else {
          this.idName = 'الإقامة'
          this.message = `رقم الجواز المدخل موجود مسبقاً لشخص فردي ( `;

        }
      });

 
    }, err => {
      this.showAlert = false;
      this.alertService.clearAllErrorAlerts();
    })
  }
  filterArray(arr, priority) {
    return arr.filter(item => item.type === priority)
  }
  getVariableName(idType: string): string {

    switch (idType) {
      case 'IQAMA':
        return 'iqamaNo';
      case 'NIN':
        return 'newNin';
      case 'PASSPORT':
        return 'passportNo';
      case 'BORDERNO':
        return 'borderNo';
      default:
        return '';
    }
  }
  navigateToContributor(data,person: Person) {
    this.contributorService.isIndividualProfile = true;
    this.storageService.setLocalValue('fromEstablishment', false);
    this.changePersonService.setPersonInformation(person);
    this.changePersonService._personInfo.next(person);
    // this.changePersonService.setMenuIndex(0);
    const NINArr = person.identity.filter(x => x.idType == 'NIN');
    const IQAMAArr = person.identity.filter(x => x.idType == 'IQAMA');
    const GCCIdArr = person.identity.filter(x => x.idType == 'GCCID');
    const BorderNoArr = person.identity.filter(x => x.idType == 'BORDERNO');
    const PassportArr = person.identity.filter(x => x.idType == 'PASSPORT');

    this.contributorService.NINDetails = NINArr;
    this.contributorService.IqamaDetails = IQAMAArr;
    this.contributorService.setSin(person.socialInsuranceNumber[0]);
    this.contributorService.GCCIdDetails = GCCIdArr;
    this.contributorService.BordeNoDetails = BorderNoArr;
    this.contributorService.PassportDetails = PassportArr;

    switch (true) {
      case NINArr.length > 0 && this.contributorService?.NINDetails[0]?.newNin > 0:
        this.storageService.setSessionValue('idType', 'NIN');
        this.personIdentifier = this.contributorService.NINDetails[0].newNin;
        break;
      case IQAMAArr.length > 0:
        this.storageService.setSessionValue('idType', 'IQAMA');
        this.personIdentifier = this.contributorService.IqamaDetails[0].iqamaNo;
        break;
      case GCCIdArr.length > 0:
        this.storageService.setSessionValue('idType', 'GCCID');
        this.personIdentifier = this.contributorService.GCCIdDetails[0].id;
        break;
      case person.socialInsuranceNumber.length > 0:
        this.storageService.setSessionValue('idType', 'SIN');
        this.personIdentifier = person.socialInsuranceNumber[0];
        break;
      case BorderNoArr.length > 0:
        this.storageService.setSessionValue('idType', 'BORDERNO');
        this.personIdentifier = this.contributorService.BordeNoDetails[0].id;
        break;
      // case PassportArr.length > 0:
      //   this.storageService.setSessionValue("idType", "passportNo");
      //   this.personIdentifier = Number(this.contributorService.PassportDetails[0].passportNo);
      //   break;
    }
    this.contributorService.setPersonIdentifier(this.personIdentifier);

    if (!this.personIdentifier) {
      

    } 
    else if (this.personIdentifier) {
      this.establishmentRegistrationNo.value = null;
      this.contributorToken.socialInsuranceNo = null;
      if(data.idType=='PASSPORT'){

      }else{
        this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL_PROFILE_INFO(this.personIdentifier)]);
      }
      // this.router.navigate([RouterConstants.ROUTE_CONTRIBUTOR_PROFILE_INFO(person.socialInsuranceNumber[0])]);
    }
  }

}
