import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';
import { IMyOptions, IMyDateRangeModel } from 'mydaterangepicker';

import { UserService } from '../../services/user/user.service';
import { ArtistService } from '../../services/artist/artist.service';
import { DialogService } from '../../services/dialog/dialog.service';

@Component({
  selector: 'artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css'],
})
export class ArtistsComponent implements OnInit {
  title = 'Artists';
  topArtist: any;
  topNineArtists: any[];
  restOfArtists: any[];
  currentPage: number;
  limit: number = 9;
  startDate: number = 1;
  endDate: number = Math.floor(Date.now() / 1000);
  loadMoreDisabled: boolean = true;
  timeButtonsDisabled: boolean = true;
  isRequesting: boolean;
  loadHelper: boolean;

  myDateRangePickerOptions: IMyOptions = {
    dateFormat: 'dd.mm.yyyy',
    showClearBtn: false,
    showClearDateRangeBtn: false,
    editableDateRangeField: false,
  };
  dateRange: Object;

  @HostListener('window:scroll', ['$event'])
  track(event) {
    console.log('scroll');
    if (
      this.loadHelper == true &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight
    ) {
      this.loadHelper = false;
      this.loadMoreArtists();
      console.log('bottom');
    }
  }

  constructor(
    private userService: UserService,
    private artistService: ArtistService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private dialogService: DialogService,
  ) {}
  ngOnInit(): void {
    this.loadArtists();
  }
  loadMoreArtists(): void {
    this.isRequesting = true;
    this.currentPage++;
    this.loadMoreDisabled = true;
    this.userService
      .getWeeklyArtistChart(
        this.startDate,
        this.endDate,
        this.localStorageService.get('name').toString(),
      )
      .then(data => {
        data = data.slice(
          this.limit * (this.currentPage - 1),
          this.limit * (this.currentPage - 1) + 9,
        );
        for (let artist of data) {
          this.getImageOfArtist(artist).then(data => {
            this.restOfArtists.push(artist);
            this.restOfArtists.sort(function(a, b) {
              return parseInt(a['@attr'].rank) - parseInt(b['@attr'].rank);
            });
            if (this.restOfArtists.length % 9 == 0) {
              this.loadMoreDisabled = false;
              this.stopRefreshing();
              this.loadHelper = true;
            }
          });
        }
      }, this.showErrorMessage);
  }
  goToArtist(artistName: string): void {
    this.dialogService
      .confirmAlbumsOfArtistDialog(
        artistName,
        [this.localStorageService.get('name').toString()],
        this.startDate,
        this.endDate,
      )
      .subscribe(res => {
        if (res) this.router.navigate(['/artist', artistName]);
      });
  }
  changeTimeRange(months: number): void {
    this.loadMoreDisabled = true;
    this.timeButtonsDisabled = true;
    this.endDate = Math.floor(Date.now() / 1000);
    if (months != -1) {
      let dateBefore = new Date();
      dateBefore.setMonth(dateBefore.getMonth() - months);
      this.startDate = Math.floor(dateBefore.getTime() / 1000);
    } else this.startDate = 1;

    this.loadArtists();
  }
  loadArtists() {
    this.isRequesting = true;
    this.userService
      .getWeeklyArtistChart(
        this.startDate,
        this.endDate,
        this.localStorageService.get('name').toString(),
      )
      .then(data => {
        let begin = new Date(this.startDate * 1000);
        let end = new Date(this.endDate * 1000);
        this.dateRange = {
          beginDate: {
            year: begin.getFullYear(),
            month: begin.getMonth() + 1,
            day: begin.getDate(),
          },
          endDate: {
            year: end.getFullYear(),
            month: end.getMonth() + 1,
            day: end.getDate(),
          },
        };
        this.currentPage = 1;
        this.topArtist = data[0];

        this.topNineArtists = new Array<any>();
        this.restOfArtists = new Array<any>();
        if (data.length != 0) {
          this.getImageOfArtist(this.topArtist);
          data = data.slice(1, 9);
          for (let artist of data) {
            this.getImageOfArtist(artist).then(data => {
              this.topNineArtists.push(artist);
              this.topNineArtists.sort(function(a, b) {
                return parseInt(a['@attr'].rank) - parseInt(b['@attr'].rank);
              });
              if (this.topNineArtists.length % 8 == 0) {
                this.loadMoreDisabled = false;
                this.timeButtonsDisabled = false;
                this.isRequesting = false;
                this.loadHelper = true;
              }
            });
          }
        }
      }, this.showErrorMessage);
  }
  getImageOfArtist(artist: any): Promise<any> {
    return this.artistService
      .getInfo(artist.name, this.localStorageService.get('name').toString())
      .then(data => {
        artist.image = data.artist.image;
      }, this.showErrorMessage);
  }
  getDateTitle(): string {
    let dateString: string = '';
    if (this.startDate == 1) dateString = 'all time';
    else {
      let start = new Date(this.startDate * 1000);
      let end = new Date(this.endDate * 1000);
      dateString = this.getDateString(start) + '-' + this.getDateString(end);
    }
    return dateString;
  }
  getDateString(date: Date): string {
    let dateString = '';
    dateString += date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    dateString +=
      date.getMonth() + 1 < 10
        ? '.0' + (date.getMonth() + 1)
        : '.' + (date.getMonth() + 1);
    dateString += '.' + date.getFullYear();
    return dateString;
  }
  onDateRangeChanged(event: IMyDateRangeModel) {
    this.startDate = Math.floor(
      new Date(
        event.beginDate.year,
        event.beginDate.month - 1,
        event.beginDate.day,
      ).getTime() / 1000,
    );
    this.endDate = Math.floor(
      new Date(
        event.endDate.year,
        event.endDate.month - 1,
        event.endDate.day,
      ).getTime() / 1000,
    );
    this.loadArtists();
  }
  showErrorMessage(error: any): void {
    alert(error.status + ' ' + error.statusText + ' ' + error['_body']);
  }
  stopRefreshing() {
    this.isRequesting = false;
  }
}
