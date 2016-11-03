/* tslint:disable:no-unused-variable */

import { TestBed, async } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import {ListItem} from "./list-item.component";
import {MockServerService} from "./mock-server.service";
import {DiffTransFormerService} from "./diff-transformer.service";

describe("App: AngularCli", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ListItem
      ],
      providers: [
        MockServerService,
        DiffTransFormerService
      ]
    });
  }));

  it("should create the app", () => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
