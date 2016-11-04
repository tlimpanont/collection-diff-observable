import {Injectable} from "@angular/core";
import {diff} from "deep-diff";
import * as _ from "lodash";
import {BehaviorSubject, Observable} from "rxjs/Rx";


export interface DiffCollection {
  oldCollection: Array<any>,
  createdCollection: Array<any>,
  updatedCollection: Array<any>,
  deletedCollection: Array<any>
}

@Injectable()
export class DistinctUntilChangedDiffService {

  private _createdCollection: Array<any> = [];
  private _deletedCollection: Array<any> = [];
  private _updatedCollection: Array<any> = [];
  private _diffCollection: BehaviorSubject<DiffCollection> = new BehaviorSubject<any>({});

  constructor() {
  }

  private _comparer(a: any, b: any) {
    let diffResult = diff(a, b);

    let createdItems: Array<any> = [];
    let updatedItems: Array<any> = [];
    let deletedItems: Array<any> = [];

    diffResult.forEach((diffItem: any) => {
      if (
        /DiffArray/.test(diffItem.constructor.toString())
        && /DiffNew/.test(diffItem.item.constructor.toString())
      ) {
        createdItems.push(b[diffItem.index]);
        this._createdCollection.push(createdItems);
      }
      else if (/DiffEdit/.test(diffItem.constructor.toString())) {
        updatedItems.push(b[diffItem.path[0]]);
        this._updatedCollection.push(_.flatten(updatedItems));
      }
      else if (
        /DiffArray/.test(diffItem.constructor.toString())
        && /DiffDeleted/.test(diffItem.item.constructor.toString())
      ) {
        deletedItems.push(a[diffItem.index]);
        this._deletedCollection.push(deletedItems);
      }
    });

    this._diffCollection.next(
      {
        oldCollection: a,
        createdCollection: this._createdCollection,
        updatedCollection: (this._updatedCollection.length) ? _.first(this._updatedCollection) : [],
        deletedCollection: this._deletedCollection
      }
    );

    return !diff;
  }

  public distinctUntilChangedDiff$(collection$: Observable<Array<any>>): Observable<Array<[Array<any>, DiffCollection]>> {
    return collection$
      .distinctUntilChanged(this._comparer.bind(this))
      .withLatestFrom(this._diffCollection);
  }
}
