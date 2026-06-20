import { Dispatch, SetStateAction } from "react";

export function resizeArray<T>(arr: T[], newSize: number, defaultValue: T): T[] {
  const newArr = new Array(newSize).fill(defaultValue);
  for (let i = 0; i < Math.min(newSize, arr.length); i++) {
    newArr[i] = arr[i];
  }
  return newArr;
}

export function updateArrayItem<T>(arr: T[], index: number, value: T, setArr: Dispatch<SetStateAction<T[]>>) {
  const n = [...arr];
  n[index] = value;
  setArr(n);
}

export function updateMatrixItem<T>(matrix: T[][], row: number, col: number, value: T, setMatrix: Dispatch<SetStateAction<T[][]>>) {
  const nm = [...matrix];
  nm[row] = [...nm[row]];
  nm[row][col] = value;
  setMatrix(nm);
}
