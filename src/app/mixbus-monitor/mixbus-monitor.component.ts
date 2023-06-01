import {
    AfterViewInit,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';

@Component({
    selector: 'app-mixbus-monitor',
    templateUrl: './mixbus-monitor.component.html',
    styleUrls: ['./mixbus-monitor.component.scss'],
})
export class MixbusMonitorComponent
    implements AfterViewInit, OnChanges, OnDestroy
{
    @Input() isPlaying: boolean = false;
    @Input() waveformBuffer: any[] = [];
    peaks: any[] = [];

    private wavesurfer: WaveSurfer | undefined;

    constructor() {}

    ngAfterViewInit(): void {
        const options = {
            container: '#waveform',
            waveColor: '#4dff98',
            progressColor: '#4dff98',
            cursorColor: '#9ca3af',
            cursorWidth: 3,
            barWidth: 2,
            barGap: 1,
            fillParent: true,
            height: 128,
        };
        this.wavesurfer = WaveSurfer.create(options);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['waveformBuffer'] && this.wavesurfer && this.isPlaying) {
            this.peaks = [...this.peaks, ...this.waveformBuffer[0]];
            this.wavesurfer.load('/assets/samples/drangie.mp3', this.peaks);
        }
    }

    ngOnDestroy(): void {
        if (this.wavesurfer) {
            this.wavesurfer.destroy();
        }
    }
}
