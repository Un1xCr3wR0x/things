/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouterConstants, RouterData, RouterDataToken, convertToYYYYMMDD } from '@gosi-ui/core';
import { BillingConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class BillingRoutingService {
  url: string;
  /**
   * Creates an instance of BillingRoutingService
   * @param routerData router data
   * @param contributionPaymentData token
   * @param router router
   */
  constructor(@Inject(RouterDataToken) readonly routerData: RouterData, readonly router: Router) {}

  /** Manage internal routing. */
  navigateToEdit() {
    switch (this.routerData.resourceType) {
      case RouterConstants.TRANSACTION_EVENT_DATE:
        {
          //navigate to maintain event date validator screen.
          this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_EVENTDATE]);
        }
        break;
      case RouterConstants.TRANSACTION_RECEIVE_CONTRIBUTION:
      case RouterConstants.TRANSACTION_RECEIVE_CONTRIBUTION_GCC:
        {
          //navigate to receive contribution screen.
          this.router.navigate([BillingConstants.ROUTE_RECEIVE_CONTRIBUTION_ESTABLISHMENT]);
        }
        break;
      case RouterConstants.TRANSACTION_RECEIVE_CONTRIBUTION_MOF: {
        this.router.navigate([BillingConstants.ROUTE_RECEIVE_CONTRIBUTION_MOF]);
        break;
      }
      case RouterConstants.TRANSACTION_CANCEL_RECEIPT: {
        this.router.navigate([BillingConstants.ROUTE_CANCEL_RECEIPT]);
        break;
      }
      case RouterConstants.TRANSACTION_WAIVE_ESTABLISHMENT_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_PENALTY_WAIVER]);
        break;
      }
      case RouterConstants.TRANSACTION_CREDIT_MANAGEMENT: {
        this.router.navigate([BillingConstants.ROUTE_ESTABLISHMENT_CREDIT_TRANSFER]);
        break;
      }
      case RouterConstants.TRANSACTION_CREDIT_REFUND_TARNSFER: {
        this.router.navigate([BillingConstants.ROUTE_ESTABLISHMENT_CREDIT_REFUND]);
        break;
      }
      case RouterConstants.TRANSACTION_CREDIT_REFUND_VIC_TARNSFER: {
        this.router.navigate([BillingConstants.ROUTE_VIC_CREDIT_REFUND]);
        break;
      }
      case RouterConstants.TRANSACTION_CONTRIBUTOR_REFUND_TARNSFER: {
        this.router.navigate([BillingConstants.ROUTE_CONTRIBUTOR_REFUND]);
        break;
      }
      case RouterConstants.TRANSACTION_VIC_EXCEPTIONAL_ESTABLISHMENT_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_VIC_EDIT]);
        break;
      }
      case RouterConstants.TRANSACTION_EXCEPTIONAL_ESTABLISHMENT_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ESTABLISHMENT_ONEDIT]);
        break;
      }
      case RouterConstants.TRANSACTION_VIC_EXCEPTIONAL_BULK_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_VIC_SEGMENT_EDIT]);
        break;
      }
      case RouterConstants.TRANSACTION_ESTABLISHMENT_EXCEPTIONAL_BULK_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ESTABLISHMENT_ONEDIT]);
        break;
      }
      case RouterConstants.TRANSACTION_ALL_ENTITY_EXCEPTIONAL_BULK_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_BULK_PENALTY_ONEDIT]);
        break;
      }
      case RouterConstants.TRANSACTION_INSTALLMENT: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_INSTALLMENT_EDIT]);
        break;
      }
      case RouterConstants.TRANSACTION_MISCELLANEOUS: {
        this.router.navigate([BillingConstants.ROUTE_MISCELLANOUEOUS_ADJUSTMENT_ONEDIT]);
        break;
      }
      case RouterConstants.TRANSACTION_ALL_ENTITY_EXCEPTIONAL_BULK_PENALTY_EVENT_DATE: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_BULK_PENALTY_ONEDIT]);
        break;
      }
      case RouterConstants.TRANSACTION_WAIVE_LATE_FEE_VIOLATION: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_LATE_FEE_VIOLATION_EDIT]);
        break;
      }
    }
  }

  /** This method is to navigate to the validator. */
  navigateToValidator() {
    if (
      this.routerData.assignedRole === 'EstablishmentAdmin' ||
      this.routerData.assignedRole === 'EstAdmin' ||
      this.routerData.assignedRole === 'Admin' ||
      this.routerData.assignedRole === 'ExceptionalWaiverOfficer' ||
      (this.routerData.assignedRole === 'GDIC' &&
        this.routerData.resourceType !== 'establishment-installment' &&
        this.routerData.resourceType !== RouterConstants.TRANSACTION_WAIVE_ESTABLISHMENT_PENALTY)
    ) {
      this.navigateToEdit();
    } else if (this.routerData.assignedRole === 'colldepmgr') {
      this.router.navigate([BillingConstants.ROUTE_LATE_CALCULATION_FEE], {
        queryParams: {
          from: 'inbox'
        }
      });
    } else {
      this.billingRouter();
    }
  }
  /** Method to  Route to screen based on resource type*/
  billingRouter() {
    switch (this.routerData.resourceType) {
      case RouterConstants.TRANSACTION_RECEIVE_CONTRIBUTION:
      case RouterConstants.TRANSACTION_RECEIVE_CONTRIBUTION_GCC:
      case RouterConstants.TRANSACTION_RECEIVE_CONTRIBUTION_MOF:
        {
          //navigate to receive contribution validator screen.
          this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_CONTRIBUTION]);
        }
        break;

      case RouterConstants.TRANSACTION_MISCELLANEOUS:
        {
          //navigate to Miscellanoues validator screen.
          this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_MISCELLANEOUS]);
        }
        break;
      case RouterConstants.TRANSACTION_EVENT_DATE: {
        //navigate to maintain event date validator screen.
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_EVENTDATE]);
        break;
      }
      case RouterConstants.TRANSACTION_CANCEL_RECEIPT:
        {
          this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_CANCEL_RECEIPT]);
        }
        break;
      case RouterConstants.TRANSACTION_WAIVE_ESTABLISHMENT_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_WAIVE_ESTABLISHMENT_PENALTY]);
        break;
      }
      case RouterConstants.TRANSACTION_EXCEPTIONAL_ESTABLISHMENT_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_ESTABLISHMENT_PENALTY]);
        break;
      }
      case RouterConstants.TRANSACTION_VIC_EXCEPTIONAL_ESTABLISHMENT_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_VIC_PENALTY]);
        break;
      }
      case RouterConstants.TRANSACTION_VIC_EXCEPTIONAL_BULK_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_BULK_PENALTY]);
        break;
      }
      case RouterConstants.TRANSACTION_CREDIT_MANAGEMENT: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_CREDIT_MANAGEMENT]);
        break;
      }
      case RouterConstants.TRANSACTION_CREDIT_REFUND_TARNSFER: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_CREDIT_TRANSFER]);
        break;
      }
      case RouterConstants.TRANSACTION_CREDIT_REFUND_VIC_TARNSFER: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_CREDIT_VIC_TRANSFER]);
        break;
      }
      case RouterConstants.TRANSACTION_CONTRIBUTOR_REFUND_TARNSFER: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_CONTRIBUTOR_TRANSFER]);
        break;
      } // vicsegment,est segment, all entity, csv file upload for both est and vic
      case RouterConstants.TRANSACTION_ESTABLISHMENT_EXCEPTIONAL_BULK_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_BULK_PENALTY]);
        break;
      }
      case RouterConstants.TRANSACTION_VIC_EXCEPTIONAL_BULK_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_BULK_PENALTY]);
        break;
      }
      case RouterConstants.TRANSACTION_ALL_ENTITY_EXCEPTIONAL_BULK_PENALTY: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_BULK_PENALTY]);
        break;
      }
      case RouterConstants.TRANSACTION_ALL_ENTITY_EXCEPTIONAL_BULK_PENALTY_EVENT_DATE: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_BULK_PENALTY]);
        break;
      }
      case RouterConstants.TRANSACTION_INSTALLMENT: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_INSTALLMENT]);
        break;
     }
      case RouterConstants.TRANSACTION_WAIVE_LATE_FEE_VIOLATION: {
        this.router.navigate([BillingConstants.ROUTE_VALIDATOR_BILLING_LATE_FEE_VIOLATION]);
        break;
      }
    }
  }
  /** This method is to navigate to inbox. */
  navigateToInbox() {
    this.router.navigate([RouterConstants.ROUTE_INBOX]);
  }
  /** This method is to navigate to inbox. */
  navigateToPublicInbox() {
    this.router.navigate([RouterConstants.ROUTE_TODOLIST]);
  }

  /** This method is to navigate to receipt screen. */
  navigateToReceipt() {
    this.router.navigate([BillingConstants.ROUTE_RECIEPT]);
  }
  /** This method is to navigate to detailed bill screen. */
  navigateToDetailedBill() {
    this.router.navigate([BillingConstants.ROUTE_DETAILED_BILL]);
  }
  navigateToDashboardBills(billDate: string, billNumber: number, isSearch: boolean, initialStartDate: string) {
    this.url = BillingConstants.ROUTE_DASHBOARD_BILL;
    this.router.navigate([this.url], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(billDate),
        billNumber: billNumber,
        isSearch: true,
        billStartDate: convertToYYYYMMDD(initialStartDate)
      }
    });
  }
  
  /** This method is to navigate to dasboard bill screen. */
  navigateToDashboardBill(billDate: string, billNumber: number, fromPage: boolean, initialStartDate: string, idNumber: number) {
    if (fromPage) {
      this.url = BillingConstants.ROUTE_VIC_DASHBOARD_BILL;
      this.router.navigate([this.url], {
        queryParams: {
          monthSelected: convertToYYYYMMDD(billDate),
          billNumber: billNumber,
          billStartDate: convertToYYYYMMDD(initialStartDate),
        }
      });
    } else {
      this.url = BillingConstants.ROUTE_DASHBOARD_BILL;
      this.router.navigate([this.url], {
        queryParams: {
          monthSelected: convertToYYYYMMDD(billDate),
          billNumber: billNumber,
          isSearch: true,
          billStartDate: convertToYYYYMMDD(initialStartDate),
          registerNo: idNumber
        }
      });
    }
  }
  navigateToMofDashboardBills(billDate: string, establishmentType: string){
    //this.url = BillingConstants.ROUTE_DASHBOARD_MOF;
    this.router.navigate([BillingConstants.ROUTE_DASHBOARD_MOF], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(billDate),
        establishmentType: establishmentType
        // billStartDate: convertToYYYYMMDD(billStartDate),
        // initialStartDate: convertToYYYYMMDD(initialStartDate)
      }
    });
  }
  /** This method is to navigate to dasboard bill screen. */
  navigateToMofDashboardBill(establishmentType: string) {
    this.url = BillingConstants.ROUTE_DASHBOARD_MOF;
    this.router.navigate([this.url],{
      queryParams: {
        establishmentType: establishmentType
      }
      });
  }
  /**
   * This method is to navigate to mof detailedBill
   */
  navigateToMofDetailedBill(billDate: string, billNumber: number) {
    this.router.navigate([BillingConstants.ROUTE_DETAILED_BILL_MOF], {
      queryParams: {
        monthSelected: convertToYYYYMMDD(billDate),
        billNumber: billNumber
      }
    });
  }
  /** This method is to navigate to bill history screen. */
  navigateToBillHistory() {
    this.router.navigate([BillingConstants.ROUTE_BILL_HISTORY]);
  }

  /** This method is to navigate to vic bill history screen. */
  navigateToVicBillHistory(sin: number) {
    this.router.navigate([BillingConstants.ROUTE_VIC_BILL_HISTORY], {
      queryParams: {
        sin: sin
      }
    });
  }
}
