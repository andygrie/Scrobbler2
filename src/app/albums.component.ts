import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { IMyOptions, IMyDateRangeModel} from 'mydaterangepicker';

import { UserService } from './user.service';
import { AlbumService } from './album.service';

@Component({
  selector: 'albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {
    title = "Albums";
    topAlbum : any;
    topNineAlbums : any[];
    restOfAlbums : any[];
    currentPage : number = 1;
    limit : number = 9;
    startDate : number = 1;
    endDate : number = Math.floor(Date.now() / 1000);
    loadMoreDisabled : boolean = true;
    timeButtonsDisabled : boolean = true;
    isRequesting: boolean;
    loadHelper : boolean;

    //date-range-picker
    myDateRangePickerOptions: IMyOptions = {
        dateFormat: 'dd.mm.yyyy',
        showClearBtn: false,
        showClearDateRangeBtn: false,
        editableDateRangeField: false
    };
    dateRange: Object;

    @HostListener('window:scroll', ['$event'])
    track(event) {
        if (this.loadHelper == true && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            this.loadHelper = false;
            this.loadMoreAlbums();
            console.log("bottom");
        }
    }
    constructor(private userService : UserService,
                private albumService : AlbumService,
                private localStorageService : LocalStorageService,
                private router : Router){}
    ngOnInit(): void {
      this.loadAlbums();
    }
    loadAlbums(){
      this.isRequesting = true;
      this.userService.getWeeklyAlbumChart(this.startDate, this.endDate).then(data => {
         let begin = new Date(this.startDate * 1000);
         let end = new Date(this.endDate * 1000);
          this.dateRange = {
            beginDate : { year : begin.getFullYear(), month: begin.getMonth() + 1, day: begin.getDate()},
            endDate : { year : end.getFullYear(), month: end.getMonth() + 1, day: end.getDate()}
          }       
          this.currentPage = 1;
          this.topAlbum = data[0];
          
          this.topNineAlbums = new Array<any>();
          this.restOfAlbums = new Array<any>();
          if(data.length != 0){
              this.getImageOfAlbum(this.topAlbum);
              data = data.slice(1,9);
              for(let album of data){
                this.getImageOfAlbum(album).then(data => {
                  this.topNineAlbums.push(album);
                  this.topNineAlbums.sort(function(a, b) {
                      return parseInt(a['@attr'].rank) - parseInt(b['@attr'].rank);
                  });
                  if(this.topNineAlbums.length % 8 == 0){
                    this.loadMoreDisabled = false;
                    this.timeButtonsDisabled = false;
                    this.stopRefreshing();
                    this.loadHelper = true;
                    console.log(this.topNineAlbums);
                  }
                });
              }
          }
        }, this.showErrorMessage);
    }
    getImageOfAlbum(album : any) : Promise<any> {
      return this.albumService.getInfo(album.name, album.artist['#text'], this.localStorageService.get('name').toString()).then(data => {
        album.image = data.album.image;
      }, this.showErrorMessage);
    }
    getDateTitle() : string {
      let dateString : string = '';
      if(this.startDate == 1)
        dateString = 'all time'
      else{
        let start = new Date(this.startDate * 1000);
        let end = new Date(this.endDate * 1000);
        dateString = this.getDateString(start) + '-' + this.getDateString(end);
      }
      return dateString;
    }
    getDateString(date : Date) : string {
      let dateString = '';
      dateString += (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
      dateString += (date.getMonth() + 1 < 10) ? '.0' + (date.getMonth() + 1) : '.' + (date.getMonth() + 1);
      dateString += '.' + date.getFullYear();
      return dateString;
    }
    loadMoreAlbums() : void{
      this.isRequesting = true;
      this.currentPage++;
      this.loadMoreDisabled = true;
      this.userService.getWeeklyAlbumChart(this.startDate, this.endDate).then(data => {
        data = data.slice(this.limit * (this.currentPage -1), this.limit * (this.currentPage -1) + 9);
        for(let album of data){
          this.getImageOfAlbum(album).then(data => {
              this.restOfAlbums.push(album);
              this.restOfAlbums.sort(function(a, b) {
                 return parseInt(a['@attr'].rank) - parseInt(b['@attr'].rank);
              });
              if(this.restOfAlbums.length % 9 == 0){
                this.loadMoreDisabled = false;
                this.stopRefreshing();
                this.loadHelper = true;
              }
          });
        }
      }, this.showErrorMessage);
    }
    goToAlbum(album : string, artist : string){
      this.router.navigate(['/album', album, artist]);
    }
    changeTimeRange(months : number) : void{
      this.loadMoreDisabled = true;
      this.timeButtonsDisabled = true;
      this.endDate = Math.floor(Date.now() / 1000);
      if(months != -1){
        let dateBefore = new Date();
        dateBefore.setMonth(dateBefore.getMonth() - months);
        this.startDate = Math.floor(dateBefore.getTime() / 1000);
      }
      else
        this.startDate = 1;

      this.loadAlbums();
    }
    onDateRangeChanged(event: IMyDateRangeModel) {
        this.startDate = Math.floor((new Date(event.beginDate.year, event.beginDate.month - 1, event.beginDate.day)).getTime() / 1000);
        this.endDate = Math.floor((new Date(event.endDate.year, event.endDate.month - 1, event.endDate.day)).getTime() / 1000);
        this.loadAlbums();
    }
    showErrorMessage(error : any) : void{
        alert(error.status + ' ' + error.statusText + ' ' + error['_body']);
    }
    stopRefreshing() {
        this.isRequesting = false;
    }
}