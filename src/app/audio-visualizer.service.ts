import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AudioVisualizerService {
    private canvas: HTMLCanvasElement | null = null;
    private canvasCtx: CanvasRenderingContext2D | null = null;
    private allData: Float32Array = new Float32Array();

    constructor() {}

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasCtx = canvas.getContext('2d');

        // Set the size of the drawing surface to match the computed size of the canvas element.
        const computedStyle = getComputedStyle(canvas);
        canvas.width = parseInt(computedStyle.getPropertyValue('width'), 10);
        canvas.height = parseInt(computedStyle.getPropertyValue('height'), 10);
    }

    drawWaveform(data: Float32Array) {
        // accumulate the data
        this.allData = Float32Array.from([
            ...this.allData,
            ...Array.from(data).map(Math.abs),
        ]);

        if (this.canvas && this.canvasCtx) {
            // Get the width and height of the canvas.
            const width = this.canvas.width;
            const height = this.canvas.height;

            // Clear the canvas.
            this.canvasCtx.clearRect(0, 0, width, height);

            // Define the number of samples to display on the canvas at a time and the group size.
            const displaySamples = width * 50; // adjust this value as needed
            const groupSize = 10; // number of samples to average

            // Get the portion of the data to display.
            const startIdx = Math.max(0, this.allData.length - displaySamples);
            const displayData = this.allData.slice(startIdx);

            // Calculate the step size.
            const step = Math.ceil(displayData.length / width);

            // Calculate the amplitude.
            const amp = height / 4; // Half the height because we are displaying positive and negative

            // Loop over the data.
            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(0, height / 2);
            const points = [];
            for (let i = 0; i < displayData.length; i += step) {
                // Find the average value for this group.
                let sum = 0.0;
                let count = 0;
                for (let j = 0; j < groupSize; j++) {
                    const idx = i + j;
                    if (idx >= displayData.length) {
                        break;
                    }
                    sum += displayData[idx];
                    count++;
                }

                // Calculate average.
                const avg = sum / count;

                // Calculate x position on the canvas for this data point.
                const x = (i / displayData.length) * width;

                // Draw the line for the top half.
                this.canvasCtx.lineTo(x, height / 2 - avg * amp);
                points.push({ x, y: height / 2 + avg * amp });
            }

            // // Draw the line for the bottom half.
            // for (let i = points.length - 1; i >= 0; i--) {
            //     this.canvasCtx.lineTo(points[i].x, points[i].y);
            // }

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
