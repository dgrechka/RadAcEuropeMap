///<reference path="types/jquery/jquery.d.ts"/>
///<reference path='AppInterfaces.ts' /> 
///<reference path='IDataSource.ts' /> 

declare var InteractiveDataDisplay: any;
declare var vertLineMarker_IDDShape: any;

class IddPdfViewer implements IProbabilityDensityViever {

    private densityChart: JQuery;
    private polyline: any;
    private confIntMarkers: any;
    private currentDensMarkers: any;
    private maxDensity: number = 0.0;
    private currentDens: number;
    private confIntBounds: Array<number>;

    constructor(div: JQuery) {
        var that = this;
        this.densityChart = $('<div></div>').height(300).addClass('densityPlot').attr('data-idd-plot', 'chart').attr('data-idd-legend', "legend").appendTo(div);
        $('<div id="pdf_highlight_value"></div>').attr('data-idd-placement', 'top').addClass('idd-title').appendTo(this.densityChart);
        $('<div>PDF at probe location</div>').attr('data-idd-placement', 'top').addClass('idd-title').appendTo(this.densityChart);
        var polyline = $('<div></div>').attr('data-idd-name', 'Probability Density').attr('data-idd-plot', 'polyline').attr('data-idd-style', 'stroke: rgb(89,150,255); thickness: 3').appendTo(this.densityChart);
        var confIntMarkers = $('<div></div>').attr('data-idd-name', 'Confidence interval').attr('data-idd-plot', 'markers').attr('data-idd-style', 'color:rgb(0,0,150); shape: errorBar;').appendTo(this.densityChart);
        var currentDensityMarkers = $('<div></div>').attr('data-idd-name', 'Showing density').attr('data-idd-plot', 'markers').attr('data-idd-style', 'color:rgb(0,150,0); shape: errorBar;').appendTo(this.densityChart);

        var plot = InteractiveDataDisplay.asPlot(this.densityChart);

        this.polyline = plot.get(polyline[0]);
            
        this.confIntMarkers = plot.get(confIntMarkers[0]);
        this.currentDensMarkers = plot.get(currentDensityMarkers[0]);

        var emptyFunc = function () { };    
        this.polyline.getLegend = emptyFunc;
        this.confIntMarkers.getLegend = emptyFunc;
        this.currentDensMarkers.getLegend = emptyFunc;

        div.find("div.idd-legend").hide();

        if (typeof vertLineMarker_IDDShape === 'undefined') { //instead of static constructor
            vertLineMarker_IDDShape = {                
                draw: function (marker, plotRect, screenSize, transform, context) {
                    var x = transform.dataToScreenX(marker.x);
                    if (x < 0 || x > screenSize.width) return;
                    var yTop = transform.dataToScreenY(marker.y);
                    var yBottom = transform.dataToScreenY(0.0);
                    if (yTop > screenSize.height || yBottom < 0) return;

                    context.strokeStyle = marker.color;
                    context.beginPath();
                    context.moveTo(x, yTop);
                    context.lineTo(x, yBottom);
                    context.lineWidth = 2;
                    context.stroke();
                },

                getBoundingBox: function (marker) {
                    return { x: marker.x, y: 0.0, width: 0.0, height: marker.y };
                },

                hitTest: function (marker, transform, ps, pd) {
                    return false;
                },

                getPadding: function (data) {
                    var padding = 4;
                    return { left: padding, right: padding, top: padding, bottom: padding };
                }
            };
        }
    }

    private RedrawConfInterval() {
        this.confIntMarkers.draw({ x: this.confIntBounds, y: [this.maxDensity, this.maxDensity], stroke: 'rgb(100,0,0)', shape: "vertLineMarker_IDDShape" });
    }

    private RedrawCurrentDensity() {
        this.currentDensMarkers.draw({ x: [this.currentDens], y: [this.maxDensity], stroke: 'rgb(255,0,0)', shape: "vertLineMarker_IDDShape" });
        $("#pdf_highlight_value").text("Current value at the probe: "+this.currentDens.toFixed(2) + " uSv/h");
    }

    public UpdateFunction(pdf: PDF) {
        var n = 1000;

        var x = new Array(n);
        var y = new Array(n);

        var step = (pdf.rightBound - pdf.leftBound) / (n - 1);

        this.maxDensity = 0.0;

        for (var i = 0; i <= n; i++) {
            var d = pdf.leftBound + i * step;            
            x[i] = d;
            var dens = pdf.getDensity(d);
            y[i] = dens;
            if (dens > this.maxDensity)
                this.maxDensity = dens;
        }
        this.polyline.draw({ x: x, y: y, stroke: 'rgb(89,150,255)', thickness: 3 });
        this.RedrawConfInterval();
        this.RedrawCurrentDensity();
    }

    public SetConfidenceInterval(confInt: IConfInt) {        
        this.confIntBounds = [confInt.Lower, confInt.Upper];
        this.RedrawConfInterval();
    }

    public HighlightDensity(x: number) {        
        this.currentDens = x;
        this.RedrawCurrentDensity();
            
    }
}