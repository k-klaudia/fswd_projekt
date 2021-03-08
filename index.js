const { PDFNet } = require('@pdftron/pdfnet-node');

const main = async() => {


    const doc = await PDFNet.PDFDoc.create();
    //element builder
    const builder = await PDFNet.ElementBuilder.create();
    //element writer
    const writer = await PDFNet.ElementWriter.create();


    let element;
    let gstate;


    const pageRect = await PDFNet.Rect.init(0, 0, 612, 794);
    const page = await doc.pageCreate(pageRect);


    const trailer = await doc.getTrailer();
    const info = await trailer.putDict('Info');
    info.putString('Producer', 'Me');
    info.putString('Title', 'Hello');


   writer.beginOnPage(page);
   element = await builder.createTextBeginWithFont(await PDFNet.Font.create(doc, PDFNet.Font.StandardType1Font.e_times_roman), 4);
   writer.writeElement(element);
   //writer.writeString()

   element = await builder.createNewTextRun('Hello World');
   element.setTextMatrixEntries(10, 0, 0, 10, 15, 700);
   gstate = await element.getGState();  

   gstate.setLeading(5);    // Zeilenabstand

   writer.writeElement(element);
   writer.writeElement(await builder.createTextNewLine()); // Neue Zeile
   
   writer.writeElement(await builder.createTextNewLine()); 
   element = await builder.createTextBeginWithFont(await PDFNet.Font.create(doc, PDFNet.Font.StandardType1Font.e_times_roman), 2);

   element = await builder.createNewTextRun('This is a PDF document.');
   gstate = await element.getGState();

   writer.writeElement(element);

    //Add Image
   let img = await PDFNet.Image.createFromFile(doc, 'pic.jpg');
   let matrix = await PDFNet.Matrix2D.create(140, 0, 0, 134, 15, 400);
   const matrix2 = await PDFNet.Matrix2D.createZeroMatrix();
   await matrix2.set(140, 0, 0, 134, 15, 400);
   let element1 = await builder.createImageFromMatrix(img, matrix2);
   writer.writePlacedElement(element1);


   writer.writeElement(await builder.createTextEnd());  // finish writing

   writer.end();
   doc.pagePushBack(page);
    doc.save('helloworld.pdf', PDFNet.SDFDoc.SaveOptions.e_remove_unused | PDFNet.SDFDoc.SaveOptions.e_compatibility);
}

PDFNet.runWithCleanup(main).catch((err) => {
    console.log(err);
}).then(() => {
    PDFNet.shutdown();
})