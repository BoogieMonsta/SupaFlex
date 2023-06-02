import {
    AfterViewInit,
    Component,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { AudioVisualizerService } from '../audio-visualizer.service';

@Component({
    selector: 'app-mixbus-monitor',
    templateUrl: './mixbus-monitor.component.html',
    styleUrls: ['./mixbus-monitor.component.scss'],
})
export class MixbusMonitorComponent implements AfterViewInit, OnChanges {
    @Input() isPlaying: boolean = false;
    @Input() waveformBuffer: any[] = [];
    peaks: any[] = [];

    constructor(private visualizer: AudioVisualizerService) {}

    ngAfterViewInit(): void {
        const canvas = document.getElementById('waveform') as HTMLCanvasElement;
        this.visualizer.setCanvas(canvas);
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('playing: ', this.isPlaying);

        if (changes['waveformBuffer'] && this.isPlaying) {
            this.visualizer.drawWaveform(this.waveformBuffer[0]);
        }
    }
}
