import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CassetteComponent } from './cassette/cassette.component';
import { TapeRecorderButtonComponent } from './tape-recorder-button/tape-recorder-button.component';

@NgModule({
    declarations: [
        AppComponent,
        CassetteComponent,
        TapeRecorderButtonComponent,
    ],
    imports: [BrowserModule, HttpClientModule, FormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
