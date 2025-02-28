export interface ChartConfig {
  defaultCandles: number;
  minCandles: number;
  maxCandles: number;
  timeframes: string[];
}

export interface ChartControls {
  zoomRange: [number, number];
  defaultZoom: number;
  allowPanning: boolean;
  preloadData: boolean;
}

export interface ContextIndicators {
  showMajorSupportResistance: boolean;
  showMovingAverages: number[];
  showVolumeProfile: boolean;
  showTrendLines: boolean;
}

export const DEFAULT_CHART_CONFIG: ChartConfig = {
  defaultCandles: 200,
  minCandles: 50,
  maxCandles: 1000,
  timeframes: ['1D', '4H', '1H', '15M']
};

export const DEFAULT_CHART_CONTROLS: ChartControls = {
  zoomRange: [50, 1000],
  defaultZoom: 200,
  allowPanning: true,
  preloadData: true
};

export const DEFAULT_CONTEXT_INDICATORS: ContextIndicators = {
  showMajorSupportResistance: true,
  showMovingAverages: [50, 100, 200],
  showVolumeProfile: true,
  showTrendLines: true
};
