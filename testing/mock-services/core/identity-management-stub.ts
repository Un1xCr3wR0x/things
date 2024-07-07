import { of } from 'rxjs';
export class identityManagementServiceStub {
  getProfile(userId) {
    if (userId)
      return of({
        preferredLanguage: 'null',
        gosiscp: '[{"role":["101"]}]',
        userreferenceid: '42064',
        mobile: 'null',
        userId: 'e0042064',
        email: 'string',
        longNameArabic: 'string'
      });
    return of(null);
  }
}
