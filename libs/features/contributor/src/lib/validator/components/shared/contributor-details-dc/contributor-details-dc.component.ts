import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonIdentity, Contributor, checkBilingualTextNull, getIdentityByType } from '@gosi-ui/core';

@Component({
  selector: 'cnt-contributor-details-dc',
  templateUrl: './contributor-details-dc.component.html',
  styleUrls: ['./contributor-details-dc.component.scss']
})
export class ContributorDetailsDcComponent implements OnInit {
   //Output variables
   @Output() onEdit: EventEmitter<null> = new EventEmitter();

  // Local Variables
  age:number;
  nin:CommonIdentity;
  @Input() contributor :Contributor;
  @Input() canEdit: boolean;
  dobAge: any;

  constructor() { }

  ngOnInit(): void {
    //console.log(this.contributor,'contri dc init');
    this.dobAge = this.formatContributorDetails(
      this.contributor?.person?.birthDate?.hijiri,
      this.age
    ); 
  }

  formatContributorDetails(birthDate: string, age: number) {
    return `${birthDate}(Age${age})`;
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if(changes && changes?.contributor){
      this.age=this.contributor?.person?.ageInHijiri ;
      this.nin=getIdentityByType(this.contributor?.person?.identity,this.contributor?.person?.nationality?.english);
    }
  }
  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }
   // method to emit edit values
   onEditDetails() {
    this.onEdit.emit();
  }

}
