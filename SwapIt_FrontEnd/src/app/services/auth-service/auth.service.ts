import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { LocalStorageService } from '../storage-service/local-storage.service';

const BASIC_URL = environment["BASIC_URL"]
export const AUTH_HEADER = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private storageService: LocalStorageService) { }
  
  register(signupDTO:any):Observable<any> {
    return this.http.post<[]>(BASIC_URL + "sign-up", signupDTO);
  }

  login(username: string, password: string): any {
    return this.http.post<[]>(BASIC_URL + "authenticate",
      { username, password },
      { observe: `response` })
      .pipe(
        tap(_ => this.log("User Authentication")),
        map((res: HttpResponse<any>) => {
          this.storageService.saveUserId(res.body.userId);
          this.storageService.saveUserRole(res.body.role);
          const tokenLength = res.headers.get(AUTH_HEADER)?.length;
          const bearerToken = res.body.token;
          this.storageService.saveToken(bearerToken);
          return res;
        })
      );
  }

  log(message: string):void {
    console.log(`User Auth Service: ${message}`)
  }
}
