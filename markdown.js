let fs = require('fs'); 
const parse = require('html-dom-parser');
let MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();  

let data = fs.readFileSync("text.md").toString()
let rendered = md.render(data)
let result = parse(rendered);
// console.log(rendered)
// console.log(result[0].name + " --- " + result[2].name)
// console.log(result)
// console.log(result[4].children[0].attribs)

console.log(result[4].children[0].attribs.alt);
        let count = -1;
        result.forEach((item) => {
            if (item.children !== undefined && item.name !== undefined && item.name === 'h1') {
                count++;
                console.log("I am a H1 tag that says: " + item.children[0].data + " COUNT: " + count);
            } else if (item.children !== undefined && item.name !== undefined && item.name === 'p' && item.children[0].name !== 'img'&& item.children[0].attribs === undefined) {
                count++;
                console.log("I am a P tag that says: " + item.children[0].data + " COUNT: " + count);
            } else if (item.children !== undefined && item.name === 'p' && item.children[0].name === 'img' && item.children[0].attribs !== undefined) {
                count++;
                console.log("I am a picture: " + item.children[0].attribs.src + " COUNT: " + count);
            }
            })




