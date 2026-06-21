import { ChordSection, InstrumentType } from "./types";

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const INSTRUMENT_TRANSPOSITIONS: Partial<Record<InstrumentType, number>> = {
  trumpet_bb: 2,
  sax_tenor: 2,
  sax_alto: -3,
};

export function getInstrumentTransposition(instrument: InstrumentType): number {
  return INSTRUMENT_TRANSPOSITIONS[instrument] ?? 0;
}

function normalizeNote(note: string): { index: number; useFlats: boolean } {
  const cleaned = note.replace(/m.*$/, '').replace(/[0-9].*$/, '').replace(/maj.*$/, '').replace(/dim.*$/, '').replace(/aug.*$/, '').replace(/sus.*$/, '').replace(/add.*$/, '');
  const useFlats = cleaned.includes('b');
  const lookup = useFlats ? FLAT_NOTES : NOTES;
  const idx = lookup.indexOf(cleaned);
  if (idx !== -1) return { index: idx, useFlats };
  const idx2 = NOTES.indexOf(cleaned);
  if (idx2 !== -1) return { index: idx2, useFlats: false };
  return { index: 0, useFlats: false };
}

function transposeChord(chord: string, semitones: number): string {
  if (!chord || chord === 'N.C.' || chord === '%') return chord;
  const match = chord.match(/^([A-G][#b]?)(.*)/);
  if (!match) return chord;
  const [, root, suffix] = match;
  const { index, useFlats } = normalizeNote(root);
  const newIndex = ((index + semitones) % 12 + 12) % 12;
  const lookup = useFlats ? FLAT_NOTES : NOTES;
  return lookup[newIndex] + suffix;
}

function transposeKey(key: string, semitones: number): string {
  return transposeChord(key, semitones);
}

export function transposeForInstrument(
  sections: ChordSection[],
  instrument: InstrumentType,
  originalKey: string
): { sections: ChordSection[]; transposedKey: string } {
  const semitones = getInstrumentTransposition(instrument);
  if (semitones === 0) {
    return { sections, transposedKey: originalKey };
  }
  const transposedSections: ChordSection[] = sections.map((section) => ({
    name: section.name,
    bars: section.bars.map((bar) => ({
      chord: transposeChord(bar.chord, semitones),
      beats: bar.beats,
    })),
  }));
  return {
    sections: transposedSections,
    transposedKey: transposeKey(originalKey, semitones),
  };
}
