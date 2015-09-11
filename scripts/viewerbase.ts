///<reference path='types/jquery/jquery.d.ts' /> 

class ViewerBase {
    public bingmapOffset = 4;
    public myplot: JQuery;
    public legend: JQuery;
    public mapPlot: JQuery;

    constructor(div: JQuery) {
        var that = this;
        this.myplot = $('<div></div>').height($(window).height() - this.bingmapOffset).addClass('myplot').attr(
            'data-idd-plot', 'plot').attr('data-idd-legend', "legend").appendTo(div);
        this.mapPlot = $('<div></div>').attr('data-idd-plot', 'bingMaps').attr(
            'data-idd-mapkey', 'AsU9NzPEmJvavA56_zO9MI0W2aow74e9b_Lhp8TGYrTbjfSWUHHSU5sMq3D-u_PY').appendTo(this.myplot);
        this.legend = $('<div id="legend"></div>').addClass('legend').appendTo(this.myplot);        
    }

    public AddControl(ch: JQuery) {
        ch.appendTo($('div#legend'));
    }
} 