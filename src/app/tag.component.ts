import { Component, OnInit } from "@angular/core";
import { UserService } from "./user.service";
import { ArtistService } from "./artist.service";
import { TagService } from "./tag.service";
import { AlbumService } from "./album.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { LocalStorageService } from "angular-2-local-storage";

@Component({
  selector: "tracks",
  templateUrl: "./tag.component.html",
  styleUrls: ["./tag.component.css"]
})
export class TagComponent implements OnInit {
  private title;
  private topAlbum;
  private topNineAlbums;
  private restOfAlbums;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private artistService: ArtistService,
    private tagService: TagService,
    private albumService: AlbumService,
    private localStorageService: LocalStorageService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.title = params["name"];
      this.loadAlbums();
    });
  }
  loadAlbums() {
    this.tagService.getTopAlbums(this.title).then(data => {
      console.log(data);
      this.topAlbum = data[0];

      this.topNineAlbums = new Array<any>();
      this.restOfAlbums = new Array<any>();
      if (data.length != 0) {
        this.getImageOfAlbum(this.topAlbum);
        data = data.slice(1, 9);
        for (let album of data) {
          this.getImageOfAlbum(album).then(data => {
            this.topNineAlbums.push(album);
            this.topNineAlbums.sort(function(a, b) {
              return parseInt(a["@attr"].rank) - parseInt(b["@attr"].rank);
            });
            if (this.topNineAlbums.length % 8 == 0) {
              console.log(this.topNineAlbums);
            }
          });
        }
      }
    }, this.showErrorMessage);
  }
  getImageOfAlbum(album: any): Promise<any> {
    return this.albumService
      .getInfo(
        album.name,
        album.artist.name,
        this.localStorageService.get("name").toString()
      )
      .then(data => {
        console.log(album);
        console.log(data);
        album.image = data.album.image;
        album.playcount = data.album.listeners;
      }, this.showErrorMessage);
  }
  toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  showErrorMessage(error: any): void {
    alert(error.status + " " + error.statusText + " " + error["_body"]);
  }
}
