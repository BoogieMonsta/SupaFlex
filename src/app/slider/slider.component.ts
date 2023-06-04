import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as noUiSlider from 'nouislider';
import { PipsMode } from 'nouislider';

export enum SliderOrientation {
    horizontal = 'horizontal',
    vertical = 'vertical'
}

export enum SliderDirection {
    ltr = 'ltr',
    rtl = 'rtl'
}

export interface SliderData {
    value: number;
    deckNb: number;
}

export interface SliderSettings {
    orientation: SliderOrientation;
    direction: SliderDirection;
    step?: number;
    start: number[];
    range: {
        'min': number;
        'max': number;
    };
}

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements AfterViewInit {

    @ViewChild('slider') sliderElement!: ElementRef;
    @Input() settings!: SliderSettings;
    @Input() deckNb!: number;
    @Input() name!: string;
    @Input() grad: boolean = false;
    @Output() dataEmitter: EventEmitter<SliderData> = new EventEmitter<SliderData>();

    constructor() { }

    ngAfterViewInit() {
        const slider = this.sliderElement.nativeElement;
        noUiSlider.create(slider, {
            start: this.settings.start,
            range: this.settings.range,
            step: this.settings.step,
            orientation: this.settings.orientation,
            direction: this.settings.direction,
            pips: this.grad ? { 
                mode: PipsMode.Values,
                values: [-3, -2, -1, 0, 1, 2, 3],
                density: 4,
              } : undefined,
        });

        slider.classList.add(this.name);

        slider.noUiSlider.on('update', (values: string[]) => {
            this.dataEmitter.emit({
                value: Number(values[0]),
                deckNb: this.deckNb
            });
        }, false);
    }
}
