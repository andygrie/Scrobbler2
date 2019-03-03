import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'artistfilter',
  pure: false,
})
export class ArtistFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter(
      item => item.artist['#text'].indexOf(filter.artist['#text']) !== -1,
    );
  }
}
