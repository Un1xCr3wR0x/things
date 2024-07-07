/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants, BilingualText, StorageService } from '@gosi-ui/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BranchDetails, BranchDetailsWrapper, Establishment } from '../models';
import {Ids} from "@gosi-ui/features/contributor/lib/shared/models/einpectionIds";

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {
  private establishment: Establishment;
  private registrationNo: number;
  private legalEntity: BilingualText;
  private status: BilingualText;
  private ppaEstablishment: boolean;
  private unifiedNationalNumber:Ids;

  /**
   * Creates an instance of ValidatorService.
   *
   * @param {HttpClient} http
   * @memberof EstablishmentService
   */

  constructor(private http: HttpClient, private storageService: StorageService) {}

  /**
   * Setter method for registration number
   */
  public set setRegistrationNo(regNo) {
    this.registrationNo = regNo;
  }

  /**
   * Getter method for registration number
   */
  public get getRegistrationNo() {
    return this.registrationNo;
  }

  public get getLegalEntity(): BilingualText {
    return this.legalEntity;
  }

  public get getEstablishmentStatus(): BilingualText {
    return this.status;
  }

  /**
   * Setter method for establishment
   */
  public set setEstablishment(est) {
    this.establishment = est;
  }

  /**
   * Getter method for establishment
   */
  public get getEstablishment() {
    return this.establishment;
  }
  public set setPpaEstablishment(establishmentPpa) {
    this.ppaEstablishment = establishmentPpa;
  }
  public get getPpaEstablishment() {
    return this.ppaEstablishment;
  }


  /**
   * This method  is to fetch the establishment details
   * @param {number} registrationNo
   * @returns
   * @memberof EstablishmentService
   */
  getEstablishmentDetails(registrationNo: number, includeEngagementInfo?: boolean): Observable<Establishment> {
    let getEstablishmentUrl = `/api/v1/establishment/${registrationNo}`;
    if (includeEngagementInfo) getEstablishmentUrl += `?includeEngagementInfo=${includeEngagementInfo}`;
    return this.http.get<Establishment>(getEstablishmentUrl).pipe(
      tap(res => {
        this.establishment = res;
        this.registrationNo = res.registrationNo;
        this.legalEntity = res.legalEntity;
        this.status = res.status;
        this.ppaEstablishment = res.ppaEstablishment;
        this.unifiedNationalNumber=res.unifiedNationalNumber;
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Method to get branch details of establishment.
   * @param registrationNo registartion number
   */
  getBranchDetails(registrationNo: number): Observable<BranchDetailsWrapper> {
    const branchFilterParams = {
      page: {
        pageNo: 0,
        size: 150
      }
    };
    const branchViewUrl = `/api/v1/establishment/${registrationNo}/branches?excludePpaEstablishment=true`;
    return this.http.post<BranchDetailsWrapper>(branchViewUrl, branchFilterParams);
  }

  /**
   * Method to get branches of the establishment.
   * @param registrationNo registration number
   */
  getBranches(registrationNo: number): Observable<BranchDetails[]> {
    return this.getBranchDetails(registrationNo).pipe(map(response => response.branchList));
  }

  /**
   * Method to get number of branches of the establishment.
   * @param registrationNo registration number
   */
  getNumberOfBranches(registrationNo: number): Observable<number> {
    return this.getBranchDetails(registrationNo).pipe(map(response => response.branchStatus.totalBranches));
  }

  /** Method to get number of active branches of the establishment. */
  getActiveBranchesCount(registrationNo: number): Observable<number> {
    return this.getBranchDetails(registrationNo).pipe(map(response => response.branchStatus.activeEstablishments));
  }

  /**
   * This method is used to handle the error
   */
  getRegistrationFromStorage(): number {
    return (this.registrationNo = Number(this.storageService.getSessionValue(AppConstants.ESTABLISHMENT_REG_KEY)));
  }

  /**
   * This method is used to handle the error
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
