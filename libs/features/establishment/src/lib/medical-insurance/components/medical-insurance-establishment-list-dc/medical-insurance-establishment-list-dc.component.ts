import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@gosi-ui/core';
import { BranchList, EstablishmentRoutesEnum } from '@gosi-ui/features/establishment';

@Component({
  selector: 'est-medical-insurance-establishment-list-dc',
  templateUrl: './medical-insurance-establishment-list-dc.component.html',
  styleUrls: ['./medical-insurance-establishment-list-dc.component.scss']
})
export class MedicalInsuranceEstablishmentListDcComponent implements OnInit {
  @Input() establishments: BranchList[];
  @Output() goToFaq = new EventEmitter<boolean>();
  constructor(readonly router: Router, readonly route: ActivatedRoute, readonly alertService: AlertService) {}

  ngOnInit(): void {}

  navigateToEnrollment() {
    this.router.navigate([EstablishmentRoutesEnum.MEDICAL_INSURANCE_ENROLLMENT], { relativeTo: this.route });
  }

  navigateToAddContributor(estRegistrationNo: number) {
    this.alertService.clearAlerts();
    this.router.navigate([
      `/home/establishment/medical-insurance/medical-insurance-extension/${estRegistrationNo}/add-contributor`
    ]);
  }

  switchToFaq() {
    this.goToFaq.emit(true);
  }
}
