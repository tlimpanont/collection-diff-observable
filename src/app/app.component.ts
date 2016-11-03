import {Component, style, state, animate, transition, trigger} from "@angular/core";
import {MockServerService} from "./mock-server.service";
import {Observable, Subject} from "rxjs/Rx";
import {DiffTransFormerService} from "./diff-transformer.service";
var _ = require("lodash");
var deepDiff = require("deep-diff");
var observableDiff = require("deep-diff").observableDiff;

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

  constructor(mockServer: MockServerService, diffTransformer: DiffTransFormerService) {
    mockServer.start();

    this.data$ = diffTransformer.oldNewComparison$(mockServer.onMessage);

    let sub = this.data$.take(1).subscribe({
      next: (x) => {
        console.log("inital loaded data", x);
        this.collection = x.newCollection;
      },
      error: (err) => {
        console.error("something wrong occurred: " + err)
      },
      complete: () => {
        this.data$.subscribe(({
          oldCollection,
          newCollection,
          addedItemsCollection,
          editedItemsCollection
        }) => {
          console.log("continous data");
          this.newItemsCount += addedItemsCollection.length;
          Observable.timer(0).subscribe(() => {
            let mouse = Observable.fromEvent(document.getElementById("refresh"), "click")
              .subscribe(() => {
                addedItemsCollection.forEach((item: any) => {
                  item.animationType = "in";
                  this.collection.unshift(item);
                  this.newItemsCount = 0;
                  mouse.unsubscribe();
                });
              });
          });
        });
      }
    });
  }
  refresh($event: any) {
    this.refreshClick.next($event);
  }
}
