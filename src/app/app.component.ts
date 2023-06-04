import { Component, OnInit } from '@angular/core';
import { el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { AudioTransportService } from './audio-transport.service';
import { Transport, TransportState } from './models/AudioTransport';
import { Deck } from './models/Deck';
import { Tape } from './models/Tape';
import { SliderDirection, SliderOrientation, SliderSettings } from './slider/slider.component';

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

    speedCtrlSettings: SliderSettings = {
        orientation: SliderOrientation.vertical,
        direction: SliderDirection.rtl,
        start: [1],
        step: 0.01,
        range: {
            'min': -3,
            'max': 3,
        },
    };

    sloppinessSettings: SliderSettings = {
        orientation: SliderOrientation.horizontal,
        direction: SliderDirection.ltr,
        start: [0.03],
        // step: 0.01,
        range: {
            'min': 0.01,
            'max': 0.1,
        },
    };

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
        sloppiness: 0.03,
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
        sloppiness: 0.03,
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
        sloppiness: 0,
    };

    mixWaveform: any[] = [];

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

            core.on('scope', (e) => {
                if (e.source === 'mix_L') {
                    this.mixWaveform = e.data;
                }
                if (e.source === 'mix_R') {
                }
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

    handlePlaybackSpeedChange(event: any, deckNb: number) {
        if (deckNb !== 1 && deckNb !== 2) {
            console.error('Invalid deck number', deckNb);
            return;
        }
        const tape = deckNb === 1 ? this.sourceTape : this.destTape;
        this.refreshPlaybackSpeed(tape, event.value);
    }

    handleSloppinessChange(event: any, deckNb: number) {
        if (deckNb !== 1 && deckNb !== 2) {
            console.error('Invalid deck number', deckNb);
            return;
        }
        const tape = deckNb === 1 ? this.sourceTape : this.destTape;
        this.refreshSloppiness(tape, event.value);
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
        tape.playbackRate = el.smooth(
            el.tau2pole(
                el.const({
                    key: `${tape.name.toLowerCase()}-sloppiness`,
                    value: tape.sloppiness,
                })
            ),
            el.const({
                key: `${tape.name.toLowerCase()}-speed`,
                value: tape.playbackSpeed * factor,
            })
        );
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
            core.render(
                el.scope({ name: 'mix_L' }, this.mixTape.L),
                el.scope({ name: 'mix_R' }, this.mixTape.R)
            );
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

    refreshSloppiness(tape: Tape, sloppiness: number) {
        tape.sloppiness = sloppiness;
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
