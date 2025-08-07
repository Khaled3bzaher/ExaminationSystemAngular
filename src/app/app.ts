import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { Footer } from "./components/footer/footer";
import { SignalRService } from './services/signal-rservice';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private signalRService:SignalRService){}
  protected title = 'Exams System';
  ngOnInit(): void {
    this.signalRService.startConnection();
  }
}
