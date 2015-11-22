/* jshint browser:false, node: true, esnext: true */
'use strict';

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

/** @type {String} */
var snippet_path = path.resolve(__dirname + '/../dist/snippet.min.js');
/** @type {String} */
var client_path = path.resolve(__dirname + '/../dist/client.min.js');
/** @type {String} */
var snippet = fs.readFileSync(snippet_path, 'utf8');

/**
  * @type {{getSnippet: module.exports.getSnippet, paths: {client: String, snippet: String}}}
 */
module.exports = {
    /**
     * @param {String} id
     * @param {Object} [options={}]
     * @returns {String}
     */
    getSnippet: function (id, options) {

        if (typeof id === 'undefined') {
            throw new TypeError('You must provide an Id');
        }

        options = options || {};

        var client = options.client || 'https://stkbn.com/js';
        var global = options.global || 'stackbin';

        var local_snippet = snippet;
        local_snippet = local_snippet.replace(/,STACKBIN_ID/, id !== '' ? ',' + JSON.stringify(id) : '');  // can be empty
        local_snippet = local_snippet.replace(/https:\/\/stkbn\.com\/js/, client);
        local_snippet = local_snippet.replace(/stackbin/, global);

        if (options.config.id) {
            local_snippet += `\n${global}("id",${JSON.stringify(options.config.id)});`;
            delete options.config.id;
        }

        if (options.config) {
            local_snippet += `\n${global}("config",${JSON.stringify(options.config)});`;
        }

        if (options.tag) {
            local_snippet += `\n${global}("tag",${JSON.stringify(options.tag)});`;
        }

        return local_snippet;

    },

    paths: {
        client: client_path,
        snippet: snippet_path
    }
};
