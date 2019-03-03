import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class AlbumService {
  constructor(
    private http: Http,
    private localStorageService: LocalStorageService,
  ) {}
  getInfo(album: string, artist: string, username: string): Promise<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('api_key', this.localStorageService.get('api_key').toString());
    params.set('album', album);
    params.set('artist', artist);
    params.set('method', 'album.getInfo');
    params.set('username', username);
    params.set('format', 'json');
    return this.http
      .get(this.localStorageService.get('APIURL').toString(), {
        search: params,
      })
      .toPromise()
      .then(data => data.json() as any)
      .catch(this.handleError);
  }
  getReleasesFromMusicBrainzByArtistAndRelease(
    artist: string,
    release: string,
  ): Promise<any> {
    return this.http
      .get(
        'http://musicbrainz.org/ws/2/release?inc=discid&query=artist:"' +
          artist +
          '" AND release:"' +
          release +
          '"',
      )
      .toPromise()
      .then(data => data.json() as any)
      .catch(this.handleError);
  }
  getRecordingsFromMusicBrainzByRelease(mbid: string): Promise<any> {
    // return this.http.get('http://musicbrainz.org/ws/2/release?release=' + mbid + '&inc=ratings&fmt=json&limit=100')
    return this.http
      .get(
        'http://musicbrainz.org/ws/2/release?release-group=' +
          mbid +
          '&inc=recordings',
      )
      .toPromise()
      .then(data => data.json() as any)
      .catch(this.handleError);
  }

  getOptimalReleaseFromArray(releases: Array<any>): any {
    //releases are sort by trackcount
    releases.sort((a, b) => {
      return a.media[0].tracks.length - b.media[0].tracks.length;
    });

    //helperarray contains information about the number of trackcount e.g. {trackCount: 14, count: 2}
    let helperArray = [];
    for (let rel of releases) {
      let helperObject = helperArray.find(
        obj => obj.trackCount == rel.media[0].tracks.length,
      );
      if (helperObject != undefined) helperObject.count += 1;
      else {
        helperObject = { trackCount: rel.media[0].tracks.length, count: 1 };
        helperArray.push(helperObject);
      }
    }

    //sort by count and trackcount
    helperArray.sort((b, a) => {
      let result = a.count - b.count;
      if (result == 0) result = a.trackCount - b.trackCount;
      return result;
    });
    //element with highest number returned
    return releases.find(
      rel => rel.media[0].tracks.length == helperArray[0].trackCount,
    );
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
