# PauseTape

PauseTape is a web-based audio application that brings the lost art of creating pause tape beats to the digital realm. Emulating the workflow used by Hip Hop producers of the golden era, PauseTape allows users to control two virtual tape machines with their keyboard.

<img width="1133" alt="Screenshot 2023-05-07 at 16 09 48" src="https://user-images.githubusercontent.com/73052877/236682671-6e733bad-99bc-4ad6-ae53-b0600f41e8e8.png">

## TODO

### GUI

- [ ]  Complete the interface as a modern custom tape recorder

### Transport & Recording

- [ ]  connect buttons to the spinning rotors
- [ ]  Deck1: add audio sample
- [ ]  Deck1: implement transport of sample (connect buttons)
- [ ]  Deck2: record audio from Deck1
- [ ]  Deck2: implement transport of sample (connect buttons)
- [ ]  Variable PLAY speed (affects pitch)
- [ ]  Variable FF & REW speed (tempo dependent for scratch effects)
- [ ]  “Tight / Sloppy” variable control (adds ramp to any transport changes)
- [ ]  Time code monitor for each deck
- [ ]  Tap tempo
- [ ]  FF & REW: heard if PLAYING, not heard if STOPPED

### Audio Visualization

- [ ]  Display audio waveform for decks 1 & 2

### Effects

Variable controls

- [ ]  Close / Far (filters, reverb, saturation)
- [ ]  Hard / Soft (compression, saturation)
- [ ]  HiFi / LoFi (filters, saturation)

## FIXME

- [ ] when pressing FF and REW at the same time while playing, TransportState gets stuck on FastForward

## How to build

Run `npm start` to build the app.
