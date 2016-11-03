import {Component, style, state, animate, transition, trigger, Input} from "@angular/core";

@Component({
  selector: "list-item",
  template: `
    <li class="list-group-item animated fadeIn" [@animationType]="animationType" >
      <ng-content></ng-content>
    </li>
  `,
  animations: [
    trigger("animationType", [
      state("in", style({transform: "translateY(0)"})),
      transition("void => in", [
        style({transform: "translateY(-100%)"}),
        animate('.6s ease-in-out')
      ])
    ])
  ]
})
export class ListItem {
  @Input() animationType: string;

  constructor() {

  }
}
