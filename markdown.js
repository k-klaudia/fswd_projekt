let fs = require('fs'); 
const parse = require('html-dom-parser');
let MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();  

const readData = fs.readFile('text.md', 'utf8', async (err, data) => {
    if(!err){
        let rendered = await md.render(data)
        let result = parse(rendered);
        let count = -1;
        // console.log(result[2].children[0].data)
        result.forEach(async(item) => {
            if (item.children !== undefined && item.name !== undefined && item.name === 'h1') {
                await count++;
                console.log("I am a H1 tag that says: " + item.children[0].data + " COUNT: " + count);
            } else if (item.children !== undefined && item.name !== undefined && item.name === 'p') {
                count++;
                console.log("I am a P tag that says: " + item.children[0].data + " COUNT: " + count);
            }
            })
    }
})



