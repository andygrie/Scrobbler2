import { Injectable }    from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import {Md5} from 'ts-md5/dist/md5';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService{

    private authenticationUrl = 'http://ws.audioscrobbler.com/2.0';
    constructor(private http: Http, private localStorageService : LocalStorageService) { }

    //returns session key and name
    getSession(): Observable<any> {
        this.setLocalStorageItems();
        let params: URLSearchParams = new URLSearchParams();
        params.set('token', this.localStorageService.get('token').toString());
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('method', 'auth.getSession');
        params.set('format', 'json');
        params.set('api_sig', Md5.hashStr('api_key' + this.localStorageService.get('api_key').toString() + 
                                            'method' + 'auth.getSession' +
                                            'token' + this.localStorageService.get('token').toString() + 
                                            this.localStorageService.get('secret')).toString().toString());

        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .map(data => data.json());
    }
    //sets api_key and secret in localstorage
    setLocalStorageItems() : void{
        this.localStorageService.set('api_key', '968954a051a88731589fe3bbe97f35c8');
        this.localStorageService.set('secret', 'ac3aec744c1e5f1a6b5da20b9b1864d7');
    }
}