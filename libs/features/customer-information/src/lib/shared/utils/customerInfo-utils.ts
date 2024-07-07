import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '@gosi-ui/core/lib/services/alert.service';

export const showErrorMessage = function (err: HttpErrorResponse, alertService: AlertService) {
  if (err.error.details && err.error.details.length > 0) {
    alertService.showError(null, err.error.details);
  } else {
    alertService.showError(err.error.message);
  }
};
