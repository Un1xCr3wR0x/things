import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'est-certificate-dc',
  templateUrl: './certificate-dc.component.html',
  styleUrls: ['./certificate-dc.component.scss']
})
export class CertificateDcComponent implements OnInit {
  @Input() heading: string;
  @Input() buttonName: string;
  @Input() isEligible = false;
  @Input() isLoaded = true;

  @Output() generateCert: EventEmitter<void> = new EventEmitter();
  @Output() showDetails: EventEmitter<void> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  handleClick() {
    if (this.isLoaded) {
      if (!this.isEligible) {
        this.showDetails.emit();
      } else {
        this.generateCert.emit();
      }
    }
  }
}
