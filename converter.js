const { PDFNet } = require('@pdftron/pdfnet-node');
let fs = require('fs'); 
const parse = require('html-dom-parser');
let MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();  
let markdownItAttrs = require('markdown-it-attrs');

const prompt = require('prompt-sync')();
 
const inputFile = prompt('Geben Sie den Namen der Datei ein, die Sie konvertieren möchten: ');
const outputFile = prompt('Welchen Namen soll die PDF/UA-Datei haben? ');

md.use(markdownItAttrs, {
    // optional, these are default options
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []  // empty array = all attributes are allowed
  });

  const main = async() => {

    let data = fs.readFileSync(inputFile).toString()
    let rendered = md.render(data)
    let result = parse(rendered);

    const doc = await PDFNet.PDFDoc.create();
    const builder = await PDFNet.ElementBuilder.create();
    const writer = await PDFNet.ElementWriter.create();

    let element;
    let gstate;
    const pageRect = await PDFNet.Rect.init(0, 0, 612, 794);
    let page = await doc.pageCreate(pageRect);

    const trailer = await doc.getTrailer();
    const info = await trailer.putDict('Info');
    await info.putString('Producer', 'KK');
    await info.putString('Title', 'Tagged Hello World');

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
    let readOrder;
    let matrixNum = 740;

    for(let i = 0; i < result.length; i++) {
        let item = result[i];

        if (item.children !== undefined && item.name !== undefined && item.name === 'h1') {
            count++;
            matrixNum -= 50;
            writer.writeString(`/H1 <</MCID ${count} >> BDC `);

            element = await builder.createTextBeginWithFont(await PDFNet.Font.create(doc, PDFNet.Font.StandardType1Font.e_times_roman), 4); 
            element.setTextMatrixEntries(10, 0, 0, 10, 50, matrixNum);
  
            gstate = await element.getGState();  
            gstate.setLeading(5);    // Zeilenabstand
            writer.writeElement(element);
            const para1 = item.children[0].data;
            const paraEnd1 = para1.length;
            let textRun1 = 0;
            let textRunEnd1;
            const paraWidth1 = 350; // paragraph width is 300 units
            let curWidth1 = 0;
            while (textRun1 < paraEnd1) {
              textRunEnd1 = para1.indexOf(' ', textRun1);
              if (textRunEnd1 < 0) {
                textRunEnd1 = paraEnd1 - 1;
              }
              let text1 = para1.substring(textRun1, textRunEnd1  + 1);
              element = await builder.createNewTextRun(text1);
              if (curWidth1 + (await element.getTextLength()) < paraWidth1) {
                writer.writeElement(element);
                curWidth1 += await element.getTextLength();
              } else {
                writer.writeElement(await builder.createTextNewLine()); // New line
                text1 = para1.substr(textRun1, textRunEnd1 - textRun1 + 1);
                element = await builder.createNewTextRun(text1);
                curWidth1 = await element.getTextLength();
                writer.writeElement(element);
                matrixNum -= 22;
              
              }
              textRun1 = textRunEnd1 + 1;
            }

            // element = await builder.createNewTextRun(item.children[0].data); 
            // writer.writeElement(element);

            writer.writeElement(await builder.createTextEnd());
            writer.writeString("EMC ");            
            writer.writeElement(await builder.createTextNewLine());

            readOrder = item.attribs.id - 1;
            const structElement = await PDFNet.SElement.createFromPDFDoc(doc, 'H1');
            await rootElement.insert(structElement, readOrder)
            const mcid1 = await structElement.createContentItem(doc, page, 0)

            if ((await (await element.getTextMatrix()).m_v) < 100) {
              writer.end(); // save changes to the current page
              doc.pagePushBack(page);
              // Start a new page ------------------------------------
              page = await doc.pageCreate(pageRect);
      
               // begin writing to this page
               writer.beginOnPage(page);
               matrixNum = 760;
           } else {
              writer.writeElement(await builder.createTextNewLine());
           }


        } else if (item.children !== undefined && item.name !== undefined && item.name === 'p' && item.children[0].name !== 'img' && item.children[0].attribs === undefined) {
            count++;
            matrixNum -= 40;

            writer.writeString(`/P <</MCID ${count} >> BDC `);

            element = await builder.createTextBeginWithFont(await PDFNet.Font.create(doc, PDFNet.Font.StandardType1Font.e_times_roman), 12);
            element.setTextMatrixEntries(1.5, 0, 0, 1.5, 50, matrixNum);
            (await element.getGState()).setLeading(15);
            writer.writeElement(element);
            const para = item.children[0].data;
            const paraEnd = para.length;
            let textRun = 0;
            let textRunEnd;
            const paraWidth = 350;
            let curWidth = 0;
            while (textRun < paraEnd) {
              textRunEnd = para.indexOf(' ', textRun);
              if (textRunEnd < 0) {
                textRunEnd = paraEnd - 1;
              }
              let text = para.substring(textRun, textRunEnd  + 1);
              element = await builder.createNewTextRun(text);
              if (curWidth + (await element.getTextLength()) < paraWidth) {
                writer.writeElement(element);
                curWidth += await element.getTextLength();
              } else {
                writer.writeElement(await builder.createTextNewLine()); // New line
                text = para.substr(textRun, textRunEnd - textRun + 1);
                element = await builder.createNewTextRun(text);
                curWidth = await element.getTextLength();
                writer.writeElement(element);
                matrixNum -= 22;
              }
              textRun = textRunEnd + 1;
            }

            writer.writeElement(await builder.createTextEnd());
            writer.writeString("EMC ");
            writer.writeElement(await builder.createTextNewLine());

            readOrder = item.attribs.id - 1;
            const structElement2 = await PDFNet.SElement.createFromPDFDoc(doc, 'P');
            await rootElement.insert(structElement2, readOrder)
            const mcid2 = await structElement2.createContentItem(doc, page, 0)

            if ((await (await element.getTextMatrix()).m_v) < 100) {
              console.log(await (await element.getTextMatrix()).m_v)
              writer.end(); // save changes to the current page
              doc.pagePushBack(page);
              // Start a new page ------------------------------------
              page = await doc.pageCreate(pageRect);
      
               // begin writing to this page
               writer.beginOnPage(page);
               matrixNum = 760;
            } else {
              writer.writeElement(await builder.createTextNewLine());
            }

        } else if (item.children !== undefined && item.name === 'p' && item.children[0].name === 'img' && item.children[0].attribs !== undefined) {
            if(item.attribs !== undefined && item.attribs.class === 'artefact' && item.children[0].name === 'img') {
                // count++;
                matrixNum -= 180
                writer.writeString("/Artifact <<>>BDC ");
                let img = await PDFNet.Image.createFromFile(doc, item.children[0].attribs.src);
                const matrix2 = await PDFNet.Matrix2D.createZeroMatrix();
                await matrix2.set(140, 0, 0, 134, 50, matrixNum);
                let element1 = await builder.createImageFromMatrix(img, matrix2);
                writer.writePlacedElement(element1);
                writer.writeString("EMC ");
            } else {
                count++;
                matrixNum -= 180
                writer.writeString(`/Figure <</MCID ${count} >> BDC `);
                let img = await PDFNet.Image.createFromFile(doc, item.children[0].attribs.src);
                const matrix2 = await PDFNet.Matrix2D.createZeroMatrix();
                await matrix2.set(140, 0, 0, 134, 50, matrixNum);
                let element1 = await builder.createImageFromMatrix(img, matrix2);
                writer.writePlacedElement(element1);
                writer.writeString("EMC ");

                readOrder = item.attribs.id - 1;
                const structElement3 = await PDFNet.SElement.createFromPDFDoc(doc, 'Figure');
                await rootElement.insert(structElement3, readOrder)
                const mcid3 = await structElement3.createContentItem(doc, page, 0)
                const x = await structElement3.getSDFObj();
                await x.putString("Alt", item.children[0].attribs.alt)
                await x.putName("Tabs", "S")
            }
        }
    }

    // finish writing
    writer.end();
    doc.pagePushBack(page);
    doc.save(outputFile, PDFNet.SDFDoc.SaveOptions.e_remove_unused | PDFNet.SDFDoc.SaveOptions.e_compatibility);
}

PDFNet.runWithCleanup(main, 'demo:1632235702476:78c6420b03000000009b6cd643e67de8b781a0fd0f8908df5dfcf566bf').catch(function(error) {
    console.log('Error: ' + JSON.stringify(error));
  }).then(function(){ PDFNet.shutdown(); });