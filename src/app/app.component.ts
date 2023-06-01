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

    isOn = false;
    deck1: Deck = {
        state: TransportState.Stopped,
    };
    deck2: Deck = {
        state: TransportState.Stopped,
    };
    // TODO do something interesting with this
    // continuous pitch & speed modulation
    // playbackRate = el.add(1, el.cycle(1));

    sourceTape: Tape = {
        name: 'Drangie',
        L: null,
        R: null,
        path_L: '',
        path_R: '',
        playbackSpeed: 1,
        playbackRate: null,
        isPlaying: false,
        playing: null,
    };
    destTape: Tape = {
        name: 'Strums',
        L: null,
        R: null,
        path_L: '',
        path_R: '',
        playbackSpeed: 1,
        playbackRate: null,
        isPlaying: false,
        playing: null,
    };
    mixTape: Tape = {
        name: 'Mix',
        L: null,
        R: null,
        path_L: '',
        path_R: '',
        playbackSpeed: 1,
        playbackRate: null,
        isPlaying: false,
        playing: null,
    };

    private _playbackSpeed1 = 1;
    set playbackSpeed1(speed: number) {
        this._playbackSpeed1 = speed;
        this.refreshPlaybackSpeed(this.sourceTape, speed);
    }
    get playbackSpeed1() {
        return this._playbackSpeed1;
    }

    private _playbackSpeed2 = 1;
    set playbackSpeed2(speed: number) {
        this._playbackSpeed2 = speed;
        this.refreshPlaybackSpeed(this.destTape, speed);
    }
    get playbackSpeed2() {
        return this._playbackSpeed2;
    }

    constructor(private transportService: AudioTransportService) {}

    async ngOnInit() {
        this.srcButtons = Object.values(Transport);
        this.srcButtons.pop(); // no rec btn on source deck
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
        this.initTape(this.mixTape);
    }

    initTape(tape: Tape) {
        tape.path_L = tape.name.toLowerCase() + '_L';
        tape.path_R = tape.name.toLowerCase() + '_R';
        this.setPlaying(tape, false);
        this.setPlaybackRate(tape, 0);

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
                if (deck.state !== TransportState.Paused) {
                    deck.state = TransportState.Paused;
                    this.pause(tape);
                }
                break;
            case Transport.Stop:
                if (deck.state !== TransportState.Stopped) {
                    deck.state = TransportState.Stopped;
                    this.stop(tape);
                }
                break;
            case Transport.Rewind:
                if (deck.state !== TransportState.Rewinding) {
                    deck.state = TransportState.Rewinding;
                    this.rewind(tape);
                }
                break;
            case Transport.FastForward:
                if (deck.state !== TransportState.FastForwarding) {
                    deck.state = TransportState.FastForwarding;
                    this.fastForward(tape);
                }
                break;
            case Transport.Play:
                if (deck.state !== TransportState.Playing) {
                    deck.state = TransportState.Playing;
                    this.play(tape);
                }
                break;
            case Transport.Record:
                if (deck.state !== TransportState.Recording) {
                    deck.state = TransportState.Recording;
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
            deck.state = TransportState.Playing;
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

    private setPlaying(tape: Tape, value: boolean) {
        tape.isPlaying = value;
        tape.playing = el.const({
            key: `${tape.name.toLowerCase()}-playing`,
            value: Number(value),
        });
    }

    private setPlaybackRate(tape: Tape, factor = 1) {
        tape.playbackRate = el.const({
            key: `${tape.name.toLowerCase()}-speed`,
            value: tape.playbackSpeed * factor,
        });
    }

    stop(tape: Tape) {
        this.pause(tape);
        tape.isPlaying = false;
    }

    pause(tape: Tape) {
        this.setPlaybackRate(tape, 0);

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
        this.renderMixBus();
    }

    async play(tape: Tape) {
        if (!this.isOn) {
            await this.toggleAudioOnOff();
        }

        this.setPlaying(tape, true);
        this.setPlaybackRate(tape);

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

        this.renderMixBus();
    }

    fastForward(tape: Tape) {
        this.setPlaybackRate(tape, 1.5);

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

        this.renderMixBus();
    }

    rewind(tape: Tape) {
        this.setPlaybackRate(tape, -1.5);

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

        this.renderMixBus();
    }

    private renderMixBus() {
        const play = this.sourceTape.isPlaying || this.destTape.isPlaying;
        this.setPlaying(this.mixTape, play);
        this.setPlaybackRate(this.mixTape, Number(play));

        this.mixTape.L = el.add(
            { key: 'mix_L' },
            this.sourceTape.L,
            this.destTape.L
        );
        this.mixTape.R = el.add(
            { key: 'mix_R' },
            this.sourceTape.R,
            this.destTape.R
        );

        if (play) {
            core.render(this.mixTape.L, this.mixTape.R);
        }
    }

    refreshPlaybackSpeed(tape: Tape, speed: number) {
        tape.playbackSpeed = speed;
        this.setPlaybackRate(tape);

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

        this.renderMixBus();
    }
}
