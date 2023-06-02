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
export class MixbusMonitorComponent implements OnChanges, AfterViewInit {
    @Input() isPlaying: boolean = false;
    @Input() waveformBuffer: any[] = [];

    constructor(private visualizer: AudioVisualizerService) {}

    ngAfterViewInit(): void {
        this.visualizer.initPixiApp('waveform-container');
        this.visualizer.startAnimation();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['waveformBuffer'] && this.isPlaying) {
            const binnedData = this.visualizer.downsample(
                this.waveformBuffer[0],
                100
            );
            this.visualizer.pushToBuffer(binnedData);
            this.visualizer.drawWaveform();
        }
    }
}
