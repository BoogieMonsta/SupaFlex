import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioTransportService implements OnInit {

  icons: { [key: string]: string } = {};

  constructor() {}

  ngOnInit(): void {
  }
  
}
