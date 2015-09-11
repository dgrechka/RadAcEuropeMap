///<reference path='types/jquery/jquery.d.ts' /> 
///<reference path='DensityExplorer.ts' /> 

class DataController implements IPointOfInterestViewer {
    private an: Animator;
    private densExplorer: DensityExplorer;
    private point_viewer: IPointViewer;
    private grid_viewer: IGridViewer;
    private poiViewer: IPointOfInterestViewer;
    private confInt: number;    

    public ChangeDataSources(gridSource: IGridDataSource, pointsSource: IPointsSetDataSource, dsource: IPDFDataSource, qsource: IQuantileFuncDataSource) {
        var that = this;

        this.densExplorer.SetSources(dsource, qsource);

        if (this.an !== undefined)
            this.an.SetAnimationAmplitude(0.0); //stoping previous animation
        this.an = new Animator(this.grid_viewer,this.densExplorer, gridSource);
        this.an.SetAnimationAmplitude(this.confInt);
        var points_data = pointsSource.GetPointsData();
        this.point_viewer.SetPointData(points_data.x, points_data.y, points_data.value);
        console.info("Created new animator with new data sources");
    }

    public ChangeConfidenceInterval(confInt: number) {
        this.confInt = confInt;
        this.an.SetAnimationAmplitude(this.confInt);
        this.densExplorer.SetConfIntWidth(this.confInt);        
    }

    public ShowPointOfInterest(lat: number, lon: number) {
        this.poiViewer.ShowPointOfInterest(lat, lon);
        this.densExplorer.SetPointOfInterest(lat, lon);
    }

    constructor(gridDataSource: IGridDataSource, pointsDataSource: IPointsSetDataSource, dsource: IPDFDataSource, qsource:IQuantileFuncDataSource, confidenceIntervalWidth: number,
        pointsViewver: IPointViewer, gridViewver: IGridViewer, densityViewer: IProbabilityDensityViever,poiViewer: IPointOfInterestViewer) {
        this.point_viewer = pointsViewver;
        this.grid_viewer = gridViewver;
        this.poiViewer = poiViewer;

        this.densExplorer = new DensityExplorer(densityViewer);
        this.densExplorer.SetSources(dsource, qsource);        
        this.densExplorer.SetConfIntWidth(confidenceIntervalWidth);
        
        this.an = new Animator(gridViewver, this.densExplorer, gridDataSource);
        this.an.SetAnimationAmplitude(confidenceIntervalWidth);
        this.confInt = confidenceIntervalWidth;        
    
        var points_data = pointsDataSource.GetPointsData();
        pointsViewver.SetPointData(points_data.x, points_data.y, points_data.value);
    }
}