import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MBPaymentHistory, NationalityCategoryEnum } from '../../shared';
import { BilingualText, MenuService, RoleIdEnum } from '@gosi-ui/core';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme';

@Component({
  selector: 'mb-payment-history-view-dc',
  templateUrl: './payment-history-view-dc.component.html',
  styleUrls: ['./payment-history-view-dc.component.scss']
})
export class PaymentHistoryViewDcComponent implements OnInit {
  ninId = NationalityCategoryEnum.NIN_ID;
  iqamaId = NationalityCategoryEnum.IQAMA_ID;
  iqamaNo = NationalityCategoryEnum.IQAMA_NO;
  gccId = NationalityCategoryEnum.GCC_ID;
  borderNo = NationalityCategoryEnum.BORDER_NO;
  paginationId = 'member-board-id';
  isFcLogin = false;
  @Input() paymentHistory: MBPaymentHistory;
  @Input() itemsPerPage: number;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  @Input() currentPage: number;
  @Input() paymentGroup: string;
  @Input() lang = 'en';
  @Output() pageSelect: EventEmitter<number> = new EventEmitter();
  @Output() navigateToProfile: EventEmitter<number> = new EventEmitter();
  @Output() navigateToSession: EventEmitter<number> = new EventEmitter();
  @Output() statusColour: EventEmitter<BilingualText> = new EventEmitter();
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;
  constructor(readonly menuService: MenuService) {}

  ngOnInit(): void {
    this.isFcLogin = this.menuService.isUserEntitled([RoleIdEnum.FC]);
  }
  selectPage(page: number) {
    this.pageDetails.currentPage = this.currentPage = page;
    this.pageSelect.emit(page);
  }
  getMembers(id: number) {
    this.navigateToProfile.emit(id);
  }
  getSession(session: number) {
    this.navigateToSession.emit(session);
  }
  getStatusColor(status) {
    this.statusColour.emit(status);
  }
}
