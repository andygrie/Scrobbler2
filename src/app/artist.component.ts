import {
  Component,
  OnInit,
  OnChanges,
  trigger,
  state,
  animate,
  transition,
  style
} from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { LocalStorageService } from "angular-2-local-storage";

import { UserService } from "./user.service";
import { ArtistService } from "./artist.service";
import { AlbumService } from "./album.service";

@Component({
  selector: "artist",
  animations: [
    trigger("isVisibleChanged", [
      state("hidden", style({ opacity: 0.9 })),
      state("shown", style({ opacity: 0 })),
      transition("shown <=> hidden", animate("300ms"))
    ])
  ],
  templateUrl: "./artist.component.html",
  styleUrls: ["./artist.component.css"]
})
export class ArtistComponent implements OnInit {
  artistName: string;
  artistImageURL: string = "";
  artistInfo: any;
  artistTracks: any[];
  userAlbumStatistics: any[];
  globalAlbumStatistics: any[];
  optionsArtist: any;
  optionsAlbums: any;
  imageStatus: string = "hidden";
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.artistName = params["name"];
      this.artistImageURL = "";
      this.artistInfo = null;
      this.artistTracks = undefined;
      this.userAlbumStatistics = undefined;
      this.globalAlbumStatistics = undefined;
      this.getArtistTracks(1);
      this.getArtistInfo();
      this.getGlobalTopAlbums();
      this.artistService.getTopTracks("Leprous");
    });
  }
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private artistService: ArtistService,
    private albumService: AlbumService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}
  getArtistInfo(): void {
    this.artistService
      .getInfo(this.artistName, this.localStorageService.get("name").toString())
      .then(data => {
        this.artistInfo = data.artist;
        this.artistImageURL = this.artistInfo.image[4]["#text"];
      }, this.showErrorMessage);
  }
  getArtistTracks(page: number): void {
    if (page == 1) this.artistTracks = new Array<any>();
    this.userService
      .getArtistTracks(
        page,
        this.artistName,
        -1,
        -1,
        this.localStorageService.get("name").toString()
      )
      .then(data => {
        this.artistTracks = this.artistTracks.concat(data);
        if (data.length == 200) {
          this.getArtistTracks(page + 1);
        } else {
          if (this.artistTracks.length != 0) {
            console.log(this.artistTracks);
            this.addUserAlbumStatistics();
          }
        }
      }, this.showErrorMessage);
  }
  getGlobalTopAlbums(): void {
    this.artistService.getTopAlbums(this.artistName).then(data => {
      this.addGlobalAlbumStatistics(data);
    }, this.showErrorMessage);
  }
  addUserAlbumStatistics(): void {
    this.userAlbumStatistics = new Array<any>();
    for (var track of this.artistTracks) {
      if (track.album["#text"] != "") {
        let existingStatistic = this.userAlbumStatistics.find(
          album => album.name == track.album["#text"]
        );
        if (existingStatistic == undefined)
          this.userAlbumStatistics.push({
            name: track.album["#text"],
            imageURL: track.image[3]["#text"],
            playcount: 1
          });
        else existingStatistic.playcount++;
      } else {
        let existingStatistic = this.userAlbumStatistics.find(
          album => album.name == "UNKNOWN ALBUM"
        );
        if (existingStatistic == undefined)
          this.userAlbumStatistics.push({
            name: "UNKNOWN ALBUM",
            imageURL: track.image[3]["#text"],
            playcount: 1
          });
        else existingStatistic.playcount++;
      }
    }
    this.userAlbumStatistics.sort(function(a, b) {
      return b.playcount - a.playcount;
    });
  }
  addGlobalAlbumStatistics(globalAlbums: any[]): void {
    this.globalAlbumStatistics = new Array<any>();
    for (var album of globalAlbums) {
      if (album.image[3]["#text"] != "") {
        this.globalAlbumStatistics.push({
          name: album.name,
          imageURL: album.image[3]["#text"],
          playcount: album.playcount
        });
      }
    }
    this.globalAlbumStatistics.sort(function(a, b) {
      return b.playcount - a.playcount;
    });
    this.removeNotOfficialAlbums();
  }
  removeNotOfficialAlbums(): void {
    for (var album of this.globalAlbumStatistics) {
      let name = album.name;
      this.albumService.getInfo(name, this.artistName, "").then(data => {
        if (data.album && data.album.tracks.track.length == 0) {
          this.globalAlbumStatistics = this.globalAlbumStatistics.filter(
            existingAlbum => existingAlbum.name != name
          );
        }
      }, this.showErrorMessage);
    }
  }
  goToArtist(artistName: string): void {
    this.router.navigate(["/artist", artistName]);
  }
  onSeriesMouseClick(e) {
    this.router.navigate(["/album", e.context.name, this.artistName]);
  }
  imageHovered(): void {
    this.imageStatus = "shown";
    window.scrollTo(0, 0);
  }
  imageLeft(): void {
    this.imageStatus = "hidden";
  }
  goToAlbum(album: string) {
    this.router.navigate(["/album", album, this.artistName]);
  }
  showErrorMessage(error: any): void {
    console.log(error);
    alert(error.status + " " + error.statusText + " " + error["_body"]);
  }
}
