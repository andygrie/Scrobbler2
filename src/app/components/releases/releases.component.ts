import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';

import { UserService } from '../../services/user/user.service';
import { ArtistService } from '../../services/artist/artist.service';
import { TrackService } from '../../services/track/track.service';
import { AlbumService } from '../../services/album/album.service';
import { DialogService } from '../../services/dialog/dialog.service';

@Component({
  selector: 'releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.css'],
})
export class ReleasesComponent implements OnInit {
  artists: any[] = new Array<any>();
  albums: any[] = new Array<any>();
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
    this.getArtists(1, new Array<any>());
  }

  getArtists(page: number, artists: any[]) {
    this.userService.getTopArtists(200, page).then(retArtists => {
      artists = artists.concat(retArtists);
      console.log(artists);
      if (retArtists.length < 200) this.getAlbumInfo(artists);
      else this.getArtists(page + 1, artists);
    }, this.showErrorMessage);
  }

  getAlbumInfo(artists): void {
    if (artists[0].mbid != undefined && artists[0].mbid != '') {
      console.log(artists[0].name);
      this.delay(700).then(result => {
        this.artistService
          .getAlbumInfoFromMusicBrainzByArtistId(artists[0].mbid)
          .then(info => {
            console.log(info);
            this.artists.push(info);
            for (let rg of info['release-groups']) rg.artist = artists[0].name;
            this.albums = this.albums.concat(info['release-groups']);
            console.log(this.artists);
            artists.shift();
            if (artists.length != 0) this.getAlbumInfo(artists);
          });
      });
    } else {
      artists.shift();
      if (artists.length != 0) this.getAlbumInfo(artists);
    }
  }
  showErrorMessage(error: any): void {
    alert(error.status + ' ' + error.statusText + ' ' + error['_body']);
  }
  delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
