import { Component, OnInit } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { UserManagementService } from 'src/app/services/user-management/user-management.service';

@Component({
  selector: 'app-admin-site',
  templateUrl: './admin-site.component.html',
  styleUrls: ['./admin-site.component.css'],
})
export class AdminSiteComponent implements OnInit{


constructor( private userService: UserManagementService,){}

  ngOnInit(): void {
    this.getUser();

  }
  users = ['samantha@example.com','adam@example.com','harold@example.com','charles@example.com']
  getUser(){
    console.log(this.userService.getAllUser());
}
}
