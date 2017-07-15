# `json-to-es-bulk`

Simple utility that reads in a file (specified on the command line with `-f`) that
contains an array of JSON data and outputs a new file with contents suitable
as the request body for an Elasticsearch bulk request.

The utility will create a file named `request-data.txt` in the output
path specified.

## Limitations

- Currently is required that there is a property named `id` in each object
of the array in order to properly create the bulk request.
- Only `index` operations are supported


> The easy use-case for this tool is to use something like [JSON-Generator](http://www.json-generator.com/)
to generate test data that can easily be converted to a bulk request.

## Usage

### Getting started

 - Clone this repo
 - Run `npm install`


### Creating request data for an input file:

```
node index.js -f inputdata.json --index test --type test
```

This will read `inputdata.json` from the current directory, and
create a bulk request to the `test` index to the `test` mapping.

### Using `curl` to index the request data:

```
curl -XPOST http://localhost:9200/_bulk @<path to output file>
```