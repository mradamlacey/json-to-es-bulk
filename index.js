var path = require('path'),
    yargs = require('yargs'),
    colors = require('colors/safe'),
    util = require('util'),
    fs = require('fs'),
    _ = require('lodash')
    isVerboseOn = false;

process.on('uncaughtException', function(err) {

    if(isVerboseOn){
        console.log(colors.red(err.stack));
    }
    else{
        console.log(colors.red(err));
    }

});

var argv = yargs.usage('Usage: $0 -f [input JSON file] -o [output path for request body data file] -i [Elasticsearch index to write to] -t [Elasticsearch type to write]')
    .demand(['f', 'i', 't'])
    .alias('f', 'file')
    .describe('f', 'Path to input JSON file')
    .alias('o', 'output')
    .describe('o', 'Output path of the request body data file')
    .default('o', './')
    .alias('i', 'index')
    .describe('i', 'Elasticsearch index to write to')
    .alias('t', 'type')
    .describe('t', 'Name of the Elasticsearch type that is being inserted')
    .alias('v', 'verbose')
    .help('h')
    .alias('h', 'help')
    .epilog('Copyright 2015')
    .argv;

if(argv.verbose){
    isVerboseOn = true;
}

var stats = fs.statSync(argv.file);
if(!stats.isFile()){
    console.log(colors.red('Unable to find input file: ', argv.file));
    exit(1);
}

var inputJsonString = fs.readFileSync(argv.file),
    inputJson;

try{
    inputJson = JSON.parse(inputJsonString);
}
catch(err){
    console.log(colors.red('Unable to parse input json contents', err));
    exit(1);
}

var outputStats = fs.statSync(argv.output);
if(!outputStats.isDirectory()){
    console.log(colors.red('[output] is not a valid directory: ', argv.output));
    exit(1);
}

if(!_.isArray(inputJson)){
    console.log(colors.red('Contents of JSON input file must be an array'));
    exit(1);
}

var stream = fs.createWriteStream(path.join(argv.output, 'request-data.txt'));
stream.on('finish', function() {
	console.log(colors.green('completed, wrote: ' + counter + ' record(s)'));
});

console.log(colors.gray('Writing records...'));
var counter = 0;

stream.once('open', function(fd) {

    _.each(inputJson, function(record){

        var recordPrologue = { index: { '_index': argv.index, '_id': record.id, '_type': argv.type } };
        stream.write(JSON.stringify(recordPrologue) + '\n');
        stream.write(JSON.stringify(record) + '\n');

        //process.stdout.write('.');

        if(counter % 100){
           // console.log(colors.gray('.'));
        }

        counter++;
    });

    stream.end();
});
