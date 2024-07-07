
import { FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText, ContributorGlobalSearch,GlobalSearchService, GosiCalendar, LovList } from '@gosi-ui/core';
import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
// import { EstablishmentService } from '@gosi-ui/features/establishment';
import { Router } from '@angular/router';

@Component({
  selector: 'gosi-global-search-dc',
  templateUrl: './global-search-dc.component.html',
  styleUrls: ['./global-search-dc.component.scss']
})
export class GlobalSearchDcComponent implements OnInit {
  isOpen: any = false;
  isExpand: boolean = false;
  sortListForm: FormGroup;
  selectedOption: any;
  isShowEstablishment: boolean = false;
  seachType: any = 'Establishment';
  placeholder: any = 'ESTABLISHMENT';
  sortOptions = [
    { name: 'Establishment', value: 'id' },]
  list: LovList = { items: [
    {
      value: { english: 'Establishment', arabic: 'المنشأة' },
      sequence: 1
    },
    {
      value: { english: 'Contributor', arabic: 'المشترك' },
      sequence: 1
    },
    {
      value: { english: 'Transactions', arabic: 'المعاملات' },
      sequence: 1
    },
    ]};
  lang: string;
  estName: BilingualText;
  estStatus: BilingualText;
  showPreviousContributors:boolean=false;
  showPreviousTransactions:boolean=false;
  showPreviousEstablishments:boolean=false;
  isError: boolean = false;
  isShowCard: boolean = false;
  isShowTransCard: boolean = false;
  isShowContributorCard:boolean=false;
  titleTrans: BilingualText;
  lastUpdatedDate: GosiCalendar = new GosiCalendar();
  transStatus: BilingualText;
  estGlobalSearchList= [];
  transGlobalSearchList = [];
  contributorSearchList=[];
  contributor:ContributorGlobalSearch[];
  transId: number;
  transNo: number;
  isNumeric: boolean = false;
  numericNo: number = 0;

  constructor( 
    private fb: FormBuilder,
    readonly router: Router,
    readonly coreGlobalSearchService:GlobalSearchService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
    ) { this.sortListForm = this.createSortListForm(); }


  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    // this.coreGlobalSearchService.estGlobalSearchList = [];
    // this.coreGlobalSearchService.transGlobalSearchList = [];
    // this.coreGlobalSearchService.contributorSearchList = [];
    this.showPreviousEstablishments=true;
    if(this.coreGlobalSearchService.contributorSearchList.length > 0) this.contributorSearchList=this.coreGlobalSearchService.contributorSearchList;
    if(this.coreGlobalSearchService.estGlobalSearchList.length > 0) this.estGlobalSearchList=this.coreGlobalSearchService.estGlobalSearchList;
    if(this.coreGlobalSearchService.transGlobalSearchList.length > 0) this.transGlobalSearchList=this.coreGlobalSearchService.transGlobalSearchList;
  }
  onHide() {
    this.isOpen = !this.isOpen;
    this.isShowCard = false;
    this.isShowContributorCard = false;
    this.isShowTransCard = false;
    if(this.coreGlobalSearchService.contributorSearchList.length > 0) this.contributorSearchList=this.coreGlobalSearchService.contributorSearchList;
    if(this.coreGlobalSearchService.estGlobalSearchList.length > 0) this.estGlobalSearchList=this.coreGlobalSearchService.estGlobalSearchList;
    if(this.coreGlobalSearchService.transGlobalSearchList.length > 0) this.transGlobalSearchList=this.coreGlobalSearchService.transGlobalSearchList;
  }
  onExpand() {
    this.isExpand = !this.isExpand;
  }
  onCompress() {
    this.isExpand = false;
  }

  onSearch(evnt){
    if(this.sortListForm.value.search){
      this.selectedOption = parseInt(this.sortListForm.value.search,10);
      if(this.seachType == 'Establishment') {
        this.isShowTransCard = false;
        this.isShowContributorCard=false;
      this.coreGlobalSearchService.getEstablishment(this.sortListForm.value.search).subscribe(
        establishment => {
          this.isShowEstablishment = true;
          this.isError=false;
          this.estName = establishment.name;
          if(this.estName.english == null){
            this.estName.english = this.estName.arabic;
          }
          this.estStatus = establishment.status;
          let isAlreadySearchedEstablishment=this.coreGlobalSearchService.estGlobalSearchList.some(item => item.registrationNo === this.selectedOption)
          if(!isAlreadySearchedEstablishment){
          this.coreGlobalSearchService.estGlobalSearchList.unshift(establishment);
          }
          let filterData = this.coreGlobalSearchService.estGlobalSearchList.filter(item => item.registrationNo != this.sortListForm.value.search);
          this.estGlobalSearchList = filterData;
          this.isShowCard = true;
        },
        error => {
          this.isError = true;
          this.estGlobalSearchList = this.coreGlobalSearchService.estGlobalSearchList;
          this.isShowCard=true;
        })
      }
      else if(this.seachType == 'Transactions') {
        this.isShowCard = false;
        this.isShowContributorCard=false;
        this.coreGlobalSearchService.getTransactionGlobalSearch(this.sortListForm.value.search).subscribe(
          transaction => {
            this.isShowTransCard = true;
            this.isError=false;
            this.titleTrans = transaction.title;
            this.lastUpdatedDate = transaction.lastActionedDate;
            this.transStatus = transaction.status;
            this.transId = transaction.transactionId;
            this.transNo = transaction.transactionRefNo
            let isAlreadySearchedTransaction=this.coreGlobalSearchService.transGlobalSearchList.some(item => item.transactionRefNo === this.selectedOption)
            if(!isAlreadySearchedTransaction){
              this.coreGlobalSearchService.transGlobalSearchList.unshift(transaction);
            }
            let filterData = this.coreGlobalSearchService.transGlobalSearchList.filter(item => item.transactionRefNo != this.sortListForm.value.search);
            this.transGlobalSearchList = filterData;
            
          },
          error => {
            this.isError = true;
            this.transGlobalSearchList = this.coreGlobalSearchService.transGlobalSearchList;
            this.isShowTransCard=true;
          })
      }else if(this.seachType === 'Contributor'){
        this.isShowCard=false;
        this.isShowTransCard=false;
        this.coreGlobalSearchService.getContributorGlobalSearch(this.sortListForm.value.search).subscribe(
          contributor=>{
            this.isShowContributorCard=true;
            if(contributor[0]?.registrationNo){
            // this.isShowContributorCard=true;
            this.isError=false;
            this.contributor=contributor;
            // 
            this.contributor.forEach((contributor)=>{
              let isContributorPreviouslySearched=this.coreGlobalSearchService.contributorSearchList.some(item=>item?.socialInsuranceNumber === contributor?.socialInsuranceNumber);
              console.log("Second",contributor.name.english.name);
              if(!isContributorPreviouslySearched){
                this.coreGlobalSearchService.contributorSearchList.unshift(contributor);
              }
            });

            // 
            this.coreGlobalSearchService.contributorSearchList.forEach(item=>{
              console.log(item.socialInsuranceNo);
            })
            // let filterData = this.coreGlobalSearchService.contributorSearchList.filter(item=>item?.socialInsuranceNumber != this.contributor?.socialInsuranceNumber);
            // this.contributorSearchList=filterData;
            let filterData = this.coreGlobalSearchService.contributorSearchList.filter(item=>!this.contributor.some(contributor=>contributor?.socialInsuranceNumber === item?.socialInsuranceNumber));
            this.contributorSearchList=filterData;
            }else{
              this.isError=true;
              this.contributorSearchList=this.coreGlobalSearchService.contributorSearchList;
            }  
          }
        );
      }
    }
  }
  isTooltipForJustification(titleTrans){
    if(titleTrans?.length > 20){
      return 1;
    }
    return 0;
  }


   //creation of form
   createSortListForm() {
    return this.fb.group({
      sortMode: this.fb.group({
        english: [
          'Establishment',
          {
            updateOn: 'blur'
          }
        ],
        arabic: [
         'نعم',
          {
            updateOn: 'blur'
          }
        ]
      }),
      search: [null]
    });
  }

  navigationToProfile(regNo) {
    if(regNo != undefined) {
    this.router.navigate([`/home/establishment/profile/${regNo}/view`])
    this.isOpen = !this.isOpen;
    }
    else{
      this.router.navigate([`/home/establishment/profile/${this.sortListForm.value.search}/view`])
      this.isOpen = !this.isOpen;
    }
  }
  navigateToIndividual(sin,regNo){
    console.log("reg",regNo);
    this.router.navigate([`/home/profile/contributor/${regNo}/${sin}/engagement/individual`]);
    this.isOpen = !this.isOpen;
  }
  navigateToTransaction(transId,transNo){
    this.router.navigate([`/home/transactions/view/${transId}/${transNo}`]);
    this.isOpen = !this.isOpen;
  }
  selectType(evnt) {
    this.sortListForm.get('search').reset();
    this.sortListForm.get('search').updateValueAndValidity();
    this.seachType = evnt;
    this.placeholder = evnt.toUpperCase();
    this.isShowCard = false;
    this.isShowTransCard = false;
    this.isShowContributorCard=false;
    this.isError=false;
    switch(this.seachType){
      case 'Contributor':
        this.showPreviousContributors=true;
        this.showPreviousEstablishments=false;
        this.showPreviousTransactions=false;
        break;
      case 'Transactions':
        this.showPreviousTransactions=true;
        this.showPreviousContributors=false;
        this.showPreviousEstablishments=false;
        break;
      case 'Establishment':
        this.showPreviousEstablishments=true; 
        this.showPreviousTransactions=false;
        this.showPreviousContributors=false;   
    }
    // this.showPreviousContributors=false;
    // this.showPreviousEstablishments=false;
    // this.showPreviousTransactions=false;
    this.isNumeric = false;
    if(this.coreGlobalSearchService.contributorSearchList.length > 0) this.contributorSearchList=this.coreGlobalSearchService.contributorSearchList;
    if(this.coreGlobalSearchService.estGlobalSearchList.length > 0) this.estGlobalSearchList=this.coreGlobalSearchService.estGlobalSearchList;
    if(this.coreGlobalSearchService.transGlobalSearchList.length > 0) this.transGlobalSearchList=this.coreGlobalSearchService.transGlobalSearchList;
  }

  onChange(evnt?) {
    if(evnt.inputType == 'deleteContentBackward'){
      this.isNumeric = false;
      if(this.coreGlobalSearchService.contributorSearchList.length > 0) this.contributorSearchList=this.coreGlobalSearchService.contributorSearchList;
    if(this.coreGlobalSearchService.estGlobalSearchList.length > 0) this.estGlobalSearchList=this.coreGlobalSearchService.estGlobalSearchList;
    if(this.coreGlobalSearchService.transGlobalSearchList.length > 0) this.transGlobalSearchList=this.coreGlobalSearchService.transGlobalSearchList;
    }
    //this.numericNo = this.numericNo + evnt.data;
    else if(isNaN(evnt.data) && this.seachType != 'Contributor'){
      this.isNumeric = true;
    }
    else{
      this.isNumeric = false;
    }
    this.isShowCard = false;
    this.isShowTransCard = false;
    this.isError = false;
    this.isShowContributorCard = false;
    switch(this.seachType){
      case 'Contributor':
        this.isNumeric = false;
        this.showPreviousContributors=true;
        break;
      case 'Transactions':
        this.showPreviousTransactions=true;
        break;
      case 'Establishment':
        this.showPreviousEstablishments=true;    
    }
  }

  clearAll() {
    this.estGlobalSearchList = [];
    this.transGlobalSearchList = [];
    this.contributorSearchList = [];
    this.coreGlobalSearchService.estGlobalSearchList = [];
    this.coreGlobalSearchService.transGlobalSearchList = [];
    this.coreGlobalSearchService.contributorSearchList = [];
    this.isShowCard = false;
    this.isShowContributorCard = false;
    this.isShowTransCard = false;
  }

}
