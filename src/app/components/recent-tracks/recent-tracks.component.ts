import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';

import { UserService } from '../../services/user/user.service';
import { ArtistService } from '../../services/artist/artist.service';
import { TrackService } from '../../services/track/track.service';
import { AlbumService } from '../../services/album/album.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { escape, unescape, parse } from 'querystring';
import { Observable } from 'rxjs';

@Component({
  selector: 'artists',
  templateUrl: './recent-tracks.component.html',
  styleUrls: ['./recent-tracks.component.css'],
})
export class RecentTracksComponent implements OnInit {
  recentTracks: any[] = new Array<any>();
  detailView: string;
  topAlbumsOfSelectedArtist: any[];
  albumsForUpdate: any[];
  selectedTrack: any;
  newAlbum: any;
  page: number;
  loadHelper: boolean;
  isRequesting: boolean;
  warnings: any[] = new Array<any>();
  errors: any[] = new Array<any>();
  selectionType: any;
  newAlbumWritten: any;

  @HostListener('window:scroll', ['$event'])
  track(event) {
    if (
      this.loadHelper == true &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.anyTrackSelected()
    ) {
      this.loadHelper = false;
      this.page++;
      this.isRequesting = true;
      this.userService.getRecentTracks(200, this.page).then(data => {
        if (data[0].date == undefined) data.shift();
        this.recentTracks = this.recentTracks.concat(data);
        this.loadHelper = true;
        this.stopRefreshing();
      }, this.showErrorMessage);
    }
  }

  constructor(
    private userService: UserService,
    private artistService: ArtistService,
    private trackService: TrackService,
    private albumService: AlbumService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private dialogService: DialogService,
  ) {}
  ngOnInit(): void {
    this.isRequesting = true;
    this.loadHelper = false;
    this.page = 1;
    this.userService.getRecentTracks(200, this.page).then(data => {
      if (data[0].date == undefined) data.shift();
      this.recentTracks = data;
      console.log(data);
      for (let t of this.recentTracks) {
        t.date['#text'] = new Date(parseInt(t.date.uts) * 1000);
      }
      this.loadHelper = true;
      this.stopRefreshing();
    }, this.showErrorMessage);
  }
  isOdd(index: number): boolean {
    return Math.floor(index / 2) * 2 == index;
  }
  getPositionOfWarning(warning: any) {
    return (parseInt(warning) / this.recentTracks.length) * window.innerHeight;
  }
  getPositionOfError(error: any) {
    return (parseInt(error) / this.recentTracks.length) * window.innerHeight;
  }
  conventionsWarning(track: any, index: any): boolean {
    let conspicuousStrings: string[] = ['(', ')', '[', ']', 'Version'];
    let warning = false;
    for (let i = 0; i < conspicuousStrings.length && warning === false; i++) {
      if (
        track.album['#text'].indexOf(conspicuousStrings[i]) === -1 &&
        track.artist['#text'].indexOf(conspicuousStrings[i]) === -1 &&
        track.name.indexOf(conspicuousStrings[i]) === -1
      )
        warning = false;
      else warning = true;
    }
    if (warning && this.warnings.indexOf(index) == -1)
      this.warnings.push(index);
    return warning;
  }
  conventionsError(track: any, index): boolean {
    let conspicuousStrings: string[] = ['Album Version', 'Explicit', '[Clean]'];
    let error = false;

    if (track.album['#text'].length == 0) error = true;

    for (let i = 0; i < conspicuousStrings.length && error === false; i++) {
      if (
        track.album['#text'].indexOf(conspicuousStrings[i]) === -1 &&
        track.artist['#text'].indexOf(conspicuousStrings[i]) === -1 &&
        track.name.indexOf(conspicuousStrings[i]) === -1
      )
        error = false;
      else error = true;
    }

    if (error && this.errors.indexOf(error) == -1) this.errors.push(index);
    return error;
  }
  showErrorMessage(error: any): void {
    alert(error.status + ' ' + error.statusText + ' ' + error['_body']);
  }
  imageFocused(track: any): void {
    this.detailView = track.image[3]['#text'];
  }
  imageUnfocused(): void {
    this.detailView = null;
  }
  getAlbumsForSpecificTrack(track: any): void {
    let alreadyTracksSelected = this.anyTrackSelected();
    track.selected = !track.selected;
    if (track.selected && !alreadyTracksSelected) {
      this.selectedTrack = track;
      this.loadReleaseGroups(
        0,
        encodeURIComponent(track.artist['#text']),
        track.name,
      );
    } else if (!this.anyTrackSelected()) {
      this.selectedTrack = null;
      this.albumsForUpdate = null;
      this.newAlbum = null;
    }
  }
  loadReleaseGroups(offset: number, artistName: string, track: string): void {
    this.artistService
      .getAlbumInfoFromMusicBrainzByArtistName(artistName, offset)
      .then(releases => {
        console.log(releases);
        if (offset == 0) this.albumsForUpdate = releases['release-groups'];
        else
          this.albumsForUpdate = this.albumsForUpdate.concat(
            releases['release-groups'],
          );
        if (offset + 100 < releases.count)
          this.loadReleaseGroups(offset + 100, artistName, track);
        else {
          this.findValidAlbumsForUpdate(artistName, track);
        }
      });
  }
  findValidAlbumsForUpdate(artistName: string, track: string) {
    this.artistService
      .getRecordingsAndReleasesFromMusicBrainzByArtistNameAndRecording(
        artistName,
        track,
        0,
      )
      .then(recordingResponse => {
        console.log(recordingResponse);

        let helperArray = [];
        for (let recording of recordingResponse.recordings) {
          for (let release of recording.releases) {
            helperArray.push(release.title);
          }
        }
        this.validateAlbumsForUpdate(helperArray);
      });
  }

  validateAlbumsForUpdate(helperArray): void {
    helperArray.forEach((helper: any) => {
      let correctAlbum = this.albumsForUpdate.find(
        album => album.title === helper,
      );
      if (correctAlbum != undefined) {
        correctAlbum.valid = true;
        console.log(helper);
      }
    });
    this.albumsForUpdate.sort((a, b) => {
      let result = 0;
      if (a.valid && !b.valid) result = -1;
      else if (!a.valid && b.valid) result = 1;
      else if (a.title < b.title) result = -1;
      else if (a.title > b.title) result = 1;
      return result;
    });
  }

  scrobbleSelectedTracks(): void {
    let selectedTracks = this.recentTracks.filter(
      track => track.selected == true,
    );

    for (let track of selectedTracks) {
      let album;
      if (this.selectionType == 'select') album = this.newAlbum.title;
      else album = this.newAlbumWritten;

      this.trackService
        .scrobbleTrack(
          track.artist['#text'],
          track.name,
          album,
          parseInt(track.date.uts) + 60,
        )
        .then(data => {
          this.userService
            .getTracksBetweenBoundaries(
              1,
              1,
              parseInt(data.scrobbles.scrobble.timestamp) - 1,
              parseInt(data.scrobbles.scrobble.timestamp) + 1,
              this.localStorageService.get('name').toString(),
            )
            .then(correctedScrobbles => {
              if (correctedScrobbles.recenttracks.track.length > 0) {
                track.album = correctedScrobbles.recenttracks.track[0].album;
                track.artist = correctedScrobbles.recenttracks.track[0].artist;
                track.date = correctedScrobbles.recenttracks.track[0].date;
                track.image = correctedScrobbles.recenttracks.track[0].image;
                track.mbid = correctedScrobbles.recenttracks.track[0].mbid;
                track.name = correctedScrobbles.recenttracks.track[0].name;
                track.streamable =
                  correctedScrobbles.recenttracks.track[0].streamable;
                track.url = correctedScrobbles.recenttracks.track[0].url;
              }
              track.selected = false;
              if (!this.anyTrackSelected()) {
                this.selectedTrack = null;
                this.albumsForUpdate = null;
                this.newAlbum = null;
                this.newAlbumWritten = null;
                this.selectionType = null;
              }
            }, this.showErrorMessage);
        }, this.showErrorMessage);
    }
  }
  anyTrackSelected(): boolean {
    return (
      this.recentTracks.filter(track => track.selected == true).length != 0
    );
  }
  stopPropagation(event): void {
    event.stopPropagation();
  }
  goToArtist(artistName: string): void {
    this.router.navigate(['/artist', artistName]);
  }
  public openDialogTrackinfo(
    artistName: string,
    trackName: string,
    albumName: string,
  ) {
    this.dialogService
      .confirmTrackinfoDialog(trackName, artistName, albumName)
      .subscribe(res => {});
  }
  stopRefreshing() {
    this.isRequesting = false;
  }
  encodeAlbumLinkURIComponent(artist: string, album: string): string {
    //album/{{track.album['#text']}}/{{track.artist['#text']}}
    return (
      'album/' + encodeURIComponent(album) + '/' + encodeURIComponent(artist)
    );
  }
  openDialogNewScrobbleBefore(date): void {
    console.log(date);
    this.dialogService
      .confirmNewScrobbleDialogWithDateAfter(date * 1000)
      .subscribe(res => {
        console.log(res);

        this.userService
          .getTracksBetweenBoundaries(
            200,
            1,
            parseInt(res.startDate) - 1,
            parseInt(res.endDate) + 1,
            this.localStorageService.get('name').toString(),
          )
          .then(scrobbles => {
            for (let i = 0; i < scrobbles.recenttracks.track.length; i++) {
              if (scrobbles.recenttracks.track[i].date != undefined) {
                scrobbles.recenttracks.track[i].date['#text'] = new Date(
                  parseInt(scrobbles.recenttracks.track[i].date.uts) * 1000,
                );
                this.recentTracks.push(scrobbles.recenttracks.track[i]);
              }
            }
            this.recentTracks.sort((a, b) => {
              return parseInt(b.date.uts) - parseInt(a.date.uts);
            });
          });
      });
  }
}
