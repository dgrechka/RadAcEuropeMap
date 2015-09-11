///<reference path='Scripts/typings/jquery/jquery.d.ts' /> 
///<reference path='AppInterfaces.ts' /> 
///<reference path='DataSources/IDataSource.ts' /> 

interface IPDFDataSource extends IDataSource {
    GetPDF(lat: number, lon: number): PDF;
}

interface IQuantileFuncDataSource extends IDataSource {
    GetQuntileFunction(lat: number, lon: number): RealFunction1D;
}

class DensityExplorer {
    private Viewer: IProbabilityDensityViever;
    private densSource: IPDFDataSource;
    private quantSource: IQuantileFuncDataSource;
    private latestPointOfInterest;
    private latestPDF: PDF;
    private latestQF: RealFunction1D;
    private latestCurrentT;
    private confIntWidth: number; // 0.0 - 1.0

    private refreshCurrentDensitySafe() {
        if (this.latestQF) {
            var quantile = this.latestQF(this.latestCurrentT);
            this.Viewer.HighlightDensity(quantile);
        }
    }

    private refreshConfIntSafe() {
        if (this.latestQF) {
            this.confIntWidth = this.confIntWidth;
            var confInt = {
                Lower: this.latestQF(0.5 - this.confIntWidth * 0.5),
                Upper: this.latestQF(0.5 + this.confIntWidth * 0.5)
            };
            this.Viewer.SetConfidenceInterval(confInt);
        }
    }

    private refreshPFD() {
        if (this.latestPDF) {
            this.Viewer.UpdateFunction(this.latestPDF);
        }
    }

    public SetPointOfInterest(lat: number, lon: number) {
        this.latestPointOfInterest = { lat: lat, lon: lon };

        if (this.densSource && this.quantSource) {
            this.latestPDF = this.densSource.GetPDF(lat, lon);
            this.latestQF = this.quantSource.GetQuntileFunction(lat, lon);                       
        }

        this.refreshConfIntSafe();
        this.refreshCurrentDensitySafe();
        this.refreshPFD();
    }

    public SetConfIntWidth(x: number) {
        this.confIntWidth = x;
        this.refreshConfIntSafe();  
    }

    public SetCurrentDensity(t: number) {
        this.latestCurrentT = t;
        this.refreshCurrentDensitySafe();
    }

    public SetSources(dsource: IPDFDataSource,qsource: IQuantileFuncDataSource) {
        this.densSource = dsource;
        this.quantSource = qsource;

        if (this.latestPointOfInterest) {
            this.latestPDF = this.densSource.GetPDF(this.latestPointOfInterest.lat, this.latestPointOfInterest.lon);
            this.latestQF = this.quantSource.GetQuntileFunction(this.latestPointOfInterest.lat, this.latestPointOfInterest.lon);
        }
        
        this.refreshConfIntSafe();
        this.refreshCurrentDensitySafe();
        this.refreshPFD();
    }


    constructor(viewer: IProbabilityDensityViever) {        
        this.Viewer = viewer;
    }
}