import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import {MockServerService} from "./mock-server.service";
import {ListItem} from "./list-item.component";
import {DiffTransFormerService} from "./diff-transformer.service";

@NgModule({
  declarations: [
    AppComponent,
    ListItem
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    MockServerService,
    DiffTransFormerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
