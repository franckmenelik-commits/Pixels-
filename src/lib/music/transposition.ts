import { ChordBar, ChordSection, InstrumentType } from "./types";

const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Flat-preference keys: keys where flats are more natural
const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb',
  'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm']);

// Transposition offsets in semitones from concert pitch
// Instruments that read in a different key than they sound
const INSTRUMENT_TRANSPOSITION: Partial<Record<InstrumentType, number>> = {
  sax_alto: 9,      // Alto sax is in Eb: written note sounds a major 6th lower, so transpose UP 9 semitones
  sax_tenor: 2,     // Tenor sax is in Bb: written note sounds a major 2nd lower, so transpose UP 2 semitones
  trumpet_bb: 2,    // Trumpet is in Bb: same as tenor sax
  // All others are concert pitch (0 transposition): guitar, bass, piano, drums, violin, cello, flute, vocals, trombone
};

/**
 * Parse a chord symbol into root note, optional bass note, and quality.
 * Examples:
 *   "Cmaj7" → { root: "C", quality: "maj7", bass: null }
 *   "F#m7" → { root: "F#", quality: "m7", bass: null }
 *   "C/E" → { root: "C", quality: "", bass: "E" }
 *   "Bbmaj7/D" → { root: "Bb", quality: "maj7", bass: "D" }
 */
function parseChord(chord: string): { root: string; quality: string; bass: string | null } | null {
  if (!chord || chord.trim() === '' || chord === 'N.C.' || chord === 'NC') return null;

  const slashIdx = chord.indexOf('/');
  let mainPart = chord;
  let bassPart: string | null = null;

  if (slashIdx > 0) {
    mainPart = chord.substring(0, slashIdx);
    bassPart = chord.substring(slashIdx + 1);
  }

  // Parse root from main part: first char is letter, optional # or b
  const rootMatch = mainPart.match(/^([A-G][#b]?)(.*)/);
  if (!rootMatch) return null;

  const root = rootMatch[1];
  const quality = rootMatch[2];

  // Parse bass note if present
  let bass: string | null = null;
  if (bassPart) {
    const bassMatch = bassPart.match(/^([A-G][#b]?)/);
    if (bassMatch) bass = bassMatch[1];
  }

  return { root, quality, bass };
}

/**
 * Get the semitone index of a note (0-11)
 */
function noteToIndex(note: string): number {
  let idx = SHARP_NOTES.indexOf(note);
  if (idx >= 0) return idx;
  idx = FLAT_NOTES.indexOf(note);
  if (idx >= 0) return idx;
  // Handle edge cases: Cb = B, E# = F, Fb = E, B# = C
  const enharmonics: Record<string, number> = { 'Cb': 11, 'E#': 5, 'Fb': 4, 'B#': 0 };
  if (note in enharmonics) return enharmonics[note];
  return -1;
}

/**
 * Get note name from semitone index, respecting sharp/flat preference
 */
function indexToNote(index: number, preferFlat: boolean): string {
  const normalized = ((index % 12) + 12) % 12;
  return preferFlat ? FLAT_NOTES[normalized] : SHARP_NOTES[normalized];
}

/**
 * Determine if we should prefer flats based on the target key
 */
function shouldPreferFlat(targetKey: string): boolean {
  return FLAT_KEYS.has(targetKey);
}

/**
 * Transpose a single note by a number of semitones
 */
function transposeNote(note: string, semitones: number, preferFlat: boolean): string {
  const idx = noteToIndex(note);
  if (idx < 0) return note; // can't parse, return as-is
  return indexToNote(idx + semitones, preferFlat);
}

/**
 * Transpose a chord symbol by a number of semitones.
 * Handles root, quality (preserved), and slash bass notes.
 */
export function transposeChord(chord: string, semitones: number, targetKey?: string): string {
  if (semitones === 0) return chord;

  const parsed = parseChord(chord);
  if (!parsed) return chord; // N.C. or unparseable

  const preferFlat = targetKey ? shouldPreferFlat(targetKey) : semitones < 0;

  const newRoot = transposeNote(parsed.root, semitones, preferFlat);
  const newBass = parsed.bass ? transposeNote(parsed.bass, semitones, preferFlat) : null;

  let result = newRoot + parsed.quality;
  if (newBass) result += '/' + newBass;

  return result;
}

/**
 * Transpose all sections by a number of semitones
 */
export function transposeSections(sections: ChordSection[], semitones: number, targetKey?: string): ChordSection[] {
  if (semitones === 0) return sections.map(s => ({
    ...s,
    bars: s.bars.map(b => ({ ...b })),
  }));

  return sections.map(section => ({
    name: section.name,
    bars: section.bars.map(bar => ({
      chord: transposeChord(bar.chord, semitones, targetKey),
      beats: bar.beats,
    })),
  }));
}

/**
 * Get the transposition offset for an instrument (semitones up from concert pitch)
 */
export function getInstrumentTransposition(instrument: InstrumentType): number {
  return INSTRUMENT_TRANSPOSITION[instrument] || 0;
}

/**
 * Transpose sections for a specific instrument
 */
export function transposeForInstrument(
  sections: ChordSection[],
  instrument: InstrumentType,
  originalKey: string
): { sections: ChordSection[]; transposedKey: string } {
  const semitones = getInstrumentTransposition(instrument);
  if (semitones === 0) {
    return { sections: transposeSections(sections, 0), transposedKey: originalKey };
  }
  const transposedKey = transposeChord(originalKey, semitones);
  return {
    sections: transposeSections(sections, semitones, transposedKey),
    transposedKey,
  };
}
