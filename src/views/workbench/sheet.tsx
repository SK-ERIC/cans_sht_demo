import React, { useRef, useCallback, useEffect, useState } from 'react';
import { excelObjectModel } from '@mocks/excel-object';
import { excelStateModel } from '@mocks/excel-state';
import { excelItemModel } from '@mocks/excel-item';
import { excelDataModel } from '@mocks/excel-data';
import '@styles/sheet-content.less';
import { DataProxy, Sheet } from '@src/utils/data_proxy';

const Excel: React.FC = () => {
  const excelRef = useRef<HTMLCanvasElement>(null);
  const [clientRect, setClientRect] = useState<DOMRect>();

  useEffect(() => {
    if (excelRef.current) {
      const ctx = excelRef.current.getContext('2d');
      if (!ctx) return;
      initCanvasDOM(ctx, excelRef.current);
      setClientRect(excelRef.current.getBoundingClientRect());
    }
  }, [excelRef.current, excelObjectModel, excelDataModel, excelItemModel]);

  useEffect(() => {
    if (excelRef.current) {
      const data = new DataProxy('sheet-test', {});
      const sheet = new Sheet(excelRef.current, data);
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
