import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'cim-certificate-card-dc',
  templateUrl: './certificate-card-dc.component.html',
  styleUrls: ['./certificate-card-dc.component.scss']
})
export class CertificateCardDcComponent {
  @Input() certificateTitle: string;
  @Input() certificateDescription: string;
  @Input() certificateLogo = 'assets/images/Benefits-light.svg';
  @Output() viewCertificate = new EventEmitter<object>();
  @Output() downloadCertificate = new EventEmitter<object>();

  constructor(readonly modalService: BsModalService) {}

  mode = 'download';
  modalRef: BsModalRef;

  @ViewChild('generateCertificateModal', { static: false })
  generateCertificateModal: TemplateRef<HTMLElement>;

  showGenerateCertificateModal(mode) {
    this.mode = mode;
    this.modalRef = this.modalService.show(this.generateCertificateModal, Object.assign({}, { class: 'modal-md' }));
  }

  hideGenerateCertificateModal() {
    this.modalRef.hide();
  }

  generateCertificate(isArabic: boolean) {
    const emitter = this.mode == 'download' ? this.downloadCertificate : this.viewCertificate;
    emitter.emit({
      isArabic,
      hideGenerateModal: this.hideGenerateCertificateModal.bind(this)
    });
  }
}
