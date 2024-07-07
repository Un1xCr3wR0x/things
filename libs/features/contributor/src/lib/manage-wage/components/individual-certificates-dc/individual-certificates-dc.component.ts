import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { downloadBase64PDF, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cnt-individual-certificates-dc',
  templateUrl: './individual-certificates-dc.component.html',
  styleUrls: ['./individual-certificates-dc.component.scss']
})
export class IndividualCertificatesDcComponent implements OnInit {
  @Input() certificateTitle: string;
  @Input() certificateIcon: string;
  @Input() certificateNumber: string;
  @Input() downloadableLink: string;
  @Input() errorFlag = false;
  @Input() bilingualVersion = false;
  @Input() alt: string;

  @Output() generateCertificatebtn = new EventEmitter();

  isGenerateClicked: boolean = false;
  lang: string;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.certificateTitle && changes.certificateTitle.currentValue) {
      this.certificateTitle = changes.certificateTitle.currentValue;
    }
    if (changes && changes.certificateIcon && changes.certificateIcon.currentValue) {
      this.certificateIcon = changes.certificateIcon.currentValue;
    }
    if (changes && changes.certificateNumber && changes.certificateNumber.currentValue) {
      this.certificateNumber = changes.certificateNumber.currentValue;
    }
    if (changes && changes.alt && changes.alt.currentValue) {
      this.alt = changes.alt.currentValue;
    }
    if (changes && changes.errorFlag && changes.errorFlag.currentValue) {
      this.errorFlag = changes.errorFlag.currentValue;
    }
    if (changes && changes.bilingualVersion && changes.bilingualVersion.currentValue) {
      this.bilingualVersion = changes.bilingualVersion.currentValue;
    }
    if (changes && changes.downloadableLink && changes.downloadableLink.currentValue) {
      this.downloadableLink = changes.downloadableLink.currentValue;
    }
  }

  generateCertificate(isEnglish?: any) {
    this.isGenerateClicked = true;
    isEnglish ? this.generateCertificatebtn.emit(true) : this.generateCertificatebtn.emit(false);
  }

  downloadCertificate() {
    downloadBase64PDF(this.downloadableLink, 'Certificate.pdf');
  }
}
