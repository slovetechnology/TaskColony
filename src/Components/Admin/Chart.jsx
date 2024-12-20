import { useCallback, useEffect, useMemo, useState } from 'react';
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';

import EChartsReact, { useChart, useTooltip } from 'echarts-for-react-fc';

echarts.use([
  GridComponent,
  TooltipComponent,
  LineChart,
  CanvasRenderer,
  SVGRenderer,
  UniversalTransition,
]);

const style = {
  width: '100%',
  height: 300,
};

const createTooltipFn = ({ params }) => {
  if (Array.isArray(params)) {
    return (
      <div>
        {params.map((item) => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>
    );
  } else {
    return <div>{params.name}</div>;
  }
};

const Chart = () => {
  const { chartRef, setChartOption, handleListenChartReady } = useChart();

  const { tooltipDom, tooltipRender, createTooltip } = useTooltip({
    component: createTooltipFn,
  });

  const [renderer, setRenderer] = useState('canvas');

  useEffect(() => {
    setChartOption({
      tooltip: {
        formatter: (params) => {
          setTimeout(() => {
            createTooltip({ params });
          }, 100);
          return tooltipDom;
        },
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    });
  }, [createTooltip, setChartOption, tooltipDom]);

  const handleClickToggleRenderer = useCallback(() => {
    setRenderer((oldRenderer) => (oldRenderer === 'canvas' ? 'svg' : 'canvas'));
  }, []);

  const initOpts = useMemo(() => {
    return {
      renderer: renderer,
    };
  }, [renderer]);

  return (
    <>
      <EChartsReact
        ref={chartRef}
        initOpts={initOpts}
        style={style}
        echarts={echarts}
        onChartReady={handleListenChartReady}
      />
      {tooltipRender}
    </>
  );
};

export default Chart;
