'use client';

import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

// Dynamically import ApexCharts with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DynamicApexChartProps {
  options: ApexOptions;
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';
  height?: number | string;
  width?: number | string;
}

const DynamicApexChart = ({ options, series, type, height, width }: DynamicApexChartProps) => {
  return (
    <Chart 
      options={options} 
      series={series} 
      type={type} 
      height={height} 
      width={width} 
    />
  );
};

export default DynamicApexChart;