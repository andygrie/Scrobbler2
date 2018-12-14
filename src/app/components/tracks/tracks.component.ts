import { Component, OnInit, HostListener } from "@angular/core";

import { UserService } from "../../services/user/user.service";

@Component({
  selector: "tracks",
  templateUrl: "./tracks.component.html",
  styleUrls: ["./tracks.component.css"]
})
export class TracksComponent implements OnInit {
  title = "Tracks";
  detailView: string;
  currentPage: number = 1;
  limit: number = 200;
  topTracks: any[] = new Array<any>();
  isRequesting: boolean;
  loadHelper: boolean;
  period: string;

  @HostListener("window:scroll", ["$event"])
  track(event) {
    if (
      this.loadHelper == true &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight
    ) {
      this.loadHelper = false;
      this.currentPage++;
      this.isRequesting = true;
      this.userService
        .getTopTracks(200, this.currentPage, this.period)
        .then(data => {
          this.topTracks = this.topTracks.concat(data);
          this.loadHelper = true;
          this.stopRefreshing();
        }, this.showErrorMessage);
      console.log("bottom");
    }
  }

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.isRequesting = true;
    this.userService
      .getTopTracks(this.limit, this.currentPage, "overall")
      .then(data => {
        this.topTracks = data;
        this.stopRefreshing();
        this.loadHelper = true;
      }, this.showErrorMessage);
  }
  showErrorMessage(error: any): void {
    alert(error.status + " " + error.statusText + " " + error["_body"]);
  }
  imageFocused(track: any): void {
    this.detailView = track.image[3]["#text"];
  }
  imageUnfocused(): void {
    this.detailView = null;
  }
  getWidthPercentage(track: any): number {
    return (
      ((parseInt(track.playcount) / parseInt(this.topTracks[0].playcount)) *
        100) /
        2 +
      50
    );
  }
  changeTimeRange(period: string): void {
    this.currentPage = 1;
    this.isRequesting = true;
    this.period = period;
    this.userService
      .getTopTracks(this.limit, this.currentPage, this.period)
      .then(data => {
        this.topTracks = data;
        this.isRequesting = false;
      }, this.showErrorMessage);
  }
  stopRefreshing(): void {
    this.isRequesting = false;
  }
}
