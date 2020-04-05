import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';

import { LocalStorageService } from '../localStorage/local-storage.service';

@Injectable()
export class CsrfService {
  constructor(
    private http: Http,
    private localStorageService: LocalStorageService,
  ) {}

  getCSRFToken(): any {
    console.log('Fetching CSRF token');

    const url = `https://bypasscors.herokuapp.com/api/?url=${encodeURIComponent(
      this.localStorageService.get('LOGINURL').toString(),
    )}`;
    this.http
      .get(url, { withCredentials: false })
      .toPromise()
      .then(
        data => {
          console.log(data);
        },
        // function(error, response, body) {
        //   if (!error && response.statusCode == 200) {
        //     //Filter out the csrftoken cookie
        //     jar.getCookies(settings.loginUrl).filter(function(value) {
        //       if (value.key === 'csrftoken') {
        //         json.csrftoken = value.value;

        //         log.info('Token ' + json.csrftoken);

        //         return true;
        //       }
        //     });
        //   } else {
        //     console.log('Could not capture csrf token');
        //     process.exit(1);
        //   }

        // callback(null, "one");
        // },
      );
  }
}
