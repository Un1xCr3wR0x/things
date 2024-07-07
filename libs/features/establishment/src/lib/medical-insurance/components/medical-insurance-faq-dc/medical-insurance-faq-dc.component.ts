import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentRoutesEnum, EstablishmentService } from '@gosi-ui/features/establishment';
import { EstablishmentScBaseComponent } from '@gosi-ui/features/establishment/lib/shared/base/establishment-sc.base-component';

@Component({
  selector: 'est-medical-insurance-faq-dc',
  templateUrl: './medical-insurance-faq-dc.component.html',
  styleUrls: ['./medical-insurance-faq-dc.component.scss']
})
export class MedicalInsuranceFaqDcComponent extends EstablishmentScBaseComponent implements OnInit {
  @Input() disableEnrollmentButton: boolean;
  @Input() isAllEnrolled: boolean;
  @Input() isNoneEnrolled: boolean;
  @Output() goToEstList = new EventEmitter<boolean>();
  termsUrl: string;

  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly establishmentService: EstablishmentService
  ) {
    super(null, null);
  }

  ngOnInit(): void {
    this.termsUrl = EstablishmentRoutesEnum.MEDICAL_INSURANCE_TERMS;
  }

  navigateToEnrollment() {
    this.router.navigate([EstablishmentRoutesEnum.MEDICAL_INSURANCE_ENROLLMENT], { relativeTo: this.route });
  }

  switchToEstList() {
    this.goToEstList.emit(true);
  }
}
