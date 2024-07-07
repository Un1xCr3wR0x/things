/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Location } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BilingualText, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'gosi-main-heading-dc',
  templateUrl: './main-heading-dc.component.html',
  styleUrls: ['./main-heading-dc.component.scss']
})
export class MainHeadingDcComponent implements OnInit {
  lang = 'en';
  @Input() header: BilingualText;
  @Input() backPath: string;
  @Input() isBack = true;
  @Output() back = new EventEmitter<null>();

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly location: Location,
    readonly route: ActivatedRoute,
    readonly router: Router
  ) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  backClicked() {
    if (this.backPath) {
      this.router.navigate([this.backPath], { relativeTo: this.route });
    } else {
      this.location.back();
    }
    this.back.emit();
  }
}
