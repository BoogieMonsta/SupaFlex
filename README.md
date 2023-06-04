# SupaFlex

SupaFlex is a web-based audio application that brings the lost art of creating pause tape beats to the digital realm. Emulating the workflow used by Hip Hop producers of the golden era, PauseTape allows users to control two virtual tape machines with their keyboard.

## FIXME

- [ ]  waveform drawing alignment issue when switching playback between decks
- [ ]  playback doesn’t work anymore after it reaches an audio clip’s extremity

## TODO

### GUI

- [ ]  connect buttons to the spinning rotors

### Transport & Recording

- [ ]  Time code monitor for each deck
- [ ]  Allow uploading audio samples
- [ ]  Deck2: record audio from Deck1
- [ ]  FF & REW: heard if PLAYING, not heard & very fast if STOPPED

### Audio Visualization

- [ ]  ElAudio: downsample the signal before it feeds the waveform visualizer
- [ ]  Attach the downsample binSize to a user-controlled slider “horizontal zoom”?
- [ ]  Display audio waveform for decks 1 & 2

### Effects

Variable controls

- [ ]  Close / Far (filters, reverb, saturation)
- [ ]  Hard / Soft (compression, saturation)
- [ ]  HiFi / LoFi (filters, saturation)

## How to build

Run `npm start` to build the app.
