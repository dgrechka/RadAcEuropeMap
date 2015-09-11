class DSFactory {

    public Create(url: string): JQueryPromise<{ grid_data: IGridDataSource; points_data: IPointsSetDataSource; data_range: IDataRange }> {
        var src = new PolynomialApproxGammaQuantilesDataSource;
        var serializer = new JsonDataSerializer;
        var result = $.Deferred();
        src.Initialize(serializer,url).done(function () {            
            this.grid = src;
            this.points = src;
            this.range = src;
            result.resolve({ gridDataSource: src, pointsDataSource: src, dataRangeInfo: src, pdfSource: src, qfSource: src });
        }).fail(function (err, o) {
                console.error("datasource creation for url "+url+" failed");
        });
        return result.promise();
    }
} 