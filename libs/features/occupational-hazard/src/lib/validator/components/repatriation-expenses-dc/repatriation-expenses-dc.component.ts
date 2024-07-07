import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ClaimWrapper } from '../../../shared';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { RepatriationDto, overallRepatriation } from '../../../shared/models/dead-body-repatriation';

@Component({
  selector: 'oh-repatriation-expenses-dc',
  templateUrl: './repatriation-expenses-dc.component.html',
  styleUrls: ['./repatriation-expenses-dc.component.scss']
})
export class RepatriationExpensesDcComponent implements OnInit,OnChanges {
  totalExpense=0;
  @Input() allowanceDetailsWrapper: ClaimWrapper;
  @Input() modifiedRepatriation: RepatriationDto;
  lang = 'en';
  newChanges: boolean = false;
  modifiedExpense: overallRepatriation[] = [];
  totalOldAmount: number = 0;
  totalNewAmount: number = 0;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) { }
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.allowanceDetailsWrapper) {
      this.getTotalExpense();
    }
    if (changes && changes.modifiedRepatriation) {
      if(this.modifiedRepatriation.modifiedDeadBodyRepatriationDto.length > 0) {
        this.newChanges = true;
      } else {
        this.newChanges = false;
      }
      this.getModifiedData(this.modifiedRepatriation);
    }
  }
  getTotalExpense(){
    this.allowanceDetailsWrapper?.claimDetails[0].claimItem.forEach(item=>{
      this.totalExpense = this.totalExpense + item.totalAmount;
    })
  }
  
  getModifiedData(modifiedRepatriation) {
    if(modifiedRepatriation.deadBodyRepatriationDto.length > 0) {
      modifiedRepatriation.deadBodyRepatriationDto.forEach((element, i) => {
        // this.modifiedExpense = [];
        // if (this.modifiedExpense.length == 0) {
        //   this.modifiedExpense.push(element)
        // }
        let data = {
            claimType: element.claimType,
            oldAmount: element.amount,
            newAmount: element.amount
        }
        this.modifiedExpense.push(data);
      });
    }
    if(modifiedRepatriation.modifiedDeadBodyRepatriationDto.length > 0) {
      modifiedRepatriation.modifiedDeadBodyRepatriationDto.forEach(element => {
        this.modifiedExpense.forEach(item => {
          if (item.claimType.english === element.claimType.english) {
            item.newAmount = element.amount;
          }
        })
      })
    }
    this.modifiedExpense.forEach(element => {
      this.totalOldAmount = this.totalOldAmount + element.oldAmount;
      this.totalNewAmount = this.totalNewAmount + element.newAmount;
    })
  }

  
  

}
