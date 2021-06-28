/* global window */
function dpr() {
  return window.devicePixelRatio || 1;
}

export function thinLineWidth() {
  return dpr() - 0.5;
}

function npx(px: number) {
  return parseInt(String(px * dpr()), 10);
}

function npxLine(px: number) {
  const n = npx(px);
  return n > 0 ? n - 0.5 : 0.5;
}

export class Draw {
  private el: HTMLCanvasElement;
  private ctx: any;

  constructor(el: HTMLCanvasElement, width: number, height: number) {
    this.el = el;
    this.ctx = el.getContext('2d');
    if (!this.ctx) return;
    this.resize(width, height);
    this.ctx.scale(dpr(), dpr());
  }

  resize(width: number, height: number) {
    // console.log('dpr:', dpr);
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.width = npx(width);
    this.el.height = npx(height);
  }

  clear() {
    const { width, height } = this.el;
    this.ctx.clearRect(0, 0, width, height);
    return this;
  }

  attr(options: any) {
    Object.assign(this.ctx, options);
    return this;
  }

  save() {
    this.ctx.save();
    this.ctx.beginPath();
    return this;
  }

  restore() {
    this.ctx.restore();
    return this;
  }

  beginPath() {
    this.ctx.beginPath();
    return this;
  }

  translate(x: number, y: number) {
    this.ctx.translate(npx(x), npx(y));
    return this;
  }

  scale(x: number, y: number) {
    this.ctx.scale(x, y);
    return this;
  }

  clearRect(x: number, y: number, w: number, h: number) {
    this.ctx.clearRect(x, y, w, h);
    return this;
  }

  fillRect(x: number, y: number, w: number, h: number) {
    this.ctx.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(w), npx(h));
    return this;
  }

  fillText(text: string, x: number, y: number) {
    this.ctx.fillText(text, npx(x), npx(y));
    return this;
  }

  line(...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      ctx.beginPath();
      const [x, y] = xys[0];
      ctx.moveTo(npxLine(x), npxLine(y));
      for (let i = 1; i < xys.length; i += 1) {
        const [x1, y1] = xys[i];
        ctx.lineTo(npxLine(x1), npxLine(y1));
      }
      ctx.stroke();
    }
    return this;
  }

}
