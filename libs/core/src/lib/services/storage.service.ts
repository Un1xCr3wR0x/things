/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Injectable } from '@angular/core';

/**
 * StorageService for handling browser default
 * localstorage and sessionstorage
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  /**
   *
   * @param key unique identifier for session value to store
   * @param value value to store
   */
  public setSessionValue(key, value) {
    sessionStorage.setItem(key, value);
  }

  /**
   *
   * @param key unique identifier to fetch session value
   */
  public getSessionValue(key) {
    return sessionStorage.getItem(key);
  }

  /**
   * Clear all session storage values
   */
  public clearSession() {
    sessionStorage.clear();
  }

  /**
   *
   * @param key unique identifier for local value to store
   * @param value value to store
   */
  public setLocalValue(key, value) {
    localStorage.setItem(key, value);
  }

  /**
   *
   * @param key unique identifier to fetch local value
   */
  public getLocalValue(key) {
    return localStorage.getItem(key);
  }

  /**
   * Clear all local storage values
   */
  public clearLocal() {
    localStorage.clear();
  }

  /**
   * Clear local storage value with key
   */
  public clearLocalValue(key) {
    localStorage.removeItem(key);
  }
}
