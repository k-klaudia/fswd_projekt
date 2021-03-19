let fs = require('fs'); 
const parse = require('html-dom-parser');
let MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();  
let markdownItAttrs = require('markdown-it-attrs');

md.use(markdownItAttrs, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []
  });

let data = fs.readFileSync("text.md").toString()
let rendered = md.render(data)
let result = parse(rendered);
console.log(result)

const result2 = []
for(let i = 0; i < result.length; i++) {
    let item1 = result[i];
    if(item1.attribs !== undefined) {
        result2.push(item1) 
    }
}

result2.sort(function(a,b) {
    return a.attribs.id - b.attribs.id
})


// console.log(result2)
for(let j = 0; j < result.length; j++) {
   let item = result[j]
   if (item.attribs !== undefined) {
    // console.log(item.attribs.id)
   }

//     if (item.attribs !== undefined && item.attribs.id === '1') {
//         if (item.children !== undefined && item.name !== undefined && item.name === 'h1' && item.attribs.id === '1') {
//         console.log("I am a H1 tag that says: " + item.children[0].data);
//         } else if (item.children !== undefined && item.name !== undefined && item.name === 'p' && item.children[0].name !== 'img'&& item.children[0].attribs === undefined && item.attribs.id === '1') {
//         console.log("I am a P tag that says: " + item.children[0].data);
//         } else if (item.children !== undefined && item.name === 'p' && item.children[0].name === 'img' && item.children[0].attribs !== undefined && item.attribs.id === '1') {
//         console.log("I am a picture: " + item.children[0].attribs.src);
         }

//     } else if (item.attribs !== undefined && item.attribs.id === '2') {
//         if (item.children !== undefined && item.name !== undefined && item.name === 'h1' && item.attribs.id === '2') {
//             console.log("I am a H1 tag that says: " + item.children[0].data);
//         } else if (item.children !== undefined && item.name !== undefined && item.name === 'p' && item.children[0].name !== 'img'&& item.children[0].attribs === undefined && item.attribs.id === '2') {
//             console.log("I am a P tag that says: " + item.children[0].data);
//         } else if (item.children !== undefined && item.name === 'p' && item.children[0].name === 'img' && item.children[0].attribs !== undefined && item.attribs.id === '2') {
//             console.log("I am a picture: " + item.children[0].attribs.src);
//         }
    
//     } else if (item.attribs !== undefined && item.attribs.id === '3') {
//         if (item.children !== undefined && item.name !== undefined && item.name === 'h1' && item.attribs.id === '3') {
//             console.log("I am a H1 tag that says: " + item.children[0].data);
//         } else if (item.children !== undefined && item.name !== undefined && item.name === 'p' && item.children[0].name !== 'img'&& item.children[0].attribs === undefined && item.attribs.id === '3') {
//             console.log("I am a P tag that says: " + item.children[0].data);
//         } else if (item.children !== undefined && item.name === 'p' && item.children[0].name === 'img' && item.children[0].attribs !== undefined && item.attribs.id === '3') {
//             console.log("I am a picture: " + item.children[0].attribs.src);
//         }
//     }

// }



// ARTEFACT LOGIC

// for(let i = 0; i < result.length; i++) {
//     let item = result[i];
//     if(item.attribs !== undefined && item.attribs.class === 'artefact' && item.children[0].name === 'img') {
//         console.log('Mark me as an artefact')
//     } else if (item.attribs !== undefined && item.children[0].name === 'img'){
//         console.log('I am a marked content')
//     }
// }


