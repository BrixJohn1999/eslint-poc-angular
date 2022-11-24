import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Params,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../service/auth.service';
import { DashboardService } from '../service/dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    let isAuthenticated: boolean = false;
    if (this.authService.getCookie('rsid')) {
      const sessionToken = this.authService.getCookie('rsid');
      await this.authService.getSessionToken(sessionToken).then((res) => {
        if (res) {
          isAuthenticated = true;
        } else if (state.root.queryParams['rtoken']) {
          this.authService.deleteCookie('rsid');
          const sessionToken: Params = state.root.queryParams['rtoken'];
          this.authService.setCookie('rsid', sessionToken.toString());
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true,
          });
          isAuthenticated = false;
        } else {
          this.authService.deleteCookie('rsid');
          window.location.href =
            'https://qa3-myaccess.stevensonsystems.com/login';
          isAuthenticated = false;
        }
      });
    } else if (state.root.queryParams['rtoken']) {
      const sessionToken: Params = state.root.queryParams['rtoken'];
      this.authService.setCookie('rsid', sessionToken.toString());
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true,
      });
      isAuthenticated = false;
    } else {
      this.authService.deleteCookie('rsid');
      window.location.href = 'https://qa3-myaccess.stevensonsystems.com/login';
      isAuthenticated = false;
    }

    return isAuthenticated;
  }
}
