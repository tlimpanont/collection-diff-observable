import {Injectable} from "@angular/core";
var faker = require("faker");
var _ = require("lodash");
import {Observable} from "rxjs/Rx";

@Injectable()
export class MockServerService {

  private _createRandomCollection: Function = () => {
    let collection: Array<any> = [];

    for (let i = 0; i < 5; i++) {
      collection.push({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        image: faker.image.avatar(),
        text: faker.lorem.words()
      });
    }
    return collection;
  };

  private _initialCollection: Array<any> = this._createRandomCollection();

  constructor() {

  }

  public onMessage$(): Observable<Array<any>> {

    return Observable.interval(500).scan((acc: Array<any>, interval: number) => {
      let editItem: boolean = ( (_.random(interval) % 2) === 0);
      if (interval > 0) {
        if (editItem || acc.length > 10) {
          return _.cloneDeep(this.editRandomItem(acc));
        } else {
          return [...acc, this.createNewRandomItem()];
        }
      } else {
        return _.cloneDeep(acc);
      }

    }, this._initialCollection);
  }

  private editRandomItem(collection: Array<any>) {
    let randomIndex: number = _.random(collection.length - 1);
    collection[randomIndex].name = faker.name.findName();
    collection[randomIndex].image = faker.image.avatar();
    collection[randomIndex].text = faker.lorem.words();
    console.log("item '" + collection[randomIndex].id + "' edited");
    return collection;
  }

  private createNewRandomItem(): Object {
    let newObject: any = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      image: faker.image.avatar(),
      text: faker.lorem.words()
    };
    console.log("item with id " + newObject.id + " created");
    return newObject;
  }
}
