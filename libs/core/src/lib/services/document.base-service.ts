/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { DocumentItem, Environment } from '../models';
import { Inject } from '@angular/core';
import { EnvironmentToken } from '../tokens';

export abstract class DocumentBaseService {
  constructor(@Inject(EnvironmentToken) readonly environment: Environment) {}
  removeDuplicateDocs(docsWithDuplicates: DocumentItem[]): DocumentItem[] {
    return docsWithDuplicates?.reduce((withoutDuplicates, document, _, docsInput) => {
      const duplicateDocs = docsInput.filter(
        it =>
          it.sequenceNumber === document.sequenceNumber &&
          (it.documentTypeId === document.documentTypeId ||
            it.parentDocumentId === document.documentTypeId ||
            it.documentTypeId === document.parentDocumentId)
      ); //get duplicate documents
      if (duplicateDocs?.length === 1) {
        //no duplicates
        withoutDuplicates.push(document);
      } else {
        // has both internal and external document
        const docWithConent = duplicateDocs?.find(doc => (doc.contentId ? true : false)); //get doc with contentid
        if (docWithConent) {
          //any one document has content
          if (withoutDuplicates.indexOf(docWithConent) === -1) {
            // Check if documents is not already pushed
            withoutDuplicates.push(docWithConent);
          }
        } else {
          //if no document has content then show internal
          if (!document.parentDocumentId) {
            withoutDuplicates.push(document);
          }
        }
      }
      return withoutDuplicates;
    }, []);
  }

  /** Method to check whether mandatory documents are scanned / uploaded.
   * @param docList document list
   */
  checkMandatoryDocuments(docList: DocumentItem[]): boolean {
    let flag = true;
    if (docList) {
      docList.forEach(document => {
        if (document.required && (document.documentContent === null || document.documentContent === 'NULL')) {
          document.uploadFailed = true;
          flag = false;
        } else {
          document.uploadFailed = false;
        }
      });
    }
    return flag;
  }

  /**
   * Method to get url for connecting to wcc/printer drvier
   * @param businessKey
   * @param transactionId
   * @param documentName
   * @param uuid
   */
  getWccScanUrl(
    businessKey,
    transactionId,
    documentName,
    uuid,
    referenceNo?,
    referenceIds?: number[],
    sequenceNo?: number,
    userAccessList?: string[],
    identifier?: string,
    documentTypeId?: number,
    description?: string
  ): string {
    //let oracleUrl = `oraclecapture://CaptureWorkspace=Scan Demo&ClientProfile=Scan Demo Profile&CaptureDriver=CAPTURE_TWAIN_DRIVER&CaptureSource=PaperStream IP fi-7160&SignOutOnRelease=0&Transaction ID=${transactionId}&Document Type=${documentName}`;
    let oracleUrl = `oraclecapture://CaptureWorkspace=Scan Demo&ClientProfile=Scan Demo Profile&CaptureDriver=CAPTURE_IMPORT_DRIVER&CaptureSource=Import Source&SignOutOnRelease=0&Transaction ID=${transactionId}&Document Type=${documentName}`;
    if (businessKey) {
      oracleUrl += `&Business Key=${businessKey}`;
    }
    if (referenceIds && referenceIds.length > 0) {
      oracleUrl += `&Reference No=${referenceIds.join(',')}`;
    } else if (referenceNo) {
      oracleUrl += `&Reference No=${referenceNo}`;
    }
    if (uuid) {
      oracleUrl += `&UUID=${uuid}`;
    }
    if (sequenceNo) {
      oracleUrl += `&Sequence No=${sequenceNo}`;
    }
    if (sequenceNo) {
      oracleUrl += `&Identifier=${identifier}`;
    }
    if (userAccessList && userAccessList.length >= 0) {
      oracleUrl += `&User Access List=${userAccessList.join(',')}`;
    }
    if (documentTypeId) {
      oracleUrl += `&DocumentType ID=${documentTypeId}`;
    }
    if (description) {
      oracleUrl += `&Description=${description}`;
    }
    return oracleUrl;
  }
}
