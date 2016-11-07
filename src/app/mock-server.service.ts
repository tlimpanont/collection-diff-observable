import {Injectable} from "@angular/core";
var faker = require("faker");
var _ = require("lodash");
import {Observable} from "rxjs/Rx";

@Injectable()
export class MockServerService {

  constructor() {

  }

  public onMessage$(): Observable<Array<any>> {

    return Observable.interval(1500).scan((acc: Array<any>, interval: number) => {
      let command: Array<string> = ["create", "update", "none"];

      if (interval > 0) {
        switch (_.sample(command)) {
          case "create":
            return [...acc, this.createNewRandomItem()];
          case "update":
            return _.cloneDeep(this.editRandomItem(acc));
          default:
            return _.cloneDeep(acc);
        }
        // return _.cloneDeep(this.editRandomItem(acc));
      } else {
        return _.cloneDeep(acc);
      }

    }, [{
      id: faker.random.uuid(),
      name: faker.name.findName(),
      image: faker.image.avatar(),
      text: faker.lorem.words()
    }]);
  }

  private editRandomItem(collection: Array<any>) {
    let randomIndex: number = _.random(collection.length - 1);
    console.log("item '" + collection[randomIndex].id + "' edited");
    collection[randomIndex].name = faker.name.findName();
    collection[randomIndex].image = faker.image.avatar();
    collection[randomIndex].text = faker.lorem.words();
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
