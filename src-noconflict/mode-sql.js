ace.define("ace/mode/sql_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var SqlHighlightRules = function() {

    var keywords = (
        "select|insert|update|delete|from|where|and|or|group|by|order|limit|offset|having|as|case|" +
        "when|then|else|end|type|left|right|join|on|outer|desc|asc|union|create|table|primary|key|if|" +
        "foreign|not|references|default|null|inner|cross|natural|database|drop|grant"
    );

    var builtinConstants = (
        "true|false"
    );

    var builtinFunctions = (
        "avg|count|first|last|max|min|sum|ucase|lcase|mid|len|round|rank|now|format|" + 
        "coalesce|ifnull|isnull|nvl"
    );

    var dataTypes = (
        "int|numeric|decimal|date|varchar|char|bigint|float|double|bit|binary|text|set|timestamp|" +
        "money|real|number|integer"
    );
   var operatorRe="\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|>=|==|!=|<>|="; 
    var keywordMapper = this.createKeywordMapper({
        "support.function": builtinFunctions,
        "keyword": keywords,
        "constant.language": builtinConstants,
        "storage.type": dataTypes
    }, "identifier", true);

 var identifierRe = "[a-zA-Z_$][a-zA-Z0-9_$]*\\b";
 var numericRe="[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b";
 var stringRe='(".*?")|(\'.*?\')|(`.*?`)';
 var numberAndIdentifierRe="[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
 var dataFieldsRe=dataFields.join('|');

    this.$rules = {

        "start" : [ {
            token : "comment",
            regex : "--.*$"
        },  {
            token : "comment",
            start : "/\\*",
            end : "\\*/"
        }, {
            token : "string",           // " string
            regex : stringRe
            },
            {
            token : [
                "field.strField", "text", "keyword.operator","text","value"
            ],
            regex : "(" + dataFieldsRe +")(\\s*)("+operatorRe+")(\\s*)(\".*?\")",
          }, 
          {
            token : [
                "field.strField", "text", "keyword.operator","text","value"
            ],
            regex : "(" + dataFieldsRe +")(\\s*)("+operatorRe+")(\\s*)('.*?')",
          }, 
          {
            token : [
                "field.strField", "text", "keyword.operator","text","value"
            ],
            regex : "(" + dataFieldsRe +")(\\s*)("+operatorRe+")(\\s*)(`.*?`)",
          }, 
          {
            token : [
                "field.strField", "text", "keyword.operator","text","value"
            ],
            regex : "(" + dataFieldsRe +")(\\s*)("+operatorRe+")(\\s*)("+identifierRe+")",
          }, 
          {
            token : [
                "field.strField", "text", "keyword.operator","text","value"
            ],
            regex : "(" + dataFieldsRe +")(\\s*)("+operatorRe+")(\\s*)("+numberAndIdentifierRe+")",
          },
          {
            token : [
                "field.numField", "text", "keyword.operator","text","value"
            ],
            regex : "(" + dataFieldsRe +")(\\s*)("+operatorRe+")(\\s*)("+numericRe+")",
          },
          
             {
            token : [
                "field.errorField", "text", "keyword.operator","text","value"
            ],
            regex : "(" + identifierRe +")(\\s*)("+operatorRe+")(\\s*)(\".*?\")",
          }, 
          {
            token : [
                "field.errorField", "text", "keyword.operator","text","value"
            ],
            regex : "(" + identifierRe +")(\\s*)("+operatorRe+")(\\s*)('.*?')",
          }, 
          {
            token : [
                "field.errorField", "text", "keyword.operator","text","value"
            ],
            regex : "(" + identifierRe +")(\\s*)("+operatorRe+")(\\s*)(`.*?`)",
          }, 
          {
            token : [
                "field.errorField", "text", "keyword.operator","text","value"
            ],
            regex : "(" + identifierRe +")(\\s*)("+operatorRe+")(\\s*)("+identifierRe+")",
          }, 

          {
            token : [
                "field.errorField", "text", "keyword.operator","text","value"
            ],
            regex : "(" + identifierRe +")(\\s*)("+operatorRe+")(\\s*)("+numericRe+")",
          },
          {
            token : [
                "field.errorField", "text", "keyword.operator","text","value"
            ],
            regex : "(" + identifierRe +")(\\s*)("+operatorRe+")(\\s*)("+numberAndIdentifierRe+")",
          },

        {
            token : "constant.numeric", // float
            regex : numericRe
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        },             
       {
            token : "paren.lparen",
            regex : "[\\(]"
        }, {
            token : "paren.rparen",
            regex : "[\\)]"
        },

         {
            token : "text",
            regex : "\\s+"
        } ],           
       
    };
    this.normalizeRules();
  var completions = [];
    var addCompletions = function(arr, meta) {
        arr.forEach(function(v) {
            completions.push({
                name: v,
                value: v,
                score: 0,
                meta: meta
            });
        });
    };
    addCompletions(builtinFunctions.split('|'), 'function');
    addCompletions(dataTypes.split('|'), 'type');
    addCompletions(keywords.split('|'), 'keyword'); 
    this.completions = completions;
};

oop.inherits(SqlHighlightRules, TextHighlightRules);

exports.SqlHighlightRules = SqlHighlightRules;
});

ace.define("ace/mode/sql",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/sql_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var SqlHighlightRules = require("./sql_highlight_rules").SqlHighlightRules;

var Mode = function() {
    this.HighlightRules = SqlHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "--";
     this.getCompletions = function(state, session, pos, prefix) {
        return session.$mode.$highlightRules.completions;
    };
    this.$id = "ace/mode/sql";
}).call(Mode.prototype);

exports.Mode = Mode;

});                (function() {
                    ace.require(["ace/mode/sql"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            