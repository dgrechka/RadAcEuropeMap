///<reference path='../Scripts/typings/jquery/jquery.d.ts' />

interface IDataSource {
    GetReferenceTimeUTC(): Date;
}

interface IGridDataSource extends IDataSource {
    GetGridData(t: number): { x: number[]; y: number[]; v: number[][] };
}

interface IPointsSetDataSource extends IDataSource {
    GetPointsData(): { x: number[]; y: number[]; value: number[] };
}

interface IDataRange {
    getMin(): number;
    getMax(): number;
}

interface IDataRangeInfo {
    GetDataRange(tMin: number,tMax:number): IDataRange;
}

         