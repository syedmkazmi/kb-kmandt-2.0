import {Pipe, PipeTransform} from '@angular/core';
import {ICasestudy} from "../../case-studies/interfaces/casestudy";

@Pipe({
  name: 'csfilter'
})
export class FilterPipe implements PipeTransform {
  transform(items: ICasestudy[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    console.log(searchText);
    return items.filter((it: ICasestudy) => {
      return it.title.toString().toLocaleLowerCase().indexOf(searchText) !== -1;
    });
  }

}
