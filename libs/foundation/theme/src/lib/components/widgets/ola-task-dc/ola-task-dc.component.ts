import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, Inject,  } from '@angular/core';
import * as moment from 'moment';
import { BPMOperators, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gosi-ola-task-dc',
  templateUrl: './ola-task-dc.component.html',
  styleUrls: ['./ola-task-dc.component.scss']
})
export class OlaTaskDcComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * input variables
   */
  @Input() assignedDate: Date;
  @Input() transactionCreationDate: Date;
  @Input() olaAvailable: boolean;
  @Input() dueDate: Date;
  @Input() slaAvailable : boolean;
  @Input() transactionDueDate: Date;
  /**
   * local variables
   */
  taskPriority: number;
  taskPrioritySLA: number;
  timeRemaining: string;
  currentValue: number;
  currentSlavalue: number;
  maxOla: number;
  maxValue: number;
  remainingTime: number;
  maxSlavalue: number;
  olaLabel: string;
  slaLabel: string;
  interval;
  slaInterval;
  slaRemainingTime: number;
  slaTimeRemaining: string;
  lang = 'en';
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.assignedDate && changes.assignedDate.currentValue)
        this.assignedDate = changes.assignedDate.currentValue;
      if (changes.transactionCreationDate && changes.transactionCreationDate.currentValue)
        this.transactionCreationDate = changes.transactionCreationDate.currentValue;
      if (changes.dueDate && changes.dueDate.currentValue) this.dueDate = changes.dueDate.currentValue;
      if (changes.transactionDueDate && changes.transactionDueDate.currentValue) this.transactionDueDate = changes.transactionDueDate.currentValue;
      if (changes.olaAvailable && changes.olaAvailable.currentValue)
        this.olaAvailable = changes.olaAvailable.currentValue;
      if (changes.slaAvailable && changes.slaAvailable.currentValue)
        this.slaAvailable = changes.slaAvailable.currentValue;
      if (this.olaAvailable === false || this.dueDate?.toString() === BPMOperators.NULL) {
        this.assignedDate = undefined;
      } else {
        this.calculateOLA();
      }
      if (this.slaAvailable === false || this.transactionDueDate?.toString() === BPMOperators.NULL) {
        this.transactionCreationDate = undefined;
      } else {
        this.calculateSLA();
      }
    }
  }
      

  handleBreach() {
    this.currentValue = 100;
    this.olaLabel = 'OLA-BREACHED';
    this.taskPriority = 1;
  }

  
  handleSLABreach() {
    this.currentSlavalue = 100;
    this.slaLabel = 'SLA-BREACHED';
    this.taskPrioritySLA = 1;
  }


  /**
   * method to calculate SLA
   */
  calculateSLA(){ 
    if (this.transactionCreationDate && this.transactionDueDate) {
      this.slaInterval = setInterval(() => {
        const currentDate = moment(new Date());
        const expireDate = moment(new Date(this.transactionDueDate));
        if (moment(expireDate) < currentDate) {
          this.handleSLABreach();
        } else {
          const duration = moment.duration(moment(expireDate).diff(currentDate)).asSeconds();
          this.slaRemainingTime = duration;
          const endingDate = moment(expireDate);
          const startDuration = moment.duration(endingDate.diff(currentDate));
          const diffTime = startDuration.days();
          this.maxSlavalue = moment.duration(endingDate.diff(this.transactionCreationDate)).asSeconds();
          if (diffTime >= 7) {
            this.slaTimeRemaining = diffTime.toString();
            this.taskPriorityValuesSLA(this.slaRemainingTime);
            this.slaLabel = 'SLA-DAYS-LABEL';
          } else if (diffTime > 0 && diffTime < 7) {
            this.slaTimeRemaining = diffTime.toString();

            if (this.slaTimeRemaining === '1') {
              this.slaLabel = 'SLA-DAY-LABEL';
            } else if(this.slaTimeRemaining === '2'){
              this.slaLabel = 'SLA-TWO-DAYS-LABEL';
            } else if(diffTime > 10){
              this.slaLabel = 'SLA-DAY-LABEL';
            }
             else {
              this.slaLabel = 'SLA-DAYS-LABEL';
            }
            this.taskPriorityValuesSLA(this.slaRemainingTime);
          }
          if (diffTime === 0) {
            const differenceHours = Math.round(this.slaRemainingTime / 3600);
            const differenceMinutes = Math.round(this.slaRemainingTime / 60);
            if (differenceHours === 1) {
              this.slaTimeRemaining = '1';
              this.slaLabel = 'SLA-HOUR-LABEL';
            } else if (differenceHours < 1) {
              if (differenceMinutes <= 1) {
                this.slaTimeRemaining = Math.round(duration).toString();
                this.slaLabel = 'SLA-SECONDS-LABEL';
              } else {
                this.slaTimeRemaining = Math.round(differenceMinutes).toString();
                this.slaLabel = 'SLA-MINUTES-LABEL';
              }
            } else {
              this.slaTimeRemaining = Math.round(differenceHours).toString();
              this.slaLabel = 'SLA-HOURS-LABEL';
            }

            this.taskPriorityValuesSLA(this.slaRemainingTime);
          }
        }
      }, 1000);
    }
  }

 
  /**
   * method to calculate OLA
   */
  calculateOLA(){ 
    if (this.assignedDate && this.dueDate) {
      this.interval = setInterval(() => {
        const currentDate = moment(new Date());
        const expireDate = moment(new Date(this.dueDate));
        if (moment(expireDate) < currentDate) {
          this.handleBreach();
        } else {
          const duration = moment.duration(moment(expireDate).diff(currentDate)).asSeconds();
          this.remainingTime = duration;
          const endingDate = moment(expireDate);
          const startDuration = moment.duration(endingDate.diff(currentDate));
          const diffTime = startDuration.days();
          this.maxValue = moment.duration(endingDate.diff(this.assignedDate)).asSeconds();
          if (diffTime >= 7) {
            this.timeRemaining = diffTime.toString();
            this.taskPriorityValues(this.remainingTime);
            this.olaLabel = 'OLA-DAYS-LABEL';
          } else if (diffTime > 0 && diffTime < 7) {
            this.timeRemaining = diffTime.toString();

            if (this.timeRemaining === '1') {
              this.olaLabel = 'OLA-DAY-LABEL';
            } else {
              this.olaLabel = 'OLA-DAYS-LABEL';
            }
            this.taskPriorityValues(this.remainingTime);
          }
          if (diffTime === 0) {
            const differenceHours = Math.round(this.remainingTime / 3600);
            const differenceMinutes = Math.round(this.remainingTime / 60);
            if (differenceHours === 1) {
              this.timeRemaining = '';
              this.olaLabel = 'OLA-HOUR-LABEL';
            } else if (differenceHours < 1) {
              if (differenceMinutes < 1) {
                if(Math.round(duration)==1){
                  this.olaLabel = 'OLA-SECOND-LABEL';
                }else if(Math.round(duration)==2){
                  this.timeRemaining ='';
                  this.olaLabel = 'OLA-TWO-SECONDS-LABEL';
                } 
                else if(Math.round(duration)>10){
                  this.timeRemaining = Math.round(duration).toString();
                  this.olaLabel = 'OLA-SECOND-LABEL';
                }else{
                  this.timeRemaining = Math.round(duration).toString();
                  this.olaLabel = 'OLA-SECONDS-LABEL';
                }
              }else if(differenceMinutes == 1 ){
                this.timeRemaining ='';
                this.olaLabel = 'OLA-MINUTE-LABEL';
              } else if(differenceMinutes == 2){
                this.timeRemaining = '';
                this.olaLabel = 'OLA-TWO-MINUTES-LABEL';
              } else if(differenceMinutes > 10){
                this.timeRemaining = Math.round(differenceMinutes).toString();
                this.olaLabel = 'OLA-MINUTE-LABEL';
              }
              else {
                this.timeRemaining = Math.round(differenceMinutes).toString();
                this.olaLabel = 'OLA-MINUTES-LABEL';
              }
            }else if(differenceHours === 2){
              this.timeRemaining = '';
              this.olaLabel = 'OLA-TWO-HOURS-LABEL';
            } else if(differenceHours > 10){
              this.timeRemaining = Math.round(differenceHours).toString();
              this.olaLabel = 'OLA-HOUR-LABEL';
            }
            else {
              this.timeRemaining = Math.round(differenceHours).toString();
              this.olaLabel = 'OLA-HOURS-LABEL';
            }

            this.taskPriorityValues(this.remainingTime);
          }
        }
      }, 1000);
    }
  }
  /**
   *
   * @param remainTime method to set ola priority
   */
  taskPriorityValues(remainTime: number) {
    const high = 1;
    const medium = 3;
    const low = 5;
    this.currentValue = 100 - (remainTime / this.maxValue) * 100;
    if (remainTime <= (this.maxValue - ((this.maxValue * 89.92) / 100))) {
      this.taskPriority = high;
    } else if (remainTime <= (this.maxValue - ((this.maxValue * 73.82) / 100))) {
      this.taskPriority = medium;
    } else {
      this.taskPriority = low;
    }
  }

  /**
   *
   * @param remainTime method to set sla priority
   */
  taskPriorityValuesSLA(remainTime: number) {
    const high = 1;
    const medium = 3;
    const low = 5;
    this.currentSlavalue = 100 - (remainTime / this.maxSlavalue) * 100;
    if (remainTime <= (this.maxSlavalue - ((this.maxSlavalue * 89.91) / 100))) {
      this.taskPrioritySLA = high;
    } else if ( remainTime <= (this.maxSlavalue - ((this.maxSlavalue * 74.98) / 100))) {
      this.taskPrioritySLA = medium;
    } else {
      this.taskPrioritySLA = low;
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}


