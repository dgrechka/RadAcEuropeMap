interface IGridViewer {
    SetGridData(x: number[], y: number[], h: number[][]): void;
}

interface IPointViewer {
    SetPointData(x: number[], y: number[], color: number[]): void;
}

interface IPointOfInterestViewer {
    ShowPointOfInterest(lat: number, lon: number);
}

interface IPaletteViewer {
    SetPalette(dataRange: IDataRange);
}

interface RealFunction1D {
    (x: number): number;
}

interface PDF {
    getDensity: RealFunction1D;
    leftBound: number;
    rightBound: number;
}

interface IConfInt {
    Lower: number;
    Upper: number;
}

interface IProbabilityDensityViever {
    UpdateFunction(pdf: PDF): void;
    SetConfidenceInterval(confInt: IConfInt): void;
    HighlightDensity(x: number) : void;
}