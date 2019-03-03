import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'albums-of-artist.dialog',
  templateUrl: 'albums-of-artist.dialog.component.html',
  styleUrls: ['albums-of-artist.dialog.component.css'],
})
export class ConfirmDialogAlbumsOfArtist implements OnInit {
  ngOnInit(): void {
    for (let friend of this.friends) {
      this.addAlbumStatistics(friend, 1);
    }
  }

  public title: string;
  public friends: string[];
  public albums: any[] = new Array<any>();
  public startDate: number;
  public endDate: number;
  friendsDone: number = 0;
  tooltipPosition: string = 'before';
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogAlbumsOfArtist>,
    private router: Router,
    private userService: UserService,
  ) {}

  addAlbumStatistics(friend: string, page: number): void {
    let now = new Date();
    let secondsNow = now.getTime() / 1000;
    let secondsWeekBefore = secondsNow - 60 * 60 * 24 * 7;
    this.userService
      .getArtistTracks(page, this.title, this.startDate, this.endDate, friend)
      .then(data => {
        for (let track of data) {
          if (track.album['#text'] != '') {
            let existingAlbum = this.albums.find(
              album => album.name == track.album['#text'],
            );
            if (existingAlbum == undefined) {
              this.albums.push({
                name: track.album['#text'],
                playcount: 1,
                imageURL: track.image[3]['#text'],
                listeners: [friend],
              });
            } else {
              existingAlbum.playcount++;
              if (
                existingAlbum.listeners.find(listener => listener == friend) ==
                undefined
              )
                existingAlbum.listeners.push(friend);
            }
          } else {
            let existingAlbum = this.albums.find(
              album => album.name == 'UNKNOWN ALBUM',
            );
            if (existingAlbum == undefined) {
              this.albums.push({
                name: 'UNKNOWN ALBUM',
                playcount: 1,
                imageURL: '',
                listeners: [friend],
              });
            } else {
              existingAlbum.playcount++;
              if (
                existingAlbum.listeners.find(listener => listener == friend) ==
                undefined
              )
                existingAlbum.listeners.push(friend);
            }
          }
        }
        if (data.length == 200) this.addAlbumStatistics(friend, page + 1);
        else {
          this.friendsDone++;
        }
        if (this.friendsDone == this.friends.length)
          this.albums.sort(function(a, b) {
            return b.playcount - a.playcount;
          });
      }, this.showErrorMessage);
  }
  getNumberOfListeners(): number {
    return this.friends.length;
  }
  getListenersOfAlbum(index: number): number {
    return this.albums[index].listeners.length;
  }
  goToAlbum(album: string, artist: string) {
    this.dialogRef.close(false);
    this.router.navigate(['/album', album, artist]);
  }
  showErrorMessage(error: any): void {
    alert(error.status + ' ' + error.statusText + ' ' + error['_body']);
  }
}
