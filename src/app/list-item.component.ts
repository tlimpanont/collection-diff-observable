import {Component, style, state, animate, transition, trigger, Input, keyframes} from "@angular/core";

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
      state("update", style({backgroundColor: "transparent"})),
      transition("void => in", [
        style({transform: "translateY(-100%)"}),
        animate('.6s ease-in-out')
      ]),
      transition("void => update", [
        animate('1s ease-in', keyframes([
          style({backgroundColor: "#fce5bf", offset: 0}),
          style({backgroundColor: "transparent", offset: 0.98})
        ]))
      ])
    ])
  ]
})
export class ListItem {
  @Input() animationType: string;

  constructor() {

  }
}
