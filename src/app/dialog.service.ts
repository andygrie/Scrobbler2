import { Observable } from "rxjs/Rx";
import { ConfirmDialogAlbumsOfArtist } from "./albums-of-artist.dialog.component";
import { ConfirmDialogTrackInfo } from "./trackinfo.dialog.component";
import { ConfirmDialogNewScrobble } from "./new-scrobble.dialog.component";
import { MdDialogRef, MdDialog, MdDialogConfig } from "@angular/material";
import { Injectable } from "@angular/core";

@Injectable()
export class DialogService {
  constructor(private dialog: MdDialog) {}

  public confirmAlbumsOfArtistDialog(
    title: string,
    friends: string[],
    startDate: number,
    endDate: number
  ): Observable<boolean> {
    let dialogRef: MdDialogRef<ConfirmDialogAlbumsOfArtist>;
    dialogRef = this.dialog.open(ConfirmDialogAlbumsOfArtist, {
      width: "75%",
      height: "75%"
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
    album: string
  ): Observable<boolean> {
    let dialogRef: MdDialogRef<ConfirmDialogTrackInfo>;
    dialogRef = this.dialog.open(ConfirmDialogTrackInfo, {
      width: "75%",
      height: "75%"
    });
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.artist = artist;
    dialogRef.componentInstance.album = album;
    return dialogRef.afterClosed();
  }
  public confirmNewScrobbleDialog(): Observable<boolean> {
    let dialogRef: MdDialogRef<ConfirmDialogNewScrobble>;
    dialogRef = this.dialog.open(ConfirmDialogNewScrobble, {
      width: "75%",
      height: "75%"
    });
    return dialogRef.afterClosed();
  }
  public confirmNewScrobbleDialogWithDateAfter(date: number): Observable<any> {
    let dialogRef: MdDialogRef<ConfirmDialogNewScrobble>;
    dialogRef = this.dialog.open(ConfirmDialogNewScrobble, {
      width: "75%",
      height: "75%"
    });
    dialogRef.componentInstance.datetimeAfter = date;
    dialogRef.componentInstance.datetimeAfterText =
      new Date(date).toLocaleDateString() +
      " " +
      new Date(date).toLocaleTimeString();
    return dialogRef.afterClosed();
  }
}
