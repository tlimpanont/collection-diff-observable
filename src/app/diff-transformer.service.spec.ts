import {DiffTransFormerService} from "./diff-transformer.service";
var _ = require("lodash");
import {TestBed, async} from "@angular/core/testing";
import {BehaviorSubject, Observable} from "rxjs";
import any = jasmine.any;

let diffTransformer = new DiffTransFormerService();

describe("DiffTransformer", () => {
  let dateBefore = new Date("2015-10-03 12:00:00").getTime();
  let dateAfter = new Date("2015-10-03 12:00:10").getTime();

  let initData: Array<any>;

  let newData: Object = {
    id: 2,
    value: "Value2",
    timestamp: dateAfter
  };

  beforeEach(() => {
    initData = [{
      id: 1,
      value: "Value1",
      timestamp: dateBefore
    }];
  });

  it("should know the diff when a new item is added", () => {
    let _copyInitData: Array<any> = _.cloneDeep(initData);
    initData.unshift(newData);
    let diffCollection: Array<any> = _.differenceBy(initData, _copyInitData, "id");
    expect(diffCollection).toEqual([newData]);
  });

  it("should know the diff when a item is edited", () => {
    let _copyInitData: Array<any> = _.cloneDeep(initData);
    initData[0] = {
      id: 1,
      value: "Changed",
      timestamp: dateAfter
    };
    let diffCollection: Array<any> = _.difference(initData, _copyInitData);
    expect(diffCollection).toEqual(initData);
  });

  it("should know the diff when a item is edited and added", () => {
    let newCollection: Array<any> = [
      {
        id: 1,
        value: "Value1",
        timestamp: dateBefore
      },
      {
        id: 2,
        value: "Value2",
        timestamp: dateBefore
      }
    ];

    let _copyInitData: Array<any> = _.cloneDeep(newCollection);

    newCollection[0].value = "Changed1";
    newCollection[0].timestamp = dateAfter;

    newCollection[1].value = "Changed2";
    newCollection[1].timestamp = dateAfter;

    newCollection.push(
      {
        id: 3,
        value: "Value3",
        timestamp: dateAfter
      }
    );

    newCollection.push(
      {
        id: 4,
        value: "Value4",
        timestamp: dateAfter
      }
    );

    let newItemsDiffCollection: Array<any> =
      diffTransformer.getNewItemsDiffCollection(newCollection, _copyInitData);

    expect(newItemsDiffCollection.length).toEqual(2);
    expect(newItemsDiffCollection).toEqual([
      {
        id: 3,
        value: "Value3",
        timestamp: dateAfter
      },
      {
        id: 4,
        value: "Value4",
        timestamp: dateAfter
      }
    ]);

    let analyzedEditedDiffCollection: Array<any> =
      diffTransformer.getEditedItemsDiffCollection(newCollection, _copyInitData);

    expect(analyzedEditedDiffCollection.length).toEqual(2);
    expect(analyzedEditedDiffCollection).toEqual([
      {
        "id": 1,
        "value": "Changed1",
        "timestamp": 1443866410000
      },
      {
        "id": 2,
        "value": "Changed2",
        "timestamp": 1443866410000
      }
    ]);
  });

  it("should be able to compare old and new value in stream", (done) => {

    let initData: Array<any> = [
      {
        id: 1,
        value: "Value1",
        timestamp: dateBefore
      },
      {
        id: 2,
        value: "Value2",
        timestamp: dateBefore
      }
    ];
    let afterData: Array<any> = [
      {
        id: 1,
        value: "Changed_Value1",
        timestamp: dateAfter
      },
      {
        id: 2,
        value: "Changed_Value2",
        timestamp: dateAfter
      },
      {
        id: 3,
        value: "Value3",
        timestamp: dateAfter
      }
    ];

    let server$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    server$.next(initData);

    Observable.timer(100).subscribe(() => {
      server$.next(afterData);
    });

    diffTransformer.oldNewComparison$(server$)
      .subscribe(({
        oldCollection,
        newCollection,
        addedItemsCollection,
        editedItemsCollection
      }) => {

        expect(oldCollection).toEqual(initData);
        expect(newCollection).toEqual(afterData);
        expect(addedItemsCollection.length).toEqual(1);
        expect(editedItemsCollection.length).toEqual(2);
        expect(addedItemsCollection[0]).toEqual({
          id: 3,
          value: "Value3",
          timestamp: dateAfter
        });
        expect(editedItemsCollection).toEqual([
          {
            id: 1,
            value: "Changed_Value1",
            timestamp: dateAfter
          },
          {
            id: 2,
            value: "Changed_Value2",
            timestamp: dateAfter
          }
        ]);
        done();
      });
  });
});
