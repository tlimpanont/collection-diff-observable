/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {DistinctUntilChangedDiffService, DiffCollection} from './distinct-until-changed-diff.service';
import {Observable} from "rxjs/Rx";

describe('Service: DistinctUntilChangedDiff', () => {
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DistinctUntilChangedDiffService]
    });
  });

  beforeEach(inject([DistinctUntilChangedDiffService], (_service: DistinctUntilChangedDiffService) => {
    service = _service;
    expect(service).toBeDefined();
  }));

  describe("diff for created items", () => {

  });

  it('should detect new created items', (done) => {

    let beforeChangeCollection: Array<any> = [
      {
        name: "Theuy Limpanont",
        books: [
          "Angular2",
          "NodeJS",
          {
            chapters: [1]
          }
        ]
      }
    ];

    let afterChangeCollection: Array<any> = [
      {
        name: "Theuy Limpanont",
        books: [
          "Angular2",
          "NodeJS",
          {
            chapters: [1]
          }
        ]
      },
      {
        name: "Tam Limpanont",
        books: [
          "Angular2",
          "NodeJS",
          {
            chapters: [1]
          }
        ]
      }
    ];

    service.distinctUntilChangedDiff$(
      Observable.from([beforeChangeCollection, afterChangeCollection])
    )
      .skip(1)
      .subscribe(([newCollection, diffCollection]) => {
        expect(diffCollection.createdCollection.length).toEqual(1);
        expect(diffCollection.updatedCollection.length).toEqual(0);
        expect(diffCollection.deletedCollection.length).toEqual(0);
        expect(diffCollection.oldCollection).not.toEqual(newCollection);
        done();
      })
  });
  it('should detect updated items', (done) => {

    let beforeChangeCollection: Array<any> = [
      {
        name: "Theuy Limpanont",
        books: [
          "Angular2",
          "NodeJS",
          {
            chapters: [1]
          }
        ]
      }
    ];

    let afterChangeCollection: Array<any> = [
      {
        name: "Tam Limpanont",
        books: [
          "Angular2",
          "Typescript",
          {
            chapters: [1]
          }
        ]
      }
    ];

    service.distinctUntilChangedDiff$(
      Observable.from([beforeChangeCollection, afterChangeCollection])
    )
      .skip(1)
      .subscribe(([newCollection, diffCollection]) => {
        expect(diffCollection.createdCollection.length).toEqual(0);
        expect(diffCollection.updatedCollection.length).toEqual(1);
        expect(diffCollection.deletedCollection.length).toEqual(0);
        expect(diffCollection.oldCollection).not.toEqual(newCollection);
        done();
      })
  });
  it('should detect deleted items', (done) => {

    let beforeChangeCollection: Array<any> = [
      {
        name: "Theuy Limpanont",
        books: [
          "Angular2",
          "NodeJS",
          {
            chapters: [1]
          }
        ]
      },
      {
        name: "Tam Limpanont",
        books: [
          "Angular2",
          "NodeJS",
          {
            chapters: [1]
          }
        ]
      }
    ];

    let afterChangeCollection: Array<any> = [
      {
        name: "Theuy Limpanont",
        books: [
          "Angular2",
          "NodeJS",
          {
            chapters: [1]
          }
        ]
      }
    ];

    service.distinctUntilChangedDiff$(
      Observable.from([beforeChangeCollection, afterChangeCollection])
    )
      .skip(1)
      .subscribe(([newCollection, diffCollection]) => {
        expect(diffCollection.createdCollection.length).toEqual(0);
        expect(diffCollection.updatedCollection.length).toEqual(0);
        expect(diffCollection.deletedCollection.length).toEqual(1);
        expect(diffCollection.oldCollection).not.toEqual(newCollection);
        done();
      })
  });
  it('should detect complex updated items', (done) => {

    let beforeChangeCollection: Array<any> = [
      {
        name: "Theuy Limpanont",
        books: [
          "Angular2",
          "NodeJS",
          {
            chapters: [1]
          }
        ]
      }
    ];

    let afterChangeCollection: Array<any> = [
      {
        name: "Tam Limpanont",
        books: [
          "TypeScript",
          "NodeJS",
          {
            chapters: [2]
          }
        ]
      }
    ];

    service.distinctUntilChangedDiff$(
      Observable.from([beforeChangeCollection, afterChangeCollection])
    )
      .skip(1)
      .subscribe(([newCollection, diffCollection]) => {
        expect(diffCollection.createdCollection.length).toEqual(0);
        expect(diffCollection.updatedCollection.length).toEqual(1);
        expect(diffCollection.deletedCollection.length).toEqual(0);
        expect(diffCollection.oldCollection).not.toEqual(newCollection);
        expect(newCollection).toEqual(afterChangeCollection);
        done();
      })
  });
  it('should detect complex created, deleted, updated items', (done) => {

    let beforeChangeCollection: Array<any> = [
      {
        id: 1,
        name: "Theuy Limpanont",
        books: [
          "Angular2",
          "NodeJS",
          {
            chapters: [1]
          }
        ]
      },
      {
        id: 2,
        name: "Tam Limpanont",
        books: [
          "Angular2",
          "NodeJS",
          {
            chapters: [1]
          }
        ]
      }
    ];

    let afterChangeCollection: Array<any> = [
      {
        id: 2,
        name: "Tam Limpanont",
        books: [
          "Typescript",
          "NodeJS",
          {
            chapters: [22]
          }
        ]
      },
      {
        id: 3,
        name: "Duan Limpanont",
        books: [
          "Angular2",
          "NodeJS",
          {
            chapters: [1]
          }
        ]
      }
    ];

    service.distinctUntilChangedDiff$(
      Observable.from([beforeChangeCollection, afterChangeCollection])
    )
      .skip(1)
      .subscribe(([newCollection, diffCollection]) => {
        expect(diffCollection.createdCollection.length).toEqual(0);
        expect(diffCollection.updatedCollection.length).toEqual(1);
        expect(diffCollection.deletedCollection.length).toEqual(0);
        expect(diffCollection.oldCollection).not.toEqual(newCollection);
        expect(newCollection).toEqual(afterChangeCollection);
        done();
      })
  });
});
