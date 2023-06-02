import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AudioVisualizerService {
    private canvas: HTMLCanvasElement | null = null;
    private canvasCtx: CanvasRenderingContext2D | null = null;

    constructor() {}

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');
    }

    drawWaveform(data: Float32Array) {
        if (this.canvas && this.canvasCtx) {
            // Get the width and height of the canvas.
            const width = this.canvas.width;
            const height = this.canvas.height;

            // Clear the canvas.
            this.canvasCtx.clearRect(0, 0, width, height);

            // Set the starting point of the line to the middle of the canvas.
            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(0, height / 2);

            // Calculate the step size.
            const step = Math.ceil(data.length / width);

            // Calculate the amplitude.
            const amp = height / 2;

            // Loop over the data.
            for (let i = 0; i < data.length; i += step) {
                // Find the min and max values for this step.
                let min = 1.0;
                let max = -1.0;
                for (let j = 0; j < step; j++) {
                    const idx = i + j;
                    if (idx >= data.length) {
                        break;
                    }
                    const datum = data[idx];
                    if (datum < min) min = datum;
                    if (datum > max) max = datum;
                }

                // Calculate x position on the canvas for this data point
                const x = (i / data.length) * width;

                // Draw the line for this step.
                this.canvasCtx.lineTo(x, (1 + max) * amp);
            }

            // Complete the line.
            this.canvasCtx.lineTo(width, height / 2);
            this.canvasCtx.lineTo(0, height / 2);
            this.canvasCtx.closePath();

            // Fill the line.
            this.canvasCtx.fillStyle = 'darkslategrey';
            this.canvasCtx.fill();
        }
    }
}
