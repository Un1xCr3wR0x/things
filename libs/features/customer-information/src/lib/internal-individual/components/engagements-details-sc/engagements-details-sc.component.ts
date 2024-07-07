import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Alert,
  AlertService,
  AlertTypeEnum,
  AuthTokenService,
  BilingualText,
  CoreIndividualProfileService,
  CurrencyToken,
  DropdownItem,
  LanguageEnum,
  LanguageToken,
  Lov,
  LovList,
  StorageService,
  convertToStringDDMMYYYY,
  convertToStringYYYYMMDD,
  convertToYYYYMMDD,
  downloadFile,
  startOfMonth,
  subtractMonths
} from '@gosi-ui/core';
import {
  BillDetails,
  BillSummaryWrapper,
  ContractWrapper,
  ContributorConstants,
  ContributorRouteConstants,
  ContributorService,
  CoveragePeriod,
  DropDownItems,
  EngagementDetails,
  EngagementPeriod,
  ManageWageConstants,
  ManageWageService,
  SearchEngagementResponse,
  VicContributionDetails,
  VicEngagementDetails
} from '@gosi-ui/features/contributor';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChangePersonService } from '../../../shared/services/change-person.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cim-engagements-details-sc',
  templateUrl: './engagements-details-sc.component.html',
  styleUrls: ['./engagements-details-sc.component.scss']
})
export class EngagementsDetailsScComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  identifier: number;
  sin: number;
  contributionBreakup: SearchEngagementResponse;
  contractId: number;
  engagementId: number;
  registrationNo: number;
  socialInsuranceNo: number;
  isVic: boolean;
  monthSelectedDate: string;
  selectedChart = '';
  actionList: DropDownItems[];
  colorCode = 0;
  tabIndicator = 0;
  engagementIds: number[];
  vicEngagementIds: number[] =[];
  actionDropDown: Array<DropdownItem> = [
    {
      id: 1,
      icon: 'pencil-alt',
      value: {
        english: 'Modify Joining Date',
        arabic: ''
      }
    },
    {
      id: 2,
      icon: 'pencil-alt',
      value: {
        english: 'Modify Leaving Date',
        arabic: ''
      }
    },
    {
      id: 3,
      icon: 'times-circle',
      value: {
        english: 'Cancel Engagement',
        arabic: ''
      }
    }
  ];
  regNo: number;
  lang: string;
  nin: number;
  contratId: number;
  engId: number;
  contractDetailsFlag: boolean;
  engagementDetails: EngagementDetails[];
  engagementPeriod: EngagementPeriod;
  allEngagements: EngagementDetails[];
  activeEngagementsList: EngagementDetails[];
  singleActive: boolean;
  myarray: CoveragePeriod;
  coverageDetails: CoveragePeriod;
  contractDetails: ContractWrapper;
  periods: CoveragePeriod[] = [];
  typeVic = 'vic';
  billHistory: BillSummaryWrapper = new BillSummaryWrapper();
  billNumber: number;
  billDetails: BillDetails = new BillDetails();
  isBillNumber = false;
  vicContributionDto: VicContributionDetails;
  vicEngagementDto: VicEngagementDetails;
  currencyType = 'SAR';
  showError = true;
  message: BilingualText;
  value = false;
  successAlert = new Alert();
  personIdentifier: any;
  exportEngagementList: LovList = {
    items: [
      {
        value: { english: 'All Engagements', arabic: 'كل مدد الاشتراك' },
        sequence: 1
      },
      {
        value: { english: 'Specific Engagements', arabic: 'مدة اشتراك محددة' },
        sequence: 2
      }]
  };
  exportingEngagementForm: FormGroup;
  establishmentList: LovList;
  commonList: Lov[] = [];
  establishmentLovList: LovList;
  employerListValues: BilingualText[] = [];
  specificEngagementSelected: boolean = false;
  establishmentSelected: string;
  engList: EngagementDetails[] = [];
  allEngagementSelected: boolean = false;
  engSelected: boolean = false;
  estSelected: boolean;
  constructor(
    readonly activatedRoute: ActivatedRoute,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly manageWageService: ManageWageService,
    readonly contributorService: ContributorService,
    readonly modalService: BsModalService,
    @Inject(CurrencyToken) readonly currency: BehaviorSubject<string>,
    readonly authTokenService: AuthTokenService,
    readonly changePersonService: ChangePersonService,
    readonly coreService: CoreIndividualProfileService,
    readonly alertService: AlertService,
    readonly storageService: StorageService,
    readonly fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.alertService.clearAllErrorAlerts();
    this.alertService.clearAllWarningAlerts();
    this.activatedRoute.parent.parent.paramMap.subscribe(params => {
      if (params.get('personId') && (this.storageService.getSessionValue('idType') == 'NIN' || 'IQAMA')) {
        this.personIdentifier = Number(params.get('personId'));
      }
    });
    this.value = this.coreService.getEditValue();
    if (this.value) {
      this.successAlert.message = this.coreService.getSuccessMessage();
      this.successAlert.type = AlertTypeEnum.SUCCESS;
      this.successAlert.timeout = 5000;
    }
    this.language.subscribe(language => {
      this.lang = language;
    });
    // this.fetchEngagementDetails();
    this.getContributionBreakup();
    this.exportingEngagementForm = this.createExportEngagementForm();
  }

  /*
  * This method is to create exporting engagement form
  */
  createExportEngagementForm(): FormGroup {
    return this.fb.group({
      exportingEngagements: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      selectEstablishment:  this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      name: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
    });
  }

  getContributionBreakup() {
    this.contributorService.getEngagementFullDetails(this.personIdentifier).subscribe(res => {
      this.contributionBreakup = res;
      let overallEngagements: any = this.contributionBreakup?.overallEngagements;
      
      for (var i = 0; i < overallEngagements.length; i++) {
        this.commonList.push({
          value: {
            arabic: overallEngagements[i].establishmentName?.arabic ? overallEngagements[i].establishmentName?.arabic : overallEngagements[i].engagementType ==='vic' ? 'الاشتراك الاختياري' : overallEngagements[i].establishmentName?.english,
            english: overallEngagements[i].establishmentName?.english ? overallEngagements[i].establishmentName?.english : overallEngagements[i].engagementType ==='vic' ? 'Voluntary Individual Contributor' : overallEngagements[i].establishmentName?.arabic
          },
          sequence: i,
          code: overallEngagements[i]?.engagementId
        });
        if(overallEngagements[i].engagementType ==='vic'){
          this.vicEngagementIds.push(this.contributionBreakup?.overallEngagements[i]?.engagementId)
        }
      }
      this.commonList = this.commonList.reduce((acc, val) => {
        if (!acc.find(el => el.value.arabic === val.value.arabic ||  el.value.english === val.value.english)) {
          acc.push(val);
        }
        return acc;
      }, [])
      this.establishmentList = new LovList(this.commonList);
      this.sin = overallEngagements[0]?.socialInsuranceNo;
    });
  
  }
  /**Method to fecth engagement details */
  fetchEngagementDetails() {
    this.contributorService.getEngagementFullDetails(this.personIdentifier).subscribe(res => {
      this.contributionBreakup = res;
      if (res?.activeEngagements) {
        if (res.activeEngagements.length === 1) {
          this.singleActive = true;
        } else {
          this.singleActive = false;
        }
        res?.activeEngagements?.forEach(item => {
          this.isVic = item?.vicIndicator;
          this.engagementId = item?.engagementId;
          if (this.isVic) {
            this.getVicBillDetails(this.personIdentifier);
            this.getVicCoverage(this.personIdentifier, item.engagementId).subscribe(response => {
              this.vicContributionDto = response;
            });
            this.getVicEngagement(this.personIdentifier, item.engagementId).subscribe(res => {
              this.vicEngagementDto = res;
            });
          } else if (!this.isVic) {
            this.contributorService
              .getContributoryCoverage(this.personIdentifier, item.engagementId, item.registrationNo)
              .subscribe(resp => {
                item.coverageDetails = resp?.currentPeriod;
                this.coverageDetails = resp?.currentPeriod;
              });
            this.contributorService
              .getContractDetails(this.personIdentifier, item.registrationNo, item.engagementId)
              .subscribe(contracts => {
                if (contracts) {
                  if (contracts.count) {
                    item.contractDetailsFlag = true;
                    item.actionList = ManageWageConstants.IndividualActionsDropdown;
                    if (!this.singleActive) {
                      item.actionList?.push(ManageWageConstants.MultiIndividualSecondDropdown);
                    }
                  } else {
                    item.contractDetailsFlag = false;
                    item.actionList = ManageWageConstants.IndividualSecondDropdown;
                    if (!this.singleActive) {
                      item.actionList?.push(ManageWageConstants.MultiIndividualSecondDropdown);
                    }
                  }
                  contracts?.contracts?.forEach(val => {
                    this.contratId = val?.id;
                    item.contractId = val?.id;
                  });
                }
              });
          }
        });
        this.activeEngagementsList = res?.activeEngagements;
      }

      res?.overallEngagements?.forEach(eng => {
        if (eng?.engagementType === this.typeVic) {
          this.getVicCoverage(this.personIdentifier, eng.engagementId).subscribe(response => {
            this.vicContributionDto = response;
          });
        } else if (eng?.engagementType !== this.typeVic) {
          this.contributorService
            .getContributoryCoverage(this.personIdentifier, eng.engagementId, eng.registrationNo)
            .subscribe(value => {
              // value?.periods?.forEach(element => {
              //   eng.allCoverage.push(element);
              //   this.periods.push(element);
              // });
              eng.coverageDetails = value?.currentPeriod;
              this.coverageDetails = value?.currentPeriod;
              eng.allCoverage = value?.periods;
              this.periods = value?.periods;
            });
          this.contributorService
            .getContractDetails(this.personIdentifier, eng.registrationNo, eng.engagementId)
            .subscribe(contracts => {
              if (contracts) {
                if (contracts.count) {
                  eng.contractDetailsFlag = true;
                } else {
                  eng.contractDetailsFlag = false;
                }
                contracts?.contracts?.forEach(val => {
                  this.contratId = val?.id;
                  eng.contractId = val?.id;
                });
              }
            });
        }
      });
      this.allEngagements = res?.overallEngagements;
    });
  }
  navigateToProfileScreen(key: string) { }
  getEngagementDetails(key: number) { }
  navigateToContract(engagement: EngagementDetails) {
    this.router.navigate([ContributorRouteConstants.ROUTE_INDIVIDUAL_CONTRACT], {
      queryParams: {
        id: engagement.contractId,
        nin: this.personIdentifier,
        engId: engagement.engagementId,
        regNumber: engagement.registrationNo,
        isContract: false
      }
    });
  }
  /**
   * Method to switch bill breakup view.
   * @param id tab id
   */
  switchBreakupView(id) {
    this.tabIndicator = id?.tabIndicator;
    this.selectedChart = id?.selectedChart;
    if (this.selectedChart === 'GOSI' || this.selectedChart === 'المؤسسة العامة للتأمينات الاجتماعية') {
      this.colorCode = 0;
    } else if (this.selectedChart === 'PPA' || this.selectedChart === 'التسويات') {
      this.colorCode = 1;
    } else if (this.selectedChart === 'VIC' || this.selectedChart === 'مشترك إختياري') {
      this.colorCode = 2;
    }
  }
  getVicBillDetails(idNo) {
    if (idNo) {
      this.monthSelectedDate = convertToYYYYMMDD(startOfMonth(subtractMonths(new Date(), 1)).toString());
      this.contributorService.getBillNumber(idNo, this.monthSelectedDate, true).subscribe(
        res => {
          if (res) {
            this.billHistory = res;
            this.billNumber = res.bills[0].billNumber;
            this.isBillNumber = false;
            this.contributorService.getVicBillBreakup(idNo, this.billNumber).subscribe((response: BillDetails) => {
              this.billDetails = response;
            });
          }
        },
        err => {
          this.isBillNumber = true;
          // this.alertService.showError(err.error.message);
        }
      );
    }
  }
  navigateToBillDashboard() {
    this.router.navigate(['/home/billing/vic/dashboard'], {
      queryParams: {
        idNo: this.personIdentifier,
        monthSelected: this.monthSelectedDate
      }
    });
  }
  navigateToModify() {
    this.router.navigate(['/home/contributor/wage/update/vic-wage'], {
      queryParams: {
        nin: this.personIdentifier,
        engId: this.engagementId
      }
    });
  }
  getVicEngagement(nin: number, engagementId: number): Observable<VicEngagementDetails> {
    return this.contributorService.getVicEngagementById(nin, engagementId).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
  getVicCoverage(nin: number, engagementId: number): Observable<VicContributionDetails> {
    return this.contributorService.getVicContributionDetails(nin, engagementId).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
  ngOnDestroy() {
    this.coreService.setSuccessMessage(null, false);
  }

  /** method to show engagement period modal
  * @param templateRef
  */
  showModal(templateRef: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-md' }));
  }
  onSubmit(){
    let fileName: string = '';
    if (this.lang === LanguageEnum.ENGLISH) {
      fileName = ContributorConstants.DOWNLOAD_ALL_CONTRIBUTOR_ENGAGEMENT_FILE_NAME.english;
    } else {
      fileName = ContributorConstants.DOWNLOAD_ALL_CONTRIBUTOR_ENGAGEMENT_FILE_NAME.arabic;
    }

    this.exportingEngagementForm.get('exportingEngagements').markAllAsTouched();
    this.exportingEngagementForm.get('exportingEngagements').updateValueAndValidity();
    this.exportingEngagementForm.get('selectEstablishment').markAllAsTouched();
    this.exportingEngagementForm.get('selectEstablishment').updateValueAndValidity
    if(this.specificEngagementSelected){
      this.exportingEngagementForm.get('name').markAllAsTouched();
      this.exportingEngagementForm.get('name').updateValueAndValidity();
    }
    if( this.specificEngagementSelected && this.engSelected && this.estSelected && this.exportingEngagementForm.valid && this.exportingEngagementForm.get('selectEstablishment').get('english').value !== 'Voluntary Individual Contributor'){
      
    this.contributorService.exportEngagementPeriods(this.sin, this.engagementIds, this.lang, this.registrationNo).subscribe(data => {
        downloadFile(fileName + '.xlsx', 'application/vnd.ms-excel', data); 
        this.modalRef.hide();
        this.exportingEngagementForm.reset();
        this.specificEngagementSelected = false; 
        this.allEngagementSelected = false;
        // this.exportingEngagementForm.get('selectEstablishment').reset();
    })
  }
  else if(this.allEngagementSelected && this.estSelected && this.exportingEngagementForm.get('exportingEngagements').valid && this.exportingEngagementForm.get('selectEstablishment').get('english').value !== 'Voluntary Individual Contributor')
  {
    this.contributorService.exportAllEngagementPeriods(this.sin, this.lang, this.registrationNo).subscribe(data => {
      downloadFile(fileName + '.xlsx', 'application/vnd.ms-excel', data); 
      this.modalRef.hide();
      this.exportingEngagementForm.reset();
      this.specificEngagementSelected = false; 
      this.allEngagementSelected = false;
      // this.exportingEngagementForm.get('selectEstablishment').reset();
    })
  }
  else if(this.allEngagementSelected && this.estSelected && this.exportingEngagementForm.get('exportingEngagements').valid && this.exportingEngagementForm.get('selectEstablishment').get('english').value === 'Voluntary Individual Contributor')
  {
    this.contributorService.exportEngagementPeriods(this.sin, this.vicEngagementIds, this.lang, null).subscribe(data => {
      downloadFile(fileName + '.xlsx', 'application/vnd.ms-excel', data); 
      this.modalRef.hide();
      this.exportingEngagementForm.reset();
      this.specificEngagementSelected = false; 
      this.allEngagementSelected = false;
    })
  }
  else if(this.specificEngagementSelected && this.estSelected && this.exportingEngagementForm.get('exportingEngagements').valid && this.exportingEngagementForm.get('selectEstablishment').get('english').value === 'Voluntary Individual Contributor')
  {
    this.contributorService.exportEngagementPeriods(this.sin, this.engagementIds, this.lang, null).subscribe(data => {
      downloadFile(fileName + '.xlsx', 'application/vnd.ms-excel', data); 
      this.modalRef.hide();
      this.exportingEngagementForm.reset();
      this.specificEngagementSelected = false; 
      this.allEngagementSelected = false;
    })
  }
  }
  exportEngagement(event){
    this.estSelected = false;
    this.engSelected = false;
    this.specificEngagementSelected = false;
    this.allEngagementSelected = false; 
    if (event === 'All Engagements') {
     this.exportingEngagementForm.get('exportingEngagements').get('english').setValue('All Engagements')
     this.specificEngagementSelected = false;
     this.allEngagementSelected = true; 
    } 
    else if (event === 'Specific Engagements') {
      this.exportingEngagementForm.get('exportingEngagements').get('english').setValue('Specific Engagements')
      this.specificEngagementSelected = true; 
      this.allEngagementSelected = false; 


    }

  }

  exportEstablishment(event){
    this.exportingEngagementForm.controls['name'].reset();
    let newList: Lov[] = [];
    this.contributionBreakup?.overallEngagements.forEach((engg, i )=>{
      if(engg.establishmentName?.arabic === event || engg.establishmentName?.english === event || ((event === 'Voluntary Individual Contributor') && engg.engagementType === 'vic')){
        this.engList.push(engg)
        this.registrationNo = engg.registrationNo
        this.estSelected = true;
        
       
       
          newList.push({
            value: {
              arabic: 'المشتركين'+ ' : ' + convertToStringYYYYMMDD(engg.joiningDate.gregorian.toString()) + ' -> ' + (convertToStringYYYYMMDD(engg.leavingDate?.gregorian.toString()) ? convertToStringYYYYMMDD(engg.leavingDate?.gregorian.toString()) : 'حتى الآن'),
              english: 'Engagement '+ ' : ' + convertToStringDDMMYYYY(engg.joiningDate?.gregorian.toString()) + ' -> ' + (convertToStringDDMMYYYY(engg.leavingDate?.gregorian.toString()) ? convertToStringDDMMYYYY(engg.leavingDate?.gregorian.toString()) : 'Onwards')
            },
            sequence: i,
            code: engg.engagementId
          })
         
        
      }
    }
      );
      this.establishmentLovList = new LovList(newList);
}


  onCancel(){
    this.modalRef.hide();
    this.exportingEngagementForm.reset();
    this.specificEngagementSelected = false; 
    // this.exportingEngagementForm.get('selectEstablishment').reset();
   
  }
  clearButtonClick(event) {
    this.exportingEngagementForm.controls['name'].reset();
    // this.employerListValues =[];
  }
  /**
   * Method to select the corresponding engagement
   * 
   *
   */

  selectedOptions(event){
    this.engagementIds=[];
    event.forEach((id)=>{
      this.engagementIds.push(id?.code)
      this.engSelected =true;
    }
    )
  
  }
}
