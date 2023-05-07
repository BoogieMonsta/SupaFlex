# PauseTape

PauseTape is a web-based audio application that brings the lost art of creating pause tape beats to the digital realm. Emulating the workflow used by Hip Hop producers of the golden era, PauseTape allows users to control two virtual tape machines with their keyboard.

## TODO

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
