import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() showItems: boolean;
  @Input() title: string;
  @Output() sidenavToggle = new EventEmitter<void>();
}
