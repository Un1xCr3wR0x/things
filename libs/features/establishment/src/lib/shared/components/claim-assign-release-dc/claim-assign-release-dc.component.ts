import { NullVisitor } from '@angular/compiler/src/render3/r3_ast';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, TransactionService } from '@gosi-ui/core';
import moment from 'moment';

@Component({
  selector: 'est-claim-assign-release-dc',
  templateUrl: './claim-assign-release-dc.component.html',
  styleUrls: ['./claim-assign-release-dc.component.scss']
})
export class ClaimAssignReleaseDcComponent implements OnInit,OnChanges {
  // Input variables 
  @Input() isUnclaimed:boolean;
  @Input() payload;
  @Input() taskId:string;
  @Output() assign:EventEmitter<null>=new EventEmitter();
  @Output() release:EventEmitter<null>=new EventEmitter();
  // variables 
  minDiff='89';
  seconds='0';
  constructor(
    private router: Router,
    private alertService: AlertService,
    readonly transactionService: TransactionService
  ) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.isUnclaimed){
      this.isUnclaimed=changes.isUnclaimed.currentValue;
    }
    if(changes && changes.payload.currentValue){
      this.payload=changes.payload.currentValue;
      this.calculateTimeDiff();
    }
    
  }
  claimTask(){
    this.calculateTimeDiff();
    this.transactionService.accquireTasks(this.taskId).subscribe(
      res=>{
        const value = {
          english:
            'Transaction has been assigned . You can now process the transaction or release it back to Establishment inbox ',
          arabic: 'تم إسناد المعاملة، بإمكانك البدء بمعالجة المعاملة او ارجعاها إلى صندوق بريد المنشاة '
        };
        this.alertService.showSuccess(value);
        this.isUnclaimed = false;
        this.assign.emit();
      },
      err=>{
        const value = {
          english: 'This Transaction can’t be assigned. Another admin have already assigned it to him ',
          arabic: 'لا يمكن اسناد المعاملة. لقد تم اسناد المعاملة من قبل مشرف آخر'
        };
        this.router.navigate(['home/transactions/list/todolist']);
        this.alertService.showError(value);
      }
    );
  }
  releaseTask(){
    this.minDiff='89';
    this.seconds='0';
    this.payload.claimTaskExpiry='NULL';
    this.transactionService.releaseTasks(this.taskId).subscribe(
      res=>{
        const value = {
          english: 'Transaction released to Establishment Inbox',
          arabic: 'تم إعادة تعيين المعاملة إلى صندوق المنشأة'
        };
        this.alertService.showSuccess(value);
        this.isUnclaimed = true;
        this.release.emit();
      }
    );
  }
  calculateTimeDiff(){
    var currentDate=this.payload.currentDate;
    var convertedDate=moment.tz(currentDate,'Asia/Riyadh');
    var expiryDate=this.payload.claimTaskExpiry;
    var formatedDate=moment(convertedDate.format(),'DD-MM-YYYY HH:mm:ss');
    var formatedExpiryDate=moment(expiryDate,'DD-MM-YYYY HH:mm:ss');
    if(expiryDate === 'NULL'){
      this.minDiff='89';
      this.seconds='0';
    }else{
      this.minDiff=Math.floor(formatedExpiryDate.diff(formatedDate,'seconds')/60).toString();
      var secDiff=formatedExpiryDate.diff(formatedDate,'seconds');
      this.seconds=(secDiff % 60).toString();
    }
    
  }
  timerStopped(){
    this.minDiff='89';
    this.seconds='0';
    this.isUnclaimed = true;
    this.release.emit();
  }

}
