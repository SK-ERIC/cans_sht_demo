export type Dictionary<T> = {
  [key: string]: T;
};
type ImagePatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
export type ImageLike = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
export interface PatternObjectBase {
  id?: number;
  // type is now unused, so make it optional
  type?: 'pattern';
  x?: number;
  y?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}
export interface ImagePatternObject extends PatternObjectBase {
  image: ImageLike | string;
  repeat?: ImagePatternRepeat;
}
export interface GradientColorStop {
  offset: number;
  color: string;
}
export interface GradientObject {
  id?: number;
  type: string;
  colorStops: GradientColorStop[];
  global: boolean;
}

export interface ExtendToolbarOption {
  tip?: string;
  el?: HTMLElement;
  icon?: string;
  onClick?: (data: object, sheet: object) => void;
}
export interface Options {
  mode?: 'edit' | 'read';
  showToolbar?: boolean;
  showGrid?: boolean;
  showContextmenu?: boolean;
  showBottomBar?: boolean;
  extendToolbar?: {
    left?: ExtendToolbarOption[];
    right?: ExtendToolbarOption[];
  };
  view?: {
    height: () => number;
    width: () => number;
  };
  row?: {
    len: number;
    height: number;
  };
  col?: {
    len: number;
    width: number;
    indexWidth: number;
    minWidth: number;
  };
  style?: {
    bgcolor: string;
    align: 'left' | 'center' | 'right';
    valign: 'top' | 'middle' | 'bottom';
    textwrap: boolean;
    strike: boolean;
    underline: boolean;
    color: string;
    font: {
      name: 'Helvetica';
      size: number;
      bold: boolean;
      italic: false;
    };
  };
}
