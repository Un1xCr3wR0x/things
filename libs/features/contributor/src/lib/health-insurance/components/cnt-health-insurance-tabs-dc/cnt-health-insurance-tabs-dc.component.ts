import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {
  DropDownItems,
  HealthInsuranceInfoRequest, HealthInsuranceService,
  InsuranceInProgressList,
  InsuredList,
  UninsuredList
} from "@gosi-ui/features/contributor";
import {BilingualText, Lov, LovList} from "@gosi-ui/core";
import { InsuranceClass } from "@gosi-ui/features/contributor/lib/shared/models/health-insurance-class";
import {FormControl} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'cnt-cnt-health-insurance-tabs-dc',
  templateUrl: './cnt-health-insurance-tabs-dc.component.html',
  styleUrls: ['./cnt-health-insurance-tabs-dc.component.scss']
})
export class CntHealthInsuranceTabsDcComponent implements OnInit {

  @Input() InsuredList:InsuredList = new InsuredList();
  @Input() UninsuredList:UninsuredList = new UninsuredList();
  @Input() OnHoldList:InsuranceInProgressList = new InsuranceInProgressList();
  @Input() insuranceClassOptions:InsuranceClass[];
  @Input() healthInsuranceInfoRequest: HealthInsuranceInfoRequest;
  @Input() selectedLanguage:string;
  @Input() selectedContributor:FormControl;
  @Output() checked:EventEmitter<string>
  @Output() selectAllEvent:EventEmitter<any>
  @Output() insuredPageChange:EventEmitter<string>
  @Output() uninsuredPageChange:EventEmitter<string>
  @Output() onHoldPageChange:EventEmitter<string>
  @Output() chosenInsuranceClassWithNIN:EventEmitter<any>
  multiValues:boolean;
  private modalService: BsModalService;
  modalRef: BsModalRef;
  counter:number = 0;
  currentTab:number;
  itemsPerPage = 10;
  pageDetails: {
    currentPage: 1,
    goToPage: ''
  }
  hipContributorList:any;
  insuredPaginationId = "insured-pagination-id";
  uninsuredPaginationId = "uninsured-pagination-id";
  onHoldPaginationId = "on-hold-pagination-id";

  constructor(modalService: BsModalService,
              readonly healthInsuranceService: HealthInsuranceService
  ) {
    this.modalService = modalService;
  }

  ngOnInit(): void {
    this.currentTab=0;
  }

  /** Method to set current tab when tabs are switched. */
  toggleTabs(index: number) {
    this.currentTab = index;
    this.counter =0;
  }
  popUp(confirmTemplate:TemplateRef<HTMLElement>){
    let modelSize: string = 'modal-xl';
    this.modalRef = this.modalService.show(confirmTemplate, Object.assign({}, {class: `${modelSize} modal-dialog-centered`}));
}

  paginateInsured(pageEvent: number){
    this.insuredPageChange?.emit(""+pageEvent);
  }
  paginateUninsured(pageEvent: number){
    this.uninsuredPageChange?.emit(""+pageEvent);
  }

  paginateOnHold(pageEvent: number){
    this.onHoldPageChange?.emit(""+pageEvent);
  }
  convertNameToBilingual(arName:string, enName:string): BilingualText{
    const bilingualName = new BilingualText();
     bilingualName.arabic=arName;
     bilingualName.english=enName;
    return bilingualName;
  }


  handleChecked(contributorNIN){
    this.checked.emit(""+contributorNIN);
  }
  selectAll(event){
    console.log(event)
  }
  chosenInsuranceClass(event){
    this.chosenInsuranceClassWithNIN.emit(event);
  }

  getJoiningDate(GOSIJoiningDate?:string){
    return GOSIJoiningDate?.split('T')[0].replace(/-/g, '/');
  }
  getEmployeeId(employeeID:string):number{
    return parseInt(employeeID);
  }
  onSelectContributor(contributor: any, event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      // increment the counter
      this.counter++;
      contributor.selected = !contributor.selected;
      // if (!this.chiContributorList.contributorDtoList.includes({"socialInsuranceNo": contributor.socialInsuranceNo})) {
      //   this.chiContributorList.contributorDtoList.push({
      //     "socialInsuranceNo": contributor.socialInsuranceNo
      //   });
      // }
    } else {
      // Decrement the counter if the checkbox is unchecked
      this.counter--;
      // this.chiContributorList.contributorDtoList.pop();
    }
    contributor.selected = !contributor.selected;
  }

  formatInsuranceClass(insuranceClassOptions:InsuranceClass[]):DropDownItems[]
  {
    const formattedInsuranceClasses :DropDownItems[] = [];
    insuranceClassOptions?.forEach((insuranceClass :InsuranceClass) => {
      formattedInsuranceClasses.push(Object.assign(new DropDownItems(insuranceClass.insuranceClass)),{id: insuranceClass.insuranceClassCode})
    })
    return formattedInsuranceClasses
  }

  handleOnHoldPagination(pageNumber: number): void {
    if (this.pageDetails.currentPage !== pageNumber) {
      this.healthInsuranceInfoRequest.page == pageNumber - 1;
      this.healthInsuranceService.onHoldListCall(this.healthInsuranceInfoRequest).subscribe(
          res =>{
            this.OnHoldList = res;
          });
    }
  }
  handleInsuredPaginate(pageNumber: number){
    if (this.pageDetails.currentPage !== pageNumber) {
      this.healthInsuranceInfoRequest.page == pageNumber - 1;
      this.healthInsuranceService.insuredListCall(this.healthInsuranceInfoRequest).subscribe(
        res =>{
          this.InsuredList = res;
        });
    }
  }
  handleUninsuredPaginate(pageNumber: number){
    if (this.pageDetails.currentPage !== pageNumber) {
      this.healthInsuranceInfoRequest.page == pageNumber - 1;
      this.healthInsuranceService.uninsuredListCall(this.healthInsuranceInfoRequest).subscribe(
        res =>{
          this.UninsuredList = res;
        });
    }
  }
}
