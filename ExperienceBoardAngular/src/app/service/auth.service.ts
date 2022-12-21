import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CookieService } from 'ngx-cookie-service';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/user.model';

@Injectable()
export class AuthService {
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(
    private apollo: Apollo,
    private cookieService: CookieService,
    private http: HttpClient
  ) {}

  async getSessionToken(sessionToken: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      UserKey: sessionToken,
    });
    const options = { headers };
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiSession}get-session-response`, options)
        .subscribe(
          (res) => {
            resolve(res);
          },
          () => {
            reject();
          }
        );
    });
  }

  async deleteSession(sessionToken: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'r-access-token': sessionToken,
    });
    const options = { headers };
    return new Promise((resolve, reject) => {
      this.http
        .delete(`${environment.apiSession}delete-session`, options)
        .subscribe(
          (res) => {
            resolve(res);
          },
          () => {
            reject();
          }
        );
    });
  }

  getCookie(key: string) {
    const cookie = this.cookieService.get(key);
    if (cookie) return cookie;
    return null;
  }

  setCookie(key: string, value: string) {
    this.cookieService.set(key, value);
  }

  deleteCookie(key: string) {
    this.cookieService.delete(key);
  }
}
