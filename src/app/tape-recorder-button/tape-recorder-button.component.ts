import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Transport, keyMap } from '../models/AudioTransport';
import { AudioTransportService } from '../audio-transport.service';

@Component({
    selector: 'app-tape-recorder-button',
    templateUrl: './tape-recorder-button.component.html',
    styleUrls: ['./tape-recorder-button.component.scss'],
})
export class TapeRecorderButtonComponent implements OnInit, OnDestroy {
    @Input()
    deckNumber!: number;
    @Input()
    btnColor = 'gray';
    @Input()
    iconName!: string;
    @Input()
    snapBack = false;

    @Output()
    onBtnDown = new EventEmitter<any>();
    @Output()
    onBtnUp = new EventEmitter<any>();

    iconSVG!: SafeHtml;
    pressed = false;
    latch = false;

    subscriptions: any[] = [];

    constructor(
        private httpClient: HttpClient,
        private sanitizer: DomSanitizer,
        private transportService: AudioTransportService
    ) {}

    ngOnInit(): void {
        this.latch =
            this.iconName === Transport.Record ||
            this.iconName === Transport.Play;
        this.httpClient
            .get(`assets/svg/${this.iconName}.svg`, { responseType: 'text' })
            .subscribe((value) => {
                this.iconSVG = this.sanitizer.bypassSecurityTrustHtml(value);
            });

        if (this.deckNumber === 1) {
            const deck1StopSub = this.transportService.deck1Stop$.subscribe(
                (value) => {
                    if (value) {
                        this.pressed = false;
                    }
                }
            );
            this.subscriptions.push(deck1StopSub);
        } else if (this.deckNumber === 2) {
            const deck2StopSub = this.transportService.deck2Stop$.subscribe(
                (value) => {
                    if (value) {
                        this.pressed = false;
                    }
                }
            );
            this.subscriptions.push(deck2StopSub);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (keyMap.get(this.iconName + this.deckNumber) === event.key) {
            this.pressed = true;
            this.onBtnDown.emit({
                deckNumber: this.deckNumber,
                name: this.iconName,
            });
        }
    }

    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        // conditions that release the button
        if (
            (keyMap.get(this.iconName + this.deckNumber) === event.key &&
                !this.latch) ||
            event.key === keyMap.get(Transport.Stop + this.deckNumber)
        ) {
            this.pressed = false;
        }
        // if ff, rew, or pause, then emit keyup event
        if (
            (this.iconName === Transport.FastForward ||
                this.iconName === Transport.Rewind ||
                this.iconName === Transport.Pause) &&
            keyMap.get(this.iconName + this.deckNumber) === event.key
        ) {
            this.onBtnUp.emit({
                deckNumber: this.deckNumber,
                name: this.iconName,
            });
        }
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        this.pressed = true;
        this.onBtnDown.emit({
            deckNumber: this.deckNumber,
            name: this.iconName,
        });
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent) {
        // conditions that release the button
        if (!this.latch) {
            this.pressed = false;
        }
        // if ff, rew, or pause, then emit keyup event
        if (
            this.iconName === Transport.FastForward ||
            this.iconName === Transport.Rewind ||
            this.iconName === Transport.Pause ||
            this.iconName === Transport.Stop
        ) {
            this.onBtnUp.emit({
                deckNumber: this.deckNumber,
                name: this.iconName,
            });
        }
    }
}
