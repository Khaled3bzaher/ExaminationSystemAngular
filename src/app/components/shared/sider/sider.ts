import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-sider',
  imports: [DrawerModule,Avatar,Button],
  templateUrl: './sider.html',
  styleUrl: './sider.css'
})
export class Sider {
    @Input() visible: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();

  close() {
    this.visibleChange.emit(false);
  }
}
