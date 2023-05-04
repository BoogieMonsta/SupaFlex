import {
    Component,
    OnInit,
    ViewChildren,
    ElementRef,
    QueryList,
} from '@angular/core';
import { el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { Notes } from './notes/notes';

const core = new WebRenderer();
let ctx = new AudioContext();
const OFF = el.const({ value: 0 });

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    @ViewChildren(
        'srcPauseBtn, srcStopBtn, srcRewBtn, srcFfBtn, srcPlayBtn, dstPauseBtn, dstStopBtn, dstRewBtn, dstFfBtn, dstPlayBtn, dstRecBtn'
    )
    buttons!: QueryList<ElementRef>;

    title = 'PauseTape';
    isAudioOn = false;

    async ngOnInit() {
        core.on('load', () => {
            core.on('error', (e: any) => {
                console.log(e);
            });
        });
        await this.main();
    }

    private async main() {
        let node = await core.initialize(ctx, {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [2],
        });
        node.connect(ctx.destination);
    }

    toggleAudioOnOff() {
        ctx.resume();
        if (this.isAudioOn) {
            this.turnAudioOff();
        } else {
            this.playSound();
        }
    }

    turnAudioOff() {
        core.render(OFF, OFF);
        this.isAudioOn = false;
    }

    playSound() {
        let leftChannel = Notes.C4;
        let rightChannel = Notes.C3;
        core.render(leftChannel, rightChannel);
        this.isAudioOn = true;
    }
}
