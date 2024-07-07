import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import {
  MenuService,
  Tab,
  RouterConstants,
  BaseComponent,
  TransactionService,
  LanguageToken,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  CoreBenefitService,
  AlertService
} from '@gosi-ui/core';
import { TransactionTabConstants } from '../../constants';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { takeUntil, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'trn-transaction-tab-sc',
  templateUrl: './transaction-tab-sc.component.html',
  styleUrls: ['./transaction-tab-sc.component.scss']
})
export class TransactionTabScComponent extends BaseComponent implements OnInit, OnDestroy {
  showDropDown = false;
  activeInDropdown = false;
  transactionTabs: Tab[] = [];
  inboxCount: number = null;
  lang = 'en';
  sum = 0;
  constructor(
    readonly menuService: MenuService,
    readonly router: Router,
    readonly transactionService: TransactionService,
    readonly cdr: ChangeDetectorRef,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly activatedRoute: ActivatedRoute,
    readonly coreBenefitService: CoreBenefitService,
    readonly alertService: AlertService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.coreBenefitService.getBenefitAppliedMessage()) {
      this.alertService.showSuccess(this.coreBenefitService.getBenefitAppliedMessage());
    }
    this.language.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cdr.detectChanges();
    });
    this.transactionTabs = TransactionTabConstants.getTransactionTabs(
      this.appToken === ApplicationTypeEnum.PRIVATE ? true : false,
      this.appToken === ApplicationTypeEnum.PUBLIC ? true : false
    ).filter(item => this.menuService.isUserEntitled(item.allowedRoles));

    this.setDefaultTab();
    this.setTabCount();
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  onDropDownClick() {
    this.showDropDown = !this.showDropDown;
  }
  setDefaultTab() {
    if (this.router.url === RouterConstants.ROUTE_MY_TRANSACTIONS && this.transactionTabs.length > 0) {
      this.router.navigate([this.transactionTabs[0].url], { replaceUrl: true });
    }
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        filter((item: RouterEvent) => item.url === RouterConstants.ROUTE_MY_TRANSACTIONS),
        tap(() => {
          if (this.transactionTabs.length > 0) {
            this.router.navigate([this.transactionTabs[0].url], { replaceUrl: true });
          }
        })
      )
      .subscribe();
  }
  /**
   * method to set the count on tab header
   */
  setTabCount() {
    this.sum = 0;
    if (this.router.url === RouterConstants.ROUTE_MY_TRANSACTIONS && this.transactionTabs.length > 0) {
      if (
        this.transactionTabs[0].url === RouterConstants.ROUTE_TODOLIST ||
        this.transactionTabs[0].url === RouterConstants.ROUTE_TRANSACTION_HISTORY
      ) {
        if (this.transactionTabs.find(item => item.url === RouterConstants.ROUTE_NOTIFICATIONS)) {
          this.getNotificationCount();
        }
      }
    } else if (this.router.url === RouterConstants.ROUTE_TRANSACTION_HISTORY) {
      this.getTodolistCount();
      this.getWorklistCount();
      this.getNotificationCount();
    } else if (this.router.url === RouterConstants.ROUTE_TODOLIST) {
      this.getNotificationCount();
    } else if (this.router.url === RouterConstants.ROUTE_NOTIFICATIONS) {
      this.getTodolistCount();
    }
    if (this.transactionTabs.find(item => item.url === RouterConstants.ROUTE_INBOX)) {
      this.transactionService.transactionCount$
        .pipe(
          filter(item => item !== null),
          takeUntil(this.destroy$)
        )
        .subscribe(count => {
          this.transactionTabs.find(item => item.url === RouterConstants.ROUTE_INBOX).count = count;
        });
    }
    if (this.transactionTabs.find(item => item.url === RouterConstants.ROUTE_TODOLIST)) {
      this.transactionService.transactionCount$
        .pipe(
          filter(item => item !== null),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(res => {
          this.transactionService.transactionCountUnclaimed$
            .pipe(
              filter(item => item !== null),
              distinctUntilChanged(),
              takeUntil(this.destroy$)
            )
            .subscribe(count => {
              this.sum = res + count;
              if (this.appToken === ApplicationTypeEnum.PUBLIC) {
                this.transactionTabs.find(item => item.url === RouterConstants.ROUTE_TODOLIST).count = this.sum;
              } else {
                this.transactionTabs.find(item => item.url === RouterConstants.ROUTE_TODOLIST).count = res;
              }
            });
        });
    }
    if (this.transactionTabs.find(item => item.url === RouterConstants.ROUTE_NOTIFICATIONS)) {
      this.transactionService.notificationTotalCount$
        .pipe(
          filter(item => item !== null),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(count => {
          this.transactionTabs.find(item => item.url === RouterConstants.ROUTE_NOTIFICATIONS).totalCount = count;
        });
      this.transactionService.notificationUnViewedCount$
        .pipe(
          filter(item => item !== null),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(count => {
          this.transactionTabs.find(item => item.url === RouterConstants.ROUTE_NOTIFICATIONS).count = count;
        });
    }
  }

  getTodolistCount() {
    if (this.transactionTabs.find(item => item.url === RouterConstants.ROUTE_TODOLIST)) {
      this.transactionService.getInboxCount().subscribe();
    }
  }
  getWorklistCount() {
    if (this.transactionTabs.find(item => item.url === RouterConstants.ROUTE_INBOX)) {
      this.transactionService.getInboxCount().subscribe();
    }
  }
  getNotificationCount() {
    if (this.transactionTabs.find(item => item.url === RouterConstants.ROUTE_NOTIFICATIONS)) {
      this.transactionService?.getNotificationCount()?.subscribe();
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  tabSelect() {
    this.showDropDown = false;
  }
}
