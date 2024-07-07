/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit } from '@angular/core';
import { AuthTokenService, BilingualText } from '@gosi-ui/core';

@Component({
  selector: 'dsb-landing-sc',
  templateUrl: './landing-sc.component.html',
  styleUrls: ['./landing-sc.component.scss']
})
export class LandingScComponent implements OnInit {
  /**
   * local variables
   */
  name: BilingualText = new BilingualText();
  constructor(readonly authService: AuthTokenService) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    const token = this.authService.decodeToken(this.authService.getAuthToken());
    this.name.arabic = token?.longnamearabic?.trim() === 'NOT_FOUND' ? token?.longnameenglish : token?.longnamearabic;
    this.name.english = token?.longnameenglish?.trim() === 'NOT_FOUND' ? token?.longnamearabic : token?.longnameenglish;
  }
}
