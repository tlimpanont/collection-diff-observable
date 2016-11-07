import {Component} from "@angular/core";
import {MockServerService} from "./mock-server.service";
import {Observable, Subject} from "rxjs/Rx";
import {DistinctUntilChangedDiffService} from "./distinct-until-changed-diff.service";
import * as _ from "lodash";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app works!";
  private refreshClick = new Subject<Event>();
  collection: Array<any> = [];
  data$;
  newItemsCount = 0;

  constructor(mockServer: MockServerService, private _distinct: DistinctUntilChangedDiffService) {

    this.data$ = this._distinct.distinctUntilChangedDiff$(mockServer.onMessage$());

    let sub = this.data$.take(1).subscribe({
      next: ([newCollection]) => {
        console.log("inital loaded data", newCollection);
        this.collection = newCollection;
      },
      error: (err) => {
        console.error("something wrong occurred: " + err)
      },
      complete: this._dataLoaded.bind(this)
    });
  }

  private _dataLoaded() {

    this._distinct.updateDiff$(this.data$)
      .subscribe(([newCollection, diffCollection]) => {
        let {updatedCollection} = diffCollection;

        this.collection.forEach((item: any, index: number) => {
          let _col = _.filter(updatedCollection, _.matches({id: item.id}));
          _col.forEach((_item: any) => {
            if (item.id === _item.id) {

              console.log(item);
              console.log(_item);

              this.collection[index] = _item;
              this.collection[index].animationType = "update";
            }
          });
        });
      });

    this._distinct.createDiff$(this.data$)
      .subscribe(([newCollection, diffCollection]) => {
        let {createdCollection} = diffCollection;
        this.newItemsCount += createdCollection.length;
        Observable.timer(0).subscribe(() => {
          let mouse = Observable.fromEvent(document.getElementById("refresh"), "click")
            .subscribe(() => {

              createdCollection.forEach((item: any, index: number) => {
                item.animationType = "in";
                this.collection.unshift(item);
              });

              this.newItemsCount = 0;
              mouse.unsubscribe();
            });
        });
      });
  }

  refresh($event: any) {
    this.refreshClick.next($event);
  }
}
