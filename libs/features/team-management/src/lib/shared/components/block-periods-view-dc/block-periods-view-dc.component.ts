/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { LanguageToken, Channel } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BlockPeriodModalTypeEnum } from '../../enums';
import { BlockPeriod } from '../../models';

@Component({
  selector: 'tm-block-periods-view-dc',
  templateUrl: './block-periods-view-dc.component.html',
  styleUrls: ['./block-periods-view-dc.component.scss']
})
export class BlockPeriodsViewDcComponent implements OnInit {
  /**
   * input variables
   */
  @Input() blockPeriods: BlockPeriod[] = [];
  /**
   * local variables
   */
  lang = 'en';
  type = BlockPeriodModalTypeEnum;
  channel = Channel;
  /**
   * output variables
   */
  @Output() addBlock = new EventEmitter();
  @Output() modifyBlock = new EventEmitter();
  @Output() removeBlock = new EventEmitter();
  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  /**
   * method to open modal
   * @param action
   * @param item
   */
  openModal(action, item?: BlockPeriod) {
    if (action === this.type.ADD_BLOCK) {
      this.addBlock.emit();
    } else if (action === this.type.MODIFY_BLOCK) {
      this.modifyBlock.emit(item);
    } else {
      this.removeBlock.emit(item);
    }
  }
}
