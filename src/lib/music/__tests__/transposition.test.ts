import { transposeChord, transposeSections, transposeForInstrument } from '../transposition';
import { ChordSection } from '../types';

describe('transposeChord', () => {
  test('simple major chord up 2 semitones', () => {
    expect(transposeChord('C', 2)).toBe('D');
  });

  test('chord with extension', () => {
    expect(transposeChord('Cmaj7', 2)).toBe('Dmaj7');
  });

  test('minor chord', () => {
    expect(transposeChord('Am7', 2)).toBe('Bm7');
  });

  test('slash chord', () => {
    expect(transposeChord('C/E', 2)).toBe('D/F#');
  });

  test('flat chord', () => {
    expect(transposeChord('Bb7', 2)).toBe('C7');
  });

  test('no change when 0 semitones', () => {
    expect(transposeChord('Fmaj7#11', 0)).toBe('Fmaj7#11');
  });

  test('N.C. returns as-is', () => {
    expect(transposeChord('N.C.', 5)).toBe('N.C.');
  });

  test('wraps around chromatic scale', () => {
    expect(transposeChord('B', 1)).toBe('C');
  });

  test('complex extension preserved', () => {
    expect(transposeChord('Dm7b5', 3)).toBe('Fm7b5');
  });
});

describe('transposeSections', () => {
  const sections: ChordSection[] = [
    {
      name: 'verse',
      bars: [
        { chord: 'C', beats: 4 },
        { chord: 'Am', beats: 4 },
        { chord: 'F', beats: 4 },
        { chord: 'G7', beats: 4 },
      ],
    },
  ];

  test('transposes all bars', () => {
    const result = transposeSections(sections, 2);
    expect(result[0].bars.map(b => b.chord)).toEqual(['D', 'Bm', 'G', 'A7']);
  });

  test('preserves beats', () => {
    const result = transposeSections(sections, 2);
    expect(result[0].bars.every(b => b.beats === 4)).toBe(true);
  });

  test('preserves section name', () => {
    const result = transposeSections(sections, 2);
    expect(result[0].name).toBe('verse');
  });
});

describe('transposeForInstrument', () => {
  const sections: ChordSection[] = [
    {
      name: 'chorus',
      bars: [
        { chord: 'Bb', beats: 4 },
        { chord: 'Ebmaj7', beats: 4 },
        { chord: 'F7', beats: 4 },
        { chord: 'Bb', beats: 4 },
      ],
    },
  ];

  test('guitar stays in concert pitch', () => {
    const result = transposeForInstrument(sections, 'guitar', 'Bb');
    expect(result.transposedKey).toBe('Bb');
    expect(result.sections[0].bars[0].chord).toBe('Bb');
  });

  test('alto sax transposes up 9 semitones (Eb instrument)', () => {
    const result = transposeForInstrument(sections, 'sax_alto', 'Bb');
    // Bb + 9 = G
    expect(result.transposedKey).toBe('G');
    expect(result.sections[0].bars[0].chord).toBe('G');
  });

  test('trumpet Bb transposes up 2 semitones', () => {
    const result = transposeForInstrument(sections, 'trumpet_bb', 'Bb');
    // Bb + 2 = C
    expect(result.transposedKey).toBe('C');
    expect(result.sections[0].bars[0].chord).toBe('C');
  });

  test('alto sax on F key', () => {
    const fSections: ChordSection[] = [
      { name: 'verse', bars: [{ chord: 'F', beats: 4 }, { chord: 'Bb', beats: 4 }] },
    ];
    const result = transposeForInstrument(fSections, 'sax_alto', 'F');
    // F + 9 = D
    expect(result.transposedKey).toBe('D');
    expect(result.sections[0].bars[0].chord).toBe('D');
    // Bb + 9 = G
    expect(result.sections[0].bars[1].chord).toBe('G');
  });

  test('trombone stays in concert pitch', () => {
    const result = transposeForInstrument(sections, 'trombone', 'Bb');
    expect(result.transposedKey).toBe('Bb');
  });

  test('drums stays in concert pitch', () => {
    const result = transposeForInstrument(sections, 'drums', 'Bb');
    expect(result.transposedKey).toBe('Bb');
  });
});
