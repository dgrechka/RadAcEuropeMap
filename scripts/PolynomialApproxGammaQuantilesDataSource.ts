///<reference path='../Scripts/typings/jquery/jquery.d.ts' /> 

declare function GammaDistribution(k0: number, b0: number): void;

interface IDataSerializer { //returns javascript object by deserializing content available on dataURL
    GetData(dataURL: string): JQueryPromise<any>;
}

class PolynomialApproxGammaQuantilesDataSource implements IPointsSetDataSource, IGridDataSource, IPDFDataSource, IQuantileFuncDataSource, IDataSource {

    private stationDoseRate: Array<number> = [];
    private stationLats: Array<number> = [];
    private stationLons: Array<number> = [];

    private gridLatAxis: Array<number> = [];
    private gridLonAxis: Array<number> = [];
    private gridGammaObj: any[][];
    private gridGamma: number[][];
    private gridGammaShape: number[][];
    private gridGammaRate: number[][];
    private dataTimeUtc: Date;

    public GetReferenceTimeUTC() {
        return this.dataTimeUtc;
    }

    public GetGridData(t: number) {
        return { x: this.gridLonAxis, y: this.gridLatAxis, v: this.DoseRateQuantileBatch(t) };
    }

    public GetPointsData() {
        return { x: this.stationLons, y: this.stationLats, value: this.stationDoseRate };
    }

    private DoseRateQuantileBatch(t: number) {
        var xl: number = this.gridLonAxis.length, yl: number = this.gridLatAxis.length;

        var data = [];
        for (var i: number = 0; i < xl; i++) {
            data[i] = [];
            for (var j: number = 0; j < yl; j++) {
                var a = this.gridGammaObj[i][j].quantile(t);
                data[i][j] = a;
            }
        }
        return data;
    }

    private DoseRateQuantileFunc(latIdx: number, lonIdx: number) {
        var a = this.gridGammaObj[lonIdx][latIdx];

        var f = function (t) {
            return a.quantile(t);
        }
        return f;
    }    

    private static GetGamma(alpha, beta, gamma, x) {
        return Math.pow(beta, alpha) / gamma * Math.pow(x, alpha - 1) * Math.exp(-beta * x); //Gamma dist pdf definition as is
    }

    private GetIndices(lat: number, lon: number) {
        if (
            (lat < this.gridLatAxis[0])
            || (lat > this.gridLatAxis[this.gridLatAxis.length - 1])
            || (lon < this.gridLonAxis[0])
            || (lon > this.gridLonAxis[this.gridLonAxis.length - 1]))
            return undefined;

        var latIdx = 0, lonIdx = 0;
        var min = Number.MAX_VALUE;
        for (var i = 0; i < this.gridLatAxis.length; i++) {
            var diff = Math.abs(this.gridLatAxis[i] - lat)
            if (diff < min) {
                min = diff;
                latIdx = i;
            }
        }
        min = Number.MAX_VALUE;
        for (var i = 0; i < this.gridLonAxis.length; i++) {
            var diff = Math.abs(this.gridLonAxis[i] - lon);
            if (diff < min) {
                min = diff;
                lonIdx = i;
            }
        }
        return {latIdx:latIdx, lonIdx:lonIdx};
    }

    public GetQuntileFunction(lat: number, lon: number) {       
        var indices = this.GetIndices(lat, lon);
        if (!indices)
            return undefined;

        var latIdx = indices.latIdx;
        var lonIdx = indices.lonIdx;

        return this.DoseRateQuantileFunc(latIdx, lonIdx);
    }    

    public GetPDF(lat: number, lon: number) {
        var that = this;

        var indices = this.GetIndices(lat, lon);
        if (!indices)
            return undefined;

        var latIdx = indices.latIdx;
        var lonIdx = indices.lonIdx;

        var qFunc = this.DoseRateQuantileFunc(latIdx, lonIdx);

        return {
            leftBound: qFunc(0.001),
            rightBound: qFunc(0.999),
            alpha: that.gridGammaShape[lonIdx][latIdx],
            beta: that.gridGammaRate[lonIdx][latIdx],
            gamma: that.gridGamma[lonIdx][latIdx],
            getDensity: function (x) {
                return PolynomialApproxGammaQuantilesDataSource.GetGamma(this.alpha, this.beta, this.gamma, x);
            }
        };
    }    

    public Initialize(rawData: IDataSerializer, dataURL: string): JQueryPromise<void> {
        var that = this;        

        var data = rawData.GetData(dataURL);
        var parseResult = data.then(function (data) {
            var timeStr = data.timeUTC[0];
            timeStr = timeStr.substr(0, 10) + 'T' + timeStr.substr(11)+"Z";
            var d = new Date(timeStr);            
            that.dataTimeUtc = d;

            for (var i: number = 0; i < data.GridLatAxis.length; i++)
            { that.gridLatAxis[i] = data.GridLatAxis[i]; }

            for (var i: number = 0; i < data.GridLonAxis.length; i++)
            { that.gridLonAxis[i] = data.GridLonAxis[i]; }

            that.stationLats = data.sensLat;
            that.stationLons = data.sensLon;
            that.stationDoseRate = data.sensVal;            
            
            var xl: number = that.gridLonAxis.length;
            var yl: number = that.gridLatAxis.length;

            that.gridGammaObj = [];
            that.gridGamma = [];
            that.gridGammaShape = [];
            that.gridGammaRate = [];

            for (var i: number = 0; i < xl; i++) {
                that.gridGammaObj[i] = []; 
                that.gridGamma[i] = [];
                that.gridGammaShape[i] = [];
                that.gridGammaRate[i] = [];
                          
                for (var j = 0; j < yl; j++) {
                    var idx = i * yl + j;                    
                    that.gridGamma[i][j] = data.grid_gamma_f_val[idx];
                    that.gridGammaShape[i][j] = data.grid_gamma_shape[idx];
                    that.gridGammaRate[i][j] = data.grid_gamma_rate[idx];                 
                    that.gridGammaObj[i][j] = new GammaDistribution(that.gridGammaShape[i][j], 1 / that.gridGammaRate[i][j]);
                }
            }            
        }, function (reasons) { console.error("Failed to get the data for \"" + dataURL+"\". "+reasons);});

        return parseResult;
    }
}