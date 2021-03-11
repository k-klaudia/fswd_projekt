var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();  

// console.log(resultH1[0].tag + ' + ' + resultP[0].tag)
var fs = require('fs'); 
const parse = require('html-dom-parser');

  
// Use fs.readFile() method to read the file 
fs.readFile('text.md', 'utf8', function(err, data){ 
    var rendered = md.render(data)
    var result = parse(rendered);
    // console.log(result[2].children[0].data)
    result.forEach((item) => {
    if (item.children !== undefined && item.name !== undefined && item.name === 'h1') {
        console.log("I am a H1 tag that says: " + item.children[0].data);
    } else if (item.children !== undefined && item.name !== undefined && item.name === 'p') {
        console.log("I am a P tag that says: " + item.children[0].data);
    }
    })
      
}); 





