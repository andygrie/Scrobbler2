import { Injectable }    from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import {Md5} from 'ts-md5/dist/md5';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService{
    constructor(private http: Http, private localStorageService : LocalStorageService) { }
    
    getRecentTracks(limit : number, page : number) : Promise<any[]>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('limit', limit.toString());
        params.set('method', 'user.getRecentTracks');
        params.set('page', page.toString());
        params.set('user', this.localStorageService.get('name').toString());
        params.set('format', 'json');
        params.set('api_sig', Md5.hashStr('api_key' + this.localStorageService.get('api_key').toString() + 
                                            'limit' + limit + 
                                            'method' + 'user.getRecentTracks' + 
                                            'page' + page +
                                            'user' + this.localStorageService.get('name') +
                                            this.localStorageService.get('secret').toString()).toString());
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json().recenttracks.track as any[])
            .catch(this.handleError);
    }
    getTracksBetweenBoundaries(limit : number, page : number, lowerBoundary : number, upperBoundary : number, user : string) : Promise<any>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('from' , lowerBoundary.toString());
        params.set('to', upperBoundary.toString());
        params.set('limit', limit.toString());
        params.set('method', 'user.getRecentTracks');
        params.set('page', page.toString());
        params.set('user', user);
        params.set('format', 'json');
        params.set('api_sig', Md5.hashStr('api_key' + this.localStorageService.get('api_key').toString() + 
                                            'from' + lowerBoundary +
                                            'limit' + limit + 
                                            'method' + 'user.getRecentTracks' + 
                                            'page' + page +
                                            'to' + upperBoundary +
                                            'user' + user +
                                            this.localStorageService.get('secret').toString()).toString());
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json())
            .catch(this.handleError);
    }
    getTopArtists(limit : number, page : number) : Promise<any[]>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('limit', limit.toString());
        params.set('method', 'user.getTopArtists');
        params.set('page', page.toString());
        params.set('user', this.localStorageService.get('name').toString());
        params.set('format', 'json');
        params.set('api_sig', Md5.hashStr('api_key' + this.localStorageService.get('api_key').toString() + 
                                            'limit' + limit + 
                                            'method' + 'user.getTopArtists' + 
                                            'page' + page +
                                            'user' + this.localStorageService.get('name') +
                                            this.localStorageService.get('secret').toString()).toString());
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json().topartists.artist as any[])
            .catch(this.handleError);
    }
    getWeeklyArtistChart(from : number, to : number, user : string) : Promise<any[]>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('from', from.toString());
        params.set('method', 'user.getWeeklyArtistChart');
        params.set('to', to.toString());
        params.set('user', user);
        params.set('format', 'json');
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json().weeklyartistchart.artist as any[])
            .catch(this.handleError);
    }
    getWeeklyAlbumChart(from : number, to : number) : Promise<any[]>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('from', from.toString());
        params.set('method', 'user.getWeeklyAlbumChart');
        params.set('to', to.toString());
        params.set('user', this.localStorageService.get('name').toString());
        params.set('format', 'json');
        params.set('api_sig', Md5.hashStr('api_key' + this.localStorageService.get('api_key').toString() + 
                                            'from' + from + 
                                            'method' + 'user.getWeeklyAlbumChart' + 
                                            'to' + to +
                                            'user' + this.localStorageService.get('name') +
                                            this.localStorageService.get('secret').toString()).toString());
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json().weeklyalbumchart.album as any[])
            .catch(this.handleError);
    }
    getWeeklyTrackChart(from : number, to : number) : Promise<any[]>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('from', from.toString());
        params.set('method', 'user.getWeeklyTrackChart');
        params.set('to', to.toString());
        params.set('user', this.localStorageService.get('name').toString());
        params.set('format', 'json');
        params.set('api_sig', Md5.hashStr('api_key' + this.localStorageService.get('api_key').toString() + 
                                            'from' + from + 
                                            'method' + 'user.getWeeklyTrackChart' + 
                                            'to' + to +
                                            'user' + this.localStorageService.get('name') +
                                            this.localStorageService.get('secret').toString()).toString());
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json().weeklytrackchart.track as any[])
            .catch(this.handleError);
    }
    getWeeklyChartList() : Promise<any>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('method', 'user.getWeeklyChartList');
        params.set('user', this.localStorageService.get('name').toString());
        params.set('format', 'json');
        params.set('api_sig', Md5.hashStr('api_key' + this.localStorageService.get('api_key').toString() + 
                                            'method' + 'user.getWeeklyChartList' + 
                                            'user' + this.localStorageService.get('name') +
                                            this.localStorageService.get('secret').toString()).toString());
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json())
            .catch(this.handleError);
    }
    getTopAlbums(limit : number, page : number) : Promise<any[]>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('limit', limit.toString());
        params.set('method', 'user.getTopAlbums');
        params.set('page', page.toString());
        params.set('user', this.localStorageService.get('name').toString());
        params.set('format', 'json');
        params.set('api_sig', Md5.hashStr('api_key' + this.localStorageService.get('api_key').toString() + 
                                            'limit' + limit + 
                                            'method' + 'user.getTopAlbums' + 
                                            'page' + page +
                                            'user' + this.localStorageService.get('name') +
                                            this.localStorageService.get('secret').toString()).toString());
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json().topalbums.album as any[])
            .catch(this.handleError);
    }
    getTopTracks(limit : number, page : number, period : string) : Promise<any[]>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('limit', limit.toString());
        params.set('method', 'user.getTopTracks');
        params.set('page', page.toString());
        params.set('period', period);
        params.set('user', this.localStorageService.get('name').toString());
        params.set('format', 'json');
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json().toptracks.track as any[])
            .catch(this.handleError);
    }
    getTopTags(limit : number) : Promise<any>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        //params.set('limit', limit.toString());
        params.set('method', 'user.getTopTags');
        // params.set('user', this.localStorageService.get('name').toString());
        params.set('user', 'hororaid');
        params.set('format', 'json');
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json())
            .catch(this.handleError);
    }
    getArtistTracks(page : number, artist : string, from : number, to : number, username : string) : Promise<any[]>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('artist', artist);
        if(from != -1)
            params.set('startTimestamp', from.toString());
        if(to != -1)
            params.set('endTimestamp', to.toString());
        params.set('limit', '200');
        params.set('method', 'user.getArtistTracks');
        params.set('page', page.toString());
        params.set('user', username);
        params.set('format', 'json');
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json().artisttracks.track as any[])
            .catch(this.handleError);
    }
    getFriends(page : number, limit: number, user : string, recenttracks : number) : Promise<any>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('api_key', this.localStorageService.get('api_key').toString());
        params.set('limit', limit.toString());
        params.set('method', 'user.getFriends');
        params.set('page', page.toString());
        params.set('recenttracks', recenttracks.toString());
        params.set('user', user);
        params.set('format', 'json');
        return this.http.get(this.localStorageService.get('APIURL').toString(), { search : params })
            .toPromise()
            .then(data => data.json())
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}