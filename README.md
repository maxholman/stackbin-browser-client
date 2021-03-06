<h1 align="center">
	<br>
	<img width="325" height="70" src="media/stackbin.png" alt="Stackbin Logo">
	<br>
	<br>
	<br>
</h1>

> JavaScript error and exception tracking for modern web applications

This is the browser based error reporting client for [Stackbin](https://stkbn.com).

## Features

- Full stack trace support
- Sourcemaps support (CoffeeScript, uglify etc)
- Timeline and user event analysis
- Tagging of arbitrary customer data + debug information
- Unique user identification
- Code snippet generation and syntax highlighting
- Slack integration
- Webhooks
- Full REST API

## Getting Started
You will need access to a [Stackbin](https://stkbn.com) account and project.

We're still in closed beta. Feel free to [ask if you want to try](mailto:hello@stkbn.com)!


## Install

```bash
npm install stackbin-browser-client --save
```


## Usage

There are 2 choices for integration, depending on your application and development environment.

HTML integration is the simplest and most common.

See the [Node.js](#nodejs) or [Other languages](#other-languages) may be better for you if you run multiple environments or have automated build processes.

### HTML

Copy the contents of `dist/snippet.min.js` into a script tag within the `HEAD` of your HTML document.

In order to catch as many errors as possible, it should be the first script tag on the page.

Don't worry about performance, it all works asynchronously and will not affect page load times.

Example:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Web App</title>
    <script>
    !function(S,T,A,C,K,B,I,N,_){
    //... minified garbage...
    }(window,document,"script","https://stkbn.com/js","stackbin");
    </script>
    <script src="https://..."></script>
</head>
<body>
```

### Node.js

Use this module to programmatically generate the snippet for inclusion within your template system.

#####
```javascript
var stackbin = require('stackbin-browser-client');
```

Simplest usage:
```javascript
var snippet = stackbin.getSnippet('example-company/product-a-staging');

// Returns:
// !function(S,T,A,C,K,B,I,N,_){
// ... minified garbage...
// }(window,document,"script","https://stkbn.com/js","stackbin","example-company/product-a-staging");
```
More complex example with options.
```javascript
var options = {
    config: {commit: process.env.NODE_ENV === 'production'},
    tag: {env: process.env.NODE_ENV, lang: config.get('lang')}
}
var snippet = stackbin.getSnippet('', options);

// Returns:
// !function(S,T,A,C,K,B,I,N,_){
// ... minified garbage...
// }(window,document,"script","https://stkbn.com/js","stackbin");
// stackbin("id","example-company/product-a-staging");
// stackbin("config",{"commit": false});
// stackbin("tag",{"env":"development","lang":"en"});
```

### Example usage with Express and Jade

From the example on [the Express template engines](http://expressjs.com/guide/using-template-engines.html) page.

```
app.set('view engine', 'jade');
```

```jade
html
  head
    title!= title
    script!= snippet
  body
```

```javascript
var snippet = stackbin.getSnippet('');
app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', snippet: snippet});
});
```
### Other languages

The browser client snippet is located at `dist/snippet.min.js`.

You can include this in your template system by accessing the file directly.

## Methods

#### getSnippet(id, [options])

Returns: `string`

##### id

Type: `String`

The property id for your Stackbin project.  Can also be a blank string if you prefer to set the id via `options.config`

Example: `example-company/product-a-staging`

##### options

Type: `Object`

###### options.config

Type: `Object`

|Options|Type|Default|
|-------|----|-------|
|id|String||
|commit|Boolean|true|
|host|String|api.stkbn.com|
|debug|Boolean|false|

###### options.identify

Type: `String`, `Number`

A unique identifier for your user.

Set this to a user id generated by your system to group and search for errors occurring repeatedly for a single user.

###### options.tag

Type: `Object`
Default: `{}`

An object of arbitrary tags to store against the report.

###### options.commit

Type: `Boolean`
Default: `true`

Whether you want to post exception reports to the Stackbin service.

Useful to set this to false in development to avoid using up your quota!

###### options.debug

Type: `Boolean`
Default: `true`

Whether you want to post exception reports to the Stackbin service.

Useful to set this to false in development to avoid using up your quota!

###### options.global

Type: `Boolean`
Default: `stackbin`

The name of the global variable you will use to reference the Stackbin client.

###### options.client

Type: `String`
Default: `https://stkbn.com/js`

If you have been informed to use a different client URL. Specify it here.

## Properties

#### paths

Type: `Object`

###### paths.snippet_path

Type: `String`

The absolute path to the client snippet.

###### paths.client_path

Type: `String`

The absolute path to the collector library.


### Support

We're glad to help with anything, no matter how small!

[Get in touch](mailto:hello@stkbn.com)

### License

See LICENCE file.
