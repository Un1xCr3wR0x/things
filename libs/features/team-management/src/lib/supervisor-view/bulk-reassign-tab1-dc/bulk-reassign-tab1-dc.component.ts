import {  Component, ComponentFactoryResolver,  ElementRef,  Inject, OnInit,   SimpleChanges, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService,  AssignmentFilter,  BPMOperators,  BPMRequest,  BPMResponse,  BPMTaskConstants,  BilingualText,  CsvFile, LanguageToken,  LovList, RequestSort, SortClause, SortDirectionEnum, TransactionService, TransactionState, WorkflowService} from '@gosi-ui/core';
import { ReassignService } from '../../shared/services/reassign.service';
import { Transaction } from '../../shared/models/bulk-reassign-csv';
import { Subscription ,BehaviorSubject} from 'rxjs';
import { TransactioUI } from '../../shared/models/transaction-ui';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'gosi-ui-bulk-reassign-tab1-dc',
  templateUrl: './bulk-reassign-tab1-dc.component.html',
  styleUrls: ['./bulk-reassign-tab1-dc.component.scss']
})
export class BulkReassignTab1DcComponent implements OnInit{


  bulkReassignTypes: LovList = new LovList([]);
  reassignDetailsForm: FormGroup;
  showEmployeeDetails: boolean = true;
  showCSVFile: boolean = false;
  showReassignUsingTransactionID: boolean = false;
  openEmployeeDetails: boolean = false;
  openTargetEmployeeDetails: boolean = false;
  showTranactionInquiry: boolean = false;
  bulkFile: CsvFile;
  file: File;
  uploadFailed = false;
  empName: any;
  userId: any;
  targetEmpName: any;
  roles: any;
  targetRoles: any;
  roleDetailsSelected: any;
  roleList: LovList;
  roleArray: any;
  count: any;
  commonValues: any;
  downloadArray: any = [
    ["10000001", "DM00001", "في هذي الحالة سيتم إعادة اسناد المعاملة مباشرة الى DM00001"],
    ["10000002", "", "في هذي الحالة سيتم إعادة اسناد المعاملة الى موظف يملك الصلاحية المطلوبة للمعامل"],
    ["", "", "يرجى حذف الأمثلة قبل ادخال المعاملات المطلوب إعادة إسنادها"]
  ];
  isCommonValue: boolean;
  isRoles: boolean;
  sourceRoleList: LovList;
  noRole: boolean = false;
  lookupClicked: boolean = false;
  isErrorOnProfile: boolean = false;
  errorMessage: string;
  csvLines: any = [];
  invalidTarget: boolean = false;
  newArray: Transaction;
  isCount: boolean = false;
  transactionIDs: any = [];
  userIDs: any = [];
  isReset: boolean = false;
  invalidSource: boolean = false;
  isCSVUploaded: boolean = true;
  lang = 'en';
  trnIndex:number = 0;
  httpSubscriptionClaimed: Subscription;
  bpmTaskResponse: BPMResponse;
  currentValidator: string = null;
  fromTeam = false;
  bpmRequest = new BPMRequest();
  sortItem: RequestSort = new RequestSort();
  transactions:TransactioUI [] = [] ;
  transactionSaved:boolean = false;

  /**
  * This method is used to initialise the component
  * @param fb
  */
  constructor(private fb: FormBuilder,
    readonly reassignService: ReassignService,
    readonly transactionService: TransactionService,
    readonly alertService: AlertService,
    readonly workflowService: WorkflowService,
    readonly translate : TranslateService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
     
     }

    
  ngOnInit(): void {
    
    this.bulkReassignTypes = new LovList([
      {
        value: {
          english: 'Using Employee ID',
          arabic: 'باستخدام الرقم الوظيفي'
        },
        sequence: 1
      },
      {
        value: {
          english: 'Using CSV file',
          arabic: 'باستخدام ملفCSV '
        },
        sequence: 2
      },
      {
        value : {
          english: "Using Transaction ID",
          arabic: "باستخدام رقم المعاملة"
        },
        sequence: 3
      },
     /*  {
        value : {
          english: "Transaction Inquiry",
          arabic: "الاستعلام عن المعاملات"
        },
        sequence: 4
      } */
    ]);
    this.reassignDetailsForm = this.createReassignDetailsForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  /**
  * This method is used to initialise the form template
  */
  createReassignDetailsForm() {

    return this.fb.group({
      empID: [null, { validators: Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9]+$')]) }],
      reassignType: this.fb.group({
        english: ['Using Employee ID', { validators: Validators.compose([Validators.required]), updateOn: 'blur' }],
        arabic: [null]
      }),
      roleSelection: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      targetEmpID: [null, { validators: Validators.compose([Validators.pattern('[a-zA-Z0-9]+$')]) }],
    });
  }

  getBulkReassignType(event) {
    this.alertService.clearAlerts();
    this.initializeNewChoice();
    if (event == 'Using Employee ID') {
      this.showEmployeeDetails = true;
      this.showReassignUsingTransactionID = false;
      this.showCSVFile = false;
      this.showTranactionInquiry = false;
    }
    else if (event == 'Using CSV file') {
      this.showEmployeeDetails = false;
      this.showReassignUsingTransactionID = false;
      this.showCSVFile = true;
      this.showTranactionInquiry = false;
    }
    else if(event == 'Using Transaction ID'){
      this.showEmployeeDetails = false;
      this.showReassignUsingTransactionID = true;
      this.showCSVFile = false;
      this.showTranactionInquiry = false;
    } else if(event == 'Transaction Inquiry'){
      this.showEmployeeDetails = false;
      this.showReassignUsingTransactionID = false;
      this.showCSVFile = false;
      this.showTranactionInquiry = true;
    }

  }

  initializeNewChoice(){
    this.alertService.clearAlerts();
    this.roles = [];
    this.roleDetailsSelected = '';
    this.roleList = new LovList([]);
    this.openTargetEmployeeDetails = false;
    this.openEmployeeDetails = false;
    this.lookupClicked = false;
    this.reassignDetailsForm.get('empID').setValue('');
    this.reassignDetailsForm.get('targetEmpID').setValue('');
     this.transactions = [];
    this.transactions.push({transactionValue:"",employeeValue:"",valid:true});
    this.transactionSaved = false;
  }
 

  getTargetEmployeeDetails() {
    this.openTargetEmployeeDetails = false;
    this.reassignService.getTargetEmployeeDetails(this.reassignDetailsForm.value.targetEmpID).subscribe(res => {
      this.openTargetEmployeeDetails = true;
      this.targetEmpName = res.longNameArabic;
      this.invalidTarget = false;
      if (res.gosiscp != 'null') {
        this.targetRoles = (JSON.parse(res.gosiscp))[0].role;

        this.commonRole();
      }
    },
      error => {
        this.openTargetEmployeeDetails = false;
        this.isErrorOnProfile = true;
        if (this.lang == 'en') {
          this.errorMessage = error.error.message.english;
        }
        else {
          this.errorMessage = error.error.message.arabic;
        }
        this.invalidTarget = true;
        //this.alertService.showError(error.error.message);
      })
  }
  onLookUp() {
    this.alertService.clearAlerts();
    this.clearAll();
    if (this.reassignDetailsForm.status == 'VALID') {
      if (this.reassignDetailsForm.value.targetEmpID) {
        this.getTargetEmployeeDetails();
      }
      this.reassignService.getEmployeeDetails(this.reassignDetailsForm.value.empID).subscribe(res => {
        this.roleArray = [];
        this.isErrorOnProfile = false;
        this.lookupClicked = true;
        this.invalidSource = false;

        this.reassignService.getTransactionCount(this.reassignDetailsForm.value.empID).subscribe(res => {
          this.count = res.taskCountResponse;
          if (this.count == 0) {
            this.isCount = true;
          }
          else {
            this.isCount = false;
          }
        });

        let list: any = [];
        this.empName = res.longNameArabic;
        this.userId = res.userId;
        if (res.gosiscp != 'null') {
          this.isRoles = true;
          this.roles = (JSON.parse(res.gosiscp))[0].role;
          this.roleArray = (JSON.parse(res.gosiscp))[0].role;
          for (var i = 0; i < this.roleArray.length; i++) {
            if (this.roleArray[i] != 135) {
              list.push(this.roleArray[i]);
            }
          }
          this.roleArray = list;
          list = [];

          for (var i = 0; i < this.roles.length; i++) {
            if (this.roles[i] != 135) {
              list.push({
                value: {
                  english: this.roles[i],
                  arabic: this.roles[i]
                },
                sequence: i
              })
            }
          }
          if (!this.reassignDetailsForm.value.targetEmpID) {
            this.roleList = new LovList(list);
          }
          if (this.reassignDetailsForm.value.targetEmpID && !this.invalidTarget) {
            this.openEmployeeDetails = true;
          }
        }
        else {
          this.isRoles = false;
        }
        this.openEmployeeDetails = true;
        this.commonRole();

      },
        error => {
          this.isErrorOnProfile = true;
          this.openEmployeeDetails = false;
          if (this.lang == 'en') {
            this.errorMessage = error.error.message.english;
          }
          else {
            this.errorMessage = error.error.message.arabic;
          }
          this.invalidSource = true;
          // this.alertService.showError(error.error.message);
        })

    }
    else {
      this.alertService.showErrorByKey('TEAM-MANAGEMENT.PROVIDE-MANDATORY-INFO')
      this.reassignDetailsForm.markAllAsTouched();
      this.reassignDetailsForm.get('empID').setValidators([Validators.required]);
      this.reassignDetailsForm.get('empID').setErrors({ valid: false });
    }

  }
  

  commonRole() {
    let commonList: any = [];
    this.commonValues = [];

    if (this.roleArray?.length == 0 || this.roleArray == undefined) {
      this.isCommonValue = true;
    }
    else {
      const commonValues = this.targetRoles ? this.roleArray.filter(value => this.targetRoles.includes(value)) : "";
      if (commonValues.length != 0) {
        this.isCommonValue = true;
        this.commonValues = commonValues;
        for (var i = 0; i < this.commonValues.length; i++) {
          commonList.push({
            value: {
              english: this.commonValues[i],
              arabic: this.commonValues[i]
            },
            sequence: i
          })
        }
        this.roleList = new LovList(commonList);
      }
      else {
        this.isCommonValue = false;
        if (this.reassignDetailsForm.value.targetEmpID) {
          this.roleList = new LovList([]);
        }
      }
    }
  }

  reassignTransaction() {
    this.alertService.clearAlerts();
    if (this.isCount != true) {
      let roles: any = [];
      if (this.roleDetailsSelected.length != 0) {
        this.noRole = false;
        for (var i = 0; i < this.roleDetailsSelected.length; i++) {
          roles[i] = parseInt(this.roleDetailsSelected[i].english);
        }
        this.reassignService.reassignTransaction(roles, this.reassignDetailsForm.value.empID, this.reassignDetailsForm.value.targetEmpID).subscribe(res => {
          this.reassignDetailsForm.get('empID').clearValidators();
          this.alertService.showSuccess(res?.message);
          this.reassignDetailsForm.get('empID').setValue('');
          this.reassignDetailsForm.get('targetEmpID').setValue('');
          // this.reassignDetailsForm.updateValueAndValidity();
          this.openEmployeeDetails = false;
          this.openTargetEmployeeDetails = false;
        },
          error => {
            //this.errorMessage = error.error.message.english;
            this.alertService.showError(error.error.message);
          })
      } else {
        this.noRole = true;
      }
    }
  }

  onDownload() {

    var CsvString = "";
    var csvRows = [];
    var csvHeading = "رقم" + "%20" + "المعاملة/ Transaction%20Trace%20Number ,إعادة " + "%20" + "اسناد " + "%20" + "المعاملة " + "%20" + "الى " + "%20" + "( اختياري )" + "/" + "%20" + "Reassign%20the%20transaction%20to%20,توضيح";

    let arrayItems: any = [
      //["رقم المعاملة / Transaction number", "إعادة اسناد المعاملة الى ( اختياري ) /  Reassign   the transaction to", "توضيح"],
      ["10000001", "DM00001", "في " + "%20" + "هذي " + "%20" + "الحالة " + "%20" + "سيتم " + "%20" + "إعادة " + "%20" + "اسناد " + "%20" + "المعاملة " + "%20" + "مباشرة " + "%20" + "الى " + "%20" + "DM00001"],
      ["10000002", "", "في " + "%20" + "هذي" + "%20" + "الحالة" + "%20" + "سيتم" + "%20" + "إعادة" + "%20" + "اسناد" + "%20" + "المعاملة" + "%20" + "الى" + "%20" + "موظف" + "%20" + "يملك" + "%20" + "الصلاحية" + "%20" + "المطلوبة" + "%20" + "للمعاملة"],
      ["", "", "يرجى " + "%20" + "حذف " + "%20" + "الأمثلة" + "%20" + "قبل" + "%20" + "ادخال" + "%20" + "المعاملات" + "%20" + "المطلوب" + "%20" + "إعادة" + "%20" + "إسنادها"]
    ];
    csvRows.push(csvHeading + "\n");
    arrayItems.forEach((RowItem: any) => {
      var csvRow = "";
      RowItem.forEach((colItem: any) => {
        csvRow += colItem + ',';
      })
      csvRows.push(csvRow + "\n");
    })
    CsvString = csvRows.join("");
    CsvString = "data:application/csv;charset=utf-8,%EF%BB%BF " + CsvString;
    var x = document.createElement("A");
    x.setAttribute("href", CsvString);
    x.style.columnWidth = '100px';
    x.setAttribute("download", "sample.csv");
    document.body.appendChild(x);
    x.click();
    this.downloadArray = [];
  }

  onFileSelected(event: any) {
    this.isCSVUploaded = false;
    const file: File = event.target.files[0];
    this.file = file;

    if (file) {

      this.parseCSV(file);

    }

  }

  parseCSV(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csvData = e.target.result;
      const lines = csvData.split('\r\n');
      for (var i = 1; i < lines.length; i++) {

        let newLine = lines[i].split(',');
        this.userIDs[i] = newLine[1];
        this.transactionIDs[i] = newLine[0];

      }
      // const csvRegNumber = (<string>csvData).split(/\r\n|\n/);
      this.csvLines = lines;
      if (this.file.name != "نموذج إعادة اسناد المعاملات_UTF-8.csv") {

      }
    };

    reader.readAsText(file);

  }

  uploadCSVFile(file) {
    const transaction = new Transaction()

    if (this.file) {
      if (this.file?.name == "نموذج إعادة اسناد المعاملات_UTF-8.csv") {
        for (var i = 0; i <= this.downloadArray.length - 2; i++) {
          transaction?.transactionUserMap.push({
            transactionTraceId: this.downloadArray[i][0],
            userId: this.downloadArray[i][1]
          })
        }

      }
      else {
        for (var i = 1; i < this.transactionIDs.length; i++) {
          if (this.transactionIDs[i] != undefined && this.transactionIDs[i] != '') {
            this.transactionIDs[i] = this.transactionIDs[i].replace(/\s/g, "")
            transaction.transactionUserMap.push({
              transactionTraceId: this.transactionIDs[i],
              userId: this.userIDs[i]
            })
          }
        }

      }

      this.isReset = false;
      this.reassignService.csvReassignTransaction(transaction).subscribe(res => {
        this.alertService.showSuccess(res?.message);
        this.isCSVUploaded = true;
        this.file = undefined;
        this.bulkFile = undefined;
        this.isReset = true;
        this.transactionIDs = [];
        this.userIDs = [];
        this.csvLines = [];
        setTimeout(() => {
          this.alertService.clearAlerts();
        }, 5000);
      })
    }
    else {
      this.transactionIDs = [];
      this.userIDs = [];
      this.csvLines = [];
      this.uploadFailed = true;
      this.alertService.showErrorByKey('TEAM-MANAGEMENT.PROVIDE-MANDATORY-INFO');
    }
  }


  onChange(evnt) {
    this.isErrorOnProfile = false;
    this.invalidTarget = false;
    this.openEmployeeDetails = false;
    this.openTargetEmployeeDetails = false;
    if (this.reassignDetailsForm.value.empID != null) {
      if (this.reassignDetailsForm.value.empID.toLowerCase().replace(/\s/g, '') == this.reassignDetailsForm.value.targetEmpID?.toLowerCase().replace(/\s/g, '')) {
        this.lookupClicked = true;
        this.alertService.showErrorByKey('TEAM-MANAGEMENT.SAME-SOURCE-TARGET-ERROR');
      }
      else {
        this.alertService.clearAllErrorAlerts();
        this.lookupClicked = false;
      }
    }
  }

  onTargetChange(evnt) {
    if(!this.reassignDetailsForm.value.targetEmpID){
      this.targetRoles = [];
      this.commonRole();
      this.onLookUp();
    }
    this.invalidTarget = false;
    this.isErrorOnProfile = false;
    this.openTargetEmployeeDetails = false;
    this.openEmployeeDetails = false;
    if (this.reassignDetailsForm.value.targetEmpID != null) {
      if (this.reassignDetailsForm.value.targetEmpID.toLowerCase().replace(/\s/g, '') == this.reassignDetailsForm.value.empID.toLowerCase().replace(/\s/g, '')) {
        this.lookupClicked = true;
        this.alertService.showErrorByKey('TEAM-MANAGEMENT.SAME-SOURCE-TARGET-ERROR');
      }
      else {
        this.alertService.clearAllErrorAlerts();
        this.lookupClicked = false;
      }
    }
  }

  clearAll() {
    this.roles = [];
    this.roleDetailsSelected = '';
    this.roleList = new LovList([]);
   
  }

  csvDeleted(){
  this.isCSVUploaded=true;
  }

   validate(evt) {
    var theEvent = evt || window.event;
    if (theEvent.type === 'paste') {
        key = theEvent.clipboardData.getData('text/plain');
    } else {
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|/;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  addNewTransaction(){
    this.transactions.push({transactionValue:"",employeeValue:"",valid:true});
  }

  removeTrn(index){
    this.transactions.forEach( (_trnsaction:TransactioUI,i) => {
        if(i == index){
            this.transactions.splice(i,1);
        }
    })  
  }

  reassignTransactionByTrnNumber(){
   let valid  = true;
   for (var i = 0; i < this.transactions.length; ++i) {
    let trnId = this.transactions[i].transactionValue;
    if(trnId == null || trnId == ""){ 
      this.transactions[i].valid = false;       
        valid = false;
    }else{
      this.transactions[i].valid = true;       
    }
   }
   if(!valid)return false;
   const transaction = new Transaction();
   for (var i = 0; i < this.transactions.length; ++i) {
     transaction.transactionUserMap.push({
      transactionTraceId:parseInt(this.transactions[i].transactionValue),
      userId: this.transactions[i].employeeValue
    })
  }
    this.reassignService.csvReassignTransaction(transaction).subscribe(res => {
      this.initializeNewChoice();
      this.alertService.showSuccess(res?.message);
    },
    error => {
      this.alertService.showError(error.error.message);
    })
 
 
  }
  
  checkTrnValue(event:any){
    event.target.value = event.target.value.replace(/[^0-9]/g, '').replace(/(\\..*?)\\..*/g, '$1');
    event.target.style.color = "#bbbbbb";
    event.target.style.borderColor = "#bbbbbb";
  }

  checkEmpValue(event:any){
    event.target.value = event.target.value.replace(/[^0-9a-zA-Z]/g, '').replace(/(\\..*?)\\..*/g, '$1');
  }

   
   
  downloadExcelSheet(){
        this.bpmRequest = {
          join: {
            ignoreCase: BPMTaskConstants.BPM_IGNORECASE,
            joinOperator: BPMOperators.AND,
            tableName: BPMTaskConstants.WFTASK
          },
          limit:{
            start:0,
            end:200
          },
        taskQuery: {
          displayColumnList:null,
            ordering: {
                clause: {
                    sortOrder: SortDirectionEnum.ASCENDING,
                    column: "assignedDate"
                }
            },
          predicate: {
            assignmentFilter: AssignmentFilter.MY,
              predicate: {
                  clause: [
                      {
                        column: { columnName: TransactionState.STATE },
                        value: BPMTaskConstants.TRN_STATE_ASSIGNED,
                        operator: BPMOperators.EQUAL,
                      }
                  ]
              }
          },
          optionalInfoList: {
              taskOptionalInfo: "Payload"
          }
      }
      }

    this.httpSubscriptionClaimed = this.workflowService.fetchBPMTaskList(this.bpmRequest, this.userId, this.fromTeam)
    .subscribe((response: BPMResponse) => {
    let trn_id_header =  this.getTranslationBilingualByKey("TEAM-MANAGEMENT.CSV-HEADER-TRN-ID").arabic;
    let trn_title_header =  this.getTranslationBilingualByKey("TEAM-MANAGEMENT.CSV-HEADER-TRN-TITLE").arabic;
    const headers = [trn_id_header,trn_title_header ];
    const columns = ["referenceNo","titleArabic" ];
    let tasks = [];
     
    response.tasks.forEach(task => {
      let taskDetails = {
        referenceNo: task.referenceNo,
        titleArabic:   task.titleArabic ,
      }
      tasks.push(taskDetails);
    })
    const csvData = this.convertToCsv(tasks,headers, columns);
    this.downloadCSVFile(csvData, 'transactions.csv', 'text/csv');
    })
  }

  convertToCsv(data: any[], headers: string[],columns): string {
    let csv = '';
    csv += headers.join(',') + '\n';
    data.forEach(row => {
      const values = [];
      columns.forEach(col => {
        values.push(row[col] || '');
      });
      csv += values.join(',') + '\n';
    });
    return csv;
  }

  downloadCSVFile(data: string, filename: string, type: string) {
     const blob = new Blob([data], { type: type });
    var universalBOM = "\uFEFF";
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('href', 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM+data));
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    
  }


  getTranslationBilingualByKey(key:string){
    let message = new BilingualText();
    message.english =  this.translate.instant(key);
    message.arabic =  this.translate.instant(key);
    return message;
  }
}
