import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers } from '@angular/http';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class ArtistService {
  constructor(
    private http: Http,
    private localStorageService: LocalStorageService,
  ) {}
  getTopAlbums(artist: string): Promise<any[]> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('api_key', this.localStorageService.get('api_key').toString());
    params.set('artist', artist);
    params.set('method', 'artist.getTopAlbums');
    //params.set('limit', '200');
    params.set('format', 'json');
    return this.http
      .get(this.localStorageService.get('APIURL').toString(), {
        search: params,
      })
      .toPromise()
      .then(data => data.json().topalbums.album as any[])
      .catch(this.handleError);
  }
  getTopTags(artist: string): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('api_key', this.localStorageService.get('api_key').toString());
    params.set('artist', artist);
    params.set('method', 'artist.getTopTags');
    params.set('format', 'json');
    return this.http
      .get(this.localStorageService.get('APIURL').toString(), {
        search: params,
      })
      .toPromise()
      .then(data => data.json().toptags.tag)
      .catch(this.handleError);
  }
  getInfo(artist: string, username: string): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('api_key', this.localStorageService.get('api_key').toString());
    params.set('artist', artist);
    params.set('method', 'artist.getInfo');
    params.set('format', 'json');
    params.set('username', username);
    return this.http
      .get(this.localStorageService.get('APIURL').toString(), {
        search: params,
      })
      .toPromise()
      .then(data => data.json())
      .catch(this.handleError);
  }
  getAlbumInfoFromMusicBrainzByArtistId(artistmbid: string): Promise<any> {
    return this.http
      .get(
        'https://musicbrainz.org/ws/2/release-group?artist=' +
          artistmbid +
          '&inc=ratings&fmt=json&limit=100',
      )
      .toPromise()
      .then(data => data.json() as any)
      .catch(this.handleError);
  }
  getAlbumInfoFromMusicBrainzByArtistName(
    name: string,
    offset: number,
  ): Promise<any> {
    return this.http
      .get(
        'https://musicbrainz.org/ws/2/release-group?query=artist:"' +
          name +
          '"&inc=ratings+recordings&fmt=json&limit=100&offset=' +
          offset,
      )
      .toPromise()
      .then(data => data.json() as any)
      .catch(this.handleError);
  }
  getRecordingsAndReleasesFromMusicBrainzByArtistNameAndRecording(
    artist: string,
    recording: string,
    offset: number,
  ): Promise<any> {
    return this.http
      .get(
        'https://musicbrainz.org/ws/2/recording?query=artist:"' +
          artist +
          '" AND recording:"' +
          recording +
          '"&inc=rel-releases&fmt=json&limit=100&offset=' +
          offset,
      )
      .toPromise()
      .then(data => data.json() as any)
      .catch(this.handleError);
  }
  getTopTracks(artist: string): Promise<any[]> {
    let headers = new Headers();
    headers.append('x-forwarded-host', 'foo');
    this.http
      .get(
        'https://www.last.fm/music/Leprous/+tracks?date_preset=LAST_7_DAYS',
        { headers: headers },
      )
      .subscribe(response => {
        console.log(response);
      });

    // let headers = new Headers();
    // headers.append('x-forwarded-host', 'foo');
    return this.http
      .get(
        'https://www.last.fm/music/Leprous/+tracks?date_preset=LAST_7_DAYS',
        { headers: headers },
      )
      .toPromise()
      .then(data => data.json().topalbums.album as any[])
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
