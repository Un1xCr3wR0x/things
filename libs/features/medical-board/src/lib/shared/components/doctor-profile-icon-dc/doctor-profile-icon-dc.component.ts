import { Component, OnInit, Input } from '@angular/core';
import { GeneralEnum } from '../../enums';

@Component({
  selector: 'mb-doctor-profile-icon-dc',
  templateUrl: './doctor-profile-icon-dc.component.html',
  styleUrls: ['./doctor-profile-icon-dc.component.scss']
})
export class DoctorProfileIconDcComponent implements OnInit {
  male = GeneralEnum.MALE;

  //Input Variables
  @Input() gender: string;

  constructor() {}

  ngOnInit(): void {}
}
