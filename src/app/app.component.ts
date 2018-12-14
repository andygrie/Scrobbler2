import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { AuthenticationService } from "./authentication.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { LocalStorageService } from "angular-2-local-storage";
import { DialogService } from "./dialog.service";

import { UserService } from "./user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private router: Router,
    private userService: UserService,
    private dialogService: DialogService
  ) {}
  ngOnInit(): void {
    this.localStorageService.set("APIURL", "http://ws.audioscrobbler.com/2.0");
    this.route.queryParams.subscribe((params: Params) => {
      //If token is set (=if you are redirected from last.fm) set session key for other request
      if (params["token"] != null) {
        this.localStorageService.set("token", params["token"]);
        this.authenticationService.getSession().subscribe(data => {
          this.localStorageService.set("sk", data.session.key);
          this.localStorageService.set("name", data.session.name);
          this.router.navigate([""]);
        });
      } else {
        this.startPolling();
      }
    });
  }
  currentTrack: any;
  lastTrack: any;
  //function for getting new token, in order to get session key
  getNewToken(): void {
    this.authenticationService.setLocalStorageItems();
    window.location.href =
      "http://www.last.fm/api/auth?api_key=" +
      this.localStorageService.get("api_key") +
      "&cb=http://localhost:4201";
  }
  openDialogNewScrobble(): void {
    this.dialogService.confirmNewScrobbleDialog().subscribe(res => {
      console.log(res);
    });
  }
  startPolling() {
    let timeout = Observable.timer(0, 10000);
    timeout.subscribe(x => {
      this.userService.getRecentTracks(1, 1).then(data => {
        if (data[0].date !== undefined) {
          this.currentTrack = undefined;
          this.lastTrack = data[0];
        } else {
          this.currentTrack = data[0];
          this.lastTrack = undefined;
        }
      }, this.showErrorMessage);
    });
  }
  showErrorMessage(error: any): void {
    alert(error.status + " " + error.statusText + " " + error["_body"]);
  }
}
