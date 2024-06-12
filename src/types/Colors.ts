export enum Colors {
  Black = '#000000',
  Maroon = '#800000',
  Olive = '#808000',
  Green = '#008000',
  Teal = '#008080',
  Navy = '#000080',
  Purple = '#800080',
  Gray = '#808080',
  Red = '#FF0000',
  Yellow = '#FFFF00',
  Lime = '#00FF00',
  Aqua = '#00FFFF',
  Blue = '#0000FF',
  Fuchsia = '#FF00FF',
  Silver = '#C0C0C0',
  White = '#FFFFFF',
}

export type Color = (typeof Colors)[keyof typeof Colors];
