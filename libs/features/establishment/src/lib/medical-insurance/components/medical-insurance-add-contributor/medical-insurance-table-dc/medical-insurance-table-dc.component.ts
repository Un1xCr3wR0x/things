import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent, formatDate } from '@gosi-ui/core';
import { fetchContributorSub } from '@gosi-ui/features/establishment/lib/shared/models/medical-insurnace-fatch-contributor-sub';

@Component({
  selector: 'est-medical-insurance-table-dc',
  templateUrl: './medical-insurance-table-dc.component.html',
  styleUrls: ['./medical-insurance-table-dc.component.scss']
})
export class MedicalInsuranceTableDcComponent extends BaseComponent implements OnInit {
  @Input() contributorSubList: fetchContributorSub;
  constructor() {
    super();
  }
  ngOnInit(): void {}

  protected readonly formatDate = formatDate;

  mapRequestStatus(status: number): string {
    let message: string = null;
    switch (status) {
      case 1:
        message = 'ESTABLISHMENT.REQUESTED';
        break;
      case 2:
        message = 'ESTABLISHMENT.IN_PROGRESS';
        break;
      case 3:
        message = 'ESTABLISHMENT.TO_BE_ACTIVATED';
        break;
      case 4:
        message = 'ESTABLISHMENT.ACTIVATED';
        break;
      case 5:
        message = 'ESTABLISHMENT.CANCELLED';
        break;
      case 6:
        message = 'ESTABLISHMENT.REJECTED';
        break;
      case 7:
        message = 'ESTABLISHMENT.DEACTIVATED';
        break;
      default:
        message = '';
    }
    return message;
  }
  mapPolicyStatus(status: number): string {
    let message: string = null;
    switch (status) {
      case 10:
        message = 'ESTABLISHMENT.ACTIVE';
        break;
      case 1:
        message = 'ESTABLISHMENT.ACTIVE';
        break;
      case 12:
        message = 'ESTABLISHMENT.EXPIRE';
        break;
    }
    return message;
  }
}
