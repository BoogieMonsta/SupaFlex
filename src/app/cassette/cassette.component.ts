import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cassette',
  templateUrl: './cassette.component.html',
  styleUrls: ['./cassette.component.scss']
})
export class CassetteComponent {

  @Input()
  title!: string;

  @Input()
  color!: string;

  initColor(): string {
    let color = '';
    switch (this.color) {
      case 'green':
        color = '#87EEAC';
        break;
      case 'blue':
        color = '#92c5fd';
        break;
      case 'red':
        color = '#ff7f7f';
        break;
      case 'yellow':
        color = '#f7f77f';
        break;
    }
    return color;
  }

}
