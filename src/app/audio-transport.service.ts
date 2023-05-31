import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioTransportService implements OnInit {

  deck1StopSubject = new Subject();
  deck2StopSubject = new Subject();
  deck1Stop$ = this.deck1StopSubject.asObservable();
  deck2Stop$ = this.deck2StopSubject.asObservable();

  constructor() {}

  ngOnInit(): void {
  }

  emitStopSubject(deck: number) {
    if (deck === 1) {
      this.deck1StopSubject.next(true);
    } else if (deck === 2) {
      this.deck2StopSubject.next(true);
    }
  }
  
}
