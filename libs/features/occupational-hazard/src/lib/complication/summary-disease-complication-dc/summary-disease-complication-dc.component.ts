import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationTypeToken} from '@gosi-ui/core';
import { OhService } from '../../shared/services';
import { Complication } from '../../shared/models';

@Component({
  selector: 'oh-summary-disease-complication-dc',
  templateUrl: './summary-disease-complication-dc.component.html',
  styleUrls: ['./summary-disease-complication-dc.component.scss']
})
export class SummaryDiseaseComplicationDcComponent implements OnInit {
  /**
   * Local Variables
   */
  registationNo: number;
  /**
   * Input Variables
   */
  @Input() complicationDetails: Complication;
  @Input() socialInsuranceNo: number;
  @Input() establishment;
  @Input() complicationId: number;

  constructor(
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly activatedRoute: ActivatedRoute,
    readonly ohService: OhService,
    readonly router: Router
  ) {}

  /**
   * This method is for initialization tasks
   */
  ngOnInit() {
  }

}

