import {Pipe, PipeTransform} from '@angular/core';
import {IProposal} from "../../proposals/interfaces/proposal";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: IProposal[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    console.log(searchText);
    return items.filter((it: IProposal) => {
      return it.proposalTitle.toString().toLocaleLowerCase().indexOf(searchText) !== -1;
    });
  }

}
