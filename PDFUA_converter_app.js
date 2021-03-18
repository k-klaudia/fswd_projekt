const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

 var exec = require('child_process').exec,
    child;

rl.question('Your Markdown to PDF/UA Conversion is about to begin. Would you like to mark the image as an artifact? ', (answer) => {
  if(answer === 'no') {
    child = exec('node mdToTaggedPdf.js',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
});
  } else if (answer === 'yes') {
    child = exec('node PDFUA_artifact.js',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
});
  } else {
    console.log('Pls only enter yes or no')
  }
  rl.close();
});


