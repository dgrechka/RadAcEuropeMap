var DEBUG = true;

function GetDataSources() {
    var dataSources = [];
    if (DEBUG) {
        dataSources["based on recent hour"] = "data/1_dr_poly_quantiles.JSON";
        dataSources["based on recent 24 hours"] = "data/24_dr_poly_quantiles.JSON";
        dataSources["based on recent 30 days"] = "data/720_dr_poly_quantiles.JSON";
    }
    else {
        dataSources["based on recent hour"] = "data.1.json";
        dataSources["based on recent 24 hours"] = "data.24.json";
        dataSources["based on recent 30 days"] = "data.720.json";
    }
    return dataSources;
}

function GetConfig() {
    return {
        dataSources: GetDataSources(),
        defaultConfInterval: 95,
        applicationTitle: "Estimation of radiation levels of Europe",
        mapVariable: "Radiation level (uSv/h)"
    };
}