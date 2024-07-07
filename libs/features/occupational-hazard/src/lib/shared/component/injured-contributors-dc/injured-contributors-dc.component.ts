import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { InjuredContributorsDTO } from '../../models/injured-contributors-DTO';
import { LanguageToken, RouterConstants } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'oh-injured-contributors-dc',
  templateUrl: './injured-contributors-dc.component.html',
  styleUrls: ['./injured-contributors-dc.component.scss']
})
export class InjuredContributorsDcComponent implements OnInit, OnChanges {
  
  //local variables
  lang = '';
  /**
   * Input variables
   */
  @Input() injuredContributorList: InjuredContributorsDTO[] = [];

   /**x
   * Output variables
   */
   @Output() viewInjury: EventEmitter<InjuredContributorsDTO> = new EventEmitter();

  constructor( readonly router: Router, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) { }
  ngOnInit(): void {
   
    this.language.subscribe(language => {
      this.lang = language;
    });   
  
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes.injuredContributorList && changes.injuredContributorList.currentValue){
      this.injuredContributorList = changes.injuredContributorList.currentValue;     
    }
  }
  navigateToInjuryDetails(injury: InjuredContributorsDTO){
    this.viewInjury.emit(injury);
  }
  navigateOnLinkClick(injury: InjuredContributorsDTO) {   
    this.router.navigate([RouterConstants.ROUTE_INDIVIDUAL(injury.socialInsuranceNo)]);
  }
}
