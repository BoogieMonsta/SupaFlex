import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AudioTransport } from '../models/AudioTransport';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-tape-recorder-button',
    templateUrl: './tape-recorder-button.component.html',
    styleUrls: ['./tape-recorder-button.component.scss'],
})
export class TapeRecorderButtonComponent implements OnInit {
    @Input()
    btnColor = 'gray';
    @Input()
    iconName!: string;
    iconSVG!: SafeHtml;

    constructor(
        private httpClient: HttpClient,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.httpClient
            .get(`assets/svg/${this.iconName}.svg`, { responseType: 'text' })
            .subscribe((value) => {
                this.iconSVG = this.sanitizer.bypassSecurityTrustHtml(value);
            });
    }
}
