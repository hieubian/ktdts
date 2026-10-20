import type { LedPolarity, SegmentName } from '../types'

export const SEGMENT_MAP: Record<string, SegmentName[]> = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'd', 'e', 'g'],
  '3': ['a', 'b', 'c', 'd', 'g'],
  '4': ['b', 'c', 'f', 'g'],
  '5': ['a', 'c', 'd', 'f', 'g'],
  '6': ['a', 'c', 'd', 'e', 'f', 'g'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g'],
  'A': ['a', 'b', 'c', 'e', 'f', 'g'],
  'a': ['a', 'b', 'c', 'd', 'e', 'g'],
  'B': ['c', 'd', 'e', 'f', 'g'],
  'b': ['c', 'd', 'e', 'f', 'g'],
  'C': ['a', 'd', 'e', 'f'],
  'c': ['d', 'e', 'g'],
  'D': ['b', 'c', 'd', 'e', 'g'],
  'd': ['b', 'c', 'd', 'e', 'g'],
  'E': ['a', 'd', 'e', 'f', 'g'],
  'e': ['a', 'b', 'd', 'e', 'f', 'g'],
  'F': ['a', 'e', 'f', 'g'],
  'H': ['b', 'c', 'e', 'f', 'g'],
  'h': ['c', 'e', 'f', 'g'],
  'P': ['a', 'b', 'e', 'f', 'g']
}

// Preset dạng bài phổ biến
export interface SevenSegPreset {
  label: string
  chars: string
  segments: SegmentName[]
  polarity: LedPolarity
  description: string
}

export const COMMON_PRESETS: SevenSegPreset[] = [
  {
    label: 'Câu 8: LED Catốt chung (a, d, g)',
    chars: '56789AEdPH',
    segments: ['a', 'd', 'g'],
    polarity: 'cathode_common',
    description: 'Hiển thị các ký tự 5, 6, 7, 8, 9, A, E, d, P, H trên thanh a, d, g'
  },
  {
    label: 'Câu 9: LED Catốt chung (a, b, c)',
    chars: '123456789A',
    segments: ['a', 'b', 'c'],
    polarity: 'cathode_common',
    description: 'Hiển thị các chữ số 1-9 và chữ A trên thanh a, b, c'
  },
  {
    label: 'Câu 9 (cải tiến): LED Anốt chung (e, f, g)',
    chars: '456789AbC',
    segments: ['e', 'f', 'g'],
    polarity: 'anode_common',
    description: 'Hiển thị 4, 5, 6, 7, 8, 9, A, b, C trên thanh e, f, g (Anốt chung)'
  },
  {
    label: 'BCD 0-9: Tất cả 7 thanh',
    chars: '0123456789',
    segments: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    polarity: 'cathode_common',
    description: 'Decoder BCD sang LED 7 đoạn đầy đủ'
  }
]

export function getSegmentActives(char: string): Record<SegmentName, boolean> {
  const activeList = SEGMENT_MAP[char] ?? SEGMENT_MAP[char.toUpperCase()] ?? []
  return {
    a: activeList.includes('a'),
    b: activeList.includes('b'),
    c: activeList.includes('c'),
    d: activeList.includes('d'),
    e: activeList.includes('e'),
    f: activeList.includes('f'),
    g: activeList.includes('g')
  }
}

export function getSegmentBitValue(isActive: boolean, polarity: LedPolarity): number {
  if (polarity === 'cathode_common') {
    return isActive ? 1 : 0
  }
  return isActive ? 0 : 1
}

export function parseSevenSegmentBits(char: string, polarity: LedPolarity): Record<SegmentName, number> {
  const actives = getSegmentActives(char)
  return {
    a: getSegmentBitValue(actives.a, polarity),
    b: getSegmentBitValue(actives.b, polarity),
    c: getSegmentBitValue(actives.c, polarity),
    d: getSegmentBitValue(actives.d, polarity),
    e: getSegmentBitValue(actives.e, polarity),
    f: getSegmentBitValue(actives.f, polarity),
    g: getSegmentBitValue(actives.g, polarity)
  }
}
