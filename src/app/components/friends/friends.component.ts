import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user/user.service';
import { ArtistService } from '../../services/artist/artist.service';
import { DialogService } from '../../services/dialog/dialog.service';

@Component({
  selector: 'friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent implements OnInit {
  title = 'Friends Listened To (last 30 days):';
  friends: any[];
  artists: any[] = new Array<any>();
  topArtist: any;
  topArtists: any[];
  friendsArtistsLoaded: number = 0;
  startDate: number;
  endDate: number;
  isRequesting: boolean;
  constructor(
    private userService: UserService,
    private artistService: ArtistService,
    private router: Router,
    private dialogService: DialogService,
  ) {}
  ngOnInit(): void {
    this.getFriends();
  }

  getFriends(): void {
    this.isRequesting = true;
    this.userService.getFriends(1, 200, 'andygrie', 1).then(data => {
      this.friends = data.friends.user;
      for (let friend of this.friends) {
        this.getRecentTracksOfFriend(friend);
      }
    }, this.showErrorMessage);
  }
  getRecentTracksOfFriend(friend: any) {
    let now = new Date();
    this.endDate = now.getTime() / 1000;
    this.startDate = this.endDate - 60 * 60 * 24 * 30;
    this.userService
      .getWeeklyArtistChart(this.startDate, this.endDate, friend.name)
      .then(data => {
        this.addArtistStatistics(data, friend.name);
      }, this.showErrorMessage);
  }
  addArtistStatistics(statistics: any[], friend: string): void {
    for (let artistStatistic of statistics) {
      let existingStatistics = this.artists.find(
        artist => artist.artist == artistStatistic.name,
      );
      if (existingStatistics == undefined) {
        this.artists.push({
          artist: artistStatistic.name,
          playcount: parseInt(artistStatistic.playcount),
          imageURL: '',
          listeners: [friend],
        });
      } else {
        existingStatistics.playcount += parseInt(artistStatistic.playcount);
        existingStatistics.listeners.push(friend);
      }
    }
    this.friendsArtistsLoaded++;
    if (this.friendsArtistsLoaded == this.friends.length) {
      this.artists.sort(function(a, b) {
        return b.listeners.length - a.listeners.length;
      });
      this.topArtist = this.artists[0];
      this.getImageURLOfArtist(this.topArtist);
      this.topArtists = this.artists.slice(1, 99);
      for (let artist of this.topArtists) {
        this.getImageURLOfArtist(artist);
      }
      this.isRequesting = false;
    }
  }
  getImageURLOfArtist(artist): void {
    this.artistService.getInfo(artist.artist, '').then(data => {
      if (data.artist != undefined)
        artist.imageURL = data.artist.image[4]['#text'];
    }, this.showErrorMessage);
  }
  public openDialog(artist: any) {
    this.dialogService
      .confirmAlbumsOfArtistDialog(
        artist.artist,
        artist.listeners,
        this.startDate,
        this.endDate,
      )
      .subscribe(res => {
        if (res) this.router.navigate(['/artist', artist.artist]);
      });
  }
  artistsLoaded(): boolean {
    return this.artists.find(artist => artist.imageURL == '') != undefined;
  }
  showErrorMessage(error: any): void {
    alert(error.status + ' ' + error.statusText + ' ' + error['_body']);
  }
}
