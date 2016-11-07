import {Injectable} from "@angular/core";
import {diff} from "deep-diff";
import * as _ from "lodash";
import {BehaviorSubject, Observable} from "rxjs/Rx";


export interface DiffCollection {
  oldCollection: Array<any>,
  newCollection: Array<any>,
  createdCollection: Array<any>,
  updatedCollection: Array<any>,
  deletedCollection: Array<any>
}

@Injectable()
export class DistinctUntilChangedDiffService {

  private _diffCollection: BehaviorSubject<DiffCollection> = new BehaviorSubject<DiffCollection>(null);

  constructor() {
  }

  private _comparer(a: any, b: any) {
    let diffResult = diff(a, b);

    if (diffResult) {
      let createdItems: Array<any> = [];
      let updatedItems: Array<any> = [];
      let deletedItems: Array<any> = [];

      diffResult.forEach((diffItem: any) => {
        if (
          /DiffArray/.test(diffItem.constructor.toString())
          && /DiffNew/.test(diffItem.item.constructor.toString())
        ) {
          createdItems.push(b[diffItem.index]);
        }
        else if (/DiffEdit/.test(diffItem.constructor.toString())) {
          let _updatedItems: Array<any> = [];
          if (_.has(diffItem, "path")) {
            _updatedItems.push(b[diffItem.path[0]]);
          }
          else {
            _updatedItems.push(b);
          }
          updatedItems.push(_.flatten(_updatedItems));
        }
        else if (
          /DiffArray/.test(diffItem.constructor.toString())
          && /DiffDeleted/.test(diffItem.item.constructor.toString())
        ) {
          deletedItems.push(a[diffItem.index]);
        }
      });

      this._diffCollection.next(
        {
          oldCollection: a,
          newCollection: b,
          createdCollection: createdItems,
          updatedCollection: (updatedItems.length) ? _.first(updatedItems) : [],
          deletedCollection: deletedItems
        }
      );
    }
    return !diffResult;
  }

  public distinctUntilChangedDiff$(sourceCollection$: Observable<Array<any>>,): Observable<Array<[Array<any>, DiffCollection]>> {

    return sourceCollection$
      .distinctUntilChanged(this._comparer.bind(this))
      .withLatestFrom(this._diffCollection);
  }

  public updateDiff$(distinctUntilChangedDiff$: Observable<any>) {
    return distinctUntilChangedDiff$
      .filter(([newCollection, diffCollection]) => (diffCollection && diffCollection.updatedCollection));
  }

  public createDiff$(distinctUntilChangedDiff$: Observable<any>) {
    return distinctUntilChangedDiff$
      .filter(([newCollection, diffCollection]) => (diffCollection && diffCollection.createdCollection));
  }

  public deleteDiff$(distinctUntilChangedDiff$: Observable<any>) {
    return distinctUntilChangedDiff$
      .filter(([newCollection, diffCollection]) => (diffCollection && diffCollection.deletedCollection));
  }

  public applyUpdatesToCollection(updatedCollection: Array<any>,
                                  sourceCollection: Array<any>, uniqIdProp: string,
                                  animationType: string = "update") {
    sourceCollection.forEach((item: any, index: number) => {
      let matches: any = {};
      matches[uniqIdProp] = item[uniqIdProp];
      let _col = _.filter(updatedCollection, _.matches(matches));
      _col.forEach((_item: any) => {
        if (item[uniqIdProp] === _item[uniqIdProp]) {
          sourceCollection[index] = _item;
          sourceCollection[index].animationType = animationType;
        }
      });
    });
  }

  public prependCreationsToCollection(createdCollection: Array<any>,
                                      sourceCollection: Array<any>,
                                      animationType: string = "in") {
    createdCollection.forEach((item: any, index: number) => {
      item.animationType = animationType;
      sourceCollection.unshift(item);
    });
  }
}
