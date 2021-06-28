import { Options } from '@src/types/common';
import * as _ from 'lodash';
import { Merges } from './merge';

const defaultSettings = {
  mode: 'edit', // edit | read
  view: {
    height: () => document.documentElement.clientHeight,
    width: () => document.documentElement.clientWidth
  },
  showGrid: true,
  showToolbar: true,
  showContextmenu: true,
  showBottomBar: true,
  row: {
    len: 100,
    height: 25
  },
  col: {
    len: 26,
    width: 100,
    indexWidth: 60,
    minWidth: 60
  },
  style: {
    bgcolor: '#ffffff',
    align: 'left',
    valign: 'middle',
    textwrap: false,
    strike: false,
    underline: false,
    color: '#0a0a0a',
    font: {
      name: 'Arial',
      size: 10,
      bold: false,
      italic: false
    },
    format: 'normal'
  }
};

class Spreadsheet {
  private options: Options;

  constructor(container: string | HTMLElement, options = {}) {
    this.options = { showBottomBar: true, ...options };
  }

  addSheet(name: string, active = true) {}
}

export default class DataProxy {
  private settings: Options;
  private name: string;
  private freeze: number[];
  private styles: any
  private merges: any

  constructor(name: string, settings: Options) {
    this.settings = _.merge(defaultSettings, settings || {});
    this.name = name || 'sheet';
    this.freeze = [0, 0];
    this.styles = []
    this.merges = new Merges()
    
  }
}
