import { Injectable }    from '@angular/core';
import { Http, URLSearchParams, RequestOptions, Headers, RequestOptionsArgs } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import {Md5} from 'ts-md5/dist/md5';
import 'rxjs/add/operator/toPromise';


declare function unescape(s:string): string;
declare function escape(s:string): string;

@Injectable()
export class TrackService{
    constructor(private http: Http, private localStorageService : LocalStorageService) { }
    getInfo(artist : string, track : string, username : string) : Promise<any>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('artist', artist);
        params.set('track', track);
        params.set('method', 'track.getInfo');
        params.set('username', username);
        params.set('format', 'json');
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json().track as any)
            .catch(this.handleError);
    }

    scrobbleTrack(artist : string, track : string, album : string, timeStamp : number) : Promise<any>{
        let fd: URLSearchParams = new URLSearchParams();
        fd.append('album', unescape(album));
        fd.append('api_key', this.localStorageService.get('api_key').toString());
        fd.append('artist', unescape(artist));
        fd.append('format', 'json');
        fd.append('method', 'track.scrobble');
        fd.append('sk', this.localStorageService.get('sk').toString());
        fd.append('timestamp', timeStamp.toString());
        fd.append('track', unescape(track));
        fd.append('api_sig',  Md5.hashStr('album' + unescape(album) + 
                                            'api_key' + this.localStorageService.get('api_key').toString() + 
                                            'artist' + unescape(artist) + 
                                            'method' + 'track.scrobble' + 
                                            'sk' + this.localStorageService.get('sk').toString() + 
                                            'timestamp' + timeStamp + 
                                            'track' + unescape(track) + 
                                            this.localStorageService.get('secret')).toString());
        let headers : Headers = new Headers({
            'Content-Type': 'application/json'
        });
        let opts : RequestOptionsArgs = { headers: headers };
        return this.http.post(this.localStorageService.get('APIURL').toString(), fd, opts)
            .toPromise()
            .then(data => data.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}