import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  LookupService,
  Person,
  FamilyDetails,
  AuthTokenService,
  RoleIdEnum,
  getPersonIdentifier,
  CoreContributorService,
  gccCountryList,
  BilingualText
} from '@gosi-ui/core';
import { ContributorService } from '@gosi-ui/features/contributor/lib/shared/services';
import { SearchRequest } from '@gosi-ui/foundation-dashboard/src';
import { DashboardSearchService } from '@gosi-ui/foundation-dashboard/src/lib/search/services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ChangePersonScBaseComponent, ChangePersonService } from '../../../shared';
import { IndividualDashboardService } from '@gosi-ui/foundation-dashboard/lib/individual-app/services/individual-dashboard.service';
import { EngagementDetails } from '@gosi-ui/foundation-dashboard/lib/individual-app/models/engagement-details';
import { DashboardBaseService } from '@gosi-ui/foundation-dashboard/lib/shared';

@Component({
  selector: 'cim-personal-details',
  templateUrl: './personal-details-sc.component.html',
  styleUrls: ['./personal-details-sc.component.scss']
})
export class PersonalDetailsScComponent extends ChangePersonScBaseComponent implements OnInit {
  @ViewChild('warningTemplate', { static: false }) warningTemplate: TemplateRef<HTMLElement>;
  @ViewChild('restrictTemplate', { static: false }) restrictTemplate: TemplateRef<HTMLElement>;
  identifier: number;
  personDtlsArr: Person[];
  personDtls: Person;
  personId: number;
  familyDetails: FamilyDetails;
  searchRequest: SearchRequest = new SearchRequest();
  accessRoles: string[] = [];
  modifyAccess: boolean;
  modalRef: BsModalRef;
  isShow: boolean;
  personContributorDetails: Person;
  dateofDeath: any;
  id: number;
  engagementDetails: EngagementDetails[];
  overallEngagements: EngagementDetails[];
  activeEngagementPpa = false;
  AnyEngagementNotPpa = false;
  hideButtonForPpa = false;
  ppaEstablishment: boolean;
  registrationNo: number;
  personIds: number;
  nationality: BilingualText;
  isGcc: boolean = false;
  constructor(
    readonly changePersonService: ChangePersonService,
    readonly lookService: LookupService,
    readonly dashboardSearchService: DashboardSearchService,
    readonly contributorService: ContributorService,
    readonly authTokenService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly documentService: DocumentService,
    readonly activatedRoute: ActivatedRoute,
    public modalService: BsModalService,
    readonly router: Router,
    readonly individualAppDashboardService: IndividualDashboardService,
    readonly coreContributorService: CoreContributorService,
    readonly dashboardBaseService: DashboardBaseService,
  ) {
    super(
      changePersonService,
      dashboardSearchService,
      contributorService,
      lookService,
      appToken,
      alertService,
      documentService,
      modalService,
      activatedRoute
    );
  }

  ngOnInit(): void {
    this.getAccessRoles();
    this.ppaEstablishment = this.dashboardSearchService.ppaEstablishment;
    // this.changePersonService.setMenuIndex(6);
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      if (params.get('personId')) {
        if (params) this.personId = Number(params.get('personId'));
        this.changePersonService.getSinValue(this.personId).subscribe(val => {
          this.id = val?.listOfPersons[0]?.personId;
          this.getNationalityElligibility(this.id);
          this.sin = val?.listOfPersons[0]?.socialInsuranceNumber[0];
          if (this.sin) this.fetchEngagementDetails(this.sin);
          this.nationality =val?.listOfPersons[0]?.nationality;
              gccCountryList.forEach(country => {
                if (this.nationality.english === country) {
                  this.isGcc = true;
            }
          });
        });
        this.dashboardSearchService.searchIndividual(this.changePersonService.getSearchRequest(), true).subscribe(
          response => {
            this.setDetails(response);
          },
          err => {
            this.dashboardSearchService
              .searchIndividual(this.changePersonService.getSearchRequest(), false)
              .subscribe(response => {
                this.setDetails(response);
              });
          }
        );
      }
    });
  }

  fetchEngagementDetails(sin: number) {
    this.individualAppDashboardService.getEngagementFullDetails(sin).subscribe(res => {
      this.engagementDetails = res.activeEngagements;
      this.overallEngagements = res.overallEngagements;
      if (this.ppaEstablishment) {
        this.hideButtonForPpa = true;
      } else {
        if (this.engagementDetails.length > 0) {
          this.engagementDetails.forEach(item => {
            this.activeEngagementPpa = item?.ppaIndicator;
          });
        }
        if (this.overallEngagements.length > 0) {
          if (this.overallEngagements.findIndex(item => item.ppaIndicator === false) >= 0) {
            this.AnyEngagementNotPpa = true;
          }
        }
        //PPA
        if (this.activeEngagementPpa && !this.AnyEngagementNotPpa) {
          this.hideButtonForPpa = true;
        } else if (this.engagementDetails.length == 0 && this.overallEngagements.length == 0) {
          this.hideButtonForPpa = false;
        } else if (this.engagementDetails.length == 0) {
          this.hideButtonForPpa = !this.AnyEngagementNotPpa ? true : false;
        } else if (this.overallEngagements.length == 0 && this.activeEngagementPpa) {
          this.hideButtonForPpa = true;
        }
      }
    });
  }
  getNationalityElligibility(id) {
    this.contributorService.getPersonEligibility(id).subscribe(res => {
      if (res.eligible == true) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    });
  }
  setDetails(response) {
    this.personDtlsArr = response.listOfPersons.filter(x => x.personId == this.changePersonService.getPersonId());
    this.personDtls = this.personDtlsArr[0];

    const poBoxIndex = this.personDtls?.contactDetail?.addresses.findIndex(
      x => x.type == 'POBOX' && x.postalCode == null
    );
    if (poBoxIndex != -1) this.personDtls.contactDetail?.addresses.splice(poBoxIndex, 1);
    const overseasIndex = this.personDtls?.contactDetail?.addresses.findIndex(
      x => x.type == 'OVERSEAS' && x.city == null
    );
    if (overseasIndex != -1) this.personDtls.contactDetail?.addresses.splice(overseasIndex, 1);

    this.changePersonService.setPersonInformation(this.personDtls);
    this.sin = this.changePersonService.getSIN();
    if (this.contributorService.NINDetails?.length > 0) {
      this.searchRequest.searchKey = this.contributorService.NINDetails[0].newNin;
      this.identifier = this.contributorService.NINDetails[0].newNin;
    } else if (this.contributorService.IqamaDetails?.length > 0) {
      this.searchRequest.searchKey = this.contributorService.IqamaDetails[0].iqamaNo;
      this.identifier = this.contributorService.IqamaDetails[0].iqamaNo;
    } else {
      this.searchRequest.searchKey = this.sin.toString();
      this.identifier = this.sin;
    }

    this.changePersonService.getFamilyAddressDetails(this.identifier).subscribe(response => {
      this.familyDetails = response.acquaintances[0];

      const familyPOBoxIndex = this.familyDetails?.contactDetail?.addresses.findIndex(
        x => x.type == 'POBOX' && x.postalCode == null
      );
      if (familyPOBoxIndex != -1) this.familyDetails?.contactDetail?.addresses.splice(familyPOBoxIndex, 1);
      const familyOverseasIndex = this.familyDetails?.contactDetail?.addresses.findIndex(
        x => x.type == 'OVERSEAS' && x.city == null
      );
      if (familyOverseasIndex != -1) this.familyDetails?.contactDetail?.addresses.splice(familyOverseasIndex, 1);
      this.changePersonService.setFamilyInfo(this.familyDetails);
    });
  }

  getAccessRoles() {
    const gosiscp = this.authTokenService.getEntitlements();
    this.accessRoles = gosiscp ? gosiscp?.[0].role?.map(r => r.toString()) : [];
    if (this.accessRoles.includes(RoleIdEnum.CSR.toString())) {
      this.modifyAccess = true;
    }
  }

  navigateToModifyDtls(index: string) {
    const navigationExtras: NavigationExtras = { state: { page: index } };
    this.router.navigate([`/home/profile/${this.personId}/edit-personal-details`], navigationExtras);
  }
  navigateToAddBankAcc() {}
  navigateToModifyNationality() {
    const iqma: any = this.personDtls?.identity.find(id => id.idType === 'IQAMA');
    const borderNo: any = this.personDtls?.identity.find(id => id.idType === 'BORDERNO');
    const nin: any = this.personDtls?.identity.find(id => id.idType === 'NIN');
    this.personIds = iqma?.iqamaNo ? iqma?.iqamaNo : nin?.newNin ? nin?.newNin : this.sin
    if(this.isShow === false){
    this.showRestrictModal();
    }
    else if (iqma?.iqamaNo || borderNo?.id || this.isGcc) {
      this.router.navigate([`home/profile/modify-nationality/${this.personIds}`]);
    } 
    else {
      this.showModal();
    }
  }

  showModal() {
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-md modal-dialog-centered` };
    this.modalRef = this.modalService.show(this.warningTemplate, config);
  }
  showRestrictModal(){
    const config = { backdrop: true, ignoreBackdropClick: true, class: `modal-md modal-dialog-centered` };
    this.modalRef = this.modalService.show(this.restrictTemplate, config); 
  }
  hideModal() {
    this.modalService.hide();
  }
}
