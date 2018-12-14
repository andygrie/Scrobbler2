import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user/user.service";
import { ArtistService } from "../../services/artist/artist.service";

@Component({
  selector: "tracks",
  templateUrl: "./tags.component.html",
  styleUrls: ["./tags.component.css"]
})
export class TagsComponent implements OnInit {
  title = "Tags(Calculated From Top 200 Artists)";
  topTags: any[] = new Array<any>();
  topArtists: any[] = new Array<any>();

  constructor(
    private userService: UserService,
    private artistService: ArtistService
  ) {}
  ngOnInit(): void {
    this.userService.getTopArtists(200, 1).then(data => {
      console.log(data[0]);
      for (let i = 0; i < data.length; i++) {
        this.artistService.getTopTags(data[i].name).then(tagData => {
          let tag = this.topTags.find(
            tag => tag.tagname.toLowerCase() === tagData[0].name.toLowerCase()
          );
          if (tag == undefined) {
            this.topTags.push({
              tagname: this.toTitleCase(tagData[0].name),
              count: parseInt(data[i].playcount)
            });
          } else tag.count += parseInt(data[i].playcount);

          this.topTags.sort((a, b) => {
            return b.count - a.count;
          });
        }, this.showErrorMessage);
      }
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
