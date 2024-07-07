/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable, Inject } from '@angular/core';
import {
  BilingualText,
  AlertService,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  ChannelConstants,
  Establishment,
  PersonWrapperDto,
  convertToYYYYMMDD,
  startOfDay,
  subtractMonths
} from '@gosi-ui/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionSearchResponse, IndividualSearchDetails, EstablishmentResponse } from '../models';
import { catchError } from 'rxjs/operators';
import { SearchRequest, DashboardBaseService } from '../../shared';
import { EstablishmentFilterConstants } from '../constants';
import { TransactionTypeConstants } from 'libs/core/src/lib/constants/transaction-type-constants';
@Injectable({
  providedIn: 'root'
})
export class DashboardSearchService extends DashboardBaseService {
  /**
   * local variables
   */
  transactionSearchRequest: SearchRequest = undefined;
  establishmentSearchRequest: SearchRequest = undefined;
  individualSearchRequest: SearchRequest = undefined;
  searchKey: string = undefined;
  searchType: string = undefined;
  isPrivate: boolean;
  enableTransactionAdvancedSearch = false;
  enableEstablishmentAdvancedSearch = false;
  enableIndividualAdvancedSearch = false;
  registrationNo: number = undefined;
  isSummaryPage = false;
  _ppaEstablishment: boolean;
  transaction: TransactionSearchResponse;

  public get ppaEstablishment(): boolean {
    return this._ppaEstablishment;
  }

  public set ppaEstablishment(value: boolean) {
    this._ppaEstablishment = value;
  }
  /**
   *
   * @param storageService
   * @param http
   * @param alertService
   * @param appToken
   */
  constructor(
    readonly http: HttpClient,
    public alertService: AlertService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    super(http);
    this.isPrivate = appToken === ApplicationTypeEnum.PRIVATE ? true : false;
  }
  /**
   *
   * @param searchRequest method to search establishment
   */
  establishmentSearch(searchRequest: SearchRequest, ignoreLoadingBar = false): Observable<EstablishmentResponse> {
    let searchEstablishmentUrl = `${this.baseUrl}/establishment?globalSearch=true&page.pageNo=${searchRequest?.limit?.pageNo}&page.size=${searchRequest?.limit?.pageSize}`;
    searchEstablishmentUrl = this.createEstablishmentSearchUrl(searchRequest, searchEstablishmentUrl);
    if (searchRequest?.sort?.column && searchRequest?.sort?.direction)
      searchEstablishmentUrl += `&sort.column=${searchRequest.sort.column}&sort.direction=${searchRequest.sort.direction}`;
    searchEstablishmentUrl = this.createEstablishmentFilter(searchRequest, searchEstablishmentUrl);
    if (
      searchRequest?.searchParam?.unifiedEstablishmentId &&
      searchRequest?.searchParam?.unifiedEstablishmentIdPrefix
    ) {
      searchEstablishmentUrl += `&molunId=${searchRequest.searchParam.unifiedEstablishmentId}`;
      searchEstablishmentUrl += `&molEstablishmentOfficeId=${searchRequest.searchParam.unifiedEstablishmentIdPrefix}`;
    }

    if (searchRequest?.searchParam?.establishmentId && searchRequest?.searchParam?.establishmentIdPrefix) {
      searchEstablishmentUrl += `&molOfficeId=${searchRequest.searchParam.establishmentIdPrefix}`;
      searchEstablishmentUrl += `&molEstablishmentId=${searchRequest.searchParam.establishmentId}`;
    }

    if (searchRequest?.searchParam?.gccCountryCode && searchRequest.searchParam.gccCountryCode.length > 0) {
      searchRequest.searchParam.gccCountryCode.forEach(item => {
        searchEstablishmentUrl += `&listOfGccCountry=${item}`;
      });
    }

    if (searchRequest?.searchParam?.gccId) {
      searchEstablishmentUrl += `&gccRegistrationNumber=${searchRequest.searchParam.gccId}`;
    }

    if (
      (searchRequest?.searchParam?.registrationStatus && searchRequest.searchParam.registrationStatus.length > 0) ||
      (searchRequest?.filter?.status && searchRequest.filter.status.length > 0)
    ) {
      const statusList: string[] = [
        ...searchRequest.searchParam.registrationStatus.map(item => item.english),
        ...searchRequest.filter.status.map(item => item.english)
      ];
      new Set(statusList).forEach(item => {
        searchEstablishmentUrl += `&filter.status=${item}`;
      });
    }

    let httpOptions = {};
    if (ignoreLoadingBar) {
      httpOptions = { headers: { ignoreLoadingBar: '' } };
    }
    return this.http.get<EstablishmentResponse>(searchEstablishmentUrl, httpOptions);
  }

  createEstablishmentFilter(searchRequest: SearchRequest, searchEstablishmentUrl: string) {
    if (searchRequest?.filter?.legalEntity && searchRequest.filter.legalEntity.length > 0) {
      searchRequest.filter.legalEntity.forEach((value: BilingualText) => {
        searchEstablishmentUrl += `&filter.legalEntity=${value.english}`;
      });
    }
    if (searchRequest?.filter?.filedOffice && searchRequest.filter.filedOffice.length > 0) {
      searchRequest.filter.filedOffice.forEach((value: BilingualText) => {
        searchEstablishmentUrl += `&filter.fieldOffice=${value.english}`;
      });
    }
    if (searchRequest?.filter?.type && searchRequest.filter.type.length > 0) {
      searchRequest.filter.type.forEach((value: BilingualText) => {
        searchEstablishmentUrl += `&filter.isGccCountry=${
          EstablishmentFilterConstants.TYPE_FILTER_FOR_ESTABLISHMENT.find(item => item.value.english === value.english)
            .code
        }`;
      });
    }
    return searchEstablishmentUrl;
  }

  createEstablishmentSearchUrl(searchRequest: SearchRequest, searchEstablishmentUrl: string) {
    if (searchRequest?.searchParam?.establishmentName)
      searchEstablishmentUrl += `&establishmentName=${searchRequest.searchParam.establishmentName}`;
    if (searchRequest?.searchParam?.registrationNo)
      searchEstablishmentUrl += `&registrationNo=${searchRequest.searchParam.registrationNo}`;
    if (searchRequest?.searchParam?.commercialRegistrationNo)
      searchEstablishmentUrl += `&crNumber=${searchRequest.searchParam.commercialRegistrationNo}`;
    if (searchRequest?.searchParam?.licenceNo)
      searchEstablishmentUrl += `&licenseNumber=${searchRequest.searchParam.licenceNo}`;
    if (searchRequest?.searchParam?.phoneNumber)
      searchEstablishmentUrl += `&ownerOrAdminPhoneNumber=${searchRequest.searchParam.phoneNumber}`;

    if (searchRequest?.searchParam?.recruitmentNo)
      searchEstablishmentUrl += `&recruitmentNo=${searchRequest.searchParam.recruitmentNo}`;

    if (searchRequest?.searchParam?.unifiedIdentificationNo)
      searchEstablishmentUrl += `&unifiedNationalNumber=${searchRequest.searchParam.unifiedIdentificationNo}`;

    if (searchRequest?.searchParam?.personIdentifier)
      searchEstablishmentUrl += `&personIdentifier=${searchRequest.searchParam.personIdentifier}`;
    return searchEstablishmentUrl;
  }
  /**
   * Method for searching the establishment using establishment name or registartion number
   * @param searchRequest
   */
  searchEstablishment(searchRequest: SearchRequest): Observable<EstablishmentResponse> {
    this.establishmentSearchRequest = searchRequest;
    return this.establishmentSearch(searchRequest).pipe(
      catchError(error => {
        if (error.status !== 400) this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }

  /**
   *
   * @param searchRequest method to search for individual
   */
  searchIndividual(searchRequest: SearchRequest, indProfile: boolean): Observable<PersonWrapperDto> {
    let searchIndividualUrl = `${this.baseUrl}/person?globalSearch=true&page.pageNo=${searchRequest?.limit?.pageNo}&page.size=${searchRequest?.limit?.pageSize}`;
    if (indProfile) {
      searchIndividualUrl += `&indProfile=true`;
    }
    if (searchRequest?.searchKey) {
      searchIndividualUrl += `&searchParam=${searchRequest.searchKey}`;
    }
    if (searchRequest?.searchParam?.birthDate) {
      searchIndividualUrl += `&birthDate=${convertToYYYYMMDD(searchRequest.searchParam.birthDate)}`;
    }
    if (searchRequest?.searchParam?.firstName) {
      searchIndividualUrl += `&personName.arabic.firstName=${searchRequest.searchParam.firstName}`;
    }
    if (searchRequest?.searchParam?.secondName) {
      searchIndividualUrl += `&personName.arabic.secondName=${searchRequest.searchParam.secondName}`;
    }
    if (searchRequest?.searchParam?.thirdName) {
      searchIndividualUrl += `&personName.arabic.thirdName=${searchRequest.searchParam.thirdName}`;
    }
    if (searchRequest?.searchParam?.familyName) {
      searchIndividualUrl += `&personName.arabic.familyName=${searchRequest.searchParam.familyName}`;
    }
    if (searchRequest?.searchParam?.englishName) {
      searchIndividualUrl += `&personName.english.name=${searchRequest.searchParam.englishName}`;
    }
    if (searchRequest?.searchParam?.oldNationalId) {
      searchIndividualUrl += `&oldNationalId=${searchRequest.searchParam.oldNationalId}`;
    }
    if (searchRequest?.searchParam?.phoneNumber) {
      searchIndividualUrl += `&mobileNumber=${searchRequest.searchParam.phoneNumber}`;
    }
    if (searchRequest?.searchParam?.nationalityCode) {
      searchIndividualUrl += `&nationalityCode=${searchRequest.searchParam.nationalityCode}`;
    }
    if (searchRequest?.searchParam?.passportNo) {
      searchIndividualUrl += `&passportNo=${searchRequest.searchParam.passportNo}`;
    }
    if (searchRequest?.searchParam?.borderNo) {
      searchIndividualUrl += `&borderNo=${searchRequest.searchParam.borderNo}`;
    }
    if (searchRequest?.searchParam?.gccId) {
      searchIndividualUrl += `&gccId=${searchRequest.searchParam.gccId}`;
    }
    // if (searchRequest?.searchParam?.sin) {
    //   searchIndividualUrl += `&socialInsuranceNumber=${searchRequest.searchParam.sin}`;
    // }
    return this.http.get<PersonWrapperDto>(searchIndividualUrl).pipe(
      catchError(error => {
        if (error.status !== 400) this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }

  searchIndividualWithSin(sin: number): Observable<PersonWrapperDto> {
    let searchIndividualUrl =
      `${this.baseUrl}/person?globalSearch=true&page.pageNo=0&page.size=10` + `&socialInsuranceNumber=${sin}`;

    return this.http.get<PersonWrapperDto>(searchIndividualUrl).pipe(
      catchError(error => {
        if (error.status !== 400) this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }
  /**
   * Method for searching transaction using esta
   * @param searchRequest
   */
  searchTransaction(searchRequest: SearchRequest): Observable<TransactionSearchResponse> {
    this.transactionSearchRequest = searchRequest;
    let searchTransactionUrl = `${this.baseUrl}/transaction?general=true&page.pageNo=${searchRequest.limit.pageNo}&page.size=${searchRequest.limit.pageSize}&sort.column=${searchRequest.sort.column}&sort.direction=${searchRequest.sort.direction}`;
    if (searchRequest.searchKey) {
      searchTransactionUrl += `&searchKey=${searchRequest.searchKey}`;
    }
    if (searchRequest.searchParam?.personIdentifier) {
      searchTransactionUrl += `&personIdentifier=${searchRequest.searchParam.personIdentifier}`;
    }
    if (searchRequest.searchParam?.registrationNo) {
      searchTransactionUrl += `&registrationNo=${searchRequest.searchParam.registrationNo}`;
    }
    if (searchRequest.filter?.status && searchRequest.filter.status.length > 0) {
      searchRequest.filter.status.forEach((value: BilingualText) => {
        searchTransactionUrl += `&filter.listOfStatus=${value.english}`;
      });
    }
    if (searchRequest.searchParam?.status) {
      let statusList = Array.from(searchRequest.searchParam.status);
      statusList.forEach((value: BilingualText) => {
        searchTransactionUrl += `&filter.listOfStatus=${value.english}`;
      });
    }
    if (searchRequest.filter?.channel && searchRequest.filter.channel.length > 0) {
      searchRequest.filter.channel.forEach((values: BilingualText) => {
        const items = ChannelConstants.CHANNELS_FILTER_TRANSACTIONS?.find(
          item => item.english === values.english
        )?.value;
        searchTransactionUrl += `&filter.listOfChannels=${items}`;
      });
    }
    if (searchRequest.searchParam?.channel) {
      searchRequest.searchParam.channel.forEach((values: BilingualText) => {
        const items = ChannelConstants.CHANNELS_ADVANCED_SEARCH_TRANSACTIONS?.find(
          item => item.value.english === values.english
        )?.channelType;
        searchTransactionUrl += `&filter.listOfChannels=${items}`;
      });
    }
    if (searchRequest.searchParam?.transactionId) {
      searchRequest.searchParam.transactionId.forEach((values: BilingualText) => {
        const items = TransactionTypeConstants.TRANSACTION_TYPE_FILTER_TRANSACTIONS?.find(
          item => item.value.english === values.english
        )?.transactionId;
        searchTransactionUrl += `&transactionId=${items}`;
      });
    }
    if (searchRequest?.searchParam?.startDate?.gregorian) {
      searchTransactionUrl += `&startDate=${convertToYYYYMMDD(
        searchRequest?.searchParam?.startDate?.gregorian.toDateString()
      )}`;
    }

    if (searchRequest?.searchParam?.endDate?.gregorian) {
      searchTransactionUrl += `&endDate=${convertToYYYYMMDD(
        searchRequest?.searchParam?.endDate?.gregorian.toDateString()
      )}`;
    }

    return this.http.get<TransactionSearchResponse>(searchTransactionUrl).pipe(
      catchError(error => {
        if (error.status !== 400) this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }
  /**
   * This method is to get establishment details
   */
  getEstablishmentDetails(registrationNo: number): Observable<Establishment> {
    return this.getEstablishment(registrationNo).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
  /**
   * method to get transaction search response
   * @param registrationNo
   */
  getTransactions(registrationNo: number, searchRequest?: SearchRequest): Observable<TransactionSearchResponse> {
    const startDate = convertToYYYYMMDD(subtractMonths(new Date(), 1).toDateString());
    let transactionUrl = `${this.baseUrl}/transaction?general=true&registrationNo=${registrationNo}&sort.column=createdDate&sort.direction=DESC&filter.listOfStatus=In Progress&startDate=${startDate}`;
    if (searchRequest?.limit?.pageNo && searchRequest?.limit?.pageSize) {
      transactionUrl += `&page.pageNo=${searchRequest.limit.pageNo}&page.size=${searchRequest.limit.pageSize}`;
    } else {
      transactionUrl += `&page.pageNo=0&page.size=10`;
    }
    return this.http.get<TransactionSearchResponse>(transactionUrl).pipe(
      catchError(error => {
        this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }

  getEstIndividualTransactions(
    registrationNo: number,
    identifier: number,
    searchRequest?: SearchRequest
  ): Observable<TransactionSearchResponse> {
    let transactionUrl = `${this.baseUrl}/transaction?general=true&registrationNo=${registrationNo}&personIdentifier=${identifier}&sort.column=createdDate&sort.direction=DESC&filter.listOfStatus=In Progress`;
    if (searchRequest?.limit?.pageNo && searchRequest?.limit?.pageSize) {
      transactionUrl += `&page.pageNo=${searchRequest.limit.pageNo}&page.size=${searchRequest.limit.pageSize}`;
    } else {
      transactionUrl += `&page.pageNo=0&page.size=10`;
    }
    return this.http.get<TransactionSearchResponse>(transactionUrl).pipe(
      catchError(error => {
        this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }

  getIndividualTransactions(
    personId: number,
    sin?: number,
    searchRequest?: SearchRequest
  ): Observable<TransactionSearchResponse> {
    let transactionUrl = `${this.baseUrl}/transaction?general=true&sort.column=lastModifiedDate&sort.direction=DESC`;
    if (personId) {
      transactionUrl += `&personIdentifier=${personId}`;
    }
    if (sin) {
      transactionUrl += `&socialInsuranceNumber=${sin}`;
    }
    if (searchRequest?.limit?.pageNo && searchRequest?.limit?.pageSize) {
      transactionUrl += `&page.pageNo=${searchRequest.limit.pageNo}&page.size=${searchRequest.limit.pageSize}`;
    }
    if (searchRequest?.sort.column) {
      transactionUrl += `&sort.column=${searchRequest.sort.column}`;
    } else {
      transactionUrl += `&page.pageNo=0&page.size=10`;
    }
    return this.http.get<TransactionSearchResponse>(transactionUrl).pipe(
      catchError(error => {
        this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }

  /**
   * method to get contributor details
   */
  getContributorDetails(identifier: string): Observable<IndividualSearchDetails> {
    const contributorUrl = `${this.baseUrl}/contributor?${identifier}&pageNo=0&pageSize=10`;
    return this.http.get<IndividualSearchDetails>(contributorUrl).pipe(
      catchError(error => {
        this.alertService.showError(error.error.message);
        throw error;
      })
    );
  }

  /**
   * Method to get the individual transaction
   */
  getIndividualTransactionDetails() {
    return this.transaction;
  }

  /**
   * Method to set variable transaction
   * @param transaction
   */
  setIndividualTransactionDetails(transaction) {
    this.transaction = transaction;
  }
}
