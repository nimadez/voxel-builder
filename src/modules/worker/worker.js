/* 
    Dec 2023
    @nimadez

    Web worker
*/

class WebWorker {
    constructor() {
        this.worker = new Worker("src/modules/worker/processor.js", { type: "module" });
    }

    start(id, data, onmessage, onerror) {
        engine.displayLoadingUI();
        
        this.worker.postMessage({
            id: id,
            data: data
        });
        
        this.worker.onmessage = (ev) => {
            onmessage(ev.data);
            engine.hideLoadingUI();
        };
    
        this.worker.onerror = (err) => {
            onerror(err);
            console.log(err);
            engine.hideLoadingUI();
        };
    }

    startBackground(id, data, onmessage, onerror) {
        this.worker.postMessage({
            id: id,
            data: data
        });
        
        this.worker.onmessage = (ev) => {
            onmessage(ev.data);
        };
    
        this.worker.onerror = (err) => {
            onerror(err);
            console.log(err);
        };
    }

    async startAsync(id, data) {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({
                id: id,
                data: data
            });
            
            this.worker.onmessage = (ev) => {
                resolve(ev.data);
            };
        
            this.worker.onerror = (err) => {
                reject(err);
                console.log(err);
            };
        });
    }
}

export const worker = new WebWorker();
