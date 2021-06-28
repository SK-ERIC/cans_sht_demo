import { Draw, thinLineWidth } from './draw';

const tableGridStyle = {
  fillStyle: '#fff',
  lineWidth: thinLineWidth,
  strokeStyle: '#e6e6e6'
};

class Table {
  private el: HTMLCanvasElement;
  private draw: any;
  private data: any;

  constructor(el: HTMLCanvasElement, data: any) {
    this.el = el;
    this.data = data;
    this.draw = new Draw(el, data.viewWidth(), data.viewHeight());
  }

  resetData(data: any) {
    this.data = data;
    this.render();
  }

  render() {
    // resize canvas
    const { data } = this;
    const { rows, cols } = data;
    // fixed width of header
    const fw = cols.indexWidth;
    // fixed height of header
    const fh = rows.height;
    this.draw.resize(data.viewWidth(), data.viewHeight());
    this.clear();
    const viewRange = data.viewRange();
    // renderAll.call(this, viewRange, data.scroll);
    const tx = data.freezeTotalWidth();
    const ty = data.freezeTotalHeight();
    const { x, y } = data.scroll;
    // 1
    renderContentGrid.call(this, viewRange, fw, fh, tx, ty);
  }

  clear() {
    this.draw.clear();
  }
}

function renderContentGrid({ sri, sci, eri, eci, w, h }, fw, fh, tx, ty) {
  const { draw, data } = this;
  const { settings } = data;

  console.log(`sri,sci,eri,eci,w,h,fw,fh,tx,ty`, sri,sci,eri,eci,w,h,fw,fh,tx,ty)

  draw.save();
  draw.attr(tableGridStyle).translate(fw + tx, fh + ty);
  // const sumWidth = cols.sumWidth(sci, eci + 1);
  // const sumHeight = rows.sumHeight(sri, eri + 1);
  // console.log('sumWidth:', sumWidth);
  // draw.clearRect(0, 0, w, h);
  if (!settings.showGrid) {
    draw.restore();
    return;
  }
  // console.log('rowStart:', rowStart, ', rowLen:', rowLen);
  data.rowEach(sri, eri, (i, y, ch) => {
    // console.log('y:', y);
    if (i !== sri) draw.line([0, y], [w, y]);
    if (i === eri) draw.line([0, y + ch], [w, y + ch]);
  });
  data.colEach(sci, eci, (i, x, cw) => {
    if (i !== sci) draw.line([x, 0], [x, h]);
    if (i === eci) draw.line([x + cw, 0], [x + cw, h]);
  });
  draw.restore();
}

export default Table;
