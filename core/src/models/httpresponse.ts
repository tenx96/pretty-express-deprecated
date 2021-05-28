export class HttpResponse {
    status: number;
    json : Object;

    constructor(status : number , json : Object) {
        this.status = status;
        this.json = json;
    }

}