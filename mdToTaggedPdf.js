const { PDFNet } = require('@pdftron/pdfnet-node');
let fs = require('fs'); 
const parse = require('html-dom-parser');
let MarkdownIt = require('markdown-it'),
    md = new MarkdownIt(); 

const main = async() => {

    let data = fs.readFileSync("text.md").toString()
    let rendered = md.render(data)
    let result = parse(rendered);

    const doc = await PDFNet.PDFDoc.create();
    const builder = await PDFNet.ElementBuilder.create();
    const writer = await PDFNet.ElementWriter.create();

    let element;
    let gstate;
    const pageRect = await PDFNet.Rect.init(0, 0, 612, 794);
    const page = await doc.pageCreate(pageRect);

    const trailer = await doc.getTrailer();
    const info = await trailer.putDict('Info');
    await info.putString('Producer', 'Me');
    await info.putString('Title', 'Hello world');

    const root = await doc.getRoot()
    await (await root.putDict('MarkInfo')).putBool('Marked', true)
    await (await root.putDict('ViewerPreferences')).putBool('DisplayDocTitle', true)
    await root.putString('Lang', 'en')
    
    const pageObj = await page.getSDFObj()
    await pageObj.putName('Tabs', 'S')

    writer.beginOnPage(page);

    //STRUCT TREE
    const structTree = await PDFNet.STree.createFromPDFDoc(doc);
    const rootElement = await PDFNet.SElement.createFromPDFDoc(doc, 'Document');
    await structTree.insert(rootElement, 0)
    let count = -1
    for(let i = 0; i < result.length; i++) {
    let item = result[i];

    if (item.children !== undefined && item.name !== undefined && item.name === 'h1') {
        count++;
        console.log("I am a H1 tag that says: " + item.children[0].data + " COUNT: " + count);
        
        //writer.writeString(`/H1 <</MCID 0 >> BDC `);
        writer.writeString(`/H1 <</MCID ${count} >> BDC `);
        element = await builder.createTextBeginWithFont(await PDFNet.Font.create(doc, PDFNet.Font.StandardType1Font.e_times_roman), 4); 
        writer.writeElement(element);
        element = await builder.createNewTextRun(item.children[0].data); 
        //console.log(await element.getMCTag())
        element.setTextMatrixEntries(10, 0, 0, 10, 15, 700);
        writer.writeElement(element);
        gstate = await element.getGState();  
        gstate.setLeading(5);    // Zeilenabstand
        writer.writeElement(await builder.createTextEnd());
        writer.writeString("EMC ");            
        writer.writeElement(await builder.createTextNewLine());

        const structElement = await PDFNet.SElement.createFromPDFDoc(doc, 'H1');
        await rootElement.insert(structElement, 0)
        const mcid1 = await structElement.createContentItem(doc, page, 0)
        //console.log(mcid1)


    } else if (item.children !== undefined && item.name !== undefined && item.name === 'p') {
        count++;
        console.log("I am a P tag that says: " + item.children[0].data + " COUNT: " + count);

        writer.writeString(`/P <</MCID ${count} >> BDC `);
        elementP = await builder.createTextBeginWithFont(await PDFNet.Font.create(doc, PDFNet.Font.StandardType1Font.e_times_roman), 2); 
        writer.writeElement(elementP);
        elementP = await builder.createNewTextRun(item.children[0].data); 
        //console.log(await elementP.getMCTag())
        elementP.setTextMatrixEntries(10, 0, 0, 10, 15, 650);
        writer.writeElement(elementP);
        gstate = await elementP.getGState();  
        gstate.setLeading(5);    // Zeilenabstand
        writer.writeElement(await builder.createTextEnd());
        writer.writeString("EMC ");
        writer.writeElement(await builder.createTextNewLine());

        const structElement2 = await PDFNet.SElement.createFromPDFDoc(doc, 'P');
        await rootElement.insert(structElement2, 1)
        const mcid2 = await structElement2.createContentItem(doc, page, 0)
        //console.log(mcid2)
    }
    }


    //TODO: convert markdown file with image in it

   writer.writeString("/Figure <</MCID 2 >> BDC ");
   let img = await PDFNet.Image.createFromFile(doc, 'pic.jpg');
   const matrix2 = await PDFNet.Matrix2D.createZeroMatrix();
   await matrix2.set(140, 0, 0, 134, 15, 400);
   let element1 = await builder.createImageFromMatrix(img, matrix2);
   writer.writePlacedElement(element1);
   writer.writeString("EMC ");

    const structElement3 = await PDFNet.SElement.createFromPDFDoc(doc, 'Figure');
    await rootElement.insert(structElement3, 2)
    const mcid3 = await structElement3.createContentItem(doc, page, 0)
    //console.log(mcid3)

    const x = await structElement3.getSDFObj();
    //console.log(await x.isDict())
    await x.putString("Alt", "My Alt text")


    const pageDict = await page.getSDFObj();
    // console.log(await pageDict.isDict())
    await x.putName("Tabs", "S")


    // finish writing
    writer.end();
    doc.pagePushBack(page);
    doc.save('taggedHelloWorld.pdf', PDFNet.SDFDoc.SaveOptions.e_remove_unused | PDFNet.SDFDoc.SaveOptions.e_compatibility);
}

PDFNet.runWithCleanup(main).catch((err) => {
    console.log(err);
}).then(() => {
    PDFNet.shutdown();
})