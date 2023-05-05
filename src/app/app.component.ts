import { Component, OnInit } from '@angular/core';
import { el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { Notes } from './notes/notes';
import { Transport, TransportState } from './models/AudioTransport';
import { AudioTransportService } from './audio-transport.service';

const core = new WebRenderer();
let ctx = new AudioContext();
const OFF = el.const({ value: 0 });

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    srcButtons: string[] = [];
    dstButtons: string[] = [];
    transportState1 = {
        previous: TransportState.Stopped,
        current: TransportState.Stopped,
    };
    transportState2 = {
        previous: TransportState.Stopped,
        current: TransportState.Stopped,
    };
    title = 'PauseTape';
    isAudioOn = false;

    constructor(private transportService: AudioTransportService) {}

    async ngOnInit() {
        this.srcButtons = Object.values(Transport);
        this.srcButtons.pop();
        this.dstButtons = Object.values(Transport);

        core.on('load', () => {
            core.on('error', (e: any) => {
                console.log(e);
            });
        });
        await this.main();
    }

    onBtnDown(btnData: any) {
        if (btnData.deckNumber === 1) {
            switch (btnData.name) {
                case Transport.Pause:
                    if (
                        this.transportState1.current !== TransportState.Paused
                    ) {
                        this.transportState1.previous =
                            this.transportState1.current;
                        this.transportState1.current = TransportState.Paused;
                    }
                    break;
                case Transport.Stop:
                    if (
                        this.transportState1.current !== TransportState.Stopped
                    ) {
                        this.transportState1.previous =
                            this.transportState1.current;
                        this.transportState1.current = TransportState.Stopped;
                    }
                    break;
                case Transport.Rewind:
                    if (
                        this.transportState1.current !==
                        TransportState.Rewinding
                    ) {
                        this.transportState1.previous =
                            this.transportState1.current;
                        this.transportState1.current = TransportState.Rewinding;
                    }
                    break;
                case Transport.FastForward:
                    if (
                        this.transportState1.current !==
                        TransportState.FastForwarding
                    ) {
                        this.transportState1.previous =
                            this.transportState1.current;
                        this.transportState1.current =
                            TransportState.FastForwarding;
                    }
                    break;
                case Transport.Play:
                    if (
                        this.transportState1.current !== TransportState.Playing
                    ) {
                        this.transportState1.previous =
                            this.transportState1.current;
                        this.transportState1.current = TransportState.Playing;
                    }
                    break;
            }
        } else if (btnData.deckNumber === 2) {
            switch (btnData.name) {
                case Transport.Pause:
                    if (
                        this.transportState2.current !== TransportState.Paused
                    ) {
                        this.transportState2.previous =
                            this.transportState2.current;
                        this.transportState2.current = TransportState.Paused;
                    }
                    break;
                case Transport.Stop:
                    if (
                        this.transportState2.current !== TransportState.Stopped
                    ) {
                        this.transportState2.previous =
                            this.transportState2.current;
                        this.transportState2.current = TransportState.Stopped;
                    }
                    break;
                case Transport.Rewind:
                    if (
                        this.transportState2.current !==
                        TransportState.Rewinding
                    ) {
                        this.transportState2.previous =
                            this.transportState2.current;
                        this.transportState2.current = TransportState.Rewinding;
                    }
                    break;
                case Transport.FastForward:
                    if (
                        this.transportState2.current !==
                        TransportState.FastForwarding
                    ) {
                        this.transportState2.previous =
                            this.transportState2.current;
                        this.transportState2.current =
                            TransportState.FastForwarding;
                    }
                    break;
                case Transport.Play:
                    if (
                        this.transportState2.current !==
                            TransportState.Playing &&
                        this.transportState2.current !==
                            TransportState.Recording
                    ) {
                        this.transportState2.previous =
                            this.transportState2.current;
                        this.transportState2.current = TransportState.Playing;
                    }
                    break;
                case Transport.Record:
                    if (
                        this.transportState2.current !==
                        TransportState.Recording
                    ) {
                        this.transportState2.previous =
                            this.transportState2.current;
                        this.transportState2.current = TransportState.Recording;
                    }
                    break;
            }
        }
    }

    onBtnUp(btnData: any) {
        if (btnData.deckNumber === 1) {
            if (
                btnData.name === Transport.Pause ||
                btnData.name === Transport.Rewind ||
                btnData.name === Transport.FastForward
            ) {
                this.transportState1.current = this.transportState1.previous;
            } else if (btnData.name === Transport.Stop) {
                this.transportService.deck1StopSubject.next(true);
            }
        } else if (btnData.deckNumber === 2) {
            if (
                btnData.name === Transport.Pause ||
                btnData.name === Transport.Rewind ||
                btnData.name === Transport.FastForward
            ) {
                this.transportState2.current = this.transportState2.previous;
            } else if (btnData.name === Transport.Stop) {
                this.transportService.deck2StopSubject.next(true);
            }
        }
    }

    private async main() {
        let node = await core.initialize(ctx, {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2],
        });
        node.connect(ctx.destination);
    }

    toggleAudioOnOff() {
        ctx.resume();
        if (this.isAudioOn) {
            this.turnAudioOff();
        } else {
            this.playSound();
        }
    }

    turnAudioOff() {
        core.render(OFF, OFF);
        this.isAudioOn = false;
    }

    playSound() {
        let leftChannel = Notes.C4;
        let rightChannel = Notes.C3;
        core.render(leftChannel, rightChannel);
        this.isAudioOn = true;
    }
}
