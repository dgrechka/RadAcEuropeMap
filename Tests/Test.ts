describe("General", () => {
    
    var view: Viewer;
    var data: DataSource;
    var anim: Animator;

    describe("Viewer", () => {

        var content = $("<div id='content'/>");
        
        var x: number[] = [1, 2, 3];
        var y: number[] = [4, 5];
        var f: number[][] = [];
        var max = 10;
        var min = 3;
        f[0] = []; f[1] = []; f[2] = [];
        f[0][0] = 14;
        f[0][1] = 15;
        f[1][0] = 24;
        f[1][1] = 25;
        f[2][0] = 34;
        f[2][1] = 35;

        beforeEach(() => {
            view = new Viewer(content);
            console.log("new Viewer");
        });

        xit("View must be defined", () => {
            expect(view).toBeDefined();
            //expect(view.heatmap).toBeDefined();
            expect(view.X).toBeDefined();
            expect(view.Y).toBeDefined();
            expect(view.F).toBeDefined();
        });

        xit("Right SetHeatmapData", () => {
            spyOn(view.Heatmap, 'draw');
            expect(function () { view.SetGridData(x, y, f) }).not.toThrow();
            expect(view.X).toEqual(x);
            expect(view.Y).toEqual(y);
            expect(view.F).toEqual(f);
            expect(view.Heatmap.draw).toHaveBeenCalledWith({ x: x, y: y, f: f });
        });

        it("Wrong SetHeatmapData", () => {
            expect(function () { view.SetGridData(y, x, f) }).toThrow();
        });

        xit("SetPalette", () => {
            data.Min = min;
            data.Max = max;
            view.SetPalette(data);
            expect(view.Heatmap.palette.range.max).toEqual(max);
            expect(view.Heatmap.palette.range.min).toEqual(min);
        });

    });


    describe("DataSource", () => {

        var req: JQueryDeferred<{}>;
        var getjsondata: JQueryDeferred<{}>;
        var path: string = "../data/data1.txt";

        beforeEach(function (done) {
            data = new DataSource();
            req = data.Initialize(path)
                    .done()
                    .fail(function () {
                        console.log("failed");
                    })
                    .always(function () {
                    console.log("init data");
                    done();
                });      
            });

        it("Resolved initialization", () => {
            expect(req.state()).toEqual("resolved");
            expect(data.DoseRate).toBeDefined();
            expect(data.DoseRateSE).toBeDefined();
            expect(data.Lat).toBeDefined();
            expect(data.Lon).toBeDefined();
            expect(data.Max).toBeDefined();
            expect(data.Min).toBeDefined();
        })

        it("GetJSON", function (done) {
            $.getJSON(path, function (jsondata): void {
                expect(jsondata.Lat).toEqual(data.Lat);
                expect(jsondata.Lon).toEqual(data.Lon);
                expect(data.DoseRate).toMatch(jsondata.DoseRate);
                expect(data.DoseRateSE).toMatch(jsondata.DoseRateSE);
                console.log("getJSON");
                done();
            })
        })

        it("GetData", () => {
            var d0: number[][] = [];
            var d1: number[][] = [];
            for (var i = 0; i < data.Dr.length; i++) {
                d0[i] = [];
                d1[i] = [];
                for (var j = 0; j < data.Dr[i].length; j++) {
                    d0[i][j] = data.Dr[i][j] - 2 * data.Ds[i][j];
                    d1[i][j] = data.Dr[i][j] + 2 * data.Ds[i][j];
                }
            }

            var gd1 = data.GetGridData(0.5);
            expect(gd1.f).toEqual(data.Dr);
            expect(gd1.x).toEqual(data.Lon);
            expect(gd1.y).toEqual(data.Lat);
            expect(data.GetGridData(0).f).toEqual(d0);
            expect(data.GetGridData(1).f).toEqual(d1);
        })


        describe("Animator", () => {

            var req: JQueryDeferred<{}>;
            var getjsondata: JQueryDeferred<{}>;
            var path: string = "../data/data1.txt";
            var content = $("<div id='content'/>");

            beforeEach(function (done) {
                console.log("new anim");
                view = new Viewer(content);
                data = new DataSource();
                req = data.Initialize(path)
                    .always(function () {
                        console.log("init data");
                        anim = new Animator(view, data);
                        done();
                    });
            });

            it("Constructor", () => {
                expect(anim).toBeDefined();
            })
            
        })

    })  
});