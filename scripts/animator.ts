class Animator {
    private gridView: IGridViewer;
    private densExplorer: DensityExplorer;
    private gridSrc: IGridDataSource;
    private loopDuration: number = 10000; //in milliseconds
    private loopStart: number = 0;    
    private _animated: boolean = true;
    private _animation_id: number;
    private amplitude: number = 0.0;
    private quantileFunc: RealFunction1D;

    constructor(gView: IGridViewer,desnExplorer: DensityExplorer, gSrc: IGridDataSource) {        
        this.gridView = gView;
        this.gridSrc = gSrc;
        this.densExplorer = desnExplorer;
    }

    public SetAnimationAmplitude(a: number) { //zero means no animation. maximum is 1.0
        var that = this;
        if (that.amplitude == 0.0 && a > 0.0) {
            console.info("Starting heatmap animation");
            that.loopStart = new Date().getTime();
            this.amplitude = a;
            that.ModelRun();
        }
        else if (this.amplitude > 0.0 && a == 0.0) {
            console.info("Stoping heatmap animation");
            window.cancelAnimationFrame(that._animation_id);
            var data = that.gridSrc.GetGridData(0.5);
            that.gridView.SetGridData(data.x, data.y, data.v);
        }
        this.amplitude = a;
    }    

    private ModelRun() {        
        var capt = this;
        // Compute next iteration and store it in data array        
        if (this.amplitude > 0.0) {
            var now = new Date().getTime();
            var phase = Math.sin((now - this.loopStart) / this.loopDuration * 2.0 * Math.PI) * this.amplitude * 0.5 + 0.5;
            var data = this.gridSrc.GetGridData(phase);          
            this.gridView.SetGridData(data.x, data.y, data.v);
            this._animation_id = window.requestAnimationFrame(function () { capt.ModelRun(); });
            this.densExplorer.SetCurrentDensity(phase);
        }
    }

    public Animation() {        
    }
}

