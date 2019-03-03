import { Observable } from 'rxjs';
import { ConfirmDialogAlbumsOfArtist } from '../../components/albums-of-artist.dialog/albums-of-artist.dialog.component';
import { ConfirmDialogTrackInfo } from '../../components/trackinfo.dialog/trackinfo.dialog.component';
import { ConfirmDialogNewScrobble } from '../../components/new-scrobble.dialog/new-scrobble.dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {
  constructor(private dialog: MatDialog) {}

  public confirmAlbumsOfArtistDialog(
    title: string,
    friends: string[],
    startDate: number,
    endDate: number,
  ): Observable<boolean> {
    let dialogRef: MatDialogRef<ConfirmDialogAlbumsOfArtist>;
    dialogRef = this.dialog.open(ConfirmDialogAlbumsOfArtist, {
      width: '75%',
      height: '75%',
    });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.friends = friends;
    dialogRef.componentInstance.startDate = startDate;
    dialogRef.componentInstance.endDate = endDate;
    return dialogRef.afterClosed();
  }
  public confirmTrackinfoDialog(
    title: string,
    artist: string,
    album: string,
  ): Observable<boolean> {
    let dialogRef: MatDialogRef<ConfirmDialogTrackInfo>;
    dialogRef = this.dialog.open(ConfirmDialogTrackInfo, {
      width: '75%',
      height: '75%',
    });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.artist = artist;
    dialogRef.componentInstance.album = album;
    return dialogRef.afterClosed();
  }
  public confirmNewScrobbleDialog(): Observable<boolean> {
    let dialogRef: MatDialogRef<ConfirmDialogNewScrobble>;
    dialogRef = this.dialog.open(ConfirmDialogNewScrobble, {
      width: '75%',
      height: '75%',
    });
    return dialogRef.afterClosed();
  }
  public confirmNewScrobbleDialogWithDateAfter(date: number): Observable<any> {
    let dialogRef: MatDialogRef<ConfirmDialogNewScrobble>;
    dialogRef = this.dialog.open(ConfirmDialogNewScrobble, {
      width: '75%',
      height: '75%',
    });
    dialogRef.componentInstance.datetimeAfter = date;
    dialogRef.componentInstance.datetimeAfterText =
      new Date(date).toLocaleDateString() +
      ' ' +
      new Date(date).toLocaleTimeString();
    return dialogRef.afterClosed();
  }
}
