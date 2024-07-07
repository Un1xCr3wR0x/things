import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from '../models';
import { AlertService } from './alert.service';
import { Observable, of } from 'rxjs';
import { CryptoService } from './crypto.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdentityManagementService {
  constructor(readonly http: HttpClient, readonly alertService: AlertService, readonly cryptoService: CryptoService) {}
  /**
   * Method to get the Team Member Profile Data
   * @param userId
   */
  getProfile(userId: string): Observable<UserProfile> {
    if (userId) {
      userId = userId.toString();
      const profileUrl = `/api/process-manager/v1/identity/profile/${this.cryptoService.encrypt(userId)}`;
      return this.http
        .get<UserProfile>(profileUrl, {
          headers: { ignoreLoadingBar: '' }
        })
        .pipe(
          map(res => {
            const profile = new UserProfile();
            profile.longNameArabic = res.displayName;
            return profile;
          })
        );
    } else return of(null);
  }
  /**
   * method to show alerts
   * @param error
   */
  showAlerts(error) {
    this.alertService.showError(error.error.message);
  }
}
