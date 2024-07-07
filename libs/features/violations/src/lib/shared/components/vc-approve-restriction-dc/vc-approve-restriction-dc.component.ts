import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'vol-vc-approve-restriction-dc',
  templateUrl: './vc-approve-restriction-dc.component.html',
  styleUrls: ['./vc-approve-restriction-dc.component.scss']
})
export class VcApproveRestrictionDcComponent implements OnInit {
  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  /**
   * Method to hide modal
   */
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }
}
