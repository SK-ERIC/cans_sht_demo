import { Options } from '@src/types/common';
import * as _ from 'lodash';
import AutoFilter from './auto_filter';
import { Cols } from './col';
import { Merges } from './merge';
import { Rows } from './row';
import Scroll from './scroll';
import Selector from './selector';
import History from './history';
import { Validations } from './validation';
import Table from './table';
import { CellRange } from './cell_range';

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

const toolbarHeight = 41;
const bottombarHeight = 41;

class Spreadsheet {
  private options: Options;

  constructor(container: string | HTMLElement, options = {}) {
    this.options = { showBottomBar: true, ...options };
  }

  addSheet(name: string, active = true) {}
}

export class Sheet {
  private data: any;
  private table: any;
  constructor(el: HTMLCanvasElement, data: any) {
    this.data = data;
    this.table = new Table(el, data);
    sheetReset.call(this);
  }

  getRect() {
    const { data } = this;
    return { width: data.viewWidth(), height: data.viewHeight() };
  }
}

function sheetReset(this: any) {
  const { table } = this;
  table.render();
}

export class DataProxy {
  private settings: Options;
  private name: string;
  private freeze: number[];
  private styles: any;
  private merges: any;
  private rows: any;
  private cols: any;
  private validations: any;
  private hyperlinks: any;
  private comments: any;
  private selector: any;
  private scroll: any;
  private history: any;
  private clipboard: any;
  private autoFilter: any;
  private change: any;
  private exceptRowSet: any;
  private sortedRowMap: any;
  private unsortedRowMap: any;

  constructor(name: string, settings: Options) {
    this.settings = _.merge(defaultSettings, settings || {});
    this.name = name || 'sheet';
    this.freeze = [0, 0];
    this.styles = []; // Array<Style>
    this.merges = new Merges(); // [CellRange, ...]
    this.rows = new Rows(this.settings.row);
    this.cols = new Cols(this.settings.col);
    this.validations = new Validations();
    this.hyperlinks = {};
    this.comments = {};
    // save data end

    // don't save object
    this.selector = new Selector();
    this.scroll = new Scroll();
    this.history = new History();
    // this.clipboard = new Clipboard();
    this.autoFilter = new AutoFilter();
    this.change = () => {};
    this.exceptRowSet = new Set();
    this.sortedRowMap = new Map();
    this.unsortedRowMap = new Map();
  }

  viewHeight() {
    const { view, showToolbar, showBottomBar } = this.settings;
    let h = view!.height();
    if (showBottomBar) {
      h -= bottombarHeight;
    }
    if (showToolbar) {
      h -= toolbarHeight;
    }
    return h;
  }

  viewWidth() {
    return this.settings.view!.width();
  }

  freezeTotalWidth() {
    return this.cols.sumWidth(0, this.freeze[1]);
  }

  freezeTotalHeight() {
    return this.rows.sumHeight(0, this.freeze[0]);
  }

  viewRange() {
    const { scroll, rows, cols, freeze, exceptRowSet } = this;
    // console.log('scroll:', scroll, ', freeze:', freeze)
    let { ri, ci } = scroll;
    if (ri <= 0) [ri] = freeze;
    if (ci <= 0) [, ci] = freeze;

    let [x, y] = [0, 0];
    let [eri, eci] = [rows.len, cols.len];
    for (let i = ri; i < rows.len; i += 1) {
      if (!exceptRowSet.has(i)) {
        y += rows.getHeight(i);
        eri = i;
      }
      if (y > this.viewHeight()) break;
    }
    for (let j = ci; j < cols.len; j += 1) {
      x += cols.getWidth(j);
      eci = j;
      if (x > this.viewWidth()) break;
    }
    // console.log(ri, ci, eri, eci, x, y);
    return new CellRange(ri, ci, eri, eci, x, y);
  }

  rowEach(min, max, cb) {
    let y = 0;
    const { rows } = this;
    const frset = this.exceptRowSet;
    const frary = [...frset];
    let offset = 0;
    for (let i = 0; i < frary.length; i += 1) {
      if (frary[i] < min) {
        offset += 1;
      }
    }
    // console.log('min:', min, ', max:', max, ', scroll:', scroll);
    for (let i = min + offset; i <= max + offset; i += 1) {
      if (frset.has(i)) {
        offset += 1;
      } else {
        const rowHeight = rows.getHeight(i);
        if (rowHeight > 0) {
          cb(i, y, rowHeight);
          y += rowHeight;
          if (y > this.viewHeight()) break;
        }
      }
    }
  }

  colEach(min, max, cb) {
    let x = 0;
    const { cols } = this;
    for (let i = min; i <= max; i += 1) {
      const colWidth = cols.getWidth(i);
      if (colWidth > 0) {
        cb(i, x, colWidth);
        x += colWidth;
        if (x > this.viewWidth()) break;
      }
    }
  }
}
