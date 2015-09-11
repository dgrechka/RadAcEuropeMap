///<reference path='types/jquery/jquery.d.ts' /> 
///<reference path='AppInterfaces.ts' />

declare var InteractiveDataDisplay: any;
declare var Microsoft: any;

class Viewer extends ViewerBase implements IGridViewer, IPointViewer, IPointOfInterestViewer, IPaletteViewer {

    private heatmap: any;
    private markers: any;
    private poiMarkers: any; //point of interest
    private f: number[][] = [];
    private x: number[] = [];
    private y: number[] = [];
    private color: number[] = [];
    private x_markers: number[] = [];
    private y_markers: number[] = [];
    private thischart: JQuery;
    private pointOfInterestChangedCallback: any;

    public get X() {
        return this.x;
    }

    public get Y() {
        return this.y;
    }

    public get F() {
        return this.f;
    }

    public get Heatmap() {
        return this.heatmap;
    }

    public set PointOfIneterestChangedCallback(fun) {
        this.pointOfInterestChangedCallback = fun;
    }

    public get PointOfIneterestChangedCallback() {
        return this.pointOfInterestChangedCallback;
    }

    public get X_for_markers() {
        return this.x_markers;
    }

    public get Y_for_markers() {
        return this.y_markers;
    }

    public get Color() {
        return this.color;
    }

    public get Markers() {
        return this.markers;
    }

    public SetGridData(x: number[], y: number[], h: number[][]): void {

        var xl = x.length;
        var yl = y.length;
        if (h.length != xl) throw Error;

        for (var i = 0; i < yl; i++)
        { this.y[i] = y[i]; }

        for (var i = 0; i < xl; i++) {
            if (h[i].length != yl) throw Error;
            this.x[i] = x[i];
            this.f[i] = [];
            for (var j = 0; j < yl; j++) {
                this.f[i][j] = h[i][j];
            }
        }
        this.heatmap.draw({ x: this.x, y: this.y, f: this.f });
    }

    public SetPointData(x: number[], y: number[], color: number[]): void {
        this.x_markers = x;
        this.y_markers = y;
        this.color = color;
        this.markers.draw({ x: this.x_markers, y: this.y_markers, color: this.color });
    }

    public SetPalette(dataRange: IDataRange) {
        var new_palette: any;

        //new_palette = InteractiveDataDisplay.ColorPalette.parse(dataRange.getMin() + "=red,green,blue,black=" + dataRange.getMax());
        new_palette = InteractiveDataDisplay.ColorPalette.parse("0.0=#00dd00,yellow=0.55,red=1.0");

        var padd = function (s) {
            if (s.length == 1)
                return "0" + s;
            else
                return s;
        };

        var steps = 9;
        var range = 1.0;
        var step = range / steps;
        var dpa = InteractiveDataDisplay.ColorPalette.toArray(new_palette, steps);
        var descreteStr = "";
        for (var i = 0; i < steps; i++)
            descreteStr += (i * step + "=#" + padd(dpa[4 * i].toString(16)) + padd(dpa[4 * i + 1].toString(16)) + padd(dpa[4 * i + 2].toString(16)) + padd(dpa[4 * i + 3].toString(16)) + "=")
        descreteStr+="1.0"

        var descretePalette = InteractiveDataDisplay.ColorPalette.parse(descreteStr);
        this.heatmap.palette = descretePalette;
        this.markers.colorPalette = descretePalette;
    }

    public AddControl(ch: JQuery) {
        super.AddControl(ch);
    }

    public UpdateLayout() {
        var that = this;

        this.thischart.height($(window).height() - this.bingmapOffset);
        this.heatmap.requestUpdateLayout();
    }

    public ShowPointOfInterest(lat: number, lon: number) {
        this.poiMarkers.draw({ x: [lon], y: [lat]});
    }

    constructor(div: JQuery) {
        super(div);
        var that = this;

        var heatmap = $('<div></div>').attr('data-idd-plot', 'heatmap').appendTo(this.myplot);
        var markers = $('<div></div>').attr('data-idd-plot', 'markers').attr(
            'data-idd-style', "border:black; shape:circle; size:10").appendTo(this.myplot);
        var poiMarkers = $('<div></div>').attr('data-idd-name', 'Probe').attr('data-idd-plot', 'markers').attr(
            'data-idd-style', "color:rgba(0,0,255,255); shape:triangle; thickness: 4; size:14").appendTo(this.myplot);

        var chart = InteractiveDataDisplay.asPlot(this.myplot);

        
        
        this.thischart = this.myplot;
        this.heatmap = chart.get(heatmap[0]);
        this.heatmap.opacity = 0.5;
        this.markers = chart.get(markers[0]);
        this.poiMarkers = chart.get(poiMarkers[0]);

        //this.heatmap.getLegend = function () { };
        this.markers.getLegend = function () { };

        chart.yDataTransform = InteractiveDataDisplay.mercatorTransform;
        this.heatmap.yDataTransform = InteractiveDataDisplay.mercatorTransform;
        this.markers.yDataTransform = InteractiveDataDisplay.mercatorTransform;
        this.poiMarkers.yDataTransform = InteractiveDataDisplay.mercatorTransform;

        var gestureSource = InteractiveDataDisplay.Gestures.getGesturesStream(chart.centralPart);
        chart.navigation.gestureSource = gestureSource;

        var yDataTransform = chart.yDataTransform;        

        div.click(function (e) {            
            if ((typeof that.PointOfIneterestChangedCallback) !== 'undefined') {
                var coordTransform = chart.coordinateTransform;
                var plotY = coordTransform.screenToPlotY(e.clientY);
                var plotX = coordTransform.screenToPlotX(e.clientX);
                var dataY = yDataTransform.plotToData(plotY);
                that.pointOfInterestChangedCallback(plotX, dataY);
                //console.log('screen: ' + e.clientY + "; plot:" + plotY + "; dataY:" + dataY);
            }
        });

        var dataTransformY = chart.yDataTransform;        
        var coordTranform = chart.coordinateTransform;



        //Microsoft.Maps.Events.addHandler(m, 'mousedown', function (event) {        
            
        //    });

    }

}

