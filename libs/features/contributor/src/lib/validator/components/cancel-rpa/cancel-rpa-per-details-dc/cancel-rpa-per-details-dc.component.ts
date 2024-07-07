import { Component, Input, OnInit } from '@angular/core';
import { checkBilingualTextNull } from '@gosi-ui/core';
import { Contributor } from '@gosi-ui/features/contributor/lib/shared/models';


@Component({
  selector: 'cnt-cancel-rpa-per-details-dc',
  templateUrl: './cancel-rpa-per-details-dc.component.html',
  styleUrls: ['./cancel-rpa-per-details-dc.component.scss']
})
export class CancelRpaPerDetailsDcComponent implements OnInit {


  @Input() contributor = new Contributor();
  constructor() { }

  ngOnInit(): void {
  }

     /**
   * This method is to check if the data is null or not
   * @param control
   */
     checkNull(control) {
      return checkBilingualTextNull(control);
    }

}
