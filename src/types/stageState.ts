export type StageState = {
  name: string;
  btcratio: number;
  entrytime: number;
  titleArray: string[];
  elapsed_time: number;
  roe_array: number[];
  refresh_cnt: number;
};

export type MinMaxRoe = {
  min_roe: number;
  max_roe: number;
};

export function GetMinMaxRoe(roe_array: number[]): MinMaxRoe {
  let min = 0;
  let max = 0;
  if (roe_array.length > 0) {
    min = Math.min(...roe_array);
    max = Math.max(...roe_array);
  }
  return { min_roe: min, max_roe: max };
}
