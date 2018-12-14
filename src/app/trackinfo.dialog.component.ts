import { MatDialogRef } from "@angular/material";
import { Component, OnInit } from "@angular/core";
import { TrackService } from "./track.service";
import { LocalStorageService } from "./services/localStorage/local-storage.service";

@Component({
  selector: "trackinfo-dialog",
  templateUrl: "trackinfo.dialog.component.html",
  styleUrls: ["trackinfo.dialog.component.css"]
})
export class ConfirmDialogTrackInfo implements OnInit {
  ngOnInit(): void {
    this.loadInfo();
  }

  public title: string;
  public artist: string;
  public album: string;
  private albumimageSource: string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogTrackInfo>,
    private trackService: TrackService,
    private localStorageService: LocalStorageService
  ) {}

  loadInfo(): void {
    this.trackService
      .getInfo(
        this.artist,
        this.title,
        this.localStorageService.get("name").toString()
      )
      .then(data => {
        if (data.album != undefined)
          this.albumimageSource = data.album.image[3]["#text"];
        console.log(data);
      }, this.showErrorMessage);
  }
  showErrorMessage(error: any): void {
    alert(error.status + " " + error.statusText + " " + error["_body"]);
  }
}
