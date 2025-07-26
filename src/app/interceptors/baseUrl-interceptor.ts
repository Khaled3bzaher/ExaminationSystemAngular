import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environment';

const baseUrl = environment.apiUrl;
export const urlInterceptor: HttpInterceptorFn = (req, next) => {

    req= req.clone({
        url:baseUrl+req.url
    });
  return next(req);
};
