import { Component, Inject, Input, OnInit } from '@angular/core';
import { Establishment, GenderEnum, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'est-authorized-person-dc',
  templateUrl: './authorized-person-dc.component.html',
  styleUrls: ['./authorized-person-dc.component.scss']
})
export class AuthorizedPersonDcComponent implements OnInit {
  //local variables
  maleGender = GenderEnum.MALE;
  femaleGender = GenderEnum.FEMALE;
  lang: string;

  @Input() heading: string;
  @Input() establishment: Establishment;
  constructor(@Inject(LanguageToken) private language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(lan => (this.lang = lan));
  }
}
