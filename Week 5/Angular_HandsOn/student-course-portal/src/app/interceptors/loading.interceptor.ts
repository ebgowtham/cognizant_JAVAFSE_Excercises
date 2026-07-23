import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Show loading spinner before request starts
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      /*
       * WHY finalize IS THE CORRECT PLACE TO HIDE THE SPINNER:
       * In RxJS, the `finalize` operator executes when the Observable source terminates
       * (either by completing successfully or throwing an error). This matches the behavior
       * of a try/catch/finally block, guaranteeing that the loading state is always set
       * back to false and the spinner is hidden, preventing it from getting stuck on failure.
       */
      loadingService.hide();
    })
  );
};
