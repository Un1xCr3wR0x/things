import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MaxLengthEnum, SearchTypeEnum } from '@gosi-ui/features/contributor/lib/shared/enums';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BranchDetails, ContributorBaseScComponent, ContributorFilter, ContributorService, ContributorWageDetailsResponse, ContributorWageParams, ContributorsWageService, EngagementService, Establishment, EstablishmentService, ManageWageService, TransferContributorPayload, TransferContributorService } from '@gosi-ui/features/contributor/lib/shared';
import { AlertService, BilingualText, CalendarService, DocumentService, EstablishmentStatusEnum, LookupService, Lov, LovList, RouterConstants, RouterData, RouterDataToken, WorkflowService, markFormGroupTouched } from '@gosi-ui/core';
import { Observable} from 'rxjs';
import { ContributorTransferableListResponse } from '@gosi-ui/features/contributor/lib/shared/models/contributorTransferableListResponse';
import { Router } from '@angular/router';
import { TransferableEngagements } from '@gosi-ui/features/contributor/lib/shared/models/transferableEngagements';
import { ContributorDetailsFilter } from '@gosi-ui/features/contributor/lib/shared/models/contributor-details-filter';

@Component({
  selector: 'cnt-multiple-transfer-sc',
  templateUrl: './multiple-transfer-sc.component.html',
  styleUrls: ['./multiple-transfer-sc.component.scss']
})
export class MultipleTransferScComponent extends ContributorBaseScComponent implements OnInit {
  contributorWageDetailsResponse: ContributorWageDetailsResponse = new ContributorWageDetailsResponse();
  contributorSelectedList:TransferableEngagements[] = [];
  parentForm: FormGroup = new FormGroup({});
  comments: FormGroup;
  commentMaxLength = MaxLengthEnum.COMMENTS;
  isDescending = false;
  totalNumberOfActiveContributors = 0;
  totalNumberOfActiveContributorsFixed = 0;
  canTransfer = false;
  registrationNoList = [];
  establishmentNameList = [];
  branchList: BranchDetails[] = [];
  isTransferable = true;
  mainEstRegistrationNo: number;
  contributorList:TransferableEngagements[] = [];
  paginationId = 'paginationId';
  itemsPerPage = 10;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  identifier:string;
  filterReq: ContributorDetailsFilter;
  verified:boolean;

    /** Observables */
    establishmentType$: Observable<LovList>;

  constructor( 
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly engagementService: EngagementService,
    readonly documentService: DocumentService,
    readonly workflowService: WorkflowService,
    readonly manageWageService: ManageWageService,
    @Inject(RouterDataToken) readonly routerDataToken: RouterData,
    readonly calendarService: CalendarService,
    readonly contributorWageService: ContributorsWageService,
    readonly lookupService: LookupService,
    readonly router: Router,
    readonly transferService: TransferContributorService,
    private fb: FormBuilder,
    readonly location: Location
    ) {
    super(
      alertService,
      establishmentService,
      contributorService,
      engagementService,
      documentService,
      workflowService,
      manageWageService,
      routerDataToken,
      calendarService
      );
  }

  ngOnInit(): void {
    this.alertService.clearAlerts();
    this.registrationNo =  this.establishmentService.getRegistrationFromStorage();
    if(this.registrationNo){ 
      this.fetchEstablishment(this.registrationNo);
    }
    this.comments = this.fb.group({ comments: [null] });
    this.parentForm.addControl('comments', this.comments);
  }
    /** Method to check establishment eligibility. */
    checkEstablishmentEligibility(establishment: Establishment): boolean {
      let flag = true;
      if (
        establishment.status.english !== EstablishmentStatusEnum.REGISTERED &&
        establishment.status.english !== EstablishmentStatusEnum.REOPEN
      ) {
        flag = false;
        this.alertService.showErrorByKey('CONTRIBUTOR.TRANSFER-CON.NO-UNREGISTERED-TRANSFER');
      } else if (establishment.gccEstablishment && establishment.gccEstablishment.gccCountry) {
        flag = false;
        this.alertService.showErrorByKey('CONTRIBUTOR.TRANSFER-CON.NO-GCC-TRANSFER');
      }
      return flag;
    }

   /** This method is fetch establishment details. */
   fetchEstablishment(regNumber: number): void {
    this.establishmentService.getEstablishmentDetails(regNumber).subscribe(
      (res) =>{ 
        this.canTransfer = this.checkEstablishmentEligibility(res);
        if(this.canTransfer){
        this.establishment = res;
        this.getBranches();
        this.getContributorList(this.assembleContributorWageParams());
      }
      
      },
        
      err => this.showError(err)
    );
  }

  /** This method is used to fetch contributor with wage details. */
  getContributorList(params: ContributorWageParams): void {
    this.alertService.clearAlerts();
      this.contributorWageService
      .getContributorTransferableList(this.registrationNo, params, true)
      .subscribe(
        (contributor:ContributorTransferableListResponse)=>{
          if(this.totalNumberOfActiveContributorsFixed==0) this.totalNumberOfActiveContributorsFixed = contributor.totalContributorCount;
          this.totalNumberOfActiveContributors = contributor.totalContributorCount;
          this.contributorList = contributor.transferableEngagements;
          
        },
        err => this.showError(err)
      );
  }

    /** Method to assemble contributor wage params. */
  assembleContributorWageParams(
    identifier?: string | number,
    pageNo?: number,
    pageSize?: number,
    filterReq?: ContributorDetailsFilter
  ): ContributorWageParams {
    return new ContributorWageParams(
      true,
      null,
      SearchTypeEnum.ACTIVE,
      pageNo,
      pageSize,
      identifier,
      null,
      null,
      this.isDescending ? 'DESC' : 'ASC',
      filterReq
    );
  }

    /** Method to get branches of establishment. */
    getBranches() {
      return this.establishmentService.getBranches(this.registrationNo).subscribe(
       res => {
          this.canTransfer = this.checkBranchEligibility(res);
          if (this.canTransfer) this.createLookups(res);
        },
        err => this.showError(err)
        );
    }
  
    /** Method to check branch eligibility. */
    checkBranchEligibility(branches: BranchDetails[]) {
      let flag = true;
      if (!branches || branches.length === 0 || branches.length === 1) {
        flag = false;
        this.alertService.showErrorByKey('CONTRIBUTOR.TRANSFER-CON.NO-BRANCHES-MESSAGE');
      }
      return flag;
    }
  
    /** Method to create lookups for view. */
    createLookups(branchList: BranchDetails[]) {
      this.mainEstRegistrationNo = branchList[0].registrationNo;
      this.registrationNoList = branchList.map(branch => branch.registrationNo);
      this.establishmentNameList = branchList.map(branch => {
        const newLov = new Lov();
        newLov.sequence = branchList.indexOf(branch);
        newLov.value.english = branch.name.english ? branch.name.english : branch.name.arabic;
        newLov.value.arabic = branch.name.arabic ? branch.name.arabic : branch.name.english;
        return newLov;
      });
      this.branchList = branchList;
      this.establishmentType$ = this.lookupService.getEstablishmentTypeList();
    }

    selectPage(pageNumber: number): void {
      if (this.pageDetails.currentPage !== pageNumber) {
        this.pageDetails.currentPage= pageNumber;
        this.getContributorList(this.assembleContributorWageParams(this.identifier,pageNumber,10,this.filterReq));
      }
    }

    searchContributorByIdentifier(identifier:string){
      this.resetPage();
      this.identifier =  identifier;
      if(!isNaN(parseInt(this.identifier))) {
        identifier.length>7? this.getContributorList(this.assembleContributorWageParams(identifier, this.pageDetails.currentPage, 10,this.filterReq )) : null;
      }
      else this.getContributorList(this.assembleContributorWageParams(identifier, this.pageDetails.currentPage, 10,this.filterReq ));
    }

        /** Method to reset page. */
  resetPage() {
    this.pageDetails.currentPage = 1;
    this.pageDetails.goToPage = '1';
  }
  
  verifiedBoolean(value){
    this.verified = value;
  }

  submitTransferMultiple(){
    if(this.parentForm.valid && this.verified){
    this.transferService
    .submitTransferRequest(
      this.registrationNo,
      this.assembleTransferAllPayload()
    ).subscribe(  res => {
      this.router.navigate([RouterConstants.ROUTE_TRANSACTION_HISTORY]);
      this.alertService.showSuccess(res)
    },
    err => this.showError(err)
    );
    }
    else {
      markFormGroupTouched(this.parentForm);
      this.showMandatoryFieldsError();
    }
  }

  cancelTransferMultiple(){
    this.router.navigate([RouterConstants.ROUTE_DASHBOARD]);
  }
  
   /** Method to assemble transfer all  payload. */
   assembleTransferAllPayload(): TransferContributorPayload {
    const transferForm = this.parentForm.get('transferMultipleForm').value;
    const payload = new TransferContributorPayload();
    payload.editFlow = false;
    payload.transferAll = false;
    payload.requestId = null;
    payload.transferTo = transferForm.registrationNoTo;
    payload.comments = this.parentForm.get('comments.comments').value;
    let eng: number[] = [];
    this.contributorSelectedList.forEach((value:TransferableEngagements) =>{
      eng.push(value.engagementId);
    })
    const data = {
      engagementId: eng,
      transferTo: transferForm.registrationNoTo
    }
    payload.transferItem.push(data);
    return payload;
  }
  filterContributorList(filterRequest){
    this.resetPage();
    this.filterReq = filterRequest;
    this.getContributorList(this.assembleContributorWageParams(this.identifier, this.pageDetails.currentPage, 10, filterRequest));
  }
  
}

