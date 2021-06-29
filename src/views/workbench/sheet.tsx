import React, { useRef, useEffect } from 'react';

import '@styles/sheet-content.less';

const Excel: React.FC = () => {
  const excelRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (excelRef.current) {
      const ctx = excelRef.current.getContext('2d');
      if (!ctx) return;
      initCanvasDOM(ctx, excelRef.current);
    }
  }, [excelRef.current]);

  return (
    <div className={'excel'}>
      {/* Excel 画布 */}
      <div className="content">
        <canvas id={'canvas_excel'} ref={excelRef} width={1000} height={500}></canvas>
      </div>
    </div>
  );
};

export default Excel;

const initCanvasDOM = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  const dpr =
    window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio || 1;
  const w = canvas.width;
  const h = canvas.height;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);
};
