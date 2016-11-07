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
  private _refreshClick$ = new Subject<Event>();
  collection: Array<any> = [];
  data$;
  newItemsCount = 0;

  constructor(mockServer: MockServerService, private _distinct: DistinctUntilChangedDiffService) {

    this.data$ = this._distinct.distinctUntilChangedDiff$(mockServer.onMessage$());

    this.data$.take(1).subscribe({
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
        this._distinct.applyUpdatesToCollection(updatedCollection, this.collection, "id");
      });

    this._distinct
      .createDiff$(this.data$)
      .subscribe(([newCollection, diffCollection]) => {
        let {createdCollection} = diffCollection;
        this.newItemsCount += createdCollection.length;
        this._refreshClick$.subscribe(() => {
          this._distinct.prependCreationsToCollection(createdCollection, this.collection);
          this.newItemsCount = 0;
          window.scrollTo(0, 0);
        });
      });
  }

  refresh($event: any) {
    this._refreshClick$.next($event);
  }
}
