import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
var _ = require('lodash');
var deepDiff = require('deep-diff');

@Injectable()
export class DiffTransFormerService {
  constructor() {

  }

  getNewItemsDiffCollection(newCollection: Array<any>,
                            oldCollection: Array<any>,
                            diffProp: string = "id"): Array<any> {
    return _.differenceBy(newCollection, oldCollection, diffProp);
  }

  getEditedItemsDiffCollection(newCollection: Array<any>,
                               oldCollection: Array<any>): Array<any> {

    let deepDiffCollection = deepDiff(oldCollection, newCollection);

    return _.chain(deepDiffCollection)
      .map((diff: any) => {
        if (/DiffEdit/.test(diff.constructor.toString())) {
          var match = {};
          match[diff.path[1]] = diff.rhs;
          return _.filter(newCollection, _.matches(match));
        }
      })
      .filter(collection => collection)
      .filter(item => item.length === 1)
      .flatten()
      .value();
  }

  oldNewComparison$(collection$: Observable<any>, diffProp: string = "id"): Observable<any> {
    return collection$.mergeMap((item: any) => {
      return Observable.of([...item]);
    })
      .pairwise().map(([oldCollection, newCollection]) => {
        return {
          oldCollection: oldCollection,
          newCollection: newCollection,
          addedItemsCollection: this.getNewItemsDiffCollection(newCollection, oldCollection, diffProp),
          editedItemsCollection: this.getEditedItemsDiffCollection(newCollection, oldCollection),
          diffMeta: deepDiff(oldCollection, newCollection)
        }
      });
  }
}
