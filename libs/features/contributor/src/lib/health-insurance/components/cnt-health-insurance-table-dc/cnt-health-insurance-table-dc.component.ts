import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {BilingualText, LanguageEnum, Lov, LovList} from "@gosi-ui/core";
import {InsuranceClass} from "@gosi-ui/features/contributor/lib/shared/models/health-insurance-class";
import {DependentsRuleNin, DropDownItems} from "@gosi-ui/features/contributor";
import {DependentsRule} from "@gosi-ui/features/contributor/lib/shared/models/health-insurance-dependents-rule";
import {DependentsRuleEnum} from "@gosi-ui/features/contributor/lib/shared/models/health-insurance-dependents-enum";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'cnt-cnt-health-insurance-table-dc',
  templateUrl: './cnt-health-insurance-table-dc.component.html',
  styleUrls: ['./cnt-health-insurance-table-dc.component.scss']
})
export class CntHealthInsuranceTableDcComponent implements OnInit {
  @Input() contributorName:BilingualText;
  @Input() contributorNin:number;
  @Input() dateOfJoining:string;
  @Input() insuranceClass:string;
  @Input() counter:number;
  @Input() dependents:DependentsRule[];
  @Input() chosenDependents:string;
  @Input() insuranceClassOptions:InsuranceClass[];
  @Input() insuredViewFlag:boolean =false;
  @Input() uninsuredViewFlag:boolean =false;
  @Input() onHoldViewFlag:boolean = false;
  @Input() selectedLanguage:string ='en';
  @Output() checked:EventEmitter<number>;
  @Output() chosenDependentsRules:EventEmitter<DependentsRuleNin[]>;
  @Output() chosenInsuranceClass:EventEmitter<any>;


  selectedDependents:DependentsRuleNin[] = [];
  constructor() { }

  ngOnInit(): void {
  }
  formatInsuranceClass(insuranceClassOptions:InsuranceClass[]):DropDownItems[]
  {
    const formattedInsuranceClasses :DropDownItems[] = [];
    insuranceClassOptions.forEach((insuranceClass :InsuranceClass) => {
      formattedInsuranceClasses.push(Object.assign(new DropDownItems(insuranceClass.insuranceClass)),{id: insuranceClass.insuranceClassCode})
    })
    return formattedInsuranceClasses
  }

  formatDependents():LovList
  {
    const lovItems : Lov[] = [];
    const formattedDependentsRules :LovList = new LovList(lovItems);

    this.dependents.forEach((dependantRule)=>
    lovItems.push(
        Object.assign(new Lov(),
            {value: Object.assign(new BilingualText(),{arabic:dependantRule?.ruleNameAr, english: dependantRule?.ruleNameEn}),
                    sequence:dependantRule?.ruleId,
                    code: dependantRule?.ruleId})
    ));
    return formattedDependentsRules
  }

  handleMultiSelection(chosen: string[]){
    if(chosen.length>0){
      chosen.forEach(value =>{this.selectedDependents.push
      (Object.assign(new DependentsRuleNin(),
        {NIN:this.contributorNin,
          rule: this.getRule(value)
        }),)})
      this.chosenDependentsRules.emit(this.selectedDependents);
    }
  }

  handleSelection(contributorNIN:number){
        this.checked.emit(contributorNIN);
      }

  getRule(ruleReference:string):DependentsRule{
    if(this.selectedLanguage===LanguageEnum.ENGLISH)
       switch (ruleReference){
         case "Parents": return DependentsRuleEnum.parentsRule;
         case "Children": return DependentsRuleEnum.childrenRule;
         case "Wife": return DependentsRuleEnum.wifeRule;
         case "Husband": return DependentsRuleEnum.husbandRule;
    }else
       switch (ruleReference){
         case "الوالدين": return DependentsRuleEnum.parentsRule;
         case "الأبناء": return DependentsRuleEnum.childrenRule;
         case "الزوجة": return DependentsRuleEnum.wifeRule;
         case "الزوج": return DependentsRuleEnum.husbandRule;
    }
  }
  selectedInsuranceClass(event):void{
    const chosenClassWithNIN = {NIN: this.contributorNin, insuranceClass:event}
    this.chosenInsuranceClass.emit(chosenClassWithNIN);
  }
}
