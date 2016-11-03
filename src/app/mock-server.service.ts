import {Injectable} from "@angular/core";
var faker = require("faker");
var _ = require("lodash");
import {Observable, BehaviorSubject} from "rxjs/Rx";

@Injectable()
export class MockServerService {

  public createCollection: Function = (count: number = 20): Array<any> => {
    let collection = [];
    for (var i = 0; i < count; i++) {
      collection.push({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        image: faker.image.avatar(),
        text: faker.lorem.sentences()
      });
    }
    return collection;
  };


  public onMessage: BehaviorSubject<any> = new BehaviorSubject<any>(this.createCollection());

  constructor() {

  }

  public start() {
    Observable.interval(1000)
      .withLatestFrom(this.onMessage)
      .map(([interval, collection]) => {
        let addNewItem: boolean = ((interval * _.random() % 2) === 1);
        if (addNewItem) {
          let items = _.random(2);
          for (var i = 0; i < items; i++) {
            this.addRandomItem(collection, interval + i);
            console.log("items toegevoed via server", items);
          }
        } else {
          console.log("items edited via server", 1);
          this.editRandomItem(collection, interval);
        }
        return collection;
      })
      .subscribe(x => this.onMessage.next(x));
  }

  private editRandomItem(collection: Array<any>, interval) {
    let randomIndex: number = _.random(collection.length - 1);
    collection[randomIndex].name = faker.name.findName();
    collection[randomIndex].image = faker.image.avatar();
    collection[randomIndex].text = faker.lorem.sentences();
  }

  private addRandomItem(collection: Array<any>, interval: number) {
    collection.unshift({
      id: faker.random.uuid(),
      name: faker.name.findName(),
      image: faker.image.avatar(),
      text: faker.lorem.sentences()
    })
  }
}
