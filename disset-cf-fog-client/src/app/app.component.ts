import { Component, HostListener, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'DISSET-CF-Fog-WebApp';
  public isLinear = false;
  public shouldOpenSidenav = true;
  public isBigScreen = true;

  public ngOnInit(): void {
    this.isBigScreen = window.innerWidth > 1000;
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event): void {
    this.isBigScreen = event.target.innerWidth > 1000;
  }

  public toggleExpanded(sidenav: MatSidenav): void {
    sidenav.toggle();
  }
}
