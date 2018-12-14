import { Pipe } from "@angular/core";

@Pipe({
  name: "orderbydate"
})
export class OrderByDatePipe {
  transform(array: Array<any>, args: string): Array<any> {
    array.sort((a: any, b: any) => {
      let result = 0;
      if (a["first-release-date"] > b["first-release-date"]) {
        result = -1;
      } else if (a["first-release-date"] < b["first-release-date"]) {
        result = 1;
      } else if (a.artist < b.artist) {
        result = -1;
      } else if (a.artist > b.artist) {
        result = 1;
      } else if (a.title < b.title) {
        result = -1;
      } else if (a.title > b.title) {
        result = 1;
      } else {
        result = 0;
      }
      return result;
    });
    return array;
  }
}
