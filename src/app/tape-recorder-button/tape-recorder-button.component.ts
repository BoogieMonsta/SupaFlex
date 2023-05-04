import {
    Component,
    HostListener,
    Input,
    OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Transport } from '../models/AudioTransport';

// TODO make it work with multiple keyboard layouts
// This is for AZERTY
const keyMap = new Map<string, string>([
    [Transport.Pause + '1', 'q'],
    [Transport.Stop + '1', 'd'],
    [Transport.Rewind + '1', 'z'],
    [Transport.FastForward + '1', 'e'],
    [Transport.Play + '1', 'f'],
    [Transport.Pause + '2', 'j'],
    [Transport.Stop + '2', 'k'],
    [Transport.Rewind + '2', 'i'],
    [Transport.FastForward + '2', 'o'],
    [Transport.Play + '2', 'm'],
    [Transport.Record + '2', 'ù'],
]);

@Component({
    selector: 'app-tape-recorder-button',
    templateUrl: './tape-recorder-button.component.html',
    styleUrls: ['./tape-recorder-button.component.scss'],
})
export class TapeRecorderButtonComponent implements OnInit {
    @Input()
    deckNumber!: number;
    @Input()
    btnColor = 'gray';
    @Input()
    iconName!: string;
    iconSVG!: SafeHtml;

    pressed = false;

    constructor(
        private httpClient: HttpClient,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.httpClient
            .get(`assets/svg/${this.iconName}.svg`, { responseType: 'text' })
            .subscribe((value) => {
                this.iconSVG = this.sanitizer.bypassSecurityTrustHtml(value);
            });
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (keyMap.get(this.iconName + this.deckNumber) === event.key) {
            this.pressed = true;
        }
    }

    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if (keyMap.get(this.iconName + this.deckNumber) === event.key) {
            this.pressed = false;
        }
    }

    onBtnPress() {
        console.log('button pressed');
    }
}
