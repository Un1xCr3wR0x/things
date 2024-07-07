import {Component, Inject, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
    AlertService,
    CalendarService,
    CoreIndividualProfileService,
    DocumentService,
    LanguageToken,
    LookupService,
    RouterData,
    RouterDataToken,
    StorageService,
    WorkflowService,
    AuthTokenService, LanguageEnum, BilingualText,
} from '@gosi-ui/core';
import {
  CancelContributorService,
  HealthInsuranceService,
  ContributorBaseScComponent,
  ContributorService,
  EngagementService,
  HealthInsuranceHDFRequest,
  ManageWageService,
  InsuredList,
  UninsuredList,
  InsuranceInProgressList,
  ComplianceDetails,
  HealthInsuranceInfoRequest,
  CreateHDFEmployee
} from '../../../shared';
import {
    EstablishmentService
} from '../../../shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {BehaviorSubject, forkJoin, noop} from 'rxjs';
import {switchMap, tap} from "rxjs/operators";
import {BreadcrumbDcComponent} from "@gosi-ui/foundation-theme";


@Component({
  selector: 'cnt-health-insurance-sc',
  templateUrl: './health-insurance-sc.component.html',
  styleUrls: ['./health-insurance-sc.component.scss']
})
export class HealthInsuranceScComponent extends ContributorBaseScComponent  implements OnInit, AfterViewInit {
  lang: string;

  @ViewChild('breadCrumb', {static: false})
  healthInsuranceBreadCrumbs: BreadcrumbDcComponent;
  /** Local Variables
   *
   */
  healthInsuranceHDFRequest: HealthInsuranceHDFRequest;
  healthInsuranceInfoRequest: HealthInsuranceInfoRequest;
  registrationNo:number;
  insuredList: InsuredList;
  uninsuredList: UninsuredList;
  insuranceInProgressList: InsuranceInProgressList;
  complianceDetails: ComplianceDetails;
  dataLoaded: boolean  =false;
  tableLoaded: boolean =false;
  UNN: number;
  EstablishmentDetails : any;
  isRegisteredInHealthInsurance:boolean=false;

  /** Creates an instance of HealthInsuranceDetailsDcComponent. */
  constructor(
      readonly contributorService: ContributorService,
      readonly alertService: AlertService,
      readonly establishmentService: EstablishmentService,
      readonly manageWageService: ManageWageService,
      readonly lookupService: LookupService,
      readonly engagementService: EngagementService,
      readonly documentService: DocumentService,
      readonly modalService: BsModalService,
      readonly workflowService: WorkflowService,
      readonly cancelContributorService: CancelContributorService,
      readonly route: ActivatedRoute,
      readonly router: Router,
      readonly storageService: StorageService,
      readonly coreService: CoreIndividualProfileService,
      readonly location: Location,
      readonly calendarService: CalendarService,
      readonly healthInsuranceService: HealthInsuranceService,
      readonly authTokenService:AuthTokenService,
      @Inject(RouterDataToken) readonly routerDataToken: RouterData,
      @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
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

  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.route.queryParams.subscribe( params => {
      this.registrationNo = params['regNo'];
      console.log("from params :",this.registrationNo);
    });

    // if (this.route.routeConfig) {
    //   this.route.routeConfig.data = {breadcrumb: 'CONTRIBUTOR.HEALTH-INSURANCE.TITLE'};
    //   this.healthInsuranceBreadCrumbs.breadcrumbs = this.healthInsuranceBreadCrumbs.buildBreadCrumb(this.route.root);
    // }


    this.establishmentService.getEstablishmentDetails(this.registrationNo,false).subscribe(res =>{
      this.EstablishmentDetails = res;
      this.UNN = this.EstablishmentDetails?.unifiedNationalNumber;
      this.healthInsuranceService.complianceDetailsCall(new HealthInsuranceInfoRequest(this.UNN,0,10)).subscribe(res =>{
        this.complianceDetails = res;
        this.dataLoaded = true;
      });
      this.healthInsuranceService.onHoldListCall(new HealthInsuranceInfoRequest(this.UNN,0,10)).subscribe(res =>{
        this.insuranceInProgressList = res;
      });
      this.healthInsuranceService.insuredListCall(new HealthInsuranceInfoRequest(this.UNN,0,10)).subscribe(res =>{
        this.insuredList = res;
      });
      this.healthInsuranceService.uninsuredListCall(new HealthInsuranceInfoRequest(this.UNN,0,10)).subscribe(res=>{
        this.uninsuredList = res;
      });
      this.tableLoaded = true;
    });

  }

    convertNameToBilingual(arName?:string, enName?:string): BilingualText{
        const bilingualName = new BilingualText();
        bilingualName.arabic=arName;
        bilingualName.english=enName;
        return bilingualName;
    }
    getCommitmentPercentage():number{
        return parseInt(this.complianceDetails?.compliancePercentage.split("%")[0],10);
    }

  ngAfterViewInit() {
    // if (this.route.routeConfig) {
    //   this.route.routeConfig.data = {breadcrumb: 'HEALTH-INSURANCE.TITLE'};
    //   this.healthInsuranceBreadCrumbs.breadcrumbs = this.healthInsuranceBreadCrumbs.buildBreadCrumb(this.route.root);
    // }
  }

  /** Method to get reg no. */
  getData() {
      this.establishmentService
     .getEstablishmentDetails(this.registrationNo,false)
     .subscribe(res => {
         this.UNN = res.unifiedNationalNumber?.id ;
         this.healthInsuranceInfoRequest = new HealthInsuranceInfoRequest(this.UNN, 0, 10);
         forkJoin([ this.getInsuredList(),
         this.getUninsuredList(),
         this.getInsuranceInProgressList(),
         this.getComplianceDetails()]).subscribe(noop)
       })

  }

   getInsuredList()  {
    this.healthInsuranceService.insuredListCall(this.healthInsuranceInfoRequest)
    .pipe( tap(data => this.insuredList = data)
    )
  }

   getUninsuredList()  {
    this.healthInsuranceService.uninsuredListCall(this.healthInsuranceInfoRequest)
    .pipe(
        tap(data => this.uninsuredList = data)
    )
  }

   getInsuranceInProgressList() {
    this.healthInsuranceService.onHoldListCall(this.healthInsuranceInfoRequest)
    .pipe(
        tap(data => this.insuranceInProgressList = data)
    )
  }

   getComplianceDetails()  {
    this.healthInsuranceService.complianceDetailsCall(this.healthInsuranceInfoRequest)
    .pipe(
      tap (data => this.complianceDetails = data)
    )
  }

  handleCheck(contributorNIN:string) {
    const contributorInfo = this.insuredList.content.find(empInfo => empInfo.employeeID === contributorNIN);
    const nameSplit=contributorInfo.employeeNameAr.split(" ");
    const firstName:string =nameSplit[0];
    const secondName: string=nameSplit[1];
    const surName: string=nameSplit[2];
  }
  handleOnHoldPagination(event :string){
    if (parseInt(event)!==this.healthInsuranceInfoRequest.page){
      this.healthInsuranceInfoRequest.page=parseInt(event);
      this.getInsuranceInProgressList();
    }
  }
  handleUninsuredPagination(event :string){
    if (parseInt(event)!==this.healthInsuranceInfoRequest.page){
      this.healthInsuranceInfoRequest.page=parseInt(event);
      this.getUninsuredList();
    }
  }
  handleInsuredPagination(event :string){
    if (parseInt(event)!==this.healthInsuranceInfoRequest.page){
      this.healthInsuranceInfoRequest.page=parseInt(event);
      this.getInsuranceInProgressList();
    }
  }
}
