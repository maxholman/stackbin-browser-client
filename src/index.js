/* jshint browser:false, node: true, esnext: true */
'use strict';

var omit = require('lodash.omit');
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
        var indent = options.indent || '';

        var local_snippet = snippet;
        local_snippet = local_snippet.replace(/,STACKBIN_ID/, id !== '' ? ',' + JSON.stringify(id) : '');  // can be empty
        local_snippet = local_snippet.replace(/STACKBIN_HOST/, JSON.stringify(client));
        local_snippet = local_snippet.replace(/STACKBIN_GLOBAL/, JSON.stringify(global));
        local_snippet = local_snippet.replace(/(\n)([^$])/g, '$1' + indent + '$2');

        if (options.config) {
            local_snippet += '\n' + indent + global + '("config",' + JSON.stringify(omit(options.config, 'id')) + ');';

            if (options.config.id) {
                local_snippet += '\n' + indent + global + '("id",' + JSON.stringify(options.config.id) + ');';
            }

        }

        if (options.tag) {
            local_snippet += '\n' + indent + global + '("tag",' + JSON.stringify(options.tag) + ');';
        }

        return local_snippet;

    },

    paths: {
        client: client_path,
        snippet: snippet_path
    }
};
