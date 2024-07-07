import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  CoreAdjustmentService,
  CoreBenefitService,
  CoreContributorService
} from '@gosi-ui/core';
import { statusBadgeType } from '@gosi-ui/core/lib/utils/common';
import {
  AssessmentDetails,
  DisabilityAssessmentService,
  DisabilityDetails,
  MBConstants,
  MbRouteConstants,
  MedicalBoardAssessmentRequest
} from '../../../shared';
import { BsModalRef } from 'ngx-bootstrap/modal';
// import { medicalBoardAssessmentRequest } from '../../../shared';
// import { ContributorService } from '@gosi-ui/features/contributor/lib/shared/services';
// import { AssessmentDetails } from '@gosi-ui/features/benefits/lib/shared';

@Component({
  selector: 'mb-medical-board-assessments-sc',
  templateUrl: './medical-board-assessments-sc.component.html',
  styleUrls: ['./medical-board-assessments-sc.component.scss']
})
export class MedicalBoardAssessmentsScComponent implements OnInit {
  modalRef: BsModalRef;
  // filteredMember: MbList[] = [];
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  currentPage = 0; // Pagination
  itemsPerPage = 10; // Pagination
  paginationId = 'member-board-list';
  totalItems = 0;
  previousDisabilityDetails: DisabilityDetails;
  socialInsuranceNo: number;
  assessmentsRequest: MedicalBoardAssessmentRequest = <MedicalBoardAssessmentRequest>{};
  personId;
  injuryId: number;
  disabilityAssessmentId: number;
  regNo: number;
  personIdentifier: number;
  isContributor = false;
  idNumber:string;
  identifier:number;
  constructor(
    readonly disabilityAssessmentService: DisabilityAssessmentService,
    readonly activatedRoute: ActivatedRoute,
    readonly coreContributorService: CoreContributorService,
    readonly coreAdjustmentService: CoreAdjustmentService,
    readonly coreBenefitService: CoreBenefitService,
    // readonly contributorService: ContributorService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly router: Router,
    readonly authTokenService: AuthTokenService
  ) {}

  ngOnInit(): void {
    this.personId = this.coreAdjustmentService.identifier;
    this.idNumber= this.coreAdjustmentService.idNumber;
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
    if (params.get('personId')) {
      if (params) this.identifier = Number(params.get('personId'))
    }
    });
    this.socialInsuranceNo = this.coreAdjustmentService.socialNumber;
    this.injuryId = this.coreBenefitService.injuryId;
    this.regNo = this.coreBenefitService.regNo;
    this.disabilityAssessmentId = this.disabilityAssessmentService.disabilityAssessmentId;
    if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
      this.isContributor = true;
    }
    // this.socialInsuranceNo = this.coreContributorService.selectedSIN;
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      if (params.get('identifier')) {
        if (params) this.socialInsuranceNo = Number(params.get('identifier'));
      }
    });
    if (this.coreContributorService.NINDetails?.length > 0) {
      this.personIdentifier = this.coreContributorService.NINDetails[0].newNin;
    } else if (this.coreContributorService.IqamaDetails?.length > 0) {
      this.personIdentifier = this.coreContributorService.IqamaDetails[0].iqamaNo;
    }
    this.activatedRoute.paramMap.subscribe(res => {
      if (!this.personIdentifier) {
        if (this.appToken === ApplicationTypeEnum.INDIVIDUAL_APP) {
          this.personIdentifier = this.authTokenService.getIndividual();
        }
      }
    });
    this.initializeView();

    // this.socialInsuranceNo = this.coreContributorService.selectedSIN;
  }

  getPreviousDisability() {
    this.disabilityAssessmentService
      .getPreviousDisability(this.identifier ? this.identifier : this.personIdentifier ? this.personIdentifier : this.idNumber, undefined, undefined, this.assessmentsRequest)
      .subscribe(res => {
        this.previousDisabilityDetails = res;
        this.totalItems = res.count;
        if (this.previousDisabilityDetails) {
          this.previousDisabilityDetails?.data?.forEach(value => {
            if (value?.assessmentTime) {
              const dateArray = value?.assessmentTime?.split('::');

              if (dateArray) dateArray[1] = dateArray[1] !== undefined ? dateArray[1] : '00';

              if (dateArray && dateArray[0] && Number(dateArray[0]) >= 12) {
                if (Number(dateArray[0]) > 12) {
                  value.assessmentTime = Number(dateArray[0]) - 12 + ':' + dateArray[1] + ' ';
                }
                if (Number(dateArray[0]) === 12) {
                  value.assessmentTime = Number(dateArray[0]) + ':' + dateArray[1] + ' ';
                }
                value.startTimeAmOrPm = MBConstants.PM;
              } else {
                value.startTimeAmOrPm = MBConstants.AM;
                if (dateArray && dateArray[0] === '00') {
                  value.assessmentTime = '12:' + dateArray[1] + ' ';
                } else {
                  value.assessmentTime = dateArray[0] + ':' + dateArray[1] + ' ';
                }
              }
            }
          });
        }
      });
  }
  paginateMemberList(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.currentPage = this.pageDetails.currentPage = page;
      this.assessmentsRequest.pageNo = this.currentPage;
      this.getPreviousDisability();
    }
  }
  statusBadgeType() {
    return statusBadgeType(status);
  }
  initializeView() {
    this.assessmentsRequest.pageNo = 0;
    this.assessmentsRequest.pageSize = this.itemsPerPage;
    this.assessmentsRequest.sortOrder = 'DESC';
    this.getPreviousDisability();
  }

  searchAssessments(searchValue: string) {
    if (searchValue?.length > 0) this.assessmentsRequest.searchKey = searchValue;
    else this.assessmentsRequest.searchKey = undefined;
    this.getPreviousDisability();
  }
  onSort(value) {
    this.assessmentsRequest.pageNo = 0;
    this.assessmentsRequest.pageSize = this.itemsPerPage;
    this.assessmentsRequest.sortOrder = value;
    this.getPreviousDisability();
  }
  onFilter(assessmentfilter) {
    this.assessmentsRequest.assessmentType = assessmentfilter.assessmentType;
    this.assessmentsRequest.medicalBoardType = assessmentfilter.medicalBoardType;
    this.assessmentsRequest.sessionPeriodFrom = assessmentfilter.sessionPeriodFrom;
    this.assessmentsRequest.sessionPeriodTo = assessmentfilter.sessionPeriodTo;
    this.assessmentsRequest.status = assessmentfilter.status;
    this.getPreviousDisability();
  }
  navigateToAssessments(item: AssessmentDetails) {
    this.coreAdjustmentService.identifier = this.personId;
    this.coreAdjustmentService.socialNumber = this.socialInsuranceNo || item?.sin;
    this.coreBenefitService.injuryId = this.injuryId || item.injuryId;
    // this.coreBenefitService.regNo = this.registrationNo;
    this.disabilityAssessmentService.disabilityAssessmentId = item.assessmentId;
    this.disabilityAssessmentService.disabilityType = item.assessmentType;
    this.disabilityAssessmentService.nationalID = this.personId;
    this.coreBenefitService.assessmentRequestId = item?.mbAssessmentReqId;
    this.coreBenefitService.setPersonIdReqId({ benefitId: item?.benefitReqId, personId: item?.personId });
    this.router.navigate([MbRouteConstants.ROUTE_ASSESSMENT_VIEW], {
      // queryParams: {
      //   sessionId: ,
      //   disabiltyType: item.assessmentType?.english?.replace(/\s/g, '')
      // }
    });
  }
}
