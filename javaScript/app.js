let url = './pdf/pdf.pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 0.8,
    canvas = document.getElementById('the-canvas'),
    ctx = canvas.getContext('2d');


function renderPage(num){
    pageRendering = true;

    pdfDoc.getPage(num).then(function(page){
        let viewport = page.getViewport({scale: scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        let renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        let renderTask = page.render(renderContext);

        renderTask.promise.then(function(){
            pageRendering = false;

            if(pageNumPending !== null){
                pageNumPending = null;
                renderPage(pageNumPending);
                pageNumPending = null
            }
        })

    })

    document.getElementById('page-num').textContent = num;

}    



    
   
pdfjsLib.getDocument(url).promise.then(function(pdfDoc_){
    pdfDoc = pdfDoc_;
    document.getElementById('page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
})
