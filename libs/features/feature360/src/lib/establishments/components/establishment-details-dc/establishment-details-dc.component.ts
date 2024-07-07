import { Component, Input, OnInit, TemplateRef, ViewChild, OnChanges } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AdminWrapper } from '../../../models/establishments/admin-wrapper';
import { EstablishmentMOLProfile } from '../../../models/establishments/establishment-molprofile';
import { EstablishmentProfile } from '../../../models/establishments/establishment-profile';
// import { EstablishmentSupervisorDetail } from '../../../models/establishments/establishment-supervisor-detail';
import { VerifyNinumberDcComponent } from '../../../shared/components/verify-ninumber-dc/verify-ninumber-dc.component';
import { Name } from '@gosi-ui/core/lib/models/name';

@Component({
  selector: 'fea-establishment-details-dc',
  templateUrl: './establishment-details-dc.component.html',
  styleUrls: ['./establishment-details-dc.component.scss']
})
export class EstablishmentDetailsDcComponent implements OnInit {
  modalRef: BsModalRef;
  isVerified = false;
  isSend = false;
  curNinumber = null;
  adminType: AdminWrapper;
  language: string;

  @Input() establishmentProfile: EstablishmentProfile;
  @Input() establishmentMOLProfile: EstablishmentMOLProfile;
  @Input() establishmentSupervisorDetail: AdminWrapper;
  @Input() set lang(lang: string) {
    this.language = lang;
    if (this.establishmentSupervisorDetail) {
      this.setTypeAdmins(JSON.parse(JSON.stringify(this.establishmentSupervisorDetail)), this.language);
    }
  }

  @ViewChild('verifyNinumberDcComp', { static: false })
  verifyNinumberDcComp: VerifyNinumberDcComponent;

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {}

  showPopupVerivication(ninumber, template: TemplateRef<HTMLElement>) {
    this.isVerified = false;
    this.isSend = false;
    this.curNinumber = ninumber;

    const ngbModalOptions: ModalOptions = {
      backdrop: 'static',
      keyboard: false,
      animated: true
    };
    this.modalRef = this.modalService.show(template, ngbModalOptions);
  }

  close() {
    this.isVerified = false;
    this.isSend = false;
    this.curNinumber = null;
    this.modalRef.hide();
  }

  sendVerification(ninumber) {
    this.isSend = true;
  }

  verifyCode(code) {
    this.isVerified = true;
  }

  setTypeAdmins(type: AdminWrapper, lang: string) {
    if (lang === 'en') {
      this.adminType = type;
      let admin = [];
      admin = type.admins.map(response => response.roles.map(val => val['english']));
      admin.forEach((value, index) => {
        this.adminType.admins[index].roles = admin[index];
      });
    }
    if (lang === 'ar') {
      this.adminType = type;
      let admin = [];
      admin = type.admins.map(response => response.roles.map(val => val['arabic']));
      admin.forEach((value, index) => {
        this.adminType.admins[index].roles = admin[index];
      });
    }
  }

  setName(names: Name): string {
    if (this.language === 'en') {
      return names.english.name;
    }
    if (this.language === 'ar') {
      return `${names.arabic.firstName} ${names.arabic.secondName} ${names.arabic.thirdName} ${names.arabic.familyName}`;
    }
  }
}
