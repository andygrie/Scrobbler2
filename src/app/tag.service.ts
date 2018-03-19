import { Injectable }    from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers, RequestOptionsArgs } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import {Md5} from 'ts-md5/dist/md5';
import 'rxjs/add/operator/toPromise';


declare function unescape(s:string): string;
declare function escape(s:string): string;

@Injectable()
export class TagService{
    constructor(private http: Http, private localStorageService : LocalStorageService) { }

    getTopAlbums(tag : string) : Promise<any>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('tag', tag);
        params.set('method', 'tag.getTopAlbums');
        params.set('limit', '9');
        params.set('format', 'json');
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json().albums.album)
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}