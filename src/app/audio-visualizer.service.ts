import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';

class CircularBuffer {
    private buffer: Float32Array;
    private size: number;
    private start: number;
    private end: number;

    constructor(size: number) {
        this.buffer = new Float32Array(size);
        this.size = size;
        this.start = 0;
        this.end = 0;
    }

    push(value: number) {
        this.buffer[this.end % this.size] = value;
        if (this.end - this.start === this.size) {
            this.start++;
        }
        this.end++;
    }

    get() {
        if (this.start === this.end) {
            return new Float32Array();
        }
        if (this.end - this.start < this.size) {
            return this.buffer.slice(this.start, this.end);
        }
        return this.buffer;
    }

    slice(start: number, end: number) {
        return this.buffer.slice(start, end);
    }

    replace(newBuffer: Float32Array) {
        this.buffer = newBuffer;
        this.start = 0;
        this.end = newBuffer.length;
    }
}

@Injectable({
    providedIn: 'root',
})
export class AudioVisualizerService {
    private app: PIXI.Application | null = null;
    private buffer: CircularBuffer | null = null;
    private bufferSize: number = 800;

    constructor() {}

    initPixiApp(containerId: string) {
        this.app = new PIXI.Application({
            width: 800,
            height: 160,
            backgroundColor: '#494949',
            antialias: true,
            backgroundAlpha: 0.5,
        });

        this.buffer = new CircularBuffer(this.bufferSize);

        const container = document.getElementById(containerId);

        if (container) {
            container.appendChild(this.app.view as HTMLCanvasElement);
        }
    }

    downsample(data: Float32Array, binSize: number): Float32Array {
        let binnedData = new Float32Array(Math.ceil(data.length / binSize));

        for (let i = 0, j = 0; i < data.length; i += binSize, j++) {
            let sum = 0;
            let count = 0;

            for (let k = 0; k < binSize; k++) {
                if (i + k < data.length) {
                    sum += data[i + k];
                    count++;
                }
            }

            binnedData[j] = sum / count;
        }

        return binnedData;
    }

    startAnimation() {
        if (!this.app) {
            console.warn('Pixi application is not initialized');
            return;
        }
        this.app.ticker.add(() => {
            this.drawWaveform();
        });
    }

    pushToBuffer(data: Float32Array) {
        // Downsample the data
        let downsampledData = this.downsample(data, 50);
    
        // Calculate how much data we're going to keep
        const keepSize = this.bufferSize - downsampledData.length;
    
        // Create a new buffer of the appropriate size
        let newBuffer = new Float32Array(this.bufferSize);
    
        if (this.buffer === null) {
            console.warn('Buffer is not initialized');
            return;
        }
    
        // Copy over the data that we're going to keep
        newBuffer.set(this.buffer.slice(downsampledData.length, this.bufferSize), 0);
    
        // Append the new data to the end of the buffer
        newBuffer.set(downsampledData, keepSize);
    
        // Replace the old buffer with the new one
        this.buffer.replace(newBuffer);
    }

    drawWaveform() {
        if (this.buffer === null) {
            console.warn('Buffer is not initialized');
            return;
        }

        if (this.app === null) {
            console.warn('Pixi application is not initialized');
            return;
        }

        // clear the application for new drawing
        this.app.stage.removeChildren();

        // get the data
        const displayData = this.buffer.get();

        // start the line
        const line = new PIXI.Graphics();
        line.lineStyle(2, 'white', 1); // (width, color, alpha)
        line.moveTo(0, this.app.screen.height / 2);

        const step = this.app.screen.width / this.bufferSize;
        for (let i = 0; i < displayData.length; i++) {
            const x = i * step;
            const y = (0.5 - displayData[i] / 2) * this.app.screen.height;
            line.lineTo(x, y);
        }

        // draw the line
        this.app.stage.addChild(line);
    }
}
