import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, IdentityTypeEnum, ApplicationTypeToken, LookupService, ApplicationTypeEnum, AuthTokenService } from '@gosi-ui/core';
import { ContractData, MbProfile, Contracts } from '../../../shared/models';
import { MemberService, DoctorService } from '../../../shared/services';
import { MbBaseScComponent } from '../../../shared/components';
import { PersonWrapper } from '../../../shared/models/person-wrapper';
import { ContractDoctorDetails } from '../../../shared/models/contract-doctor-details';

@Component({
  selector: 'mb-view-doctor-profile-sc',
  templateUrl: './view-doctor-profile-sc.component.html',
  styleUrls: ['./view-doctor-profile-sc.component.scss']
})
export class ViewDoctorProfileScComponent extends MbBaseScComponent implements OnInit {
  //Local Variables
  typeNin = IdentityTypeEnum.NIN;
  typeIqama = IdentityTypeEnum.IQAMA;
  typeBorder = IdentityTypeEnum.BORDER;
  typePassport = IdentityTypeEnum.PASSPORT;
  typeGcc = IdentityTypeEnum.NATIONALID;
  person: MbProfile = new MbProfile();
  personArabicName: string;
  identificationNo: number;
  selectedPersonContract: Contracts[];  
  contractedDoc: PersonWrapper;
  contractDoctorDetails: ContractDoctorDetails = new ContractDoctorDetails();

  constructor(
    readonly alertService: AlertService,
    readonly lookUpService: LookupService,
    readonly memberService: MemberService,
    readonly doctorService: DoctorService,
    readonly router: Router,
    readonly authTokenService: AuthTokenService,
    private route: ActivatedRoute,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(alertService, lookUpService, memberService, appToken);
  }

  ngOnInit() {
    this.isMBApp = this.appToken === ApplicationTypeEnum.MEDICAL_BOARD ? true : false;
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE ? true : false;
    this.route.params.subscribe(res => {
      this.identificationNo = res.identificationNo || this.authTokenService.getEstablishment();
    });
    if(this.appToken === ApplicationTypeEnum.MEDICAL_BOARD){
      this.getContractPersonDetails(this.identificationNo);
      this.getPersonContractInAPP(this.identificationNo)
      this.doctorService.getContractProfileDetail(this.identificationNo).subscribe (res => {
        this.contractDoctorDetails= res;
      });
    } else {
       this.getPersonDetails(this.identificationNo);
       this.getPersonContract(this.identificationNo);
    }
  }
  getPersonContractInAPP(identificationNo) {
    this.doctorService.getContractDataDetail(identificationNo).subscribe(
      res=>{
        this.memberperson = res;
      },
      err => this.showError(err)
    );
  }
  getPersonContract(identificationNo) {
    this.doctorService.getContractDetail(identificationNo).subscribe(
      res=>{
        this.memberperson = res;
      },
      err => this.showError(err)
    );
  }

  getPersonDetails(identificationNo) {
    this.doctorService.getPersonDetails(identificationNo).subscribe(
      res => {
        this.person = res;
        if (this.person.contracts.length) {
          const selectedContractType = this.doctorService.getContractType();
          this.selectedPersonContract = this.person.contracts.filter(eachContract => {
            return eachContract.contractType.english === selectedContractType.english;
          });
        }
      },
      err => this.showError(err)
    );
  }
  getContractPersonDetails(personId: number) {
    this.doctorService.getPerson(personId).subscribe(
      res => {
        this.contractedDoc = res;
        if(this.contractedDoc){
          this.person = new MbProfile();
          this.memberperson = new ContractData();
          this.person.identity = this.contractedDoc.listOfPersons[0].identity;
          this.person.name = this.contractedDoc.listOfPersons[0].name;
          this.person.nationality = this.contractedDoc.listOfPersons[0].nationality;
          this.person.birthDate = this.contractedDoc.listOfPersons[0].birthDate;
          this.person.sex = this.contractedDoc.listOfPersons[0].sex;
        }
      }
    )
  }
}
