import { Component, OnInit } from '@angular/core';
import { el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { Transport, TransportState } from './models/AudioTransport';
import { AudioTransportService } from './audio-transport.service';
import { Tape } from './models/Tape';
import { Deck } from './models/Deck';

const core = new WebRenderer();
let ctx = new AudioContext();
let audioBuffer: AudioBuffer;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    srcButtons: string[] = [];
    dstButtons: string[] = [];
    deck1: Deck = {
        previousState: TransportState.Stopped,
        currentState: TransportState.Stopped,
    };
    deck2: Deck = {
        previousState: TransportState.Stopped,
        currentState: TransportState.Stopped,
    };
    title = 'PauseTape';

    isOn = false;
    // TODO do something interesting with this
    // continuous pitch & speed modulation
    // playbackRate = el.add(1, el.cycle(1));

    sourceTape: Tape = {
        name: 'Drangie',
        L: null,
        R: null,
        path_L: '',
        path_R: '',
        playbackRate: null,
        isPlaying: false,
        playing: null,
    };
    destTape: Tape = {
        name: 'Chops',
        L: null,
        R: null,
        path_L: '',
        path_R: '',
        playbackRate: null,
        isPlaying: false,
        playing: null,
    };

    constructor(private transportService: AudioTransportService) {}

    async ngOnInit() {
        this.srcButtons = Object.values(Transport);
        this.srcButtons.pop();
        this.dstButtons = Object.values(Transport);

        core.on('load', async () => {
            core.on('error', (e: any) => {
                console.log(e);
            });

            this.initTapes();

            // TODO implement with el.snapshot()
            core.on('snapshot', (e: any) => {
                console.log(e);
            });
        });
        await this.main();
    }

    initTapes() {
        this.initTape(this.sourceTape);
        this.initTape(this.destTape);
    }

    initTape(tape: Tape) {
        tape.path_L = tape.name.toLowerCase() + '_L';
        tape.path_R = tape.name.toLowerCase() + '_R';
        tape.playbackRate = el.const({ key: 'speed', value: 0 });
        tape.playing = el.const({ key: 'playing', value: 0 });

        tape.L = el.sample(
            { key: tape.path_L, path: tape.path_L },
            tape.playing, // trigger (1 = one-shot)
            tape.playbackRate
        );
        tape.R = el.sample(
            { key: tape.path_R, path: tape.path_R },
            tape.playing, // trigger (1 = one-shot)
            tape.playbackRate
        );
    }

    onBtnDown(btnData: any) {
        if (btnData.deckNumber !== 1 && btnData.deckNumber !== 2) {
            console.error('Invalid deck number', btnData.deckNumber);
            return;
        }
        const tape = btnData.deckNumber === 1 ? this.sourceTape : this.destTape;
        const deck = btnData.deckNumber === 1 ? this.deck1 : this.deck2;
        switch (btnData.name) {
            case Transport.Pause:
                if (deck.currentState !== TransportState.Paused) {
                    deck.previousState = deck.currentState;
                    deck.currentState = TransportState.Paused;
                    this.pause(tape);
                }
                break;
            case Transport.Stop:
                if (deck.currentState !== TransportState.Stopped) {
                    deck.previousState = deck.currentState;
                    deck.currentState = TransportState.Stopped;
                    this.stop(tape);
                }
                break;
            case Transport.Rewind:
                if (deck.currentState !== TransportState.Rewinding) {
                    deck.previousState = deck.currentState;
                    deck.currentState = TransportState.Rewinding;
                    this.rewind(tape);
                }
                break;
            case Transport.FastForward:
                if (deck.currentState !== TransportState.FastForwarding) {
                    deck.previousState = deck.currentState;
                    deck.currentState = TransportState.FastForwarding;
                    this.fastForward(tape);
                }
                break;
            case Transport.Play:
                if (deck.currentState !== TransportState.Playing) {
                    deck.previousState = deck.currentState;
                    deck.currentState = TransportState.Playing;
                    this.play(tape);
                }
                break;
            case Transport.Record:
                if (deck.currentState !== TransportState.Recording) {
                    deck.previousState = deck.currentState;
                    deck.currentState = TransportState.Recording;
                    // TODO implement recording
                }
                break;
        }
    }

    onBtnUp(btnData: any) {
        if (btnData.deckNumber !== 1 && btnData.deckNumber !== 2) {
            console.error('Invalid deck number', btnData.deckNumber);
            return;
        }
        const tape = btnData.deckNumber === 1 ? this.sourceTape : this.destTape;
        const deck = btnData.deckNumber === 1 ? this.deck1 : this.deck2;
        if (
            (btnData.name === Transport.Pause ||
                btnData.name === Transport.Rewind ||
                btnData.name === Transport.FastForward) &&
            tape.isPlaying
        ) {
            deck.currentState = deck.previousState;
            this.play(tape);
        } else if (btnData.name === Transport.Stop) {
            this.transportService.emitStopSubject(btnData.deckNumber);
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

    async fetchAndDecodeAudio(tape: Tape) {
        const response = await fetch(
            `assets/samples/${tape.name.toLowerCase()}.mp3`
        );
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        const sampleBufferL = audioBuffer.getChannelData(0);
        const sampleBufferR = audioBuffer.getChannelData(1);

        core.updateVirtualFileSystem({
            [tape.path_L]: sampleBufferL,
            [tape.path_R]: sampleBufferR,
        });
    }

    async toggleAudioOnOff() {
        if (this.isOn) {
            await ctx.suspend();
            this.isOn = false;
        } else {
            await ctx.resume();
            this.isOn = true;
            await this.fetchAndDecodeAudio(this.sourceTape);
            await this.fetchAndDecodeAudio(this.destTape);
        }
    }

    stop(tape: Tape) {
        this.pause(tape);
        tape.isPlaying = false;
    }

    pause(tape: Tape) {
        if (tape.path_L === null || tape.path_R === null) {
            console.error('Invalid tape', tape);
            return;
        }

        tape.playing = el.const({ key: 'playing', value: 1 });
        tape.playbackRate = el.const({ key: 'speed', value: 0 });

        tape.L = el.sample(
            { key: tape.path_L, path: tape.path_L },
            tape.playing, // trigger (1 = one-shot)
            tape.playbackRate
        );
        tape.R = el.sample(
            { key: tape.path_R, path: tape.path_R },
            tape.playing, // trigger (1 = one-shot)
            tape.playbackRate
        );
        core.render(tape.L, tape.R);
    }

    async play(tape: Tape) {
        if (!this.isOn) {
            await this.toggleAudioOnOff();
        }
        if (tape.path_L === null || tape.path_R === null) {
            console.error('Invalid tape', tape);
            return;
        }

        tape.playing = el.const({ key: 'playing', value: 1 });
        tape.playbackRate = el.const({ key: 'speed', value: 1 });

        tape.L = el.sample(
            { key: tape.path_L, path: tape.path_L },
            tape.playing, // trigger (1 = one-shot)
            tape.playbackRate
        );
        tape.R = el.sample(
            { key: tape.path_R, path: tape.path_R },
            tape.playing, // trigger (1 = one-shot)
            tape.playbackRate
        );

        core.render(tape.L, tape.R);
        tape.isPlaying = true;
    }

    fastForward(tape: Tape) {
        if (tape.path_L === null || tape.path_R === null) {
            console.error('Invalid tape', tape);
            return;
        }

        tape.playbackRate = el.const({ key: 'speed', value: 2 });

        tape.L = el.sample(
            { key: tape.path_L, path: tape.path_L },
            tape.playing, // trigger (1 = one-shot)
            tape.playbackRate
        );
        tape.R = el.sample(
            { key: tape.path_R, path: tape.path_R },
            tape.playing, // trigger (1 = one-shot)
            tape.playbackRate
        );

        core.render(tape.L, tape.R);
    }

    rewind(tape: Tape) {
        if (tape.path_L === null || tape.path_R === null) {
            console.error('Invalid tape', tape);
            return;
        }

        tape.playbackRate = el.const({ key: 'speed', value: -2 });

        tape.L = el.sample(
            { key: tape.path_L, path: tape.path_L },
            tape.playing, // trigger (1 = one-shot)
            tape.playbackRate
        );
        tape.R = el.sample(
            { key: tape.path_R, path: tape.path_R },
            tape.playing, // trigger (1 = one-shot)
            tape.playbackRate
        );

        core.render(tape.L, tape.R);
    }
}
