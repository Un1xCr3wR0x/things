import { Component, Inject, OnInit } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs-compat';

@Component({
  selector: 'vol-commitment-indicator-sc',
  templateUrl: './commitment-indicator-sc.component.html',
  styleUrls: ['./commitment-indicator-sc.component.scss']
})
export class CommitmentIndicatorScComponent implements OnInit {

  lang = 'en';
  regiterationNo:number;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) { }

  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
    this.regiterationNo = +window.location.href.split("/").pop();
  }

}
