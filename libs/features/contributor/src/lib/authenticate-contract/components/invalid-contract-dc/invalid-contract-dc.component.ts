/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component,Inject ,Input} from '@angular/core';
import { Router } from '@angular/router';
import { QueryParams, RouterData, RouterDataToken } from '@gosi-ui/core';

@Component({
  selector: 'cnt-invalid-contract-dc',
  templateUrl: './invalid-contract-dc.component.html',
  styleUrls: ['./invalid-contract-dc.component.scss']
})
export class InvalidContractDcComponent {
 
  @Input() flag:boolean=false;

  constructor(@Inject(RouterDataToken) readonly routerData: RouterData, readonly router: Router) {}

  ngOnInit(): void {    
    if(this.routerData.priority===1){
      this.flag=true;
    } 
  }

  /** Method to navigate  to taminaty app. */
  navigateToTaminaty() {
    window.location.href = 'https://www.gosi.gov.sa/GOSIOnline/Login?locale=ar_SA';
  }
}
