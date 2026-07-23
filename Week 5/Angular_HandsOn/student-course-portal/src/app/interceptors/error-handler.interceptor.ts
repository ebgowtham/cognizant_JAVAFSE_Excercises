import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('errorHandlerInterceptor caught HTTP error:', error);
      if (error.status === 401) {
        console.warn('Unauthorized (401) - Redirecting to home...');
        router.navigate(['/']);
      } else if (error.status === 500) {
        console.error('Server error (500) detected.');
        // We can display a global alert or handle otherwise
        alert('Global Server Error (500): Please try again later.');
      }
      return throwError(() => error);
    })
  );
};
