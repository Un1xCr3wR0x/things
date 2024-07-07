/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, Inject, OnInit } from '@angular/core';
import { BPMTask, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tm-selected-transactions-dc',
  templateUrl: './selected-transactions-dc.component.html',
  styleUrls: ['./selected-transactions-dc.component.scss']
})
export class SelectedTransactionsDcComponent implements OnInit {
  /**
   * input variables
   */
  @Input() selectedTransactions: BPMTask[] = [];
  /**
   * local variables
   */
  lang = 'en';
  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe((res: string) => {
      this.lang = res;
    });
  }
}
