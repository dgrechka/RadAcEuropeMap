///<reference path="types/jquery/jquery.d.ts"/>

class JsonDataSerializer implements IDataSerializer {
    public GetData(dataURL: string) : JQueryPromise<any> {
        return $.getJSON(dataURL);
    }
}