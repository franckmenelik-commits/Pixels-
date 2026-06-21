export type InstrumentType =
  | 'guitar' | 'bass' | 'piano' | 'drums'
  | 'sax_alto' | 'sax_tenor' | 'trumpet_bb' | 'trombone'
  | 'violin' | 'cello' | 'flute' | 'vocals';

export interface ChordBar {
  chord: string;
  beats: number;
}

export interface ChordSection {
  name: string;
  bars: ChordBar[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  originalKey: string;
  bpm: number | null;
  genre: string | null;
  durationSeconds: number | null;
  sourceUrl: string | null;
  status: 'draft' | 'chord_detected' | 'arranged' | 'ready';
  createdBy: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface ChordChart {
  id: string;
  songId: string;
  key: string;
  sections: ChordSection[];
  source: 'manual' | 'auto_detected' | 'auto_detected_corrected';
  createdAt: unknown;
  updatedAt: unknown;
}

export interface InstrumentPart {
  id: string;
  chordChartId: string;
  songId: string;
  instrument: InstrumentType;
  transposedSections: ChordSection[];
  notationType: 'chords_only' | 'lead_sheet';
  pdfUrl: string | null;
  manualOverrideUrl: string | null;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface RehearsalNote {
  id: string;
  instrumentPartId: string;
  barRange: string;
  note: string;
  authorId: string;
  authorName: string;
  appliedToChart: boolean;
  createdAt: unknown;
}

export interface EventSongAssignment {
  id: string;
  eventId: string;
  songId: string;
  assignments: {
    userId: string;
    userName: string;
    instrumentPartId: string;
    instrument: InstrumentType;
  }[];
  notes: string | null;
  createdAt: unknown;
}

export const INSTRUMENT_LABELS: Record<InstrumentType, string> = {
  guitar: 'Guitare',
  bass: 'Basse',
  piano: 'Piano',
  drums: 'Batterie',
  sax_alto: 'Sax Alto',
  sax_tenor: 'Sax Ténor',
  trumpet_bb: 'Trompette (Bb)',
  trombone: 'Trombone',
  violin: 'Violon',
  cello: 'Violoncelle',
  flute: 'Flûte',
  vocals: 'Voix',
};
