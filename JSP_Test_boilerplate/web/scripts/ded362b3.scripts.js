var wordRegexp;
wordRegexp = function(words) {
    return new RegExp("^(?:" + words.join("|") + ")$","i")
}
,
CodeMirror.defineMode("cypher", function(config) {
    var curPunc, funcs, indentUnit, keywords, operatorChars, popContext, preds, pushContext, tokenBase, tokenLiteral;
    return tokenBase = function(stream, state) {
        var ch, curPunc, type, word;
        return ch = stream.next(),
        curPunc = null ,
        '"' === ch || "'" === ch ? (stream.match(/.+?["']/),
        "string") : /[{}\(\),\.;\[\]]/.test(ch) ? (curPunc = ch,
        "node") : "/" === ch && stream.eat("/") ? (stream.skipToEnd(),
        "comment") : operatorChars.test(ch) ? (stream.eatWhile(operatorChars),
        null ) : (stream.eatWhile(/[_\w\d]/),
        stream.eat(":") ? (stream.eatWhile(/[\w\d_\-]/),
        "atom") : (word = stream.current(),
        type = void 0,
        funcs.test(word) ? "builtin" : preds.test(word) ? "def" : keywords.test(word) ? "keyword" : "variable"))
    }
    ,
    tokenLiteral = function(quote) {
        return function(stream, state) {
            var ch, escaped;
            for (escaped = !1,
            ch = void 0; null  != (ch = stream.next()); ) {
                if (ch === quote && !escaped) {
                    state.tokenize = tokenBase;
                    break
                }
                escaped = !escaped && "\\" === ch
            }
            return "string"
        }
    }
    ,
    pushContext = function(state, type, col) {
        return state.context = {
            prev: state.context,
            indent: state.indent,
            col: col,
            type: type
        }
    }
    ,
    popContext = function(state) {
        return state.indent = state.context.indent,
        state.context = state.context.prev
    }
    ,
    indentUnit = config.indentUnit,
    curPunc = void 0,
    funcs = wordRegexp(["str", "min", "labels", "max", "type", "lower", "upper", "length", "type", "id", "coalesce", "head", "last", "nodes", "relationships", "extract", "filter", "tail", "range", "reduce", "abs", "round", "sqrt", "sign", "replace", "substring", "left", "right", "ltrim", "rtrim", "trim", "collect", "distinct", "split", "toInt", "toFloat"]),
    preds = wordRegexp(["all", "any", "none", "single", "not", "in", "has", "and", "or", "like", "ilike"]),
    keywords = wordRegexp(["start", "merge", "load", "csv", "using", "periodic commit", "on create", "on match", "match", "index on", "drop", "where", "with", "limit", "skip", "order", "by", "return", "create", "delete", "set", "unique", "unwind"]),
    operatorChars = /[*+\-<>=&|~]/,
    {
        startState: function(base) {
            return {
                tokenize: tokenBase,
                context: null ,
                indent: 0,
                col: 0
            }
        },
        token: function(stream, state) {
            var style;
            if (stream.sol() && (state.context && null  == state.context.align && (state.context.align = !1),
            state.indent = stream.indentation()),
            stream.eatSpace())
                return null ;
            if (style = state.tokenize(stream, state),
            "comment" !== style && state.context && null  == state.context.align && "pattern" !== state.context.type && (state.context.align = !0),
            "(" === curPunc)
                pushContext(state, ")", stream.column());
            else if ("[" === curPunc)
                pushContext(state, "]", stream.column());
            else if ("{" === curPunc)
                pushContext(state, "}", stream.column());
            else if (/[\]\}\)]/.test(curPunc)) {
                for (; state.context && "pattern" === state.context.type; )
                    popContext(state);
                state.context && curPunc === state.context.type && popContext(state)
            } else
                "." === curPunc && state.context && "pattern" === state.context.type ? popContext(state) : /atom|string|variable/.test(style) && state.context && (/[\}\]]/.test(state.context.type) ? pushContext(state, "pattern", stream.column()) : "pattern" !== state.context.type || state.context.align || (state.context.align = !0,
                state.context.col = stream.column()));
            return style
        },
        indent: function(state, textAfter) {
            var closing, context, firstChar;
            if (firstChar = textAfter && textAfter.charAt(0),
            context = state.context,
            /[\]\}]/.test(firstChar))
                for (; context && "pattern" === context.type; )
                    context = context.prev;
            return closing = context && firstChar === context.type,
            context ? "keywords" === context.type ? newlineAndIndent : context.align ? context.col + (closing ? 0 : 1) : context.indent + (closing ? 0 : indentUnit) : 0
        }
    }
}),
CodeMirror.modeExtensions.cypher = {
    autoFormatLineBreaks: function(text) {
        var i, lines, reProcessedPortion;
        for (lines = text.split("\n"),
        reProcessedPortion = /\s+\b(return|where|order by|match|with|skip|limit|create|delete|set)\b\s/g,
        i = 0; i < lines.length; )
            lines[i] = lines[i].replace(reProcessedPortion, " \n$1 ").trim(),
            i++;
        return lines.join("\n")
    }
},
CodeMirror.defineMIME("application/x-cypher-query", "cypher"),
"function" != typeof String.prototype.trim && (String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "")
}
),
Object.keys = Object.keys || function(o, k, r) {
    r = [];
    for (k in o)
        r.hasOwnProperty.call(o, k) && r.push(k);
    return r
}
;
var baseURL, restAPI;
baseURL = "",
restAPI = baseURL + "/db/data",
angular.module("neo4jApp.settings", ["neo4jApp.utils"]).constant("Settings", {
    cmdchar: ":",
    endpoint: {
        console: baseURL + "/db/manage/server/console",
        version: baseURL + "/db/manage/server/version",
        jmx: baseURL + "/db/manage/server/jmx/query",
        rest: restAPI,
        cypher: restAPI + "/cypher",
        transaction: restAPI + "/transaction",
        authUser: baseURL + "/user"
    },
    host: baseURL,
    maxExecutionTime: 3600,
    heartbeat: 60,
    maxFrames: 50,
    maxHistory: 100,
    maxNeighbours: 100,
    maxRows: 1e3,
    filemode: !1,
    maxRawSize: 5e3,
    scrollToTop: !0,
    showVizDiagnostics: !1,
    acceptsReplies: !1,
    enableMotd: !0,
    initCmd: ":play start",
    refreshInterval: 10,
    userName: "Graph Friend",
    theme: "normal",
    storeCredentials: !0,
    shouldReportUdc: !1
}),
angular.module("neo4jApp.settings").service("SettingsStore", ["$rootScope", "localStorageService", "Settings", "Utils", function($rootScope, localStorageService, Settings, Utils) {
    var originalSettings;
    return originalSettings = angular.copy(Settings),
    {
        load: function() {
            var settings;
            return settings = localStorageService.get("settings"),
            angular.isObject(settings) ? Utils.extendDeep(Settings, settings) : void 0
        },
        reset: function() {
            return localStorageService.remove("settings"),
            angular.extend(Settings, originalSettings)
        },
        save: function() {
            return localStorageService.set("settings", angular.copy(Settings)),
            $rootScope.$broadcast("settings:saved")
        }
    }
}
]),
angular.module("neo4jApp.settings").run(["SettingsStore", function(SettingsStore) {
    return SettingsStore.load()
}
]),
angular.module("neo4jApp.utils", []).service("Utils", ["$timeout", function($timeout) {
    var that, utils;
    return utils = new neo.helpers,
    that = utils.extend(utils, this),
    that.debounce = function(func, wait, immediate) {
        var result, timeout;
        return result = void 0,
        timeout = null ,
        function() {
            var args, callNow, context, later;
            return context = this,
            args = arguments,
            later = function() {
                return timeout = null ,
                immediate ? void 0 : result = func.apply(context, args)
            }
            ,
            callNow = immediate && !timeout,
            $timeout.cancel(timeout),
            timeout = $timeout(later, wait),
            callNow && (result = func.apply(context, args)),
            result
        }
    }
    ,
    that
}
]);
var app;
angular.module("neo4jApp.controllers", ["neo4jApp.utils"]),
angular.module("neo4jApp.directives", ["ui.bootstrap.modal", "neo4jApp.utils"]),
angular.module("neo4jApp.filters", []),
angular.module("neo4jApp.services", ["LocalStorageModule", "neo4jApp.settings", "neo4jApp.utils", "base64"]),
app = angular.module("neo4jApp", ["ngAnimate", "neo4jApp.controllers", "neo4jApp.directives", "neo4jApp.filters", "neo4jApp.services", "neo4jApp.animations", "neo.exportable", "neo.csv", "ui.bootstrap.dropdown", "ui.bootstrap.position", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.tabs", "ui.bootstrap.carousel", "ui.codemirror", "ui.sortable", "ngSanitize"]),
angular.module("neo4jApp").config(["$httpProvider", function($httpProvider) {
    var base;
    return $httpProvider.defaults.headers.common["X-stream"] = !0,
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json",
    (base = $httpProvider.defaults.headers).get || (base.get = {}),
    $httpProvider.defaults.headers.get["Cache-Control"] = "no-cache",
    $httpProvider.defaults.headers.get.Pragma = "no-cache",
    $httpProvider.defaults.headers.get["If-Modified-Since"] = "Wed, 11 Dec 2013 08:00:00 GMT"
}
]),
angular.module("neo4jApp").run(["AuthService", "$rootScope", "$timeout", "Server", "Settings", function(AuthService, $scope, $timeout, Server, Settings) {
    var timer;
    return timer = null ,
    $scope.check = function() {
        var ts;
        return $timeout.cancel(timer),
        ts = (new Date).getTime(),
        Server.status("?t=" + ts).success(function(r) {
            return $scope.offline = !1,
            timer = $timeout($scope.check, 1e3 * Settings.heartbeat),
            r
        }).error(function(r) {
            return $scope.offline = !0,
            $scope.unauthorized = !1,
            timer = $timeout($scope.check, 2e3),
            r
        }).then(function(r) {
            return AuthService.isConnected().then(function() {
                return $scope.unauthorized = !1
            }, function(response) {
                var ref;
                return 401 === (ref = response.status) || 403 === ref || 429 === ref ? ($scope.offline = !1,
                $scope.unauthorized = !0) : ($scope.offline = !0,
                $scope.unauthorized = !1)
            }).then(function() {
                return $scope.refresh()
            }),
            r
        })
    }
    ,
    $scope.check()
}
]),
angular.module("neo4jApp").config(["$tooltipProvider", function($tooltipProvider) {
    return $tooltipProvider.options({
        popupDelay: 1e3
    })
}
]),
angular.module("neo4jApp").run(["$rootScope", "Document", "Folder", function($rootScope, Document, Folder) {
    var doc, folders, general_scripts, i, len, node_scripts, ref, relationship_scripts, results, system_scripts;
    for (general_scripts = [{
        folder: "general",
        content: '// Create a node\nCREATE (n {name:"World"}) RETURN "hello", n.name'
    }, {
        folder: "general",
        content: "// Get some data\nMATCH (n) RETURN n LIMIT 100"
    }, {
        folder: "general",
        content: "// What is related, and how\nMATCH (a)-[r]->(b)\nWHERE labels(a) <> [] AND labels(b) <> []\nRETURN DISTINCT head(labels(a)) AS This, type(r) as To, head(labels(b)) AS That\nLIMIT 10"
    }, {
        folder: "general",
        content: "// REST API\n:GET /db/data"
    }],
    node_scripts = [{
        folder: "nodes",
        content: "// Count nodes\n// Warning: may take a long time.\nMATCH (n)\nRETURN count(n)"
    }, {
        folder: "nodes",
        content: "// Create index\n// Replace:\n//   'LabelName' with label to index\n//   'propertyKey' with property to be indexed\nCREATE INDEX ON :LabelName(propertyKey)"
    }, {
        folder: "nodes",
        content: "// Create indexed node\n// Replace:\n//   'LabelName' with label to apply to new node\n//   'propertyKey' with property to add\n//   'property_value' with value of the added property\nCREATE (n:LabelName { propertyKey:\"property_value\" }) RETURN n"
    }, {
        folder: "nodes",
        content: "// Create node\nCREATE (n) RETURN n"
    }, {
        folder: "nodes",
        content: "// Delete a node\n// Replace:\n//   'LabelName' with label of node to delete\n//   'propertyKey' with property to find\n//   'expected_value' with value of property\nSTART n=node(*) \nMATCH (n:LabelName)-[r?]-()\nWHERE n.propertyKey = \"expected_value\"\nDELETE n,r"
    }, {
        folder: "nodes",
        content: "// Drop index\n// Replace:\n//   'LabelName' with label index\n//   'propertyKey' with indexed property\nDROP INDEX ON :LabelName(propertyKey)"
    }, {
        folder: "nodes",
        content: "// Find a node\nMATCH (n{{':'+label-name}})\nWHERE n.{{property-name}} = \"{{property-value}}\" RETURN n"
    }],
    relationship_scripts = [{
        folder: "relationships",
        content: "// Isolate node\n// Description: Delete some relationships to a particular node\n// Replace:\n//   'RELATIONSHIP' with relationship type to match (or remove for all)\n//   'propertyKey' with property by which to find the node\n//   'expected_value' with the property value to find\nMATCH (a)-[r:RELATIONSHIP]-()\nWHERE a.propertyKey = \"expected_value\"\nDELETE r"
    }, {
        folder: "relationships",
        content: "// Relate nodes\n// Replace:\n//   'propertyKey' with property to evaluate on either node\n//   'expected_value_a' with property value to find node a\n//   'expected_value_b' with property value to find node b\n//   'RELATIONSHP' with type of new relationship between a and b\nMATCH (a),(b)\nWHERE a.propertyKey = \"expected_value_a\"\nAND b.propertyKey = \"expected_value_b\"\nCREATE (a)-[r:RELATIONSHIP]->(b)\nRETURN a,r,b"
    }, {
        folder: "relationships",
        content: "// Shortest path\n// Replace:\n//   'propertyKey' with property to evaluate on either node\n//   'expected_value_a' with property value to find node a\n//   'expected_value_b' with property value to find node b\nMATCH p = shortestPath( (a)-[*..4]->(b) )\nWHERE a.propertyKey='expected_value_a' AND b.propertyKey='expected_value_b'\nRETURN p"
    }, {
        folder: "relationships",
        content: "// Whats related\n// Description: find a random sample of nodes, revealing how they are related\nMATCH (a)-[r]-(b)\nRETURN DISTINCT head(labels(a)), type(r), head(labels(b)) LIMIT 100"
    }],
    system_scripts = [{
        folder: "system",
        content: "// Server configuration\n:GET /db/manage/server/jmx/domain/org.neo4j/instance%3Dkernel%230%2Cname%3DConfiguration"
    }, {
        folder: "system",
        content: "// Kernel information\n:GET /db/manage/server/jmx/domain/org.neo4j/instance%3Dkernel%230%2Cname%3DKernel"
    }, {
        folder: "system",
        content: "// ID Allocation\n:GET /db/manage/server/jmx/domain/org.neo4j/instance%3Dkernel%230%2Cname%3DPrimitive%20count"
    }, {
        folder: "system",
        content: "// Store file sizes\n:GET /db/manage/server/jmx/domain/org.neo4j/instance%3Dkernel%230%2Cname%3DStore%20file%20sizes"
    }, {
        folder: "system",
        content: "// Extensions\n:GET /db/data/ext"
    }],
    folders = [{
        id: "general",
        name: "General",
        expanded: !0
    }, {
        id: "system",
        name: "System",
        expanded: !1
    }],
    0 === Document.length && (Document.add(general_scripts.concat(system_scripts)).save(),
    Folder.add(folders).save()),
    ref = Document.all(),
    results = [],
    i = 0,
    len = ref.length; len > i; i++)
        doc = ref[i],
        doc.folder && (Folder.get(doc.folder) ? results.push(void 0) : results.push(Folder.create({
            id: doc.folder
        })));
    return results
}
]),
angular.module("neo4jApp.services").run(["GraphRenderer", "GraphStyle", function(GraphRenderer, GraphStyle) {
    var arrowPath, nodeCaption, nodeOutline, nodeOverlay, noop, relationshipOverlay, relationshipType;
    return noop = function() {}
    ,
    nodeOutline = new GraphRenderer.Renderer({
        onGraphChange: function(selection) {
            var circles;
            return circles = selection.selectAll("circle.outline").data(function(node) {
                return [node]
            }),
            circles.enter().append("circle").classed("outline", !0).attr({
                cx: 0,
                cy: 0
            }),
            circles.attr({
                r: function(node) {
                    return node.radius
                },
                fill: function(node) {
                    return GraphStyle.forNode(node).get("color")
                },
                stroke: function(node) {
                    return GraphStyle.forNode(node).get("border-color")
                },
                "stroke-width": function(node) {
                    return GraphStyle.forNode(node).get("border-width")
                }
            }),
            circles.exit().remove()
        },
        onTick: noop
    }),
    nodeCaption = new GraphRenderer.Renderer({
        onGraphChange: function(selection) {
            var text;
            return text = selection.selectAll("text").data(function(node) {
                return node.caption
            }),
            text.enter().append("text").attr({
                "text-anchor": "middle"
            }),
            text.text(function(line) {
                return line.text
            }).attr("y", function(line) {
                return line.baseline
            }).attr("font-size", function(line) {
                return GraphStyle.forNode(line.node).get("font-size")
            }).attr({
                fill: function(line) {
                    return GraphStyle.forNode(line.node).get("text-color-internal")
                }
            }),
            text.exit().remove()
        },
        onTick: noop
    }),
    nodeOverlay = new GraphRenderer.Renderer({
        onGraphChange: function(selection) {
            var circles;
            return circles = selection.selectAll("circle.overlay").data(function(node) {
                return node.selected ? [node] : []
            }),
            circles.enter().insert("circle", ".outline").classed("ring", !0).classed("overlay", !0).attr({
                cx: 0,
                cy: 0,
                fill: "#f5F6F6",
                stroke: "rgba(151, 151, 151, 0.2)",
                "stroke-width": "3px"
            }),
            circles.attr({
                r: function(node) {
                    return node.radius + 6
                }
            }),
            circles.exit().remove()
        },
        onTick: noop
    }),
    arrowPath = new GraphRenderer.Renderer({
        onGraphChange: function(selection) {
            var paths;
            return paths = selection.selectAll("path").data(function(rel) {
                return [rel]
            }),
            paths.enter().append("path"),
            paths.attr("fill", function(rel) {
                return GraphStyle.forRelationship(rel).get("color")
            }).attr("stroke", "none"),
            paths.exit().remove()
        },
        onTick: function(selection) {
            return selection.selectAll("path").attr("d", function(d) {
                return d.arrowOutline
            }).attr("transform", function(d) {
                return "translate(" + d.startPoint.x + " " + d.startPoint.y + ") rotate(" + d.angle + ")"
            })
        }
    }),
    relationshipType = new GraphRenderer.Renderer({
        onGraphChange: function(selection) {
            var texts;
            return texts = selection.selectAll("text").data(function(rel) {
                return [rel]
            }),
            texts.enter().append("text").attr({
                "text-anchor": "middle"
            }),
            texts.attr("font-size", function(rel) {
                return GraphStyle.forRelationship(rel).get("font-size")
            }).attr("fill", function(rel) {
                return GraphStyle.forRelationship(rel).get("text-color-" + rel.captionLayout)
            }),
            texts.exit().remove()
        },
        onTick: function(selection) {
            return selection.selectAll("text").attr("x", function(rel) {
                return rel.midShaftPoint.x
            }).attr("y", function(rel) {
                return rel.midShaftPoint.y + parseFloat(GraphStyle.forRelationship(rel).get("font-size")) / 2 - 1
            }).attr("transform", function(rel) {
                return "rotate(" + rel.textAngle + " " + rel.midShaftPoint.x + " " + rel.midShaftPoint.y + ")"
            }).text(function(rel) {
                return rel.shortCaption
            })
        }
    }),
    relationshipOverlay = new GraphRenderer.Renderer({
        onGraphChange: function(selection) {
            var band, rects;
            return rects = selection.selectAll("rect").data(function(rel) {
                return [rel]
            }),
            band = 20,
            rects.enter().append("rect").classed("overlay", !0).attr("fill", "yellow").attr("x", 0).attr("y", -band / 2).attr("height", band),
            rects.attr("opacity", function(rel) {
                return rel.selected ? .3 : 0
            }),
            rects.exit().remove()
        },
        onTick: function(selection) {
            return selection.selectAll("rect").attr("width", function(d) {
                return d.arrowLength > 0 ? d.arrowLength : 0
            }).attr("transform", function(d) {
                return "translate(" + d.startPoint.x + " " + d.startPoint.y + ") rotate(" + d.angle + ")"
            })
        }
    }),
    GraphRenderer.nodeRenderers.push(nodeOutline),
    GraphRenderer.nodeRenderers.push(nodeCaption),
    GraphRenderer.nodeRenderers.push(nodeOverlay),
    GraphRenderer.relationshipRenderers.push(arrowPath),
    GraphRenderer.relationshipRenderers.push(relationshipType),
    GraphRenderer.relationshipRenderers.push(relationshipOverlay)
}
]),
angular.module("neo4jApp").config(["FrameProvider", "Settings", function(FrameProvider, Settings) {
    var argv, cmdchar, error, extractGraphModel, mapError, topicalize;
    return cmdchar = Settings.cmdchar,
    topicalize = function(input) {
        return null  != input ? input.toLowerCase().trim().replace(/\s+/g, "-") : null 
    }
    ,
    argv = function(input) {
        var rv;
        return rv = null  != input ? input.toLowerCase().split(" ") : void 0,
        rv || []
    }
    ,
    error = function(msg, exception, data) {
        return null  == exception && (exception = "Error"),
        {
            errors: [{
                message: msg,
                code: exception,
                data: data
            }]
        }
    }
    ,
    mapError = function(r) {
        var returnObject;
        return r.errors || (returnObject = error("Error: " + r.raw.response.data.status + " - " + r.raw.response.data.statusText, "Request error"),
        r.errors = returnObject.errors),
        r
    }
    ,
    FrameProvider.interpreters.push({
        type: "clear",
        matches: cmdchar + "clear",
        exec: ["Frame", function(Frame) {
            return function(input) {
                return Frame.reset(),
                !0
            }
        }
        ]
    }),
    FrameProvider.interpreters.push({
        type: "style",
        matches: cmdchar + "style",
        exec: ["$rootScope", "exportService", "GraphStyle", function($rootScope, exportService, GraphStyle) {
            return function(input, q) {
                switch (argv(input)[1]) {
                case "reset":
                    GraphStyle.resetToDefault();
                    break;
                case "export":
                    exportService.download("graphstyle.grass", "text/plain;charset=utf-8", GraphStyle.toString());
                    break;
                default:
                    $rootScope.togglePopup("styling")
                }
                return !0
            }
        }
        ]
    }),
    FrameProvider.interpreters.push({
        type: "history",
        matches: cmdchar + "history",
        templateUrl: "views/frame-history.html",
        exec: ["HistoryService", function(HistoryService) {
            return function(input, q) {
                return q.resolve(angular.copy(HistoryService.history)),
                q.promise
            }
        }
        ]
    }),
    FrameProvider.interpreters.push({
        type: "shell",
        templateUrl: "views/frame-rest.html",
        matches: cmdchar + "schema",
        exec: ["Server", function(Server) {
            return function(input, q) {
                return Server.console(input.substr(1)).then(function(r) {
                    var response;
                    return response = r.data[0],
                    response.match("Unknown") ? q.reject(error("Unknown action", null , response)) : q.resolve(response)
                }),
                q.promise
            }
        }
        ]
    }),
    FrameProvider.interpreters.push({
        type: "play",
        templateUrl: "views/frame-guide.html",
        matches: cmdchar + "play",
        exec: ["$http", "$rootScope", "Utils", function($http, $rootScope, Utils) {
            var step_number;
            return step_number = 1,
            function(input, q) {
                var clean_url, host, host_ok, is_remote, topic, url;
                return clean_url = input.slice("play".length + 1).trim(),
                is_remote = !1,
                /^https?:\/\//i.test(clean_url) ? (is_remote = !0,
                url = input.slice("play".length + 2),
                host = url.match(/^(https?:\/\/[^\/]+)/)[1],
                host_ok = Utils.hostIsAllowed(host, $rootScope.kernel["dbms.browser.remote_content_hostname_whitelist"], $rootScope.neo4j.enterpriseEdition)) : (topic = topicalize(clean_url) || "start",
                url = "content/guides/" + topic + ".html"),
                is_remote && !host_ok ? (q.reject({
                    page: url,
                    contents: "",
                    is_remote: is_remote,
                    errors: [{
                        code: "0",
                        message: "Requested host is not whitelisted in dbms.browser.remote_content_hostname_whitelist."
                    }]
                }),
                q.promise) : ($http.get(url).then(function(res) {
                    return q.resolve({
                        contents: res.data,
                        page: url,
                        is_remote: is_remote
                    })
                }, function(r) {
                    return r.is_remote = is_remote,
                    q.reject(r)
                }),
                q.promise)
            }
        }
        ]
    }),
    FrameProvider.interpreters.push({
        type: "play",
        matches: cmdchar + "sysinfo",
        exec: ["Frame", function(Frame) {
            return function(input, q) {
                return Frame.create({
                    input: Settings.cmdchar + "play sysinfo"
                }),
                !0
            }
        }
        ]
    }),
    FrameProvider.interpreters.push({
        type: "help",
        templateUrl: "views/frame-help.html",
        matches: [cmdchar + "help", cmdchar + "man"],
        exec: ["$http", function($http) {
            return function(input, q) {
                var topic, url;
                return topic = topicalize(input.slice("help".length + 1)) || "help",
                url = "content/help/" + topic + ".html",
                $http.get(url).then(function() {
                    return q.resolve({
                        page: url
                    })
                }, function(r) {
                    return q.reject(r)
                }),
                q.promise
            }
        }
        ]
    }),
    FrameProvider.interpreters.push({
        type: "config",
        templateUrl: "views/frame-config.html",
        matches: [cmdchar + "config"],
        exec: ["Settings", "SettingsStore", function(Settings, SettingsStore) {
            return function(input, q) {
                var key, matches, property, ref, value;
                return "reset" === argv(input)[1] ? (SettingsStore.reset(),
                q.resolve(Settings),
                q.promise) : (matches = /^[^\w]*config\s+([^:]+):?([\S\s]+)?$/.exec(input),
                null  != matches ? (ref = [matches[1], matches[2]],
                key = ref[0],
                value = ref[1],
                null  != value ? (value = function() {
                    try {
                        return eval(value)
                    } catch (_error) {}
                }(),
                Settings[key] = value,
                SettingsStore.save()) : value = Settings[key],
                property = {},
                property[key] = value,
                q.resolve(property)) : q.resolve(Settings),
                q.promise)
            }
        }
        ]
    }),
    FrameProvider.interpreters.push({
        type: "http",
        templateUrl: "views/frame-rest.html",
        matches: [cmdchar + "get", cmdchar + "post", cmdchar + "delete", cmdchar + "put", cmdchar + "head"],
        exec: ["Server", function(Server) {
            return function(input, q) {
                var data, e, ref, regex, result, url, verb;
                regex = /^[^\w]*(get|GET|put|PUT|post|POST|delete|DELETE|head|HEAD)\s+(\S+)\s*([\S\s]+)?$/i,
                result = regex.exec(input);
                try {
                    ref = [result[1], result[2], result[3]],
                    verb = ref[0],
                    url = ref[1],
                    data = ref[2]
                } catch (_error) {
                    return e = _error,
                    q.reject(error("Unparseable http request", "Request error")),
                    q.promise
                }
                if (verb = null  != verb ? verb.toLowerCase() : void 0,
                !verb)
                    return q.reject(error("Invalid verb, expected 'GET, PUT, POST, HEAD or DELETE'", "Request error")),
                    q.promise;
                if (!(null  != url ? url.length : void 0) > 0)
                    return q.reject(error("Missing path", "Request error")),
                    q.promise;
                if (("post" === verb || "put" === verb) && data)
                    try {
                        JSON.parse(data.replace(/\n/g, ""))
                    } catch (_error) {
                        return e = _error,
                        q.reject(error("Payload does not seem to be valid data.", "Request payload error")),
                        q.promise
                    }
                return "function" == typeof Server[verb] && Server[verb](url, data).then(function(r) {
                    return q.resolve(r.data)
                }, function(r) {
                    return q.reject(error("Error: " + r.status + " - " + r.statusText, "Request error"))
                }),
                q.promise
            }
        }
        ]
    }),
    FrameProvider.interpreters.push({
        type: "auth",
        fullscreenable: !1,
        templateUrl: "views/frame-connect.html",
        matches: function(input) {
            var pattern;
            return pattern = new RegExp("^" + cmdchar + "server connect"),
            input.match(pattern)
        },
        exec: ["AuthService", function(AuthService) {
            return function(input, q) {
                return q.resolve()
            }
        }
        ]
    }),
    FrameProvider.interpreters.push({
        type: "auth",
        fullscreenable: !1,
        templateUrl: "views/frame-disconnect.html",
        matches: function(input) {
            var pattern;
            return pattern = new RegExp("^" + cmdchar + "server disconnect"),
            input.match(pattern)
        },
        exec: ["Settings", "AuthService", function(Settings, AuthService) {
            return function(input, q) {
                return q.resolve()
            }
        }
        ]
    }),
    FrameProvider.interpreters.push({
        type: "auth",
        fullscreenable: !1,
        templateUrl: "views/frame-server-status.html",
        matches: function(input) {
            var pattern;
            return pattern = new RegExp("^" + cmdchar + "server status"),
            input.match(pattern)
        },
        exec: ["AuthService", "ConnectionStatusService", function(AuthService, ConnectionStatusService) {
            return function(input, q) {
                return AuthService.hasValidAuthorization().then(function(r) {
                    return q.resolve(r)
                }, function(r) {
                    return q.reject(r)
                }),
                q.promise
            }
        }
        ]
    }),
    FrameProvider.interpreters.push({
        type: "auth",
        fullscreenable: !1,
        templateUrl: "views/frame-change-password.html",
        matches: function(input) {
            var pattern;
            return pattern = new RegExp("^" + cmdchar + "server change-password"),
            input.match(pattern)
        },
        exec: ["AuthService", function(AuthService) {
            return function(input, q) {
                return q.resolve(),
                q.promise
            }
        }
        ]
    }),
    extractGraphModel = function(response, CypherGraphModel) {
        var graph;
        return graph = new neo.models.Graph,
        graph.addNodes(response.nodes.map(CypherGraphModel.convertNode())),
        graph.addRelationships(response.relationships.map(CypherGraphModel.convertRelationship(graph))),
        graph
    }
    ,
    FrameProvider.interpreters.push({
        type: "cypher",
        matches: function(input) {
            var pattern;
            return pattern = new RegExp("^[^" + cmdchar + "]"),
            input.match(pattern)
        },
        templateUrl: "views/frame-cypher.html",
        exec: ["Cypher", "CypherGraphModel", "CypherParser", "Timer", function(Cypher, CypherGraphModel, CypherParser, Timer) {
            return function(input, q) {
                var commit_fn, current_transaction;
                return current_transaction = Cypher.transaction(),
                commit_fn = function() {
                    var timer;
                    return timer = Timer.start(),
                    current_transaction.commit(input).then(function(response) {
                        return response.size > Settings.maxRows && (response.displayedSize = Settings.maxRows),
                        q.resolve({
                            raw: response.raw,
                            responseTime: timer.stop().time(),
                            table: response,
                            graph: extractGraphModel(response, CypherGraphModel)
                        })
                    }, function(r) {
                        return q.reject(mapError(r))
                    })
                }
                ,
                CypherParser.isPeriodicCommit(input) ? commit_fn() : current_transaction.begin().then(function() {
                    return commit_fn()
                }, function(r) {
                    return q.reject(mapError(r))
                }),
                q.promise.transaction = current_transaction,
                q.promise.reject = q.reject,
                q.promise
            }
        }
        ]
    })
}
]),
angular.module("neo4jApp.controllers").controller("LayoutCtrl", ["$rootScope", "$timeout", "$modal", "Editor", "Frame", "GraphStyle", "Utils", "Settings", "UsageDataCollectionService", "ConnectionStatusService", function($scope, $timeout, $modal, Editor, Frame, GraphStyle, Utils, Settings, UsageDataCollectionService, ConnectionStatusService) {
    var _codeMirror, checkCypherContent, dialog, dialogOptions, resizeStream;
    return $scope.settings = Settings,
    _codeMirror = null ,
    dialog = null ,
    dialogOptions = {
        backdrop: !0,
        backdropClick: !0,
        backdropFade: !0,
        dialogFade: !0,
        keyboard: !0,
        size: "lg"
    },
    $scope.theme = Settings.theme,
    $scope.$on("settings:saved", function() {
        return $scope.theme = Settings.theme
    }),
    $scope.toggleMessenger = function() {
        return UsageDataCollectionService.toggleMessenger()
    }
    ,
    $scope.showMessenger = function() {
        return UsageDataCollectionService.showMessenger()
    }
    ,
    $scope.suggestionPlaceholder = "I want to X, tried Y, suggest Z",
    $scope.newMessage = function(suggestion) {
        return UsageDataCollectionService.newMessage(suggestion)
    }
    ,
    $scope.showDoc = function() {
        return Frame.create({
            input: ":play"
        })
    }
    ,
    $scope.showStats = function() {
        return Frame.create({
            input: ":schema"
        })
    }
    ,
    $scope.focusEditor = function(ev) {
        return null  != ev && ev.preventDefault(),
        $timeout(function() {
            return null  != _codeMirror ? _codeMirror.focus() : void 0
        }, 0)
    }
    ,
    $scope.codemirrorLoaded = function(_editor) {
        return _codeMirror = _editor,
        _codeMirror.focus(),
        _codeMirror.on("change", function(cm) {
            return $scope.editorChanged(cm),
            $scope.focusEditor()
        }),
        _codeMirror.on("keyup", function(cm, e) {
            return 27 === e.keyCode ? $timeout(function() {
                return cm.refresh()
            }, 0) : void 0
        }),
        _codeMirror.on("focus", function(cm) {
            return $scope.editorChanged(cm)
        })
    }
    ,
    $scope.isEditorFocused = function() {
        return $(".CodeMirror-focused").length > 0
    }
    ,
    $scope.editor = Editor,
    $scope.editorOneLine = !0,
    $scope.editorChanged = function(codeMirror) {
        return $scope.editorOneLine = 1 === codeMirror.lineCount() && !Editor.document,
        $scope.disableHighlighting = ":" === codeMirror.getValue().trim()[0],
        checkCypherContent(codeMirror)
    }
    ,
    $scope.isDrawerShown = !1,
    $scope.whichDrawer = "",
    $scope.toggleDrawer = function(selectedDrawer, state) {
        return null  == selectedDrawer && (selectedDrawer = ""),
        null  == state && (state = !$scope.isDrawerShown || selectedDrawer !== $scope.whichDrawer),
        $scope.isDrawerShown = state,
        $scope.whichDrawer = selectedDrawer
    }
    ,
    $scope.showingDrawer = function(named) {
        return $scope.isDrawerShown && $scope.whichDrawer === named
    }
    ,
    $scope.$watch("isDrawerShown", function() {
        return $timeout(function() {
            return $scope.$emit("layout.changed", 0)
        })
    }),
    $scope.isPopupShown = !1,
    $scope.togglePopup = function(content) {
        return null  != content ? dialog || (dialogOptions.templateUrl = "popup-" + content,
        dialogOptions.windowClass = "modal-" + content,
        dialog = $modal.open(dialogOptions),
        dialog.result["finally"](function() {
            return $scope.popupContent = null ,
            $scope.isPopupShown = !1,
            dialog = null 
        })) : (null  != dialog && dialog.close(),
        dialog = null ),
        $scope.popupContent = dialog,
        $scope.isPopupShown = !!dialog
    }
    ,
    $scope.globalMouse = function(e) {
        return ConnectionStatusService.restartSessionCountdown()
    }
    ,
    $scope.globalKey = function(e) {
        return resizeStream(),
        ConnectionStatusService.restartSessionCountdown(),
        $scope.isPopupShown && 191 !== e.keyCode ? void 0 : 27 === e.keyCode ? $scope.isPopupShown ? $scope.togglePopup() : Editor.maximize() : 191 !== e.keyCode || $scope.isEditorFocused() ? void 0 : (e.preventDefault(),
        $scope.focusEditor())
    }
    ,
    $scope.$on("visualization:stats", function(event, stats) {
        return $scope.showVizDiagnostics = Settings.showVizDiagnostics,
        Settings.showVizDiagnostics ? $scope.visualizationStats = stats : void 0
    }),
    resizeStream = Utils.debounce(function(ignored) {
        return $scope.editor.maximized ? void 0 : ($("#stream").css({
            top: $(".view-editor").height() + $(".file-bar").height()
        }),
        $scope.$emit("layout.changed"))
    }, 100),
    checkCypherContent = Utils.debounce(function(codeMirror) {
        return $scope.editor.checkCypherContent(codeMirror)
    }, 200),
    $(window).resize(resizeStream),
    navigator.userAgent.match(/Gecko\/[\d\.]+.*Firefox/) && $("html").addClass("browser-firefox"),
    $("body").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
        return resizeStream()
    })
}
]),
angular.module("neo4jApp.directives").directive("keyup", ["$parse", function($parse) {
    return {
        restrict: "A",
        link: function(scope, elem, attr, ctrl) {
            return elem.bind("keyup", function(e) {
                var exp;
                return exp = $parse(attr.keyup),
                scope.$apply(function() {
                    return exp(scope, {
                        $event: e
                    })
                })
            })
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("onEnter", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attr, ctrl) {
            return elem.bind("keydown", function(e) {
                var code, element;
                return code = e.which || e.keyCode,
                13 === code ? (e.preventDefault(),
                "focus" === attr.onEnter ? (element = document.getElementById(attr.onEnterTargetId),
                element.focus()) : "click" === attr.onEnter ? (element = document.getElementById(attr.onEnterTargetId),
                angular.element(element).triggerHandler("click"),
                elem.select()) : void 0) : void 0
            })
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("mousemove", ["$parse", "Utils", function($parse, Utils) {
    return {
        restrict: "A",
        link: function(scope, elem, attr) {
            var throttle;
            return throttle = Utils.throttle(function(e) {
                var exp;
                return exp = $parse(attr.mousemove),
                scope.$apply(function() {
                    return exp(scope, {
                        $event: e
                    })
                })
            }, 5e3),
            elem.bind("mousemove", function(e) {
                return throttle(e)
            })
        }
    }
}
]),
angular.module("neo4jApp.filters").filter("uncomment", function() {
    return function(input) {
        var row;
        return null  == input ? "" : function() {
            var i, len, ref, results;
            for (ref = input.split("\n"),
            results = [],
            i = 0,
            len = ref.length; len > i; i++)
                row = ref[i],
                0 !== row.indexOf("//") && results.push(row);
            return results
        }().join("\n")
    }
}),
angular.module("neo4jApp.filters").filter("autotitle", function() {
    return function(input) {
        var firstRow;
        return null  == input ? "" : (firstRow = input.split("\n")[0],
        0 === firstRow.indexOf("//") ? firstRow.slice(2) : input)
    }
}),
angular.module("neo4jApp.filters").filter("basename", function() {
    return function(input) {
        return null  == input ? "" : input.replace(/\\/g, "/").replace(/.*\//, "")
    }
}),
angular.module("neo4jApp.filters").filter("dirname", function() {
    return function(input) {
        return null  == input ? "" : input.replace(/\\/g, "/").replace(/\/[^\/]*$/, "")
    }
}),
angular.module("neo4jApp.filters").filter("neo4jdoc", function() {
    return function(input) {
        return null  == input ? "" : input.indexOf("SNAPSHOT") > 0 ? "snapshot" : input
    }
}),
angular.module("neo4jApp.filters").filter("humanReadableBytes", [function() {
    return function(input) {
        var i, len, number, unit, units;
        if (number = +input,
        !isFinite(number))
            return "-";
        if (1024 > number)
            return number + " B";
        for (number /= 1024,
        units = ["KiB", "MiB", "GiB", "TiB"],
        i = 0,
        len = units.length; len > i; i++) {
            if (unit = units[i],
            1024 > number)
                return number.toFixed(2) + " " + unit;
            number /= 1024
        }
        return number.toFixed(2) + " PiB"
    }
}
]);
var bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments)
    }
}
;
angular.module("neo4jApp.services").factory("Cypher", ["$q", "$rootScope", "Server", "UsageDataCollectionService", function($q, $rootScope, Server, UDC) {
    var CypherResult, CypherService, CypherTransaction, parseId, promiseResult;
    return parseId = function(resource) {
        var id;
        return null  == resource && (resource = ""),
        id = resource.split("/").slice(-2, -1),
        parseInt(id, 10)
    }
    ,
    CypherResult = function() {
        function CypherResult(_response) {
            var base, j, k, l, len, len1, len2, node, ref, ref1, ref2, ref3, relationship, row;
            if (this._response = null  != _response ? _response : {},
            this.nodes = [],
            this.other = [],
            this.relationships = [],
            this.size = 0,
            this.displayedSize = 0,
            this.stats = {},
            this.size = (null  != (ref = this._response.data) ? ref.length : void 0) || 0,
            this.displayedSize = this.size,
            this._response.stats && this._setStats(this._response.stats),
            null  == (base = this._response).data && (base.data = []),
            null  == this._response.data)
                return this._response;
            for (ref1 = this._response.data,
            j = 0,
            len = ref1.length; len > j; j++) {
                for (row = ref1[j],
                ref2 = row.graph.nodes,
                k = 0,
                len1 = ref2.length; len1 > k; k++)
                    node = ref2[k],
                    this.nodes.push(node);
                for (ref3 = row.graph.relationships,
                l = 0,
                len2 = ref3.length; len2 > l; l++)
                    relationship = ref3[l],
                    this.relationships.push(relationship)
            }
            this._response
        }
        return CypherResult.prototype.response = function() {
            return this._response
        }
        ,
        CypherResult.prototype.rows = function() {
            var cell, entry, j, len, ref, results1;
            for (ref = this._response.data,
            results1 = [],
            j = 0,
            len = ref.length; len > j; j++)
                entry = ref[j],
                results1.push(function() {
                    var k, len1, ref1, results2;
                    for (ref1 = entry.row,
                    results2 = [],
                    k = 0,
                    len1 = ref1.length; len1 > k; k++)
                        cell = ref1[k],
                        null  == cell ? results2.push(null ) : null  != cell.self ? results2.push(angular.copy(cell.data)) : results2.push(angular.copy(cell));
                    return results2
                }());
            return results1
        }
        ,
        CypherResult.prototype.columns = function() {
            return this._response.columns
        }
        ,
        CypherResult.prototype.isTextOnly = function() {
            return 0 === this.nodes.length && 0 === this.relationships.length
        }
        ,
        CypherResult.prototype._setStats = function(stats) {
            return this.stats = stats,
            null  != this.stats && (this.stats.labels_added > 0 || this.stats.labels_removed > 0) ? $rootScope.$broadcast("db:changed:labels", angular.copy(this.stats)) : void 0
        }
        ,
        CypherResult
    }(),
    promiseResult = function(promise) {
        var q;
        return q = $q.defer(),
        promise.then(function(_this) {
            return function(r) {
                var partResult, raw, results;
                return raw = {
                    request: r.config,
                    response: {
                        headers: r.headers(),
                        data: r.data
                    }
                },
                raw.request.status = r.status,
                r ? r.data.errors && r.data.errors.length > 0 ? q.reject({
                    errors: r.data.errors,
                    raw: raw
                }) : (results = [],
                partResult = new CypherResult(r.data.results[0] || {}),
                partResult.raw = raw,
                results.push(partResult),
                q.resolve(results[0])) : q.reject({
                    raw: raw
                })
            }
        }(this), function(r) {
            var raw;
            return raw = {
                request: r.config,
                response: {
                    headers: r.headers(),
                    data: r.data
                }
            },
            raw.request.status = r.status,
            q.reject({
                errors: r.errors,
                raw: raw
            })
        }),
        q.promise
    }
    ,
    CypherTransaction = function() {
        function CypherTransaction() {
            var delegate;
            this._reset(),
            this.requests = [],
            delegate = null 
        }
        return CypherTransaction.prototype._requestDone = function(promise) {
            var that;
            return that = this,
            promise.then(function(res) {
                return that.requests.push(res)
            }, function(res) {
                return that.requests.push(res)
            })
        }
        ,
        CypherTransaction.prototype._onSuccess = function() {}
        ,
        CypherTransaction.prototype._onError = function() {}
        ,
        CypherTransaction.prototype._reset = function() {
            return this.id = null 
        }
        ,
        CypherTransaction.prototype.begin = function(query) {
            var parsed_result, rr, statements;
            return statements = query ? [{
                statement: query
            }] : [],
            rr = Server.transaction({
                path: "",
                statements: statements
            }).success(function(_this) {
                return function(r) {
                    var ref;
                    return _this.id = parseId(r.commit),
                    null  != (ref = _this.delegate) && ref.transactionStarted.call(_this.delegate, _this.id, _this),
                    r
                }
            }(this)),
            parsed_result = promiseResult(rr),
            this._requestDone(parsed_result),
            parsed_result
        }
        ,
        CypherTransaction.prototype.execute = function(query) {
            var parsed_result;
            return this.id ? (parsed_result = promiseResult(Server.transaction({
                path: "/" + this.id,
                statements: [{
                    statement: query
                }]
            })),
            this._requestDone(parsed_result),
            parsed_result) : this.begin(query)
        }
        ,
        CypherTransaction.prototype.commit = function(query) {
            var q, res, rr, statements;
            return statements = query ? [{
                statement: query
            }] : [],
            UDC.increment("cypher_attempts"),
            this.id ? (q = $q.defer(),
            rr = Server.transaction({
                path: "/" + this.id + "/commit",
                statements: statements
            }).success(function(_this) {
                return function(r) {
                    var ref;
                    return null  != (ref = _this.delegate) && ref.transactionFinished.call(_this.delegate, _this.id),
                    _this._reset(),
                    q.resolve(r)
                }
            }(this)).error(function(_this) {
                return function(r) {
                    return q.reject(r)
                }
            }(this)),
            res = promiseResult(rr),
            res.then(function() {
                return UDC.increment("cypher_wins")
            }, function() {
                return UDC.increment("cypher_fails")
            }),
            this._requestDone(res),
            res) : (res = promiseResult(Server.transaction({
                path: "/commit",
                statements: statements
            })),
            res.then(function() {
                return UDC.increment("cypher_wins")
            }, function() {
                return UDC.increment("cypher_fails")
            }),
            this._requestDone(res),
            res)
        }
        ,
        CypherTransaction.prototype.rollback = function() {
            var q, server_promise;
            return q = $q.defer(),
            this.id ? (server_promise = Server.transaction({
                method: "DELETE",
                path: "/" + this.id,
                statements: []
            }),
            server_promise.then(function(_this) {
                return function(r) {
                    return _this._reset(),
                    q.resolve(r)
                }
            }(this), function(r) {
                return q.reject(r)
            }),
            q.promise) : (q.resolve({}),
            q.promise)
        }
        ,
        CypherTransaction
    }(),
    CypherService = function() {
        function CypherService() {
            this.rollbackAllTransactions = bind(this.rollbackAllTransactions, this),
            this._active_requests = {}
        }
        return CypherService.prototype.profile = function(query) {
            var q;
            return q = $q.defer(),
            Server.cypher("?profile=true", {
                query: query
            }).success(function(r) {
                return q.resolve(r.plan)
            }).error(q.reject),
            q.promise
        }
        ,
        CypherService.prototype.send = function(query) {
            return this.transaction().commit(query)
        }
        ,
        CypherService.prototype.getTransactionIDs = function() {
            return Object.keys(this._active_requests)
        }
        ,
        CypherService.prototype.transaction = function() {
            var transaction;
            return transaction = new CypherTransaction,
            transaction.delegate = this,
            transaction
        }
        ,
        CypherService.prototype.transactionStarted = function(id, transaction) {
            return this._active_requests[id] = transaction
        }
        ,
        CypherService.prototype.transactionFinished = function(id) {
            return "undefined" !== this._active_requests[id] ? delete this._active_requests[id] : void 0
        }
        ,
        CypherService.prototype.rollbackAllTransactions = function() {
            var ids;
            return ids = this.getTransactionIDs(),
            null  != ids ? ids.forEach(function(d, i) {
                return this._active_requests[i].rollback()
            }) : void 0
        }
        ,
        CypherService
    }(),
    window.Cypher = new CypherService
}
]),
angular.module("neo4jApp.services").factory("Collection", [function() {
    var Collection;
    return Collection = function() {
        function Collection(items, _model) {
            this._model = _model,
            this._reset(),
            null  != items && this.add(items)
        }
        return Collection.prototype.add = function(items, opts) {
            var i, itemsToAdd, j, len;
            if (null  == opts && (opts = {}),
            null  != items) {
                for (items = angular.isArray(items) ? items : [items],
                itemsToAdd = [],
                j = 0,
                len = items.length; len > j; j++)
                    i = items[j],
                    !this._model || i instanceof this._model || (i = new this._model(i)),
                    null  == i || this.get(i) || (this._byId[null  != i.id ? i.id : i] = i,
                    itemsToAdd.push(i));
                return itemsToAdd.length && (angular.isNumber(opts.at) ? [].splice.apply(this.items, [opts.at, 0].concat(itemsToAdd)) : [].push.apply(this.items, itemsToAdd),
                this.length += itemsToAdd.length),
                this
            }
        }
        ,
        Collection.prototype.all = function() {
            return this.items
        }
        ,
        Collection.prototype.first = function() {
            return this.items[0]
        }
        ,
        Collection.prototype.get = function(id) {
            return null  == id ? void 0 : (id = null  != id.id ? id.id : id,
            this._byId[id])
        }
        ,
        Collection.prototype.indexOf = function(item) {
            return this.items.indexOf(item)
        }
        ,
        Collection.prototype.last = function() {
            return this.items[this.length - 1]
        }
        ,
        Collection.prototype.next = function(item) {
            var idx;
            return idx = this.indexOf(item),
            null  != idx ? this.items[++idx] : void 0
        }
        ,
        Collection.prototype.remove = function(items) {
            var index, item, itemsToRemove, j, len;
            for (itemsToRemove = angular.isArray(items) ? items : [items],
            j = 0,
            len = itemsToRemove.length; len > j; j++)
                item = itemsToRemove[j],
                item = this.get(item),
                item && (delete this._byId[item.id],
                index = this.items.indexOf(item),
                this.items.splice(index, 1),
                this.length--);
            return items
        }
        ,
        Collection.prototype.reset = function(items) {
            return this._reset(),
            this.add(items)
        }
        ,
        Collection.prototype.pluck = function(attr) {
            var i, j, len, ref, results;
            if (!angular.isString(attr))
                return void 0;
            for (ref = this.items,
            results = [],
            j = 0,
            len = ref.length; len > j; j++)
                i = ref[j],
                results.push(i[attr]);
            return results
        }
        ,
        Collection.prototype.prev = function(item) {
            var idx;
            return idx = this.indexOf(item),
            null  != idx ? this.items[--idx] : void 0
        }
        ,
        Collection.prototype.pop = function() {
            var item;
            return item = this.items.pop(),
            this.length = this.items.length,
            item
        }
        ,
        Collection.prototype.push = function(items) {
            var itemsToPush;
            return itemsToPush = angular.isArray(items) ? items : [items],
            this.items.push.apply(this.items, itemsToPush),
            this.length = this.items.length,
            this
        }
        ,
        Collection.prototype.where = function(attrs) {
            var item, j, key, len, matches, numAttrs, ref, rv, val;
            if (rv = [],
            !angular.isObject(attrs))
                return rv;
            for (numAttrs = Object.keys(attrs).length,
            ref = this.items,
            j = 0,
            len = ref.length; len > j; j++) {
                item = ref[j],
                matches = 0;
                for (key in attrs)
                    val = attrs[key],
                    item[key] === val && matches++;
                numAttrs === matches && rv.push(item)
            }
            return rv
        }
        ,
        Collection.prototype.save = function() {
            return this._model || angular.isFunction(this._model.save) ? (this._model.save(this.all()),
            this) : void 0
        }
        ,
        Collection.prototype.fetch = function() {
            return this._model || angular.isFunction(this._model.fetch) ? (this.reset(this._model.fetch()),
            this) : void 0
        }
        ,
        Collection.prototype._reset = function() {
            return this.items = [],
            this._byId = {},
            this.length = 0
        }
        ,
        Collection
    }()
}
]),
angular.module("neo4jApp.services").factory("Timer", function() {
    var Timer, TimerService, currentTime;
    return currentTime = function() {
        return (new Date).getTime()
    }
    ,
    Timer = function() {
        function Timer() {
            this._start = null ,
            this._end = null 
        }
        return Timer.prototype.isRunning = function() {
            return null  != this._start
        }
        ,
        Timer.prototype.start = function() {
            return null  == this._start && (this._start = currentTime()),
            this
        }
        ,
        Timer.prototype.started = function() {
            return this._start
        }
        ,
        Timer.prototype.stop = function() {
            return null  == this._end && (this._end = currentTime()),
            this
        }
        ,
        Timer.prototype.stopped = function() {
            return this._end
        }
        ,
        Timer.prototype.time = function() {
            var end;
            return null  == this._start ? 0 : (end = this._end || currentTime(),
            end - this._start)
        }
        ,
        Timer
    }(),
    new (TimerService = function() {
        function TimerService() {}
        var timers;
        return timers = {},
        TimerService.prototype["new"] = function(name) {
            return null  == name && (name = "default"),
            timers[name] = new Timer
        }
        ,
        TimerService.prototype.start = function(name) {
            var timer;
            return null  == name && (name = "default"),
            timer = this["new"](name),
            timer.start()
        }
        ,
        TimerService.prototype.stop = function(name) {
            return null  == name && (name = "default"),
            null  == timers[name] ? void 0 : timers[name].stop()
        }
        ,
        TimerService.prototype.currentTime = currentTime,
        TimerService
    }())
}),
angular.module("neo4jApp.directives").directive("focusOn", ["$timeout", function($timeout) {
    return function(scope, element, attrs) {
        return scope.$watch(attrs.focusOn, function(val) {
            return val ? $timeout(function() {
                return element[0].focus()
            }, 0, !1) : void 0
        })
    }
}
]),
angular.module("neo.csv", []).factory("CSV", [function() {
    var Serializer;
    return Serializer = neo.serializer,
    {
        Serializer: Serializer
    }
}
]),
angular.module("neo4jApp").directive("resizable", [function() {
    return {
        controller: function($scope) {
            var startCallbacks, stopCallbacks;
            return startCallbacks = [],
            stopCallbacks = [],
            this.onStart = function(func) {
                return startCallbacks.push(func)
            }
            ,
            this.onStop = function(func) {
                return stopCallbacks.push(func)
            }
            ,
            this.start = function(amount) {
                var callback, i, len, results;
                for (results = [],
                i = 0,
                len = startCallbacks.length; len > i; i++)
                    callback = startCallbacks[i],
                    results.push(callback.call(void 0, amount));
                return results
            }
            ,
            this.stop = function() {
                var callback, i, len, results;
                for (results = [],
                i = 0,
                len = stopCallbacks.length; len > i; i++)
                    callback = stopCallbacks[i],
                    results.push(callback.call(void 0));
                return results
            }
        }
    }
}
]).directive("resize", function() {
    return {
        require: "^resizable",
        link: function(scope, element, attrs, resizableCtrl) {
            var initialValue, property;
            return property = attrs.resize,
            initialValue = +element.css(property).slice(0, -2),
            resizableCtrl.onStart(function(amount) {
                return element[0].style[property] = initialValue + amount + "px"
            }),
            resizableCtrl.onStop(function() {
                return initialValue = +element[0].style[property].slice(0, -2)
            })
        }
    }
}).directive("resizeChild", function() {
    return {
        require: "^resizable",
        link: function(scope, element, attrs, resizableCtrl) {
            var child, initialValue, property;
            return attrs = scope.$eval(attrs.resizeChild),
            child = Object.keys(attrs)[0],
            property = attrs[child],
            initialValue = null ,
            resizableCtrl.onStart(function(amount) {
                return initialValue || (initialValue = +$(child, element).css(property).slice(0, -2)),
                $(child, element).css(property, initialValue + amount + "px")
            }),
            resizableCtrl.onStop(function() {
                return initialValue = +element[0].style[property].slice(0, -2)
            })
        }
    }
}).directive("handle", function() {
    return {
        require: "^resizable",
        link: function(scope, element, attrs, resizableCtrl) {
            return element.bind("mousedown", function(e) {
                var initialValue, lastValue;
                return e.preventDefault(),
                initialValue = lastValue = e.clientY,
                angular.element(document).bind("mousemove", function(e) {
                    var mousePos, newValue;
                    return mousePos = e.clientY,
                    newValue = element[0].clientHeight - (lastValue - mousePos),
                    lastValue = mousePos,
                    resizableCtrl.start(lastValue - initialValue)
                }),
                angular.element(document).bind("mouseup", function() {
                    return angular.element(document).unbind("mousemove"),
                    angular.element(document).unbind("mouseup"),
                    resizableCtrl.stop()
                })
            })
        }
    }
}),
angular.module("neo4jApp.directives").controller("fileUpload", ["$attrs", "$parse", "$rootScope", "$scope", "$window", function($attrs, $parse, $rootScope, $scope, $window) {
    var INITIAL_STATUS, getFirstFileFromEvent, onUploadSuccess, scopeApply;
    return INITIAL_STATUS = $attrs.message || "Drop Cypher script file to import",
    $scope.status = INITIAL_STATUS,
    onUploadSuccess = function(content, name) {
        var exp;
        return $attrs.upload ? (exp = $parse($attrs.upload),
        $scope.$apply(function() {
            return exp($scope, {
                $content: content,
                $name: name
            })
        })) : void 0
    }
    ,
    getFirstFileFromEvent = function(evt) {
        var files;
        return files = evt.originalEvent.dataTransfer.files,
        files[0]
    }
    ,
    scopeApply = function(fn) {
        return function() {
            return fn.apply($scope, arguments),
            $scope.$apply()
        }
    }
    ,
    this.onDragEnter = scopeApply(function(evt) {
        return getFirstFileFromEvent(evt),
        $scope.active = !0
    }),
    this.onDragLeave = scopeApply(function() {
        return $scope.active = !1
    }),
    this.onDrop = scopeApply(function(_this) {
        return function(evt) {
            var file, reg;
            return _this.preventDefault(evt),
            $scope.active = !1,
            file = getFirstFileFromEvent(evt),
            !file || $attrs.type && file.type.indexOf($attrs.type) < 0 ? void 0 : $attrs.extension && (reg = new RegExp($attrs.extension + "$"),
            !file.name.match(reg)) ? alert("Only ." + $attrs.extension + " files are supported") : ($scope.status = "Uploading...",
            _this.readFile(file))
        }
    }(this)),
    this.preventDefault = function(evt) {
        return evt.stopPropagation(),
        evt.preventDefault()
    }
    ,
    this.readFile = function(file) {
        var reader;
        return reader = new $window.FileReader,
        reader.onerror = scopeApply(function(evt) {
            return $scope.status = function() {
                switch (evt.target.error.code) {
                case 1:
                    return file.name + " not found.";
                case 2:
                    return file.name + " has changed on disk, please re-try.";
                case 3:
                    return "Upload cancelled.";
                case 4:
                    return "Cannot read " + file.name;
                case 5:
                    return "File too large for browser to upload."
                }
            }(),
            $rootScope.$broadcast("fileUpload:error", $scope.error)
        }),
        reader.onloadend = scopeApply(function(evt) {
            var data;
            return data = evt.target.result,
            data = data.split("base64,")[1],
            onUploadSuccess($window.atob(data), file.name),
            $scope.status = INITIAL_STATUS
        }),
        reader.readAsDataURL(file)
    }
    ,
    this
}
]),
angular.module("neo4jApp.directives").directive("fileUpload", ["$window", function($window) {
    return {
        controller: "fileUpload",
        restrict: "E",
        scope: "@",
        transclude: !0,
        template: '<div class="file-drop-area" ng-class="{active: active}" ng-bind="status"></div>',
        link: function(scope, element, attrs, ctrl) {
            return $window.FileReader && $window.atob ? (element.bind("dragenter", ctrl.onDragEnter),
            element.bind("dragleave", ctrl.onDragLeave),
            element.bind("drop", ctrl.onDrop),
            element.bind("dragover", ctrl.preventDefault),
            element.bind("drop")) : void 0
        }
    }
}
]);
var hasProp = {}.hasOwnProperty;
angular.module("neo4jApp.directives").directive("neoTable", ["Utils", function(Utils) {
    return {
        replace: !0,
        restrict: "E",
        link: function(scope, elm, attr) {
            var cell2html, emptyMarker, json2html, render, unbind;
            return emptyMarker = function() {
                return "<em>(empty)</em>"
            }
            ,
            unbind = scope.$watch(attr.tableData, function(result) {
                return result ? (elm.html(render(result)),
                unbind()) : void 0
            }),
            json2html = function(obj) {
                var html, k, v;
                if (!Object.keys(obj).length)
                    return emptyMarker();
                html = "<table class='json-object'><tbody>";
                for (k in obj)
                    hasProp.call(obj, k) && (v = obj[k],
                    html += "<tr><th>" + k + "</th><td>" + cell2html(v) + "</td></tr>");
                return html += "</tbody></table>"
            }
            ,
            cell2html = function(cell) {
                var el;
                return angular.isString(cell) ? cell.length ? Utils.escapeHTML(cell) : emptyMarker() : angular.isArray(cell) ? "[" + function() {
                    var j, len, results;
                    for (results = [],
                    j = 0,
                    len = cell.length; len > j; j++)
                        el = cell[j],
                        results.push(cell2html(el));
                    return results
                }().join(", ") + "]" : angular.isObject(cell) ? json2html(cell) : Utils.escapeHTML(JSON.stringify(cell))
            }
            ,
            render = function(result) {
                var cell, col, cols, html, i, j, l, len, len1, len2, m, n, ref, ref1, rows;
                if (rows = result.rows(),
                cols = result.columns() || [],
                !cols.length)
                    return "";
                for (html = "<table class='table data'>",
                html += "<thead><tr>",
                j = 0,
                len = cols.length; len > j; j++)
                    col = cols[j],
                    html += "<th>" + col + "</th>";
                if (html += "</tr></thead>",
                html += "<tbody>",
                result.displayedSize)
                    for (i = l = 0,
                    ref = result.displayedSize; ref >= 0 ? ref > l : l > ref; i = ref >= 0 ? ++l : --l) {
                        for (html += "<tr>",
                        ref1 = rows[i],
                        m = 0,
                        len1 = ref1.length; len1 > m; m++)
                            cell = ref1[m],
                            html += "<td>" + cell2html(cell) + "</td>";
                        html += "</tr>"
                    }
                else {
                    for (html += "<tr>",
                    n = 0,
                    len2 = cols.length; len2 > n; n++)
                        col = cols[n],
                        html += "<td>&nbsp;</td>";
                    html += "</tr>"
                }
                return html += "</tbody>",
                html += "</table>"
            }
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("neoGraph", ["exportService", "SVGUtils", function(exportService, SVGUtils) {
    var dir;
    return dir = {
        require: "ngController",
        restrict: "A"
    },
    dir.link = function(scope, elm, attr, ngCtrl) {
        var unbinds, watchGraphData;
        return unbinds = [],
        watchGraphData = scope.$watch(attr.graphData, function(graph) {
            var listenerExportPNG, listenerExportSVG, listenerResetFrame;
            if (graph)
                return ngCtrl.render(graph),
                listenerExportSVG = scope.$on("export.graph.svg", function() {
                    var svg;
                    return svg = SVGUtils.prepareForExport(elm, dir.getDimensions(ngCtrl.getGraphView())),
                    exportService.download("graph.svg", "image/svg+xml", (new XMLSerializer).serializeToString(svg.node())),
                    svg.remove()
                }),
                listenerExportPNG = scope.$on("export.graph.png", function() {
                    var svg;
                    return svg = SVGUtils.prepareForExport(elm, dir.getDimensions(ngCtrl.getGraphView())),
                    exportService.downloadPNGFromSVG(svg, "graph"),
                    svg.remove()
                }),
                listenerResetFrame = scope.$on("reset.frame.views", function() {
                    var i, len, unbind;
                    for (i = 0,
                    len = unbinds.length; len > i; i++)
                        (unbind = unbinds[i])();
                    return unbinds = [],
                    $(elm[0]).empty(),
                    dir.link(scope, elm, attr, ngCtrl)
                }),
                unbinds.push(listenerExportSVG),
                unbinds.push(listenerExportPNG),
                unbinds.push(listenerResetFrame),
                watchGraphData()
        })
    }
    ,
    dir.getDimensions = function(view) {
        var boundingBox, dimensions;
        return boundingBox = view.boundingBox(),
        dimensions = {
            width: boundingBox.width,
            height: boundingBox.height,
            viewBox: [boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height].join(" ")
        }
    }
    ,
    dir
}
]),
angular.module("neo4jApp.directives").directive("neoPlan", ["exportService", "SVGUtils", function(exportService, SVGUtils) {
    var dir;
    return dir = {
        restrict: "A"
    },
    dir.link = function(scope, elm, attr) {
        var unbinds, watchQueryPlan;
        return unbinds = [],
        watchQueryPlan = scope.$watch(attr.queryPlan, function(originalPlan) {
            var display, listenerExportPNG, listenerExportSVG, listenerResetFrame, plan;
            if (originalPlan)
                return plan = JSON.parse(JSON.stringify(originalPlan)),
                display = function() {
                    return neo.queryPlan(elm.get(0)).display(plan)
                }
                ,
                display(),
                scope.toggleExpanded = function(expanded) {
                    var visit;
                    return visit = function(operator) {
                        var child, i, len, ref, results;
                        if (operator.expanded = expanded,
                        operator.children) {
                            for (ref = operator.children,
                            results = [],
                            i = 0,
                            len = ref.length; len > i; i++)
                                child = ref[i],
                                results.push(visit(child));
                            return results
                        }
                    }
                    ,
                    visit(plan.root),
                    display()
                }
                ,
                listenerExportSVG = scope.$on("export.plan.svg", function() {
                    var svg, svgData;
                    return svg = SVGUtils.prepareForExport(elm, dir.getDimensions(elm.get(0))),
                    svgData = (new XMLSerializer).serializeToString(svg.node()),
                    svgData = svgData.replace(/&nbsp;/g, "&#160;"),
                    exportService.download("plan.svg", "image/svg+xml", svgData),
                    svg.remove()
                }),
                listenerExportPNG = scope.$on("export.plan.png", function() {
                    var svg;
                    return svg = SVGUtils.prepareForExport(elm, dir.getDimensions(elm.get(0))),
                    exportService.downloadPNGFromSVG(svg, "plan"),
                    svg.remove()
                }),
                listenerResetFrame = scope.$on("reset.frame.views", function() {
                    var i, len, unbind;
                    for (i = 0,
                    len = unbinds.length; len > i; i++)
                        (unbind = unbinds[i])();
                    return unbinds = [],
                    $(elm[0]).empty(),
                    dir.link(scope, elm, attr)
                }),
                unbinds.push(listenerExportSVG),
                unbinds.push(listenerExportPNG),
                unbinds.push(listenerResetFrame),
                watchQueryPlan()
        })
    }
    ,
    dir.getDimensions = function(element) {
        var dimensions, node;
        return node = d3.select(element),
        dimensions = {
            width: node.attr("width"),
            height: node.attr("height"),
            viewBox: node.attr("viewBox")
        }
    }
    ,
    dir
}
]),
angular.module("neo4jApp.directives").directive("headersTable", ["Utils", function(Utils) {
    return {
        replace: !0,
        restrict: "E",
        link: function(scope, elm, attr) {
            var render, unbind;
            return unbind = scope.$watch(attr.tableData, function(result) {
                return result ? (elm.html(render(result)),
                unbind()) : void 0
            }),
            render = function(result) {
                var col, cols, html, i, j, len, rows, v;
                if (rows = result,
                cols = ["Header", "Value"],
                !Object.keys(rows).length)
                    return "";
                for (html = "<table class='table data'>",
                html += "<thead><tr>",
                j = 0,
                len = cols.length; len > j; j++)
                    col = cols[j],
                    html += "<th>" + col + "</th>";
                html += "</tr></thead>",
                html += "<tbody>";
                for (i in rows)
                    v = rows[i],
                    html += "<tr>",
                    html += "<td>" + Utils.escapeHTML(i) + "</td>",
                    html += "<td>" + Utils.escapeHTML(v) + "</td>",
                    html += "</tr>";
                return html += "</tbody>",
                html += "</table>"
            }
        }
    }
}
]);
var indexOf = [].indexOf || function(item) {
    for (var i = 0, l = this.length; l > i; i++)
        if (i in this && this[i] === item)
            return i;
    return -1
}
;
angular.module("neo4jApp.directives").directive("generalRequestTable", ["Utils", function(Utils) {
    return {
        replace: !0,
        restrict: "E",
        link: function(scope, elm, attr) {
            var render, unbind;
            return unbind = scope.$watch(attr.tableData, function(result) {
                return result ? (elm.html(render(result)),
                unbind()) : void 0
            }),
            render = function(result) {
                var html, i, map, rows, v;
                if (rows = result,
                map = ["url", "method", "status"],
                !Object.keys(rows).length)
                    return "";
                html = "<table class='table data'>",
                html += "<tbody>";
                for (i in rows)
                    v = rows[i],
                    indexOf.call(map, i) < 0 || (html += "<tr>",
                    html += "<td>" + Utils.escapeHTML(i) + "</td>",
                    html += "<td>" + Utils.escapeHTML(v) + "</td>",
                    html += "</tr>");
                return html += "</tbody>",
                html += "</table>"
            }
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("divToggler", ["Editor", function(Editor) {
    return {
        restrict: "C",
        link: function(scope, element, attrs) {
            return element.click(function(e) {
                return element.next("div").slideToggle(),
                element.toggleClass("collapsed"),
                scope.$apply()
            })
        }
    }
}
]),
angular.module("neo4jApp.controllers").controller("D3GraphCtrl", ["$attrs", "$element", "$parse", "$window", "$rootScope", "$scope", "$interval", "CircularLayout", "GraphExplorer", "GraphStyle", "CypherGraphModel", function($attrs, $element, $parse, $window, $rootScope, $scope, $interval, CircularLayout, GraphExplorer, GraphStyle, CypherGraphModel) {
    var attributeHandlerFactory, checkLimitsReached, graphView, initGraphView, itemMouseOut, itemMouseOver, measureSize, nodeDragToggle, onCanvasClicked, selectItem, selectedItem, toggleSelection;
    return graphView = null ,
    this.getGraphView = function() {
        return graphView
    }
    ,
    measureSize = function() {
        return {
            width: $element.width(),
            height: $element.height()
        }
    }
    ,
    attributeHandlerFactory = function(attribute) {
        return function(item) {
            var exp;
            return $attrs[attribute] ? (exp = $parse($attrs[attribute]),
            $scope.$apply(function() {
                return exp($scope, {
                    $item: item
                })
            })) : void 0
        }
    }
    ,
    itemMouseOver = attributeHandlerFactory("onItemMouseOver"),
    itemMouseOut = attributeHandlerFactory("onItemMouseOut"),
    nodeDragToggle = attributeHandlerFactory("onNodeDragToggle"),
    onCanvasClicked = attributeHandlerFactory("onCanvasClicked"),
    selectItem = attributeHandlerFactory("onItemClick"),
    selectedItem = null ,
    toggleSelection = function(_this) {
        return function(d) {
            return d === selectedItem ? (null  != d && (d.selected = !1),
            selectedItem = null ) : (null  != selectedItem && (selectedItem.selected = !1),
            null  != d && (d.selected = !0),
            selectedItem = d),
            graphView.update(),
            selectItem(selectedItem)
        }
    }(this),
    $rootScope.$on("layout.changed", function() {
        return null  != graphView ? graphView.resize() : void 0
    }),
    $scope.$watch("displayInternalRelationships", function(displayInternalRelationships) {
        return $rootScope.stickyDisplayInternalRelationships = displayInternalRelationships,
        graphView ? displayInternalRelationships ? GraphExplorer.internalRelationships(graphView.graph, [], graphView.graph.nodes()).then(function() {
            return graphView.update()
        }) : (graphView.graph.pruneInternalRelationships(),
        graphView.update()) : void 0
    }),
    initGraphView = function(graph) {
        var emitStats;
        return graphView = new neo.graphView($element[0],measureSize,graph,GraphStyle),
        $scope.style = GraphStyle.rules,
        $scope.$watch("style", function(_this) {
            return function(val) {
                return val ? graphView.update() : void 0
            }
        }(this), !0),
        graphView.on("nodeClicked", function(d) {
            return d.fixed = !0,
            toggleSelection(d)
        }).on("nodeDblClicked", function(d) {
            return d.expanded ? void 0 : (GraphExplorer.exploreNeighbours(d, graph, $scope.displayInternalRelationships).then(function(_this) {
                return function(neighboursResult) {
                    var linkDistance;
                    return checkLimitsReached(neighboursResult),
                    linkDistance = 60,
                    CircularLayout.layout(graph.nodes(), d, linkDistance),
                    d.expanded = !0,
                    graphView.update()
                }
            }(this)),
            $rootScope.$$phase ? void 0 : $rootScope.$apply())
        }).on("relationshipClicked", function(d) {
            return toggleSelection(d)
        }).on("nodeMouseOver", itemMouseOver).on("nodeMouseOut", itemMouseOut).on("nodeDragToggle", nodeDragToggle).on("relMouseOver", itemMouseOver).on("relMouseOut", itemMouseOut).on("canvasClicked", function() {
            return toggleSelection(null ),
            onCanvasClicked()
        }).on("updated", function() {
            return $rootScope.$broadcast("graph:changed", graph)
        }),
        emitStats = function() {
            var stats;
            return stats = graphView.collectStats(),
            stats.frameCount > 0 ? $rootScope.$emit("visualization:stats", stats) : void 0
        }
        ,
        $interval(emitStats, 1e3),
        graphView.resize(),
        $rootScope.$broadcast("graph:changed", graph)
    }
    ,
    this.render = function(initialGraph) {
        var graph;
        return graph = initialGraph,
        0 !== graph.nodes().length ? $scope.displayInternalRelationships ? GraphExplorer.internalRelationships(graph, [], graph.nodes()).then(function() {
            return initGraphView(graph)
        }) : initGraphView(graph) : void 0
    }
    ,
    checkLimitsReached = function(result) {
        return result.neighbourSize > result.neighbourDisplayedSize ? $scope.$emit("graph:max_neighbour_limit", result) : void 0
    }
    ,
    this
}
]),
angular.module("neo4jApp").directive("editInPlace", ["$parse", "$timeout", function($parse, $timeout) {
    return {
        restrict: "A",
        scope: {
            value: "=editInPlace",
            callback: "&onBlur"
        },
        replace: !0,
        template: '<div ng-class=" {editing: editing} " class="edit-in-place"><form ng-submit="save()"><span ng-bind="value" ng-hide="editing"></span><input ng-show="editing" ng-model="value" class="edit-in-place-input"><div ng-click="edit($event)" ng-hide="editing" class="edit-in-place-trigger"></div></form></div>',
        link: function(scope, element, attrs) {
            var inputElement;
            return scope.editing = !1,
            inputElement = element.find("input"),
            scope.edit = function(e) {
                return e.preventDefault(),
                e.stopPropagation(),
                scope.editing = !0,
                $timeout(function() {
                    return inputElement.focus()
                }, 0, !1)
            }
            ,
            scope.save = function() {
                return scope.editing = !1,
                scope.callback ? scope.callback() : void 0
            }
            ,
            inputElement.bind("blur", function(e) {
                return scope.save(),
                scope.$$phase ? void 0 : scope.$apply()
            })
        }
    }
}
]),
angular.module("neo4jApp.services").factory("Server", ["$http", "$q", "Settings", function($http, $q, Settings) {
    var Server, httpOptions, returnAndUpdate, returnAndUpdateArray, returnAndUpdateObject;
    return httpOptions = {
        timeout: 1e3 * Settings.maxExecutionTime
    },
    returnAndUpdate = function(Type, initial, promise) {
        var rv;
        return rv = initial,
        promise.success(function(r) {
            return angular.isArray(rv) ? (rv.length = 0,
            rv.push.apply(rv, r)) : angular.extend(rv, r)
        }),
        rv
    }
    ,
    returnAndUpdateArray = function(initial, promise) {
        return returnAndUpdate(Array, initial, promise)
    }
    ,
    returnAndUpdateObject = function(initial, promise) {
        return returnAndUpdate(Object, initial, promise)
    }
    ,
    new (Server = function() {
        function Server() {}
        return Server.prototype.options = function(path, options) {
            return null  == path && (path = ""),
            null  == options && (options = {}),
            0 !== path.indexOf(Settings.host) && (path = Settings.host + path),
            options.method = "OPTIONS",
            options.url = path,
            $http(options)
        }
        ,
        Server.prototype.head = function(path, options) {
            return null  == path && (path = ""),
            0 !== path.indexOf(Settings.host) && (path = Settings.host + path),
            $http.head(path, options || httpOptions)
        }
        ,
        Server.prototype["delete"] = function(path, data) {
            return null  == path && (path = ""),
            null  == data && (data = null ),
            0 !== path.indexOf(Settings.host) && (path = Settings.host + path),
            $http["delete"](path, httpOptions)
        }
        ,
        Server.prototype.get = function(path, options) {
            return null  == path && (path = ""),
            0 !== path.indexOf(Settings.host) && (path = Settings.host + path),
            $http.get(path, options || httpOptions)
        }
        ,
        Server.prototype.post = function(path, data) {
            return null  == path && (path = ""),
            0 !== path.indexOf(Settings.host) && (path = Settings.host + path),
            $http.post(path, data, httpOptions)
        }
        ,
        Server.prototype.put = function(path, data) {
            return null  == path && (path = ""),
            0 !== path.indexOf(Settings.host) && (path = Settings.host + path),
            $http.put(path, data, httpOptions)
        }
        ,
        Server.prototype.transaction = function(opts) {
            var i, len, method, path, s, statements;
            for (opts = angular.extend({
                path: "",
                statements: [],
                method: "post"
            }, opts),
            path = opts.path,
            statements = opts.statements,
            method = opts.method,
            path = Settings.endpoint.transaction + path,
            method = method.toLowerCase(),
            i = 0,
            len = statements.length; len > i; i++)
                s = statements[i],
                s.resultDataContents = ["row", "graph"],
                s.includeStats = !0;
            return "function" == typeof this[method] ? this[method](path, {
                statements: statements
            }) : void 0
        }
        ,
        Server.prototype.console = function(command, engine) {
            return null  == engine && (engine = "shell"),
            this.post(Settings.endpoint.console, {
                command: command,
                engine: engine
            })
        }
        ,
        Server.prototype.cypher = function(path, data) {
            return null  == path && (path = ""),
            this.post("" + Settings.endpoint.cypher + path, data)
        }
        ,
        Server.prototype.jmx = function(query) {
            return this.post(Settings.endpoint.jmx, query)
        }
        ,
        Server.prototype.labels = function(initial) {
            return null  == initial && (initial = []),
            returnAndUpdateArray(initial, this.get(Settings.endpoint.rest + "/labels"))
        }
        ,
        Server.prototype.relationships = function(initial) {
            return null  == initial && (initial = []),
            returnAndUpdateArray(initial, this.get(Settings.endpoint.rest + "/relationship/types"))
        }
        ,
        Server.prototype.propertyKeys = function(initial) {
            return null  == initial && (initial = []),
            returnAndUpdateArray(initial, this.get(Settings.endpoint.rest + "/propertykeys"))
        }
        ,
        Server.prototype.info = function(initial) {
            return null  == initial && (initial = {}),
            returnAndUpdateObject(initial, this.get(Settings.endpoint.rest + "/"))
        }
        ,
        Server.prototype.version = function(initial) {
            return null  == initial && (initial = {}),
            returnAndUpdateObject(initial, this.get(Settings.endpoint.version + "/"))
        }
        ,
        Server.prototype.status = function(params) {
            return null  == params && (params = ""),
            this.options(Settings.endpoint.rest + "/", {
                timeout: 1e3 * Settings.heartbeat
            })
        }
        ,
        Server.prototype.log = function(path) {
            return this.get(path).then(function(r) {
                return console.log(r)
            })
        }
        ,
        Server.prototype.hasData = function() {
            var q;
            return q = $q.defer(),
            this.cypher("?profile=true", {
                query: "MATCH (n) RETURN ID(n) LIMIT 1"
            }).success(function(r) {
                return q.resolve(1 === r.plan.rows)
            }).error(q.reject),
            q.promise
        }
        ,
        Server
    }())
}
]),
angular.module("neo4jApp.controllers").config(function($provide, $compileProvider, $filterProvider, $controllerProvider) {
    return $controllerProvider.register("MainCtrl", ["$rootScope", "$window", "Server", "Frame", "AuthService", "ConnectionStatusService", "Settings", "motdService", "UsageDataCollectionService", "Utils", function($scope, $window, Server, Frame, AuthService, ConnectionStatusService, Settings, motdService, UDC, Utils) {
        var license, mapServerConfig, refreshAllowOutgoingConnections, refreshPolicies;
        return $scope.kernel = {},
        $scope.refresh = function() {
            return $scope.unauthorized || $scope.offline ? "" : ($scope.labels = Server.labels($scope.labels),
            $scope.relationships = Server.relationships($scope.relationships),
            $scope.propertyKeys = Server.propertyKeys($scope.propertyKeys),
            $scope.server = Server.info($scope.server),
            $scope.version = Server.version($scope.version),
            $scope.host = $window.location.host,
            Server.jmx(["org.neo4j:instance=kernel#0,name=Configuration", "org.neo4j:instance=kernel#0,name=Kernel", "org.neo4j:instance=kernel#0,name=Store file sizes"]).success(function(response) {
                var a, allow_connections, i, j, len, len1, r, ref, ref1;
                for (i = 0,
                len = response.length; len > i; i++)
                    for (r = response[i],
                    ref = r.attributes,
                    j = 0,
                    len1 = ref.length; len1 > j; j++)
                        a = ref[j],
                        $scope.kernel[a.name] = a.value;
                return UDC.set("store_id", $scope.kernel.StoreId),
                UDC.set("neo4j_version", $scope.server.neo4j_version),
                refreshPolicies($scope.kernel["dbms.browser.store_credentials"], $scope.kernel["dbms.browser.credential_timeout"]),
                allow_connections = null  != (ref1 = [!1, "false", "no"].indexOf($scope.kernel["dbms.security.allow_outgoing_browser_connections"]) < 0) ? ref1 : {
                    yes: !1
                },
                refreshAllowOutgoingConnections(allow_connections)
            }).error(function(r) {
                return $scope.kernel = {}
            }))
        }
        ,
        refreshAllowOutgoingConnections = function(allow_connections) {
            return $scope.neo4j.config.allow_outgoing_browser_connections !== allow_connections ? (allow_connections = $scope.neo4j.enterpriseEdition ? allow_connections : !0,
            mapServerConfig("allow_outgoing_browser_connections", allow_connections),
            allow_connections ? ($scope.motd.refresh(),
            UDC.loadUDC()) : allow_connections ? void 0 : UDC.unloadUDC()) : void 0
        }
        ,
        refreshPolicies = function(storeCredentials, credentialTimeout) {
            var ref;
            return null  == storeCredentials && (storeCredentials = !0),
            null  == credentialTimeout && (credentialTimeout = 0),
            storeCredentials = null  != (ref = [!1, "false", "no"].indexOf(storeCredentials) < 0) ? ref : {
                yes: !1
            },
            credentialTimeout = Utils.parseTimeMillis(credentialTimeout) / 1e3,
            ConnectionStatusService.setAuthPolicies({
                storeCredentials: storeCredentials,
                credentialTimeout: credentialTimeout
            })
        }
        ,
        mapServerConfig = function(key, val) {
            return $scope.neo4j.config[key] !== val ? $scope.neo4j.config[key] = val : void 0
        }
        ,
        $scope.identity = angular.identity,
        $scope.motd = motdService,
        $scope.auth_service = AuthService,
        $scope.neo4j = license = {
            type: "GPLv3",
            url: "http://www.gnu.org/licenses/gpl.html",
            edition: "community",
            enterpriseEdition: !1
        },
        $scope.neo4j.config = {},
        $scope.$on("db:changed:labels", $scope.refresh),
        $scope.today = Date.now(),
        $scope.cmdchar = Settings.cmdchar,
        $scope.goodBrowser = !/msie/.test(navigator.userAgent.toLowerCase()),
        $scope.$watch("offline", function(serverIsOffline) {
            return null  != serverIsOffline ? serverIsOffline ? $scope.errorMessage = motdService.pickRandomlyFromChoiceName("disconnected") : UDC.ping("connect") : void 0
        }),
        $scope.$on("auth:status_updated", function(e, is_connected) {
            return $scope.check(),
            is_connected ? ConnectionStatusService.setSessionStartTimer(new Date) : void 0
        }),
        AuthService.hasValidAuthorization().then(function() {
            return Frame.create({
                input: "" + Settings.initCmd
            })
        }, function(r) {
            return 404 === r.status ? Frame.create({
                input: "" + Settings.initCmd
            }) : $scope.$emit("auth:disconnected")
        }),
        $scope.$on("auth:disconnected", function() {
            return Frame.createOne({
                input: Settings.cmdchar + "server connect"
            })
        }),
        $scope.$watch("version", function(val) {
            return val ? ($scope.neo4j.version = val.version,
            $scope.neo4j.edition = val.edition,
            $scope.neo4j.enterpriseEdition = "enterprise" === val.edition,
            $scope.$emit("db:updated:edition", val.edition),
            val.version ? $scope.motd.setCallToActionVersion(val.version) : void 0) : ""
        }, !0)
    }
    ])
}).run(["$rootScope", "Editor", function($scope, Editor) {
    return $scope.unauthorized = !0
}
]);
var hasProp = {}.hasOwnProperty;
angular.module("neo4jApp.services").factory("Node", [function() {
    var Node;
    return Node = function() {
        function Node(id, labels, properties) {
            var key, value;
            this.id = id,
            this.labels = labels,
            this.propertyMap = properties,
            this.propertyList = function() {
                var results;
                results = [];
                for (key in properties)
                    hasProp.call(properties, key) && (value = properties[key],
                    results.push({
                        key: key,
                        value: value
                    }));
                return results
            }()
        }
        return Node.prototype.toJSON = function() {
            return this.propertyMap
        }
        ,
        Node.prototype.isNode = !0,
        Node.prototype.isRelationship = !1,
        Node
    }()
}
]);
var hasProp = {}.hasOwnProperty;
angular.module("neo4jApp.services").factory("Relationship", [function() {
    var Relationship;
    return Relationship = function() {
        function Relationship(id, source, target, type, properties) {
            var key, value;
            this.id = id,
            this.source = source,
            this.target = target,
            this.type = type,
            this.propertyMap = properties,
            this.propertyList = function() {
                var ref, results;
                ref = this.propertyMap,
                results = [];
                for (key in ref)
                    hasProp.call(ref, key) && (value = ref[key],
                    results.push({
                        key: key,
                        value: value
                    }));
                return results
            }
            .call(this)
        }
        return Relationship.prototype.toJSON = function() {
            return this.propertyMap
        }
        ,
        Relationship.prototype.isNode = !1,
        Relationship.prototype.isRelationship = !0,
        Relationship
    }()
}
]),
angular.module("neo4jApp.controllers").controller("JMXCtrl", ["$scope", "Server", function($scope, Server) {
    var parseName, parseSection;
    return parseName = function(str) {
        return str.split("=").pop()
    }
    ,
    parseSection = function(str) {
        return str.split("/")[0]
    }
    ,
    Server.jmx(["*:*"]).success(function(response) {
        var i, len, r, section, sections;
        for (sections = {},
        i = 0,
        len = response.length; len > i; i++)
            r = response[i],
            r.name = parseName(r.name),
            section = parseSection(r.url),
            null  == sections[section] && (sections[section] = {}),
            sections[section][r.name] = r;
        return $scope.sections = sections,
        $scope.currentItem = sections[section][r.name]
    }),
    $scope.stringify = function(val) {
        return angular.isString(val) ? val : JSON.stringify(val, null , " ")
    }
    ,
    $scope.selectItem = function(section, name) {
        return $scope.currentItem = $scope.sections[section][name]
    }
    ,
    $scope.simpleValues = function(item) {
        return !$scope.objectValues(item)
    }
    ,
    $scope.objectValues = function(item) {
        return angular.isObject(item.value)
    }
}
]),
angular.module("neo4jApp.services").factory("GraphExplorer", ["$q", "Cypher", "CypherGraphModel", "Settings", function($q, Cypher, CypherGraphModel, Settings) {
    return {
        exploreNeighbours: function(node, graph, withInternalRelationships) {
            var currentNeighbourIds, q, returnObj;
            return q = $q.defer(),
            currentNeighbourIds = graph.findNodeNeighbourIds(node.id),
            returnObj = {
                neighbourDisplayedSize: currentNeighbourIds.length,
                neighbourSize: currentNeighbourIds.length
            },
            returnObj.neighbourDisplayedSize >= Settings.maxNeighbours ? (this.findNumberOfNeighbours(node).then(function(_this) {
                return function(numberNeighboursResult) {
                    var ref;
                    return returnObj.neighbourSize = null  != (ref = numberNeighboursResult._response.data[0]) ? ref.row[0] : void 0,
                    q.resolve(returnObj)
                }
            }(this)),
            q.promise) : (this.findNeighbours(node, currentNeighbourIds).then(function(_this) {
                return function(neighboursResult) {
                    var ref;
                    return graph.addNodes(neighboursResult.nodes.map(CypherGraphModel.convertNode())),
                    graph.addRelationships(neighboursResult.relationships.map(CypherGraphModel.convertRelationship(graph))),
                    currentNeighbourIds = graph.findNodeNeighbourIds(node.id),
                    returnObj = {
                        neighbourDisplayedSize: currentNeighbourIds.length,
                        neighbourSize: null  != (ref = neighboursResult._response.data[0]) ? ref.row[1] : void 0
                    },
                    withInternalRelationships ? _this.internalRelationships(graph, graph.nodes(), neighboursResult.nodes).then(function() {
                        return q.resolve(returnObj)
                    }) : q.resolve(returnObj)
                }
            }(this)),
            q.promise)
        },
        findNeighbours: function(node, currentNeighbourIds) {
            var q;
            return q = $q.defer(),
            Cypher.transaction().commit("MATCH path = (a)--(o)\nWHERE id(a)= " + node.id + "\nAND NOT (id(o) IN[" + currentNeighbourIds.join(",") + "])\nRETURN path, size((a)--()) as c\nORDER BY id(o)\nLIMIT " + (Settings.maxNeighbours - currentNeighbourIds.length)).then(q.resolve),
            q.promise
        },
        findNumberOfNeighbours: function(node) {
            var q;
            return q = $q.defer(),
            Cypher.transaction().commit("MATCH (a)\nWHERE id(a)= " + node.id + "\nRETURN size((a)--()) as c").then(q.resolve),
            q.promise
        },
        internalRelationships: function(graph, existingNodes, newNodes) {
            var existingNodeIds, newNodeIds, q;
            return q = $q.defer(),
            0 === newNodes.length ? (q.resolve(),
            q.promise) : (newNodeIds = newNodes.map(function(node) {
                return node.id
            }),
            existingNodeIds = existingNodes.map(function(node) {
                return node.id
            }).concat(newNodeIds),
            Cypher.transaction().commit("MATCH a -[r]- b WHERE id(a) IN[" + existingNodeIds.join(",") + "]\nAND id(b) IN[" + newNodeIds.join(",") + "]\nRETURN r;").then(function(_this) {
                return function(result) {
                    return graph.addInternalRelationships(result.relationships.map(CypherGraphModel.convertRelationship(graph))),
                    q.resolve()
                }
            }(this)),
            q.promise)
        }
    }
}
]),
angular.module("neo4jApp.services").provider("GraphRenderer", [function() {
    return this.Renderer = function() {
        function Renderer(opts) {
            null  == opts && (opts = {}),
            angular.extend(this, opts),
            null  == this.onGraphChange && (this.onGraphChange = function() {}
            ),
            null  == this.onTick && (this.onTick = function() {}
            )
        }
        return Renderer
    }(),
    this.nodeRenderers = [],
    this.relationshipRenderers = [],
    this.$get = function() {
        return {
            nodeRenderers: this.nodeRenderers,
            relationshipRenderers: this.relationshipRenderers,
            Renderer: this.Renderer
        }
    }
    ,
    this
}
]),
angular.module("neo4jApp.services").provider("GraphStyle", [function() {
    var GraphStyle, Selector, StyleElement, StyleRule, provider;
    return provider = this,
    this.defaultStyle = {
        node: {
            diameter: "50px",
            color: "#A5ABB6",
            "border-color": "#9AA1AC",
            "border-width": "2px",
            "text-color-internal": "#FFFFFF",
            "font-size": "10px"
        },
        relationship: {
            color: "#A5ABB6",
            "shaft-width": "1px",
            "font-size": "8px",
            padding: "3px",
            "text-color-external": "#000000",
            "text-color-internal": "#FFFFFF",
            caption: "<type>"
        }
    },
    this.defaultSizes = [{
        diameter: "10px"
    }, {
        diameter: "20px"
    }, {
        diameter: "50px"
    }, {
        diameter: "65px"
    }, {
        diameter: "80px"
    }],
    this.defaultArrayWidths = [{
        "shaft-width": "1px"
    }, {
        "shaft-width": "2px"
    }, {
        "shaft-width": "3px"
    }, {
        "shaft-width": "5px"
    }, {
        "shaft-width": "8px"
    }, {
        "shaft-width": "13px"
    }, {
        "shaft-width": "25px"
    }, {
        "shaft-width": "38px"
    }],
    this.defaultColors = [{
        color: "#A5ABB6",
        "border-color": "#9AA1AC",
        "text-color-internal": "#FFFFFF"
    }, {
        color: "#68BDF6",
        "border-color": "#5CA8DB",
        "text-color-internal": "#FFFFFF"
    }, {
        color: "#6DCE9E",
        "border-color": "#60B58B",
        "text-color-internal": "#FFFFFF"
    }, {
        color: "#FF756E",
        "border-color": "#E06760",
        "text-color-internal": "#FFFFFF"
    }, {
        color: "#DE9BF9",
        "border-color": "#BF85D6",
        "text-color-internal": "#FFFFFF"
    }, {
        color: "#FB95AF",
        "border-color": "#E0849B",
        "text-color-internal": "#FFFFFF"
    }, {
        color: "#FFD86E",
        "border-color": "#EDBA39",
        "text-color-internal": "#604A0E"
    }],
    Selector = function() {
        function Selector(tag1, classes1) {
            this.tag = tag1,
            this.classes = null  != classes1 ? classes1 : []
        }
        return Selector.prototype.toString = function() {
            var classs, i, len, ref, str;
            for (str = this.tag,
            ref = this.classes,
            i = 0,
            len = ref.length; len > i; i++)
                classs = ref[i],
                null  != classs && (str += "." + classs);
            return str
        }
        ,
        Selector
    }(),
    StyleRule = function() {
        function StyleRule(selector1, props1) {
            this.selector = selector1,
            this.props = props1
        }
        return StyleRule.prototype.matches = function(selector) {
            var classs, i, len, ref;
            if (this.selector.tag !== selector.tag)
                return !1;
            for (ref = this.selector.classes,
            i = 0,
            len = ref.length; len > i; i++)
                if (classs = ref[i],
                null  != classs && -1 === selector.classes.indexOf(classs))
                    return !1;
            return !0
        }
        ,
        StyleRule.prototype.matchesExact = function(selector) {
            return this.matches(selector) && this.selector.classes.length === selector.classes.length
        }
        ,
        StyleRule
    }(),
    StyleElement = function() {
        function StyleElement(selector) {
            this.selector = selector,
            this.props = {}
        }
        return StyleElement.prototype.applyRules = function(rules) {
            var i, len, rule;
            for (i = 0,
            len = rules.length; len > i; i++)
                rule = rules[i],
                rule.matches(this.selector) && angular.extend(this.props, rule.props);
            return this
        }
        ,
        StyleElement.prototype.get = function(attr) {
            return this.props[attr] || ""
        }
        ,
        StyleElement
    }(),
    GraphStyle = function() {
        function GraphStyle(storage) {
            var e, ref;
            this.storage = storage,
            this.rules = [];
            try {
                this.loadRules(null  != (ref = this.storage) ? ref.get("grass") : void 0)
            } catch (_error) {
                e = _error
            }
        }
        var parseSelector;
        return GraphStyle.prototype.selector = function(item) {
            return item.isNode ? this.nodeSelector(item) : item.isRelationship ? this.relationshipSelector(item) : void 0
        }
        ,
        GraphStyle.prototype.newSelector = function(tag, classes) {
            return new Selector(tag,classes)
        }
        ,
        GraphStyle.prototype.calculateStyle = function(selector) {
            return new StyleElement(selector).applyRules(this.rules)
        }
        ,
        GraphStyle.prototype.forEntity = function(item) {
            return this.calculateStyle(this.selector(item))
        }
        ,
        GraphStyle.prototype.forNode = function(node) {
            var ref, selector;
            return null  == node && (node = {}),
            selector = this.nodeSelector(node),
            (null  != (ref = node.labels) ? ref.length : void 0) > 0 && this.setDefaultNodeStyling(selector, node),
            this.calculateStyle(selector)
        }
        ,
        GraphStyle.prototype.forRelationship = function(rel) {
            var selector;
            return selector = this.relationshipSelector(rel),
            this.calculateStyle(selector)
        }
        ,
        GraphStyle.prototype.findAvailableDefaultColor = function() {
            var defaultColor, i, j, len, len1, ref, ref1, rule, usedColors;
            for (usedColors = {},
            ref = this.rules,
            i = 0,
            len = ref.length; len > i; i++)
                rule = ref[i],
                null  != rule.props.color && (usedColors[rule.props.color] = !0);
            for (ref1 = provider.defaultColors,
            j = 0,
            len1 = ref1.length; len1 > j; j++)
                if (defaultColor = ref1[j],
                null  == usedColors[defaultColor.color])
                    return defaultColor;
            return provider.defaultColors[0]
        }
        ,
        GraphStyle.prototype.setDefaultNodeStyling = function(selector, item) {
            var defaultCaption, defaultColor, i, len, minimalSelector, ref, rule;
            for (defaultColor = !0,
            defaultCaption = !0,
            ref = this.rules,
            i = 0,
            len = ref.length; len > i; i++)
                rule = ref[i],
                rule.selector.classes.length > 0 && rule.matches(selector) && (rule.props.hasOwnProperty("color") && (defaultColor = !1),
                rule.props.hasOwnProperty("caption") && (defaultCaption = !1));
            return minimalSelector = new Selector(selector.tag,selector.classes.sort().slice(0, 1)),
            defaultColor && this.changeForSelector(minimalSelector, this.findAvailableDefaultColor()),
            defaultCaption ? this.changeForSelector(minimalSelector, this.getDefaultNodeCaption(item)) : void 0
        }
        ,
        GraphStyle.prototype.getDefaultNodeCaption = function(item) {
            var caption_prio_order, default_caption, ref;
            return !item || !(null  != (ref = item.propertyList) ? ref.length : void 0) > 0 ? {
                caption: "<id>"
            } : (caption_prio_order = [/^name$/i, /^title$/i, /^label$/i, /name$/i, /description$/i, /^.+/],
            default_caption = caption_prio_order.reduceRight(function(leading, current) {
                var hits;
                return hits = item.propertyList.filter(function(prop) {
                    return current.test(prop.key)
                }),
                hits.length ? "{" + hits[0].key + "}" : leading
            }, ""),
            default_caption || (default_caption = "<id>"),
            {
                caption: default_caption
            })
        }
        ,
        GraphStyle.prototype.changeForSelector = function(selector, props) {
            var rule;
            return rule = this.findRule(selector),
            null  == rule && (rule = new StyleRule(selector,{}),
            this.rules.push(rule)),
            angular.extend(rule.props, props),
            this.persist(),
            rule
        }
        ,
        GraphStyle.prototype.destroyRule = function(rule) {
            var idx;
            return idx = this.rules.indexOf(rule),
            null  != idx && this.rules.splice(idx, 1),
            this.persist()
        }
        ,
        GraphStyle.prototype.findRule = function(selector) {
            var i, len, r, ref;
            for (ref = this.rules,
            i = 0,
            len = ref.length; len > i; i++)
                if (r = ref[i],
                r.matchesExact(selector))
                    return r;
            return void 0
        }
        ,
        GraphStyle.prototype.nodeSelector = function(node) {
            var classes;
            return null  == node && (node = {}),
            classes = null  != node.labels ? node.labels : [],
            new Selector("node",classes)
        }
        ,
        GraphStyle.prototype.relationshipSelector = function(rel) {
            var classes;
            return null  == rel && (rel = {}),
            classes = null  != rel.type ? [rel.type] : [],
            new Selector("relationship",classes)
        }
        ,
        GraphStyle.prototype.importGrass = function(string) {
            var e, rules;
            try {
                return rules = this.parse(string),
                this.loadRules(rules),
                this.persist()
            } catch (_error) {
                e = _error
            }
        }
        ,
        parseSelector = function(key) {
            var tokens;
            return tokens = key.split("."),
            new Selector(tokens[0],tokens.slice(1))
        }
        ,
        GraphStyle.prototype.loadRules = function(data) {
            var key, props;
            angular.isObject(data) || (data = provider.defaultStyle),
            this.rules.length = 0;
            for (key in data)
                props = data[key],
                this.rules.push(new StyleRule(parseSelector(key),angular.copy(props)));
            return this
        }
        ,
        GraphStyle.prototype.parse = function(string) {
            var c, chars, i, insideProps, insideString, j, k, key, keyword, len, len1, prop, props, ref, ref1, rules, skipThis, v, val;
            for (chars = string.split(""),
            insideString = !1,
            insideProps = !1,
            keyword = "",
            props = "",
            rules = {},
            i = 0,
            len = chars.length; len > i; i++) {
                switch (c = chars[i],
                skipThis = !0,
                c) {
                case "{":
                    insideString ? skipThis = !1 : insideProps = !0;
                    break;
                case "}":
                    insideString ? skipThis = !1 : (insideProps = !1,
                    rules[keyword] = props,
                    keyword = "",
                    props = "");
                    break;
                case "'":
                case '"':
                    insideString ^= !0;
                    break;
                default:
                    skipThis = !1
                }
                skipThis || (insideProps ? props += c : c.match(/[\s\n]/) || (keyword += c))
            }
            for (k in rules)
                for (v = rules[k],
                rules[k] = {},
                ref = v.split(";"),
                j = 0,
                len1 = ref.length; len1 > j; j++)
                    prop = ref[j],
                    ref1 = prop.split(":"),
                    key = ref1[0],
                    val = ref1[1],
                    key && val && (rules[k][null  != key ? key.trim() : void 0] = null  != val ? val.trim() : void 0);
            return rules
        }
        ,
        GraphStyle.prototype.persist = function() {
            var ref;
            return null  != (ref = this.storage) ? ref.add("grass", JSON.stringify(this.toSheet())) : void 0
        }
        ,
        GraphStyle.prototype.resetToDefault = function() {
            return this.loadRules(),
            this.persist()
        }
        ,
        GraphStyle.prototype.toSheet = function() {
            var i, len, ref, rule, sheet;
            for (sheet = {},
            ref = this.rules,
            i = 0,
            len = ref.length; len > i; i++)
                rule = ref[i],
                sheet[rule.selector.toString()] = rule.props;
            return sheet
        }
        ,
        GraphStyle.prototype.toString = function() {
            var i, k, len, r, ref, ref1, str, v;
            for (str = "",
            ref = this.rules,
            i = 0,
            len = ref.length; len > i; i++) {
                r = ref[i],
                str += r.selector.toString() + " {\n",
                ref1 = r.props;
                for (k in ref1)
                    v = ref1[k],
                    "caption" === k && (v = "'" + v + "'"),
                    str += "  " + k + ": " + v + ";\n";
                str += "}\n\n"
            }
            return str
        }
        ,
        GraphStyle.prototype.defaultSizes = function() {
            return provider.defaultSizes
        }
        ,
        GraphStyle.prototype.defaultArrayWidths = function() {
            return provider.defaultArrayWidths
        }
        ,
        GraphStyle.prototype.defaultColors = function() {
            return angular.copy(provider.defaultColors)
        }
        ,
        GraphStyle.prototype.interpolate = function(str, item) {
            var ips;
            return ips = str.replace(/\{([^{}]*)\}/g, function(a, b) {
                var r;
                return r = item.propertyMap[b],
                "object" == typeof r && (r = r.join(", ")),
                "string" == typeof r || "number" == typeof r ? r : ""
            }),
            ips.length < 1 && "{type}" === str && item.isRelationship && (ips = "<type>"),
            ips.length < 1 && "{id}" === str && item.isNode && (ips = "<id>"),
            ips.replace(/^<(id|type)>$/, function(a, b) {
                var r;
                return r = item[b],
                "string" == typeof r || "number" == typeof r ? r : ""
            })
        }
        ,
        GraphStyle
    }(),
    this.$get = ["localStorageService", function(localStorageService) {
        return new GraphStyle(localStorageService)
    }
    ],
    this
}
]),
angular.module("neo4jApp.services").service("GraphGeometry", ["GraphStyle", "TextMeasurement", function(GraphStyle, TextMeasurent) {
    var captionFitsInsideArrowShaftWidth, formatNodeCaptions, layoutRelationships, measureRelationshipCaption, measureRelationshipCaptions, setNodeRadii, shortenCaption, square;
    return square = function(distance) {
        return distance * distance
    }
    ,
    setNodeRadii = function(nodes) {
        var j, len, node, results;
        for (results = [],
        j = 0,
        len = nodes.length; len > j; j++)
            node = nodes[j],
            results.push(node.radius = parseFloat(GraphStyle.forNode(node).get("diameter")) / 2);
        return results
    }
    ,
    formatNodeCaptions = function(nodes) {
        var captionText, i, j, k, len, lines, node, ref, results, template, words;
        for (results = [],
        j = 0,
        len = nodes.length; len > j; j++) {
            for (node = nodes[j],
            template = GraphStyle.forNode(node).get("caption"),
            captionText = GraphStyle.interpolate(template, node),
            words = captionText.split(" "),
            lines = [],
            i = k = 0,
            ref = words.length - 1; ref >= 0 ? ref >= k : k >= ref; i = ref >= 0 ? ++k : --k)
                lines.push({
                    node: node,
                    text: words[i],
                    baseline: 10 * (1 + i - words.length / 2)
                });
            results.push(node.caption = lines)
        }
        return results
    }
    ,
    measureRelationshipCaption = function(relationship, caption) {
        var fontFamily, fontSize, padding;
        return fontFamily = "sans-serif",
        fontSize = parseFloat(GraphStyle.forRelationship(relationship).get("font-size")),
        padding = parseFloat(GraphStyle.forRelationship(relationship).get("padding")),
        TextMeasurent.measure(caption, fontFamily, fontSize) + 2 * padding
    }
    ,
    captionFitsInsideArrowShaftWidth = function(relationship) {
        return parseFloat(GraphStyle.forRelationship(relationship).get("shaft-width")) > parseFloat(GraphStyle.forRelationship(relationship).get("font-size"))
    }
    ,
    measureRelationshipCaptions = function(relationships) {
        var j, len, relationship, results;
        for (results = [],
        j = 0,
        len = relationships.length; len > j; j++)
            relationship = relationships[j],
            relationship.captionLength = measureRelationshipCaption(relationship, relationship.type),
            results.push(relationship.captionLayout = captionFitsInsideArrowShaftWidth(relationship) ? "internal" : "external");
        return results
    }
    ,
    shortenCaption = function(relationship, caption, targetWidth) {
        var shortCaption, width;
        for (shortCaption = caption; ; ) {
            if (shortCaption.length <= 2)
                return ["", 0];
            if (shortCaption = shortCaption.substr(0, shortCaption.length - 2) + "\u2026",
            width = measureRelationshipCaption(relationship, shortCaption),
            targetWidth > width)
                return [shortCaption, width]
        }
    }
    ,
    layoutRelationships = function(relationships) {
        var alongPath, dx, dy, endBreak, headHeight, headRadius, j, len, length, ref, relationship, results, shaftLength, shaftRadius, startBreak;
        for (results = [],
        j = 0,
        len = relationships.length; len > j; j++)
            relationship = relationships[j],
            dx = relationship.target.x - relationship.source.x,
            dy = relationship.target.y - relationship.source.y,
            length = Math.sqrt(square(dx) + square(dy)),
            relationship.arrowLength = length - relationship.source.radius - relationship.target.radius,
            alongPath = function(from, distance) {
                return {
                    x: from.x + dx * distance / length,
                    y: from.y + dy * distance / length
                }
            }
            ,
            shaftRadius = parseFloat(GraphStyle.forRelationship(relationship).get("shaft-width")) / 2,
            headRadius = shaftRadius + 3,
            headHeight = 2 * headRadius,
            shaftLength = relationship.arrowLength - headHeight,
            relationship.startPoint = alongPath(relationship.source, relationship.source.radius),
            relationship.endPoint = alongPath(relationship.target, -relationship.target.radius),
            relationship.midShaftPoint = alongPath(relationship.startPoint, shaftLength / 2),
            relationship.angle = Math.atan2(dy, dx) / Math.PI * 180,
            relationship.textAngle = relationship.angle,
            (relationship.angle < -90 || relationship.angle > 90) && (relationship.textAngle += 180),
            ref = shaftLength > relationship.captionLength ? [relationship.type, relationship.captionLength] : shortenCaption(relationship, relationship.type, shaftLength),
            relationship.shortCaption = ref[0],
            relationship.shortCaptionLength = ref[1],
            "external" === relationship.captionLayout ? (startBreak = (shaftLength - relationship.shortCaptionLength) / 2,
            endBreak = shaftLength - startBreak,
            results.push(relationship.arrowOutline = ["M", 0, shaftRadius, "L", startBreak, shaftRadius, "L", startBreak, -shaftRadius, "L", 0, -shaftRadius, "Z", "M", endBreak, shaftRadius, "L", shaftLength, shaftRadius, "L", shaftLength, headRadius, "L", relationship.arrowLength, 0, "L", shaftLength, -headRadius, "L", shaftLength, -shaftRadius, "L", endBreak, -shaftRadius, "Z"].join(" "))) : results.push(relationship.arrowOutline = ["M", 0, shaftRadius, "L", shaftLength, shaftRadius, "L", shaftLength, headRadius, "L", relationship.arrowLength, 0, "L", shaftLength, -headRadius, "L", shaftLength, -shaftRadius, "L", 0, -shaftRadius, "Z"].join(" "));
        return results
    }
    ,
    this.onGraphChange = function(graph) {
        return setNodeRadii(graph.nodes()),
        formatNodeCaptions(graph.nodes()),
        measureRelationshipCaptions(graph.relationships())
    }
    ,
    this.onTick = function(graph) {
        return layoutRelationships(graph.relationships())
    }
    ,
    this
}
]),
angular.module("neo4jApp").service("TextMeasurement", function() {
    var cache, measureUsingCanvas;
    return measureUsingCanvas = function(text, font) {
        var canvas, canvasSelection, context;
        return canvasSelection = d3.select("canvas#textMeasurementCanvas").data([this]),
        canvasSelection.enter().append("canvas").attr("id", "textMeasuringCanvas").style("display", "none"),
        canvas = canvasSelection.node(),
        context = canvas.getContext("2d"),
        context.font = font,
        context.measureText(text).width
    }
    ,
    cache = function() {
        var cacheSize, list, map;
        return cacheSize = 1e4,
        map = {},
        list = [],
        function(key, calc) {
            var cached, result;
            return cached = map[key],
            cached ? cached : (result = calc(),
            list.length > cacheSize && (delete map[list.splice(0, 1)],
            list.push(key)),
            map[key] = result)
        }
    }(),
    this.measure = function(text, fontFamily, fontSize) {
        var font;
        return font = "normal normal normal " + fontSize + "px/normal " + fontFamily,
        cache(text + font, function() {
            return measureUsingCanvas(text, font)
        })
    }
    ,
    this
}),
angular.module("neo4jApp.services").service("CircularLayout", function() {
    var CircularLayout;
    return CircularLayout = {},
    CircularLayout.layout = function(nodes, center, radius) {
        var i, j, k, len, len1, n, node, results, unlocatedNodes;
        for (unlocatedNodes = [],
        j = 0,
        len = nodes.length; len > j; j++)
            node = nodes[j],
            (null  == node.x || null  == node.y) && unlocatedNodes.push(node);
        for (results = [],
        i = k = 0,
        len1 = unlocatedNodes.length; len1 > k; i = ++k)
            n = unlocatedNodes[i],
            n.x = center.x + radius * Math.sin(2 * Math.PI * i / unlocatedNodes.length),
            results.push(n.y = center.y + radius * Math.cos(2 * Math.PI * i / unlocatedNodes.length));
        return results
    }
    ,
    CircularLayout
}),
angular.module("neo4jApp.services").service("CircumferentialDistribution", function() {
    return this.distribute = function(arrowAngles, minSeparation) {
        var angle, center, expand, i, j, k, key, l, len, length, list, rawAngle, ref, ref1, ref2, ref3, result, run, runLength, runsOfTooDenseArrows, tooDense, wrapAngle, wrapIndex;
        list = [],
        ref = arrowAngles.floating;
        for (key in ref)
            angle = ref[key],
            list.push({
                key: key,
                angle: angle
            });
        for (list.sort(function(a, b) {
            return a.angle - b.angle
        }),
        runsOfTooDenseArrows = [],
        length = function(startIndex, endIndex) {
            return endIndex > startIndex ? endIndex - startIndex + 1 : endIndex + list.length - startIndex + 1
        }
        ,
        angle = function(startIndex, endIndex) {
            return endIndex > startIndex ? list[endIndex].angle - list[startIndex].angle : 360 - (list[startIndex].angle - list[endIndex].angle)
        }
        ,
        tooDense = function(startIndex, endIndex) {
            return angle(startIndex, endIndex) < length(startIndex, endIndex) * minSeparation
        }
        ,
        wrapIndex = function(index) {
            return -1 === index ? list.length - 1 : index >= list.length ? index - list.length : index
        }
        ,
        wrapAngle = function(angle) {
            return angle >= 360 ? angle - 360 : angle
        }
        ,
        expand = function(startIndex, endIndex) {
            if (length(startIndex, endIndex) < list.length) {
                if (tooDense(startIndex, wrapIndex(endIndex + 1)))
                    return expand(startIndex, wrapIndex(endIndex + 1));
                if (tooDense(wrapIndex(startIndex - 1), endIndex))
                    return expand(wrapIndex(startIndex - 1), endIndex)
            }
            return runsOfTooDenseArrows.push({
                start: startIndex,
                end: endIndex
            })
        }
        ,
        i = j = 0,
        ref1 = list.length - 2; ref1 >= 0 ? ref1 >= j : j >= ref1; i = ref1 >= 0 ? ++j : --j)
            tooDense(i, i + 1) && expand(i, i + 1);
        for (result = {},
        k = 0,
        len = runsOfTooDenseArrows.length; len > k; k++)
            for (run = runsOfTooDenseArrows[k],
            center = list[run.start].angle + angle(run.start, run.end) / 2,
            runLength = length(run.start, run.end),
            i = l = 0,
            ref2 = runLength - 1; ref2 >= 0 ? ref2 >= l : l >= ref2; i = ref2 >= 0 ? ++l : --l)
                rawAngle = center + (i - (runLength - 1) / 2) * minSeparation,
                result[list[wrapIndex(run.start + i)].key] = wrapAngle(rawAngle);
        ref3 = arrowAngles.floating;
        for (key in ref3)
            angle = ref3[key],
            result[key] || (result[key] = arrowAngles.floating[key]);
        return result
    }
    ,
    this
}),
angular.module("neo4jApp.controllers").controller("InspectorCtrl", ["$scope", "GraphStyle", "Collection", "$timeout", function($scope, graphStyle, Collection, $timeout) {
    var arrowDisplayWidths, i, inspectorItem, nodeDisplaySizes, triggerInspectorUIUpdate;
    return $scope.sizes = graphStyle.defaultSizes(),
    $scope.arrowWidths = graphStyle.defaultArrayWidths(),
    $scope.colors = graphStyle.defaultColors(),
    $scope.currentItem = null ,
    $scope.inspectorContracted = !0,
    $scope.inspectorChanged = !1,
    $scope.inspectorFixed = !1,
    inspectorItem = function(item, type) {
        return {
            data: item,
            type: type,
            tmpl: "inspector/" + type + ".html"
        }
    }
    ,
    triggerInspectorUIUpdate = function() {
        return $timeout(function() {
            return $scope.inspectorChanged = !1
        }, 0),
        $timeout(function() {
            return $scope.inspectorChanged = !0
        }, 0)
    }
    ,
    $scope.onNodeDragToggle = function(node) {
        return $scope.inspectorFixed = !!node
    }
    ,
    $scope.onItemClick = function(item, type) {
        return item ? ($scope.currentItem = inspectorItem(item, type),
        $scope.Inspector.reset($scope.currentItem)) : ($scope.currentItem = null ,
        $scope.Inspector.reset()),
        triggerInspectorUIUpdate()
    }
    ,
    $scope.onItemHover = function(item, type) {
        return $scope.inspectorFixed ? void 0 : (item ? $scope.Inspector.reset(inspectorItem(item, type)) : $scope.Inspector.reset($scope.currentItem),
        triggerInspectorUIUpdate())
    }
    ,
    $scope.styleForItem = function(item) {
        var style;
        return style = graphStyle.forEntity(item),
        {
            "background-color": style.props.color,
            color: style.props["text-color-internal"]
        }
    }
    ,
    $scope.styleForLabel = function(label) {
        var item;
        return item = {
            labels: [label],
            isNode: !0
        },
        $scope.styleForItem(item)
    }
    ,
    $scope.sizeLessThan = function(a, b) {
        return a = a ? a.replace("px", "") : 0,
        b = b ? b.replace("px", "") : 0,
        +b >= +a
    }
    ,
    $scope.Inspector = new Collection,
    $scope.close = function() {
        return Inspector.visible = !1
    }
    ,
    $scope.toggleInspector = function() {
        return Inspector.visible = !Inspector.visible
    }
    ,
    $scope.selectArrowWidth = function(item, size) {
        return item.style = graphStyle.changeForSelector(item.style.selector, size)
    }
    ,
    $scope.selectCaption = function(item, caption) {
        return item.style = graphStyle.changeForSelector(item.style.selector, {
            caption: caption
        })
    }
    ,
    $scope.isSelectedCaption = function(item, caption) {
        var grassProps;
        return grassProps = item.style.props,
        grassProps.caption === "" + caption || !grassProps.caption && ("<id>" === caption || "<type>" === caption)
    }
    ,
    $scope.selectScheme = function(item, scheme) {
        return item.style = graphStyle.changeForSelector(item.style.selector, angular.copy(scheme))
    }
    ,
    $scope.selectSize = function(item, size) {
        return item.style = graphStyle.changeForSelector(item.style.selector, size)
    }
    ,
    arrowDisplayWidths = function() {
        var j, results;
        for (results = [],
        i = j = 0; 10 >= j; i = ++j)
            results.push(5 + 3 * i + "px");
        return results
    }(),
    $scope.arrowDisplayWidth = function(idx) {
        return {
            width: arrowDisplayWidths[idx]
        }
    }
    ,
    nodeDisplaySizes = function() {
        var j, results;
        for (results = [],
        i = j = 0; 10 >= j; i = ++j)
            results.push(12 + 2 * i + "px");
        return results
    }(),
    $scope.nodeDisplaySize = function(idx) {
        return {
            width: nodeDisplaySizes[idx],
            height: nodeDisplaySizes[idx]
        }
    }
}
]),
angular.module("neo4jApp").controller("LegendCtrl", ["$scope", "Frame", "GraphStyle", function($scope, resultFrame, graphStyle) {
    var graphChanged, graphStats, update;
    return $scope.graph = null ,
    $scope.sizes = graphStyle.defaultSizes(),
    $scope.arrowWidths = graphStyle.defaultArrayWidths(),
    $scope.colors = graphStyle.defaultColors(),
    $scope.labelsContracted = !0,
    $scope.typesContracted = !0,
    graphStats = function(graph) {
        var base, base1, base2, base3, i, ignored, j, k, label, len, len1, len2, name, node, ref, ref1, ref2, rel, resultLabels, resultRelTypes, stats;
        for (resultLabels = {},
        resultRelTypes = {},
        stats = {
            labels: {},
            types: {}
        },
        ref = graph.nodes(),
        i = 0,
        len = ref.length; len > i; i++)
            for (node = ref[i],
            null  == (base = stats.labels)[""] && (base[""] = {
                label: "",
                attrs: [],
                count: 0,
                style: graphStyle.calculateStyle(graphStyle.newSelector("node"))
            }),
            stats.labels[""].count++,
            ref1 = node.labels,
            ignored = j = 0,
            len1 = ref1.length; len1 > j; ignored = ++j)
                label = ref1[ignored],
                null  == (base1 = stats.labels)[label] && (base1[label] = {
                    label: label,
                    attrs: Object.keys(node.propertyMap),
                    count: 0,
                    style: graphStyle.calculateStyle(graphStyle.newSelector("node", [label]))
                }),
                stats.labels[label].count++;
        for (ref2 = graph.relationships(),
        k = 0,
        len2 = ref2.length; len2 > k; k++)
            rel = ref2[k],
            null  == (base2 = stats.types)[""] && (base2[""] = {
                type: "",
                attrs: [],
                count: 0,
                style: graphStyle.calculateStyle(graphStyle.newSelector("relationship"))
            }),
            stats.types[""].count++,
            null  == (base3 = stats.types)[name = rel.type] && (base3[name] = {
                type: rel.type,
                attrs: Object.keys(rel.propertyMap),
                count: 0,
                style: graphStyle.calculateStyle(graphStyle.newSelector("relationship", [rel.type]))
            }),
            stats.types[rel.type].count++;
        return stats
    }
    ,
    update = function(graph) {
        var stats;
        return stats = graphStats(graph),
        $scope.labels = stats.labels,
        $scope.types = stats.types,
        $scope.$parent.hasLabels = stats.labels[""] && stats.labels[""].count > 0 ? !0 : !1,
        $scope.$parent.hasTypes = stats.types[""] && stats.types[""].count > 0 ? !0 : !1
    }
    ,
    $scope.$watch("frame.response", function(frameResponse) {
        return frameResponse && frameResponse.graph ? ($scope.graph = frameResponse.graph,
        update(frameResponse.graph)) : void 0
    }),
    graphChanged = function(event, graph) {
        return graph === $scope.graph ? update(graph) : void 0
    }
    ,
    $scope.$on("graph:changed", graphChanged)
}
]),
angular.module("neo4jApp.controllers").controller("StylePreviewCtrl", ["$scope", "$window", "GraphStyle", function($scope, $window, GraphStyle) {
    var serialize;
    return serialize = function() {
        return $scope.code = GraphStyle.toString()
    }
    ,
    $scope.rules = GraphStyle.rules,
    $scope.$watch("rules", serialize, !0),
    $scope["import"] = function(content) {
        return GraphStyle.importGrass(content)
    }
    ,
    $scope.reset = function() {
        return GraphStyle.resetToDefault()
    }
    ,
    serialize()
}
]);
var indexOf = [].indexOf || function(item) {
    for (var i = 0, l = this.length; l > i; i++)
        if (i in this && this[i] === item)
            return i;
    return -1
}
;
angular.module("neo4jApp.controllers").controller("CypherResultCtrl", ["$rootScope", "$scope", function($rootScope, $scope) {
    var getTimeString, ref;
    return $scope.displayInternalRelationships = null  != (ref = $rootScope.stickyDisplayInternalRelationships) ? ref : !0,
    $scope.availableModes = [],
    $scope.$watch("frame.response", function(resp) {
        var ref1, ref2, ref3, ref4;
        if (resp)
            return $scope.availableModes = [],
            resp.errors || ((null  != (ref1 = resp.table) ? ref1.nodes.length : void 0) && $scope.availableModes.push("graph"),
            null  != (null  != (ref2 = resp.table) ? ref2.size : void 0) && $scope.availableModes.push("table"),
            (null  != (ref3 = resp.table) ? ref3._response.plan : void 0) && $scope.availableModes.push("plan")),
            resp.raw && $scope.availableModes.push("raw"),
            resp.errors && $scope.availableModes.push("errors"),
            (null  != (ref4 = resp.raw) ? ref4.response.data.notifications : void 0) && $scope.availableModes.push("messages"),
            $scope.tab = $rootScope.stickyTab,
            $scope.isAvailable("messages") && $scope.frame.showCypherNotification ? $scope.tab = "messages" : $scope.isAvailable("plan") ? $scope.tab = "plan" : $scope.isAvailable("errors") && ($scope.tab = "errors"),
            null  == $scope.tab && ($scope.tab = $scope.availableModes[0] || "table"),
            $scope.availableModes.indexOf($scope.tab) >= 0 ? void 0 : $scope.tab = "table"
    }),
    $scope.setActive = function(tab) {
        return null  == tab && (tab = "graph" === $scope.tab ? "table" : "graph"),
        $rootScope.stickyTab = $scope.tab = tab
    }
    ,
    $scope.isActive = function(tab) {
        return tab === $scope.tab
    }
    ,
    $scope.isAvailable = function(tab) {
        return indexOf.call($scope.availableModes, tab) >= 0;
    }
    ,
    $scope.resultStatistics = function(frame) {
        var messages, ref1, ref2, ref3, rowsStatistics, updatesMessages;
        return (null  != frame ? frame.response : void 0) ? (updatesMessages = [],
        (null  != (ref1 = frame.response.table) && null  != (ref2 = ref1._response) && null  != (ref3 = ref2.columns) ? ref3.length : void 0) && (updatesMessages = $scope.updatesStatistics(frame)),
        rowsStatistics = $scope.returnedRowsStatistics(frame),
        messages = [].concat(updatesMessages, rowsStatistics),
        $scope.formatStatisticsOutput(messages)) : void 0
    }
    ,
    $scope.graphStatistics = function(frame) {
        var graph, internalRelationships, message, plural, ref1;
        return null  != (null  != frame && null  != (ref1 = frame.response) ? ref1.graph : void 0) ? (graph = frame.response.graph,
        plural = function(collection, noun) {
            return collection.length + " " + noun + (1 === collection.length ? "" : "s")
        }
        ,
        message = "Displaying " + plural(graph.nodes(), "node") + ", " + plural(graph.relationships(), "relationship"),
        internalRelationships = graph.relationships().filter(function(r) {
            return r.internal
        }),
        internalRelationships.length > 0 && (message += " (completed with  " + plural(internalRelationships, "additional relationship") + ")"),
        message + ".") : void 0
    }
    ,
    $scope.planStatistics = function(frame) {
        var collectHits, message, ref1, ref2, root;
        return null  != (null  != frame && null  != (ref1 = frame.response) && null  != (ref2 = ref1.table) ? ref2._response.plan : void 0) ? (root = frame.response.table._response.plan.root,
        collectHits = function(operator) {
            var child, hits, i, len, ref3, ref4;
            if (hits = null  != (ref3 = operator.DbHits) ? ref3 : 0,
            operator.children)
                for (ref4 = operator.children,
                i = 0,
                len = ref4.length; len > i; i++)
                    child = ref4[i],
                    hits += collectHits(child);
            return hits
        }
        ,
        message = "Cypher version: " + root.version + ", planner: " + root.planner + ".",
        collectHits(root) && (message += " " + collectHits(root) + " total db hits in " + frame.response.responseTime + " ms."),
        message) : void 0
    }
    ,
    $scope.formatStatisticsOutput = function(messages) {
        var joinedMessages;
        return joinedMessages = messages.join(", "),
        "" + joinedMessages.substring(0, 1).toUpperCase() + joinedMessages.substring(1) + "."
    }
    ,
    $scope.returnedRowsStatistics = function(frame) {
        var messages, ref1;
        return messages = [],
        null  != (null  != frame && null  != (ref1 = frame.response) ? ref1.table : void 0) && (messages.push("returned " + frame.response.table.size + " " + (1 === frame.response.table.size ? "row" : "rows")),
        messages = getTimeString(frame, messages, "returnedRows"),
        frame.response.table.size > frame.response.table.displayedSize && messages.push("displaying first " + frame.response.table.displayedSize + " rows")),
        messages
    }
    ,
    $scope.updatesStatistics = function(frame) {
        var field, messages, nonZeroFields, ref1, stats;
        return messages = [],
        null  != (null  != frame && null  != (ref1 = frame.response) ? ref1.table : void 0) && (stats = frame.response.table.stats,
        nonZeroFields = $scope.getNonZeroStatisticsFields(frame),
        messages = function() {
            var i, len, results;
            for (results = [],
            i = 0,
            len = nonZeroFields.length; len > i; i++)
                field = nonZeroFields[i],
                results.push(field.verb + " " + stats[field.field] + " " + (1 === stats[field.field] ? field.singular : field.plural));
            return results
        }(),
        messages = getTimeString(frame, messages, "updates")),
        messages
    }
    ,
    $scope.getNonZeroStatisticsFields = function(frame) {
        var field, fields, i, len, nonZeroFields, ref1, stats;
        if (nonZeroFields = [],
        null  != (null  != frame && null  != (ref1 = frame.response) ? ref1.table : void 0))
            for (stats = frame.response.table.stats,
            fields = [{
                plural: "constraints",
                singular: "constraint",
                verb: "added",
                field: "constraints_added"
            }, {
                plural: "constraints",
                singular: "constraint",
                verb: "removed",
                field: "constraints_removed"
            }, {
                plural: "indexes",
                singular: "index",
                verb: "added",
                field: "indexes_added"
            }, {
                plural: "indexes",
                singular: "index",
                verb: "removed",
                field: "indexes_removed"
            }, {
                plural: "labels",
                singular: "label",
                verb: "added",
                field: "labels_added"
            }, {
                plural: "labels",
                singular: "label",
                verb: "removed",
                field: "labels_removed"
            }, {
                plural: "nodes",
                singular: "node",
                verb: "created",
                field: "nodes_created"
            }, {
                plural: "nodes",
                singular: "node",
                verb: "deleted",
                field: "nodes_deleted"
            }, {
                plural: "properties",
                singular: "property",
                verb: "set",
                field: "properties_set"
            }, {
                plural: "relationships",
                singular: "relationship",
                verb: "deleted",
                field: "relationship_deleted"
            }, {
                plural: "relationships",
                singular: "relationship",
                verb: "created",
                field: "relationships_created"
            }],
            i = 0,
            len = fields.length; len > i; i++)
                field = fields[i],
                stats[field.field] > 0 && nonZeroFields.push(field);
        return nonZeroFields
    }
    ,
    $scope.rawStatistics = function(frame) {
        var ref1;
        if (null  != (ref1 = frame.response) ? ref1.responseTime : void 0)
            return "Request finished in " + frame.response.responseTime + " ms."
    }
    ,
    $scope.getRequestTitle = function(num_requests, index) {
        var titles;
        return titles = [["Autocommitting Transaction"], ["Open Transaction", "Commit Transaction"]],
        titles[num_requests - 1][index]
    }
    ,
    getTimeString = function(frame, messages, context) {
        var ref1, ref2, ref3, timeMessage;
        return timeMessage = " in " + frame.response.responseTime + " ms",
        "updates" === context && messages.length && !(null  != (ref1 = frame.response.table._response.columns) ? ref1.length : void 0) && (messages.push("statement executed"),
        messages[messages.length - 1] += timeMessage),
        "returnedRows" === context && ((null  != (ref2 = frame.response.table._response.columns) ? ref2.length : void 0) || !(null  != (ref3 = frame.response.table._response.columns) ? ref3.length : void 0) && !$scope.getNonZeroStatisticsFields(frame).length) && (messages[messages.length - 1] += timeMessage),
        messages
    }
    ,
    $scope.$on("frame.export.graph.svg", function() {
        return $scope.$broadcast("export.graph.svg")
    }),
    $scope.$on("frame.export.plan.svg", function() {
        return $scope.$broadcast("export.plan.svg")
    }),
    $scope.$on("frame.export.graph.png", function() {
        return $scope.$broadcast("export.graph.png")
    }),
    $scope.$on("frame.export.plan.png", function() {
        return $scope.$broadcast("export.plan.png")
    }),
    $scope.toggleDisplayInternalRelationships = function() {
        return $scope.displayInternalRelationships = !$scope.displayInternalRelationships
    }
    ,
    $scope.$on("graph:max_neighbour_limit", function(event, result) {
        return event.stopPropagation && event.stopPropagation(),
        $scope.$broadcast("frame.notif.max_neighbour_limit", result)
    })
}
]),
angular.module("neo4jApp.services").factory("motdService", ["$rootScope", "rssFeedService", "motdFeedParser", "Settings", function($rootScope, rssFeedService, motdFeedParser, Settings) {
    var Motd;
    return new (Motd = function() {
        function Motd() {}
        var choices;
        return choices = {
            quotes: [{
                text: "When you label me, you negate me.",
                author: "Soren Kierkegaard"
            }, {
                text: "In the beginning was the command line.",
                author: "Neal Stephenson"
            }, {
                text: "Remember, all I'm offering is the truth \u2013 nothing more.",
                author: "Morpheus"
            }, {
                text: "Testing can show the presence of bugs, but never their absence.",
                author: "Edsger W. Dijkstra"
            }, {
                text: "We think your graph is a special snowflake.",
                author: "Neo4j"
            }, {
                text: "Still he'd see the matrix in his sleep, bright lattices of logic unfolding across that colorless void.",
                author: "William Gibson"
            }, {
                text: "Eventually everything connects.",
                author: "Charles Eames"
            }, {
                text: "To develop a complete mind: study the science of art. Study the art of science. Develop your senses - especially learn how to see. Realize that everything connects to everything else.",
                author: "Leonardo da Vinci"
            }],
            tips: ["Use <shift-return> for multi-line, <cmd-return> to evaluate command", "Navigate history with <ctrl- up/down arrow>", "When in doubt, ask for :help"],
            unrecognizable: ["Interesting. How does this make you feel?", "Even if I squint, I can't make out what that is. Is it an elephant?", "This one time, at bandcamp...", "Ineffable, enigmatic, possibly transcendent. Also quite good looking.", "I'm not (yet) smart enough to understand this.", "Oh I agree. Kaaviot ovat suuria!"],
            emptiness: ["No nodes. Know nodes?", "Waiting for the big bang of data.", "Ready for anything.", "Every graph starts with the first node."],
            disconnected: ["Disconnected from Neo4j. Please check if the cord is unplugged."],
            callToAction: [{
                d: "Every good graph starts with Neo4j.",
                u: "http://neo4j.com"
            }]
        },
        Motd.prototype.quote = "",
        Motd.prototype.tip = "",
        Motd.prototype.unrecognized = "",
        Motd.prototype.emptiness = "",
        Motd.prototype.setCallToActionVersion = function(version) {
            return this.cta_version !== version ? (this.cta_version = version,
            this.refresh()) : void 0
        }
        ,
        Motd.prototype.getCallToActionFeedItem = function(feed) {
            var item, match_filter, ref, that;
            return that = this,
            match_filter = {
                version: function(val) {
                    var re, res;
                    return val ? (re = new RegExp("^" + val),
                    res = re.test(that.cta_version)) : !0
                },
                combo: function(val) {
                    var res;
                    return val ? res = /^!/.test(val) : !1
                }
            },
            item = motdFeedParser.getFirstMatch(feed, match_filter),
            (null  != item ? item.d : void 0) || (match_filter = {
                version: function(val) {
                    var hit, re;
                    return val ? (re = new RegExp("^" + val),
                    hit = re.test(that.cta_version),
                    hit || "neo4j" === val) : !0
                }
            },
            item = motdFeedParser.getFirstMatch(feed, match_filter)),
            item.bang = null  != (ref = motdFeedParser.explodeTags(item.t).combo) ? ref.replace(/[^a-z]*/gi, "") : void 0,
            (null  != item ? item.u : void 0) && item.u.indexOf("blog") >= 0 && (item.d = "Latest Blog: " + item.d),
            item
        }
        ,
        Motd.prototype.refresh = function() {
            return this.quote = this.pickRandomlyFrom(choices.quotes),
            this.tip = this.pickRandomlyFrom(choices.tips),
            this.unrecognized = this.pickRandomlyFrom(choices.unrecognizable),
            this.emptiness = this.pickRandomlyFrom(choices.emptiness),
            this.disconnected = this.pickRandomlyFrom(choices.disconnected),
            this.callToAction = this.pickRandomlyFrom(choices.callToAction),
            Settings.enableMotd !== !1 && $rootScope.neo4j.config.allow_outgoing_browser_connections ? rssFeedService.get().then(function(_this) {
                return function(feed) {
                    return _this.callToAction = _this.getCallToActionFeedItem(feed)
                }
            }(this)) : void 0
        }
        ,
        Motd.prototype.pickRandomlyFrom = function(fromThis) {
            return fromThis[Math.floor(Math.random() * fromThis.length)]
        }
        ,
        Motd.prototype.pickRandomlyFromChoiceName = function(choiceName) {
            return choices[choiceName] ? this.pickRandomlyFrom(choices[choiceName]) : ""
        }
        ,
        Motd
    }())
}
]),
angular.module("neo4jApp.directives").directive("fancyLogo", ["$window", function($window) {
    return {
        template: "<h1>fancified</h1>",
        link: function(scope, element, attrs, ctrl) {
            return element.html(Modernizr.inlinesvg ? '<span class="ball one"/><span class="ball two"/><span class="ball three"/>' : '<svg viewBox="41 29 125 154" width="125pt" height="154pt"><defs><pattern id="img1" patternUnits="objectBoundingBox" width="90" height="90"><image href="images/faces/abk.jpg" x="0" y="0" width="64" height="64"></image></pattern></defs><g class="logo" stroke="none" stroke-opacity="1" stroke-dasharray="none" fill-opacity="1"><circle class="node" cx="129.63533" cy="84.374286" r="32.365616" fill="#fad000"></circle><circle class="node" cx="62.714058" cy="50.834676" r="18.714163" fill="#fad000"></circle><circle class="node" cx="83.102398" cy="152.22447" r="26.895987" fill="#fad000"></circle><circle class="relationship" cx="91.557016" cy="45.320086" r="5.0627656" fill="#ff4907" stroke="none"></circle><circle class="relationship" cx="104.57301" cy="49.659258" r="5.0627656" fill="#ff4907" stroke="none"></circle><circle class="relationship" cx="55.755746" cy="78.59023" r="5.0627656" fill="#ff4907" stroke="none"></circle><circle class="relationship" cx="55.755746" cy="92.690676" r="5.0627656" fill="#ff4907" stroke="none"></circle><circle class="relationship" cx="58.64808" cy="108.24096" r="5.0627656" fill="#ff4907" stroke="none"></circle><circle class="relationship" cx="65.87916" cy="121.25976" r="5.0627656" fill="#ff4907" stroke="none"></circle><circle class="relationship" cx="118.67652" cy="138.25673" r="5.0627656" fill="#ff4907" stroke="none"></circle><circle class="relationship" cx="127.35707" cy="127.40609" r="5.0627656" fill="#ff4907" stroke="none"></circle><path class="swish" d="M 157.176255 67.359654 C 155.88412 65.2721 154.33242 63.29959 152.52118 61.488342 C 139.88167 48.84871 119.389024 48.84871 106.74953 61.488342 C 94.109954 74.127904 94.109954 94.620657 106.74953 107.260246 C 107.89654 108.40725 109.10819 109.45017 110.37279 110.38901 C 102.64778 97.90879 104.199466 81.316687 115.027814 70.488345 C 126.520325 58.995706 144.50541 57.952786 157.176255 67.35964 Z" fill="#f5aa00"></path><path class="swish" d="M 78.48786 41.29777 C 77.75747 40.117761 76.88036 39.00278 75.856537 37.978957 C 68.711942 30.834292 57.12829 30.834292 49.983703 37.978957 C 42.839068 45.123583 42.839068 56.707297 49.983703 63.85194 C 50.63206 64.500294 51.316958 65.089815 52.031784 65.6205 C 47.665153 58.565944 48.542256 49.187108 54.663076 43.06629 C 61.159322 36.569972 71.325554 35.980452 78.48786 41.297761 Z" fill="#f5aa00"></path><path class="swish" d="M 104.91025 138.61693 C 103.88164 136.955135 102.64641 135.384915 101.20457 133.94307 C 91.142876 123.88128 74.829684 123.88128 64.768004 133.94307 C 54.706255 144.00481 54.706255 160.31808 64.768004 170.37984 C 65.68108 171.29292 66.64562 172.12314 67.652304 172.8705 C 61.502802 162.93561 62.73802 149.727445 71.35794 141.10753 C 80.506564 131.958805 94.82361 131.12859 104.91025 138.61692 Z" fill="#f5aa00"></path><circle class="node-outline" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" fill="none" cx="129.63533" cy="84.374286" r="32.365616" stroke="#eb7f00"></circle><circle class="node-outline" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" fill="none" cx="62.714058" cy="50.834676" r="18.714163" stroke="#eb7f00"></circle><circle class="node-outline" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" fill="none" cx="83.102394" cy="152.22448" r="26.895992" stroke="#eb7f00"></circle></g></svg>')
        }
    }
}
]),
angular.module("neo4jApp.services").factory("Persistable", ["$rootScope", "localStorageService", function($rootScope, localStorageService) {
    var Persistable;
    return Persistable = function() {
        function Persistable(data) {
            null  == data && (data = {}),
            angular.isObject(data) && angular.extend(this, data),
            null  == this.id && (this.id = UUID.genV1().toString())
        }
        return Persistable.fetch = function() {
            var i, len, p, persisted, results;
            if (persisted = function() {
                try {
                    return localStorageService.get(this.storageKey)
                } catch (_error) {
                    return null 
                }
            }
            .call(this),
            !angular.isArray(persisted))
                return [];
            for (results = [],
            i = 0,
            len = persisted.length; len > i; i++)
                p = persisted[i],
                results.push(new this(p));
            return results
        }
        ,
        Persistable.save = function(data) {
            return localStorageService.add(this.storageKey, JSON.stringify(data)),
            $rootScope.$broadcast("localStorage:updated")
        }
        ,
        Persistable
    }()
}
]);
var extend = function(child, parent) {
    function ctor() {
        this.constructor = child
    }
    for (var key in parent)
        hasProp.call(parent, key) && (child[key] = parent[key]);
    return ctor.prototype = parent.prototype,
    child.prototype = new ctor,
    child.__super__ = parent.prototype,
    child
}
  , hasProp = {}.hasOwnProperty;
angular.module("neo4jApp.services").factory("Folder", ["Collection", "Document", "Persistable", function(Collection, Document, Persistable) {
    var Folder, Folders;
    return Folder = function(superClass) {
        function Folder(data) {
            this.expanded = !0,
            Folder.__super__.constructor.call(this, data),
            null  == this.name && (this.name = "Unnamed folder")
        }
        return extend(Folder, superClass),
        Folder.storageKey = "folders",
        Folder.prototype.toJSON = function() {
            return {
                id: this.id,
                name: this.name,
                expanded: this.expanded
            }
        }
        ,
        Folder
    }(Persistable),
    Folders = function(superClass) {
        function Folders() {
            return Folders.__super__.constructor.apply(this, arguments)
        }
        return extend(Folders, superClass),
        Folders.prototype.create = function(data) {
            var folder;
            return folder = new Folder(data),
            this.add(folder),
            this.save(),
            folder
        }
        ,
        Folders.prototype.expand = function(folder) {
            return folder.expanded = !folder.expanded,
            this.save()
        }
        ,
        Folders.prototype.klass = Folder,
        Folders.prototype["new"] = function(args) {
            return new Folder(args)
        }
        ,
        Folders.prototype.destroy = function(folder) {
            var documentsToRemove;
            return documentsToRemove = Document.where({
                folder: folder.id
            }),
            Document.remove(documentsToRemove),
            this.remove(folder),
            this.save()
        }
        ,
        Folders
    }(Collection),
    new Folders(null ,Folder).fetch()
}
]);
var extend = function(child, parent) {
    function ctor() {
        this.constructor = child
    }
    for (var key in parent)
        hasProp.call(parent, key) && (child[key] = parent[key]);
    return ctor.prototype = parent.prototype,
    child.prototype = new ctor,
    child.__super__ = parent.prototype,
    child
}
  , hasProp = {}.hasOwnProperty;
angular.module("neo4jApp.services").factory("Document", ["Collection", "Persistable", function(Collection, Persistable) {
    var Document, Documents;
    return Document = function(superClass) {
        function Document(data) {
            Document.__super__.constructor.call(this, data),
            null  == this.name && (this.name = "Unnamed document"),
            null  == this.folder && (this.folder = !1)
        }
        return extend(Document, superClass),
        Document.storageKey = "documents",
        Document.prototype.toJSON = function() {
            return {
                id: this.id,
                name: this.name,
                folder: this.folder,
                content: this.content
            }
        }
        ,
        Document
    }(Persistable),
    Documents = function(superClass) {
        function Documents() {
            return Documents.__super__.constructor.apply(this, arguments)
        }
        return extend(Documents, superClass),
        Documents.prototype.create = function(data) {
            var d;
            return d = new Document(data),
            this.add(d),
            this.save(),
            d
        }
        ,
        Documents.prototype.klass = Document,
        Documents.prototype["new"] = function(args) {
            return new Document(args)
        }
        ,
        Documents.prototype.remove = function(doc) {
            return Documents.__super__.remove.apply(this, arguments)
        }
        ,
        Documents.prototype.destroy = function(doc) {
            return this.remove(doc),
            this.save()
        }
        ,
        Documents
    }(Collection),
    new Documents(null ,Document).fetch()
}
]);
var bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments)
    }
}
  , extend = function(child, parent) {
    function ctor() {
        this.constructor = child
    }
    for (var key in parent)
        hasProp.call(parent, key) && (child[key] = parent[key]);
    return ctor.prototype = parent.prototype,
    child.prototype = new ctor,
    child.__super__ = parent.prototype,
    child
}
  , hasProp = {}.hasOwnProperty;
angular.module("neo4jApp.services").provider("Frame", [function() {
    var self;
    return self = this,
    this.interpreters = [],
    this.$get = ["$injector", "$q", "Collection", "Settings", "Utils", function($injector, $q, Collection, Settings, Utils) {
        var Frame, Frames, frames;
        return Frame = function() {
            function Frame(data) {
                null  == data && (data = {}),
                this.getDetailedErrorText = bind(this.getDetailedErrorText, this),
                this.setError = bind(this.setError, this),
                this.addErrorText = bind(this.addErrorText, this),
                this.resetError = bind(this.resetError, this),
                this.setErrorMessages = bind(this.setErrorMessages, this),
                this.templateUrl = null ,
                angular.isString(data) ? this.input = data : angular.extend(this, data),
                null  == this.id && (this.id = UUID.genV1().toString())
            }
            return Frame.prototype.toJSON = function() {
                return {
                    id: this.id,
                    input: this.input
                }
            }
            ,
            Frame.prototype.exec = function() {
                var intr, intrFn, intrPromise, query;
                return query = Utils.stripComments(this.input.trim()),
                query && (intr = frames.interpreterFor(query)) ? (this.type = intr.type,
                intrFn = $injector.invoke(intr.exec),
                this.setProperties(intr),
                this.errorText = !1,
                this.detailedErrorText = !1,
                this.hasErrors = !1,
                this.startTime || (this.isLoading = !0),
                this.isTerminating = !1,
                this.closeAttempts = 0,
                this.response = null ,
                this.templateUrl = intr.templateUrl,
                this.startTime || (this.startTime = (new Date).getTime()),
                this.pinTime = 0,
                intrPromise = intrFn(query, $q.defer()),
                this.terminate = function(_this) {
                    return function() {
                        var q;
                        return _this.resetError(),
                        q = $q.defer(),
                        intrPromise && intrPromise.transaction ? (intrPromise.reject("cancel main request"),
                        _this.isTerminating = !0,
                        intrPromise.transaction.rollback().then(function(r) {
                            return _this.isTerminating = !1,
                            q.resolve(r)
                        }, function(r) {
                            return _this.isTerminating = !1,
                            q.reject(r)
                        }),
                        q.promise) : (q.resolve({}),
                        q.promise)
                    }
                }(this),
                $q.when(intrPromise).then(function(_this) {
                    return function(result) {
                        var ref;
                        return _this.isLoading = !1,
                        _this.response = result,
                        _this.requests = (null  != intrPromise && null  != (ref = intrPromise.transaction) ? ref.requests : void 0) || []
                    }
                }(this), function(_this) {
                    return function(result) {
                        var ref;
                        return null  == result && (result = {}),
                        _this.isLoading = !1,
                        _this.response = result,
                        _this.requests = (null  != intrPromise && null  != (ref = intrPromise.transaction) ? ref.requests : void 0) || [],
                        _this.setError(result)
                    }
                }(this)),
                this) : void 0
            }
            ,
            Frame.prototype.setProperties = function(intr) {
                var ref;
                return this.exportable = "cypher" === (ref = this.type) || "http" === ref,
                this.fullscreenable = intr.fullscreenable === !0 || "undefined" == typeof intr.fullscreenable || null  === intr.fullscreenable ? !0 : this.fullscreenable
            }
            ,
            Frame.prototype.setErrorMessages = function(result) {
                var errors, ref;
                return null  == result && (result = {}),
                "string" == typeof result && (result = {
                    errors: [{
                        code: "Error",
                        message: result
                    }]
                }),
                401 !== (ref = result.status) && 403 !== ref && 429 !== ref && 422 !== ref && 404 !== ref || !result.data.errors || (result = result.data),
                result.status && (result = {
                    errors: [{
                        code: "HTTP Status: " + result.status,
                        message: "HTTP Status: " + result.status + " - " + result.statusText
                    }]
                }),
                result.is_remote && 0 === result.status && (result = {
                    errors: [{
                        code: 0,
                        message: "No 'Access-Control-Allow-Origin' header is present on the requested resource and can therefore not be played."
                    }]
                }),
                errors = result.errors[0],
                this.errorText = "" + errors.code,
                this.detailedErrorText = errors.message
            }
            ,
            Frame.prototype.resetError = function() {
                return this.errorText = this.detailedErrorText = "",
                this.hasErrors = !1
            }
            ,
            Frame.prototype.addErrorText = function(error) {
                return this.detailedErrorText += error,
                this.hasErrors = !0
            }
            ,
            Frame.prototype.setError = function(response) {
                return this.setErrorMessages(response),
                this.hasErrors = !0
            }
            ,
            Frame.prototype.getDetailedErrorText = function() {
                return this.detailedErrorText
            }
            ,
            Frame
        }(),
        Frames = function(superClass) {
            function Frames() {
                return Frames.__super__.constructor.apply(this, arguments)
            }
            return extend(Frames, superClass),
            Frames.prototype.create = function(data) {
                var frame, intr, rv;
                return null  == data && (data = {}),
                data.input && (intr = this.interpreterFor(data.input)) ? (intr.templateUrl ? frame = new Frame(data) : rv = $injector.invoke(intr.exec)(data.input),
                frame && (this.add(frame.exec()),
                this.length > Settings.maxFrames && this.close(this.first())),
                frame || rv) : void 0
            }
            ,
            Frames.prototype.close = function(frame) {
                var pr;
                return pr = frame.terminate(),
                pr.then(function(_this) {
                    return function() {
                        return _this.remove(frame)
                    }
                }(this), function(_this) {
                    return function(r) {
                        return frame.closeAttempts < 1 ? (frame.setError(r),
                        frame.closeAttempts++) : _this.remove(frame)
                    }
                }(this))
            }
            ,
            Frames.prototype.createOne = function(data) {
                var last;
                return null  == data && (data = {}),
                last = this.last(),
                (null  != last ? last.input : void 0) !== data.input ? this.create(data) : void 0
            }
            ,
            Frames.prototype.interpreterFor = function(input) {
                var cmds, firstWord, i, intr, j, len, ref;
                for (null  == input && (input = ""),
                intr = null ,
                input = Utils.stripComments(input.trim()),
                firstWord = Utils.firstWord(input).toLowerCase(),
                ref = self.interpreters,
                j = 0,
                len = ref.length; len > j; j++)
                    if (i = ref[j],
                    angular.isFunction(i.matches)) {
                        if (i.matches(input))
                            return i
                    } else if (cmds = i.matches,
                    angular.isString(i.matches) && (cmds = [cmds]),
                    angular.isArray(cmds) && cmds.indexOf(firstWord) >= 0)
                        return i;
                return intr
            }
            ,
            Frames.prototype.klass = Frame,
            Frames
        }(Collection),
        frames = new Frames(null ,Frame)
    }
    ],
    this
}
]),
angular.module("neo4jApp.animations", []).animation(".frame-in", ["$window", function($window) {
    return {
        enter: function(element, done) {
            var afterFirst;
            return element.css({
                position: "absolute",
                top: "-100px",
                opacity: 0
            }),
            afterFirst = function() {
                return element.css({
                    position: "relative"
                }),
                element.animate({
                    opacity: 1,
                    top: 0,
                    maxHeight: element.height()
                }, {
                    duration: 400,
                    easing: "easeInOutCubic",
                    complete: function() {
                        return element.css({
                            maxHeight: 1e4
                        }),
                        done()
                    }
                })
            }
            ,
            element.animate({
                opacity: .01
            }, 200, function() {
                return setTimeout(afterFirst, 0)
            }),
            function() {}
        },
        leave: function(element, done) {
            return element.css({
                height: element.height()
            }),
            element.animate({
                opacity: 0,
                height: 0
            }, {
                duration: 400,
                easing: "easeInOutCubic",
                complete: done
            }),
            function() {}
        }
    }
}
]).animation(".intro-in", ["$window", function($window) {
    return {
        enter: function(element, done) {
            return element.css({
                opacity: 0,
                top: 0,
                display: "block"
            }),
            element.animate({
                opacity: 1,
                top: 0
            }, {
                duration: 1600,
                easing: "easeInOutCubic",
                complete: done
            })
        },
        leave: function(element, done) {
            return element.animate({
                opacity: 0,
                top: 40
            }, {
                duration: 400,
                easing: "easeInOutCubic",
                complete: done
            })
        }
    }
}
]).animation(".slide-down", ["$window", function($window) {
    return {
        enter: function(element, done) {
            return element.css({
                maxHeight: 0,
                display: "block"
            }),
            element.animate({
                maxHeight: 49
            }, {
                duration: 400,
                easing: "easeInOutCubic",
                complete: done
            }),
            function() {}
        },
        leave: function(element, done) {
            return element.animate({
                height: 0
            }, {
                duration: 400,
                easing: "easeInOutCubic",
                complete: done
            }),
            function() {}
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("outputRaw", ["Settings", function(Settings) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var unbind;
            return unbind = scope.$watch(attrs.outputRaw, function(val) {
                var rest, str;
                if (val)
                    return angular.isString(val) || (val = JSON.stringify(val, null , 2)),
                    str = val.substring(0, Settings.maxRawSize),
                    rest = val.substring(Settings.maxRawSize + 1),
                    attrs.overrideSizeLimit && (str = val,
                    rest = !1),
                    rest && (rest = rest.split("\n")[0] || "",
                    str += rest + "\n...\n<truncated output>\n\nPress download to see complete response"),
                    element.text(str),
                    unbind()
            })
        }
    }
}
]),
angular.module("neo4jApp.directives").factory("fullscreenService", [function() {
    var container, root;
    return root = angular.element("body"),
    container = angular.element('<div class="fullscreen-container"></div>'),
    container.hide().appendTo(root),
    {
        display: function(element) {
            return container.append(element).show()
        },
        hide: function() {
            return container.hide()
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("fullscreen", ["fullscreenService", function(fullscreenService) {
    return {
        restrict: "A",
        controller: ["$scope", function($scope) {
            return $scope.toggleFullscreen = function(state) {
                return null  == state && (state = !$scope.fullscreen),
                $scope.fullscreen = state
            }
        }
        ],
        link: function(scope, element, attrs) {
            var parent;
            return parent = element.parent(),
            scope.fullscreen = !1,
            scope.$watch("fullscreen", function(val, oldVal) {
                return val !== oldVal ? (val ? fullscreenService.display(element) : (parent.append(element),
                fullscreenService.hide()),
                scope.$emit("layout.changed")) : void 0
            })
        }
    }
}
]),
angular.module("neo.exportable", ["neo.csv"]).service("exportService", ["$window", "Canvg", "Utils", function($window, Canvg, Utils) {
    return {
        download: function(filename, mime, data) {
            var blob;
            return navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) ? (data = "object" == typeof data ? Utils.ua2text(data) : unescape(encodeURIComponent(data)),
            $window.open("data:" + mime + ";base64," + btoa(data)),
            !0) : (blob = new Blob([data],{
                type: mime
            }),
            $window.saveAs(blob, filename))
        },
        downloadWithDataURI: function(filename, dataURI) {
            var byteString, i, ia, j, mimeString, ref;
            for (byteString = null ,
            byteString = dataURI.split(",")[0].indexOf("base64") >= 0 ? atob(dataURI.split(",")[1]) : unescape(dataURI.split(",")[1]),
            mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0],
            ia = new Uint8Array(byteString.length),
            i = j = 0,
            ref = byteString.length; ref >= 0 ? ref >= j : j >= ref; i = ref >= 0 ? ++j : --j)
                ia[i] = byteString.charCodeAt(i);
            return this.download(filename, mimeString, ia)
        },
        downloadPNGFromSVG: function(svgObj, filename) {
            var canvas, png, svgData;
            return svgData = (new XMLSerializer).serializeToString(svgObj.node()),
            svgData = svgData.replace(/&nbsp;/g, "&#160;"),
            canvas = document.createElement("canvas"),
            canvas.width = svgObj.attr("width"),
            canvas.height = svgObj.attr("height"),
            Canvg(canvas, svgData),
            png = canvas.toDataURL("image/png"),
            this.downloadWithDataURI(filename + ".png", png)
        }
    }
}
]).directive("exportable", [function() {
    return {
        restrict: "A",
        controller: ["$scope", "CSV", "exportService", function($scope, CSV, exportService) {
            return $scope.exportGraphSVG = function() {
                return $scope.$emit("frame.export.graph.svg"),
                !0
            }
            ,
            $scope.exportPlanSVG = function() {
                return $scope.$emit("frame.export.plan.svg"),
                !0
            }
            ,
            $scope.exportGraphPNG = function() {
                return $scope.$emit("frame.export.graph.png"),
                !0
            }
            ,
            $scope.exportPlanPNG = function() {
                return $scope.$emit("frame.export.plan.png"),
                !0
            }
            ,
            $scope.exportJSON = function(data) {
                return data ? exportService.download("result.json", "application/json", JSON.stringify(data)) : void 0
            }
            ,
            $scope.exportCSV = function(data) {
                var csv, j, len, ref, row;
                if (data) {
                    for (csv = new CSV.Serializer,
                    csv.columns(data.columns()),
                    ref = data.rows(),
                    j = 0,
                    len = ref.length; len > j; j++)
                        row = ref[j],
                        csv.append(row);
                    return exportService.download("export.csv", "text/csv;charset=utf-8", csv.output())
                }
            }
            ,
            $scope.exportText = function(data) {
                return data ? exportService.download("result.txt", "text/plain", data) : void 0
            }
            ,
            $scope.exportGraSS = function(data) {
                return exportService.download("graphstyle.grass", "text/plain", data)
            }
            ,
            $scope.exportScript = function(data) {
                return exportService.download("script.cypher", "text/plain", data)
            }
        }
        ]
    }
}
]),
angular.module("neo4jApp.directives").directive("article", ["$rootScope", "Editor", "Frame", function($rootScope, Editor, Frame) {
    return {
        restrict: "E",
        link: function(scope, element, attrs) {
            return element.on("click", ".runnable", function(e) {
                var code;
                return code = e.currentTarget.textContent || e.currentTarget.innerText,
                (null  != code ? code.length : void 0) > 0 ? (Editor.setContent(code.trim()),
                angular.element(e.currentTarget).addClass("clicked"),
                $rootScope.$$phase ? void 0 : $rootScope.$apply()) : void 0
            })
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("helpTopic", ["$rootScope", "Frame", "Settings", function($rootScope, Frame, Settings) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var command, topic;
            return topic = attrs.helpTopic,
            command = "help",
            topic ? element.on("click", function(e) {
                return e.preventDefault(),
                topic = topic.toLowerCase().trim().replace(/-/g, " "),
                Frame.create({
                    input: "" + Settings.cmdchar + command + " " + topic
                }),
                $rootScope.$$phase ? void 0 : $rootScope.$apply()
            }) : void 0
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("playTopic", ["$rootScope", "Frame", "Settings", function($rootScope, Frame, Settings) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var command, topic;
            return topic = attrs.playTopic,
            command = "play",
            topic ? element.on("click", function(e) {
                return e.preventDefault(),
                topic = topic.toLowerCase().trim().replace("-", " "),
                Frame.create({
                    input: "" + Settings.cmdchar + command + " " + topic
                }),
                $rootScope.$$phase ? void 0 : $rootScope.$apply()
            }) : void 0
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("noNgAnimate", ["$animate", function($animate) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            return $animate.enabled(!1, element)
        }
    }
}
]),
angular.module("neo4jApp").config(["localStorageServiceProvider", function(localStorageServiceProvider) {
    return localStorageServiceProvider.setPrefix("neo4j")
}
]),
angular.module("neo4jApp.controllers").controller("EditorCtrl", ["$scope", "Editor", "motdService", "Settings", function($scope, Editor, motdService, Settings) {
    return $scope.editor = Editor,
    $scope.motd = motdService,
    $scope.settings = Settings,
    $scope.editorHasContent = !1,
    $scope.$watch("editor.content", function(val, val2) {
        return $scope.editorHasContent = !!val
    }),
    $scope.create = function() {
        return $scope.toggleDrawer("scripts", !0),
        Editor.createDocument()
    }
    ,
    $scope.clone = function() {
        return $scope.toggleDrawer("scripts", !0),
        Editor.cloneDocument()
    }
    ,
    $scope.star = function() {
        return Editor.document || $scope.toggleDrawer("scripts", !0),
        Editor.saveDocument()
    }
}
]);
var hasProp = {}.hasOwnProperty;
angular.module("neo4jApp.controllers").controller("SidebarCtrl", ["$scope", "Document", "Editor", "Frame", "Folder", "GraphStyle", function($scope, Document, Editor, Frame, Folder, GraphStyle) {
    var nestedFolderStructure, scopeApply;
    return scopeApply = function(fn) {
        return function() {
            return fn.apply($scope, arguments),
            $scope.$apply()
        }
    }
    ,
    $scope.removeFolder = function(folder) {
        return confirm("Are you sure you want to delete the folder?") ? Folder.destroy(folder) : void 0
    }
    ,
    $scope.removeDocument = function(doc) {
        var k, results, v;
        Document.destroy(doc),
        results = [];
        for (k in doc)
            hasProp.call(doc, k) && (v = doc[k],
            results.push(doc[k] = null ));
        return results
    }
    ,
    $scope.importDocument = function(content, name) {
        return /\.grass$/.test(name) ? GraphStyle.importGrass(content) : Document.create({
            content: content
        })
    }
    ,
    $scope.playDocument = function(content) {
        return Frame.create({
            input: content
        })
    }
    ,
    $scope.sortableOptions = {
        connectWith: ".sortable",
        placeholder: "sortable-placeholder",
        items: "li",
        cursor: "move",
        dropOnEmpty: !0,
        stop: function(e, ui) {
            var doc, folder, i, j, len, len1, ref, ref1;
            for (doc = ui.item.sortable.moved || ui.item.scope().document,
            folder = null  != ui.item.folder ? ui.item.folder : doc.folder,
            ui.item.resort && ui.item.relocate && (doc.folder = folder,
            "root" === doc.folder && (doc.folder = !1)),
            ref = $scope.folders,
            i = 0,
            len = ref.length; len > i; i++)
                for (folder = ref[i],
                ref1 = folder.documents,
                j = 0,
                len1 = ref1.length; len1 > j; j++)
                    doc = ref1[j],
                    Document.remove(doc),
                    Document.add(doc);
            Document.save()
        },
        update: function(e, ui) {
            return ui.item.resort = !0
        },
        receive: function(e, ui) {
            var folder;
            return ui.item.relocate = !0,
            folder = angular.element(e.target).scope().folder,
            ui.item.folder = null  != folder ? folder.id : !1
        }
    },
    nestedFolderStructure = function() {
        var doc, documents, folder, nested, noFolder;
        return nested = function() {
            var i, len, ref, results;
            for (ref = Folder.all(),
            results = [],
            i = 0,
            len = ref.length; len > i; i++)
                folder = ref[i],
                documents = function() {
                    var j, len1, ref1, results1;
                    for (ref1 = Document.where({
                        folder: folder.id
                    }),
                    results1 = [],
                    j = 0,
                    len1 = ref1.length; len1 > j; j++)
                        doc = ref1[j],
                        results1.push(doc);
                    return results1
                }(),
                folder.documents = documents,
                results.push(folder);
            return results
        }(),
        noFolder = Folder["new"]({
            id: "root"
        }),
        noFolder.documents = function() {
            var i, len, ref, results;
            for (ref = Document.where({
                folder: !1
            }),
            results = [],
            i = 0,
            len = ref.length; len > i; i++)
                doc = ref[i],
                results.push(doc);
            return results
        }(),
        nested.push(noFolder),
        nested
    }
    ,
    $scope.folders = nestedFolderStructure(),
    $scope.$on("localStorage:updated", function() {
        return $scope.folders = nestedFolderStructure()
    }),
    $scope.editor = Editor,
    $scope.substituteToken = function(query, token) {
        var escapedToken;
        return escapedToken = token.match(/^[A-Za-z][A-Za-z0-9_]*$/) ? token : "`" + token + "`",
        query.replace(/<token>/g, escapedToken)
    }
    ,
    $scope.folderService = Folder
}
]),
angular.module("neo4jApp.services").service("Editor", ["Document", "Frame", "Settings", "HistoryService", "CypherParser", "motdService", "$timeout", function(Document, Frame, Settings, HistoryService, CypherParser, motdService, $timeout) {
    var Editor, editor;
    return Editor = function() {
        function Editor() {
            this.history = HistoryService,
            this.content = "",
            this.document = null 
        }
        return Editor.prototype.execScript = function(input, no_duplicates) {
            var frame, ref;
            if (null  == no_duplicates && (no_duplicates = !1),
            this.showMessage = !1,
            no_duplicates) {
                if (frame = Frame.createOne({
                    input: input
                }),
                !frame)
                    return
            } else
                frame = Frame.create({
                    input: input
                });
            return frame || "" === input ? (Settings.filemode && (null  != (ref = this.document) ? ref.id : void 0) || this.addToHistory(input),
            this.maximize(!1),
            this.document = null ) : this.setMessage("<b>Unrecognized:</b> <i>" + input + "</i>.", "error")
        }
        ,
        Editor.prototype.execCurrent = function() {
            return this.execScript(this.content)
        }
        ,
        Editor.prototype.hasChanged = function() {
            var ref;
            return (null  != (ref = this.document) ? ref.content : void 0) && this.document.content !== this.content
        }
        ,
        Editor.prototype.historyNext = function() {
            var item;
            return this.history.setBuffer(this.content),
            item = this.history.next(),
            this.setContent(item)
        }
        ,
        Editor.prototype.historyPrev = function() {
            var item;
            return this.history.setBuffer(this.content),
            item = this.history.prev(),
            this.setContent(item)
        }
        ,
        Editor.prototype.historySet = function(idx) {
            var item;
            return item = this.history.get(idx),
            this.setContent(item)
        }
        ,
        Editor.prototype.addToHistory = function(input) {
            var item;
            return item = this.history.add(input),
            this.content = item
        }
        ,
        Editor.prototype.loadDocument = function(id) {
            var doc;
            return (doc = Document.get(id)) ? (this.content = doc.content,
            this.document = doc) : void 0
        }
        ,
        Editor.prototype.maximize = function(state) {
            return null  == state && (state = !this.maximized),
            this.maximized = !!state
        }
        ,
        Editor.prototype.saveDocument = function() {
            var input, ref, ref1;
            return (input = this.content.trim()) ? ((null  != (ref = this.document) ? ref.id : void 0) && (this.document = Document.get(this.document.id)),
            (null  != (ref1 = this.document) ? ref1.id : void 0) ? (this.document.content = input,
            Document.save()) : this.document = Document.create({
                content: this.content
            })) : void 0
        }
        ,
        Editor.prototype.createDocument = function(content, folder) {
            return null  == content && (content = "// Untitled script\n"),
            this.content = content,
            this.document = Document.create({
                content: content,
                folder: folder
            })
        }
        ,
        Editor.prototype.cloneDocument = function() {
            var folder, ref;
            return folder = null  != (ref = this.document) ? ref.folder : void 0,
            this.createDocument(this.content, folder)
        }
        ,
        Editor.prototype.setContent = function(content) {
            return null  == content && (content = ""),
            $timeout(function(_this) {
                return function() {
                    return _this.content = content
                }
            }(this), 0),
            this.document = null 
        }
        ,
        Editor.prototype.setMessage = function(message, type) {
            return null  == type && (type = "info"),
            this.showMessage = !0,
            this.errorCode = type,
            this.errorMessage = message
        }
        ,
        Editor.prototype.checkCypherContent = function(cm) {
            var cb, input;
            return cb = function(err, res) {
                var i, item, len, ref, ref1, results;
                if (cm.clearGutter("cypher-hints"),
                !err && (null  != (ref = res.raw.response.data.notifications) ? ref.length : void 0)) {
                    for (ref1 = res.raw.response.data.notifications,
                    results = [],
                    i = 0,
                    len = ref1.length; len > i; i++)
                        item = ref1[i],
                        item.position || (item.position = {
                            line: 1
                        }),
                        results.push(function(item) {
                            return cm.setGutterMarker(item.position.line - 1, "cypher-hints", function() {
                                var r;
                                return r = document.createElement("div"),
                                r.style.color = "#822",
                                r.innerHTML = "<i class='fa fa-exclamation-triangle gutter-warning'></i>",
                                r.title = item.title + "\n" + item.description,
                                r.onclick = function() {
                                    return Frame.create({
                                        input: "EXPLAIN " + input,
                                        showCypherNotification: !0
                                    })
                                }
                                ,
                                r
                            }())
                        }(item));
                    return results
                }
            }
            ,
            input = cm.getValue(),
            CypherParser.runHints(cm, cb)
        }
        ,
        Editor
    }(),
    editor = new Editor,
    CodeMirror.commands.handleEnter = function(cm) {
        return 1 !== cm.lineCount() || editor.document ? CodeMirror.commands.newlineAndIndent(cm) : editor.execCurrent()
    }
    ,
    CodeMirror.commands.handleUp = function(cm) {
        return 1 === cm.lineCount() ? editor.historyPrev() : CodeMirror.commands.goLineUp(cm)
    }
    ,
    CodeMirror.commands.handleDown = function(cm) {
        return 1 === cm.lineCount() ? editor.historyNext() : CodeMirror.commands.goLineDown(cm)
    }
    ,
    CodeMirror.commands.historyPrev = function(cm) {
        return editor.historyPrev()
    }
    ,
    CodeMirror.commands.historyNext = function(cm) {
        return editor.historyNext()
    }
    ,
    CodeMirror.commands.execCurrent = function(cm) {
        return editor.execCurrent()
    }
    ,
    CodeMirror.keyMap["default"].Enter = "handleEnter",
    CodeMirror.keyMap["default"]["Shift-Enter"] = "newlineAndIndent",
    CodeMirror.keyMap["default"]["Cmd-Enter"] = "execCurrent",
    CodeMirror.keyMap["default"]["Ctrl-Enter"] = "execCurrent",
    CodeMirror.keyMap["default"].Up = "handleUp",
    CodeMirror.keyMap["default"].Down = "handleDown",
    CodeMirror.keyMap["default"]["Cmd-Up"] = "historyPrev",
    CodeMirror.keyMap["default"]["Ctrl-Up"] = "historyPrev",
    CodeMirror.keyMap["default"]["Cmd-Down"] = "historyNext",
    CodeMirror.keyMap["default"]["Ctrl-Down"] = "historyNext",
    editor
}
]),
angular.module("neo4jApp.filters").filter("commandError", [function() {
    return function(input) {
        return ":" === (null  != input ? input.charAt(0) : void 0) ? "Not-a-command" : "Unrecognized"
    }
}
]),
angular.module("neo4jApp.directives").directive("clickToCode", ["Editor", function(Editor) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var applyAction, code;
            return code = scope.$eval(attrs.clickToCode),
            element.click(function(e) {
                return applyAction(Editor.setContent)
            }),
            "true" === attrs.dblclickToExec && element.dblclick(function(e) {
                return applyAction(Editor.execScript)
            }),
            applyAction = function(fn) {
                return (null  != code ? code.length : void 0) ? (fn.call(Editor, code.trim()),
                scope.$apply()) : void 0
            }
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("overflowWithToggle", ["$window", "$timeout", function($window, $timeout) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var onResize;
            return onResize = function() {
                var growing, oneline;
                return growing = element.parent().find("ul").height(),
                oneline = parseInt(element.css("height")),
                1.1 * oneline >= growing ? element.hide() : element.show()
            }
            ,
            $timeout(function() {
                return onResize()
            }, 0),
            scope.$watch(function() {
                return element.parent().width()
            }, function(old, newv) {
                return onResize()
            }),
            "updateUi" in attrs ? scope.$watch(attrs.updateUi, function(new_val, old_val) {
                return new_val ? onResize() : void 0
            }) : void 0
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("href", ["Editor", function(Editor) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            return attrs.href.match(/^http/) ? element.attr("target", "_blank") : void 0
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("scrollToTop", ["Settings", function(Settings) {
    return function(scope, element, attrs) {
        return Settings.scrollToTop ? scope.$watch(attrs.scrollToTop, function() {
            return $("#" + attrs.scrollToTop).animate({
                scrollTop: 0
            })
        }) : void 0
    }
}
]),
angular.module("neo4jApp.directives").directive("frameStream", ["Frame", "Editor", "motdService", function(Frame, Editor, motdService) {
    return {
        restrict: "A",
        priority: 0,
        templateUrl: "views/partials/stream.html",
        replace: !1,
        transclude: !1,
        scope: !1,
        controller: ["$scope", "Frame", "Editor", "motdService", function($scope, Frame, Editor, motdService) {
            return $scope.frames = Frame,
            $scope.motd = motdService,
            $scope.editor = Editor
        }
        ]
    }
}
]);
var RssFeedService;
RssFeedService = function() {
    function RssFeedService($http) {
        RssFeedService.prototype.get = function() {
            var apiUrl, format, username;
            return format = "json",
            username = "neo4jmotd",
            apiUrl = (document.location.protocol || "http:") + "//assets.neo4j.org/v2/" + format + "/" + username + "?callback=JSON_CALLBACK&count=10?plain=true",
            $http.jsonp(apiUrl).error(function(results) {
                return results
            }).then(function(response) {
                return response.data ? response.data : []
            })
        }
    }
    return RssFeedService
}(),
angular.module("neo4jApp.services").service("rssFeedService", ["$http", RssFeedService]);
var MotdFeedParser;
MotdFeedParser = function() {
    function MotdFeedParser() {}
    return MotdFeedParser.prototype.explodeTags = function(tags) {
        var i, len, out, pair, parts;
        if (out = {},
        !tags)
            return out;
        for (i = 0,
        len = tags.length; len > i; i++)
            pair = tags[i],
            parts = pair.split("="),
            out[parts[0]] = parts[1];
        return out
    }
    ,
    MotdFeedParser.prototype.getFirstMatch = function(feed, match_filter) {
        var items, that;
        return that = this,
        items = feed.filter(function(x) {
            var k, tags, v;
            if (!Object.keys(match_filter).length)
                return !0;
            tags = that.explodeTags(x.t);
            for (k in match_filter)
                if (v = match_filter[k],
                !v(tags[k]))
                    return !1;
            return !0
        }),
        items[0] || {}
    }
    ,
    MotdFeedParser
}(),
angular.module("neo4jApp.services").service("motdFeedParser", [MotdFeedParser]),
angular.module("neo4jApp.services").service("CypherGraphModel", function() {
    var malformed;
    return malformed = function() {
        return new Error("Malformed graph: must add nodes before relationships that connect them")
    }
    ,
    this.convertNode = function() {
        return function(node) {
            return new neo.models.Node(node.id,node.labels,node.properties)
        }
    }
    ,
    this.convertRelationship = function(graph) {
        return function(relationship) {
            var source, target;
            return source = graph.findNode(relationship.startNode) || function() {
                throw malformed()
            }(),
            target = graph.findNode(relationship.endNode) || function() {
                throw malformed()
            }(),
            new neo.models.Relationship(relationship.id,source,target,relationship.type,relationship.properties)
        }
    }
    ,
    this
});
var bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments)
    }
}
;
angular.module("neo4jApp.services").service("AuthService", ["ConnectionStatusService", "Server", "Settings", "$q", function(ConnectionStatusService, Server, Settings, $q) {
    var AuthService, clearConnectionAuthData, setConnectionAuthData;
    return setConnectionAuthData = function(username, password) {
        return ConnectionStatusService.setConnectionAuthData(username, password)
    }
    ,
    clearConnectionAuthData = function() {
        return ConnectionStatusService.clearConnectionAuthData()
    }
    ,
    new (AuthService = function() {
        function AuthService() {
            this.forget = bind(this.forget, this),
            this.authenticate = bind(this.authenticate, this)
        }
        return AuthService.prototype.authenticate = function(username, password) {
            var promise, that;
            return that = this,
            this.current_password = password,
            setConnectionAuthData(username, password),
            promise = this.makeRequest(),
            promise.then(function(r) {
                return ConnectionStatusService.setConnected(!0),
                r
            }, function(r) {
                return 403 !== r.status && that.forget(),
                r
            }),
            promise
        }
        ,
        AuthService.prototype.authorizationRequired = function() {
            var p, q, skip_auth_header;
            return q = $q.defer(),
            p = this.makeRequest(skip_auth_header = !0),
            p.then(function(r) {
                return clearConnectionAuthData(),
                ConnectionStatusService.setAuthorizationRequired(!1),
                q.resolve(r)
            }, function(r) {
                return ConnectionStatusService.setAuthorizationRequired(!0),
                q.reject(r)
            }),
            q.promise
        }
        ,
        AuthService.prototype.hasValidAuthorization = function() {
            var q, req, that;
            return that = this,
            q = $q.defer(),
            req = this.authorizationRequired(),
            req.then(function(r) {
                return ConnectionStatusService.setConnected(!0),
                q.resolve(r)
            }, function(r) {
                return that.isConnected().then(function(r) {
                    return q.resolve(r)
                }, function(r) {
                    return q.reject(r)
                })
            }),
            q.promise
        }
        ,
        AuthService.prototype.isConnected = function() {
            var p, q;
            return q = $q.defer(),
            p = this.makeRequest(),
            p.then(function(rr) {
                return ConnectionStatusService.setConnected(!0),
                q.resolve(rr)
            }, function(rr) {
                return 401 === rr.status && clearConnectionAuthData(),
                q.reject(rr)
            }),
            q.promise
        }
        ,
        AuthService.prototype.makeRequest = function(skip_auth_header) {
            var opts, p;
            return null  == skip_auth_header && (skip_auth_header = !1),
            opts = skip_auth_header ? {
                skipAuthHeader: skip_auth_header
            } : {},
            p = Server.get(Settings.endpoint.rest + "/", opts)
        }
        ,
        AuthService.prototype.forget = function() {
            return ConnectionStatusService.connectedAsUser() && clearConnectionAuthData(),
            this.hasValidAuthorization()
        }
        ,
        AuthService.prototype.setNewPassword = function(old_passwd, new_passwd) {
            var q, that;
            return q = $q.defer(),
            that = this,
            setConnectionAuthData(ConnectionStatusService.connectedAsUser(), old_passwd),
            Server.post(Settings.endpoint.authUser + "/" + ConnectionStatusService.connectedAsUser() + "/password", {
                password: new_passwd
            }).then(function(r) {
                return setConnectionAuthData(ConnectionStatusService.connectedAsUser(), new_passwd),
                q.resolve(r)
            }, function(r) {
                return 401 === r.status && that.forget(),
                q.reject(r)
            }),
            q.promise
        }
        ,
        AuthService.prototype.getCurrentUser = function() {
            return ConnectionStatusService.connectedAsUser()
        }
        ,
        AuthService
    }())
}
]),
angular.module("neo4jApp.services").service("AuthDataService", ["localStorageService", "$base64", function(localStorageService, $base64) {
    var cached_authorization_data, cached_credential_timeout, cached_store_credentials;
    return cached_authorization_data = localStorageService.get("authorization_data") || "",
    cached_store_credentials = null ,
    cached_credential_timeout = null ,
    this.setAuthData = function(authdata) {
        var encoded;
        if (authdata)
            return encoded = $base64.encode(authdata),
            cached_authorization_data = encoded,
            this.getPolicies().storeCredentials !== !1 ? localStorageService.set("authorization_data", encoded) : void 0
    }
    ,
    this.persistCachedAuthData = function() {
        return this.getPolicies().storeCredentials !== !1 ? localStorageService.set("authorization_data", cached_authorization_data) : void 0
    }
    ,
    this.clearAuthData = function() {
        return localStorageService.remove("authorization_data"),
        cached_authorization_data = null 
    }
    ,
    this.clearPersistentAuthData = function() {
        return localStorageService.remove("authorization_data")
    }
    ,
    this.getAuthData = function() {
        return cached_authorization_data || localStorageService.get("authorization_data") || ""
    }
    ,
    this.getPlainAuthData = function() {
        var data;
        return data = this.getAuthData(),
        data ? $base64.decode(data) : ""
    }
    ,
    this.setStoreCredentials = function(storeCredentials) {
        return cached_store_credentials = storeCredentials
    }
    ,
    this.setCredentialTimeout = function(credentialTimeout) {
        return cached_credential_timeout = credentialTimeout
    }
    ,
    this.getPolicies = function() {
        return {
            storeCredentials: cached_store_credentials,
            credentialTimeout: cached_credential_timeout
        }
    }
    ,
    this.clearPolicies = function() {
        return cached_store_credentials = null ,
        cached_credential_timeout = null 
    }
    ,
    this
}
]),
angular.module("neo4jApp.controllers").controller("AuthCtrl", ["$scope", "AuthService", "ConnectionStatusService", "Frame", "Settings", "$timeout", function($scope, AuthService, ConnectionStatusService, Frame, Settings, $timeout) {
    var setPolicyMessage;
    return $scope.username = "neo4j",
    $scope.password = "",
    $scope.current_password = "",
    $scope.connection_summary = ConnectionStatusService.getConnectionStatusSummary(),
    $scope.static_user = $scope.connection_summary.user,
    $scope.static_is_authenticated = $scope.connection_summary.is_connected,
    $scope.policy_message = "",
    setPolicyMessage = function() {
        var _connection_summary, msg;
        if ($scope.static_is_authenticated)
            return _connection_summary = ConnectionStatusService.getConnectionStatusSummary(),
            null  === _connection_summary.credential_timeout ? void $timeout(function() {
                return setPolicyMessage()
            }, 1e3) : (msg = "",
            msg += _connection_summary.store_credentials ? "Connection credentials are stored in your web browser" : "Connection credentials are not stored in your web browser",
            msg += _connection_summary.credential_timeout > 0 ? " and your credential timeout when idle is " + _connection_summary.credential_timeout + " seconds." : ".",
            $scope.$evalAsync(function() {
                return $scope.policy_message = msg
            }))
    }
    ,
    $scope.authenticate = function() {
        return $scope.frame.resetError(),
        $scope.password.length || $scope.frame.addErrorText("You have to enter a password. "),
        $scope.username.length || $scope.frame.addErrorText("You have to enter a username. "),
        $scope.frame.getDetailedErrorText().length ? void 0 : AuthService.authenticate($scope.username, $scope.password).then(function(r) {
            return $scope.frame.resetError(),
            $scope.connection_summary = ConnectionStatusService.getConnectionStatusSummary(),
            $scope.static_user = $scope.connection_summary.user,
            $scope.static_is_authenticated = $scope.connection_summary.is_connected,
            setPolicyMessage(),
            Frame.create({
                input: "" + Settings.initCmd
            }),
            $scope.focusEditor()
        }, function(r) {
            var ref;
            return 403 === r.status && (null  != (ref = r.data.password_change) ? ref.length : void 0) ? ($scope.current_password = $scope.password,
            $scope.password_change_required = !0) : $scope.frame.setError(r)
        })
    }
    ,
    $scope.defaultPasswordChanged = function() {
        return AuthService.hasValidAuthorization().then(function() {
            return $scope.password_change_required = !1,
            $scope.static_user = ConnectionStatusService.connectedAsUser(),
            $scope.static_is_authenticated = ConnectionStatusService.isConnected()
        })
    }
    ,
    setPolicyMessage()
}
]),
angular.module("neo4jApp.controllers").controller("DisconnectCtrl", ["$scope", "AuthService", "ConnectionStatusService", function($scope, AuthService, ConnectionStatusService) {
    return AuthService.forget().then(function() {
        return $scope.static_user = ConnectionStatusService.connectedAsUser(),
        $scope.static_is_authenticated = ConnectionStatusService.isConnected()
    }),
    $scope.focusEditor()
}
]),
angular.module("neo4jApp.controllers").controller("ChangePasswordCtrl", ["$scope", "AuthService", "ConnectionStatusService", "Frame", "Settings", function($scope, AuthService, ConnectionStatusService, Frame, Settings) {
    return $scope.new_password = "",
    $scope.new_password2 = "",
    $scope.current_password = "",
    $scope.password_changed = !1,
    $scope.$parent.frame.resetError(),
    $scope.static_user = ConnectionStatusService.connectedAsUser(),
    $scope.static_is_authenticated = ConnectionStatusService.isConnected(),
    $scope.showCurrentPasswordField = function() {
        return !$scope.$parent.password_change_required
    }
    ,
    $scope.setNewPassword = function() {
        var is_authenticated;
        return is_authenticated = ConnectionStatusService.isConnected(),
        $scope.$parent.frame.resetError(),
        $scope.$parent.password_change_required && ($scope.current_password = $scope.$parent.current_password),
        $scope.static_user = ConnectionStatusService.connectedAsUser(),
        $scope.current_password.length || $scope.$parent.frame.addErrorText("You have to enter your current password. "),
        $scope.new_password.length || $scope.$parent.frame.addErrorText("You have to enter a new password. "),
        $scope.new_password !== $scope.new_password2 && $scope.$parent.frame.addErrorText("The new passwords mismatch, try again. "),
        $scope.$parent.frame.getDetailedErrorText().length ? void 0 : AuthService.setNewPassword($scope.current_password, $scope.new_password).then(function() {
            return is_authenticated || ($scope.$parent.defaultPasswordChanged(),
            Frame.create({
                input: "" + Settings.initCmd
            })),
            $scope.password_changed = !0,
            $scope.$parent.frame.resetError(),
            $scope.focusEditor()
        }, function(r) {
            return $scope.$parent.frame.setError(r)
        })
    }
}
]),
angular.module("neo4jApp.services").factory("RequestInterceptor", ["AuthDataService", function(AuthDataService) {
    var interceptor;
    return interceptor = {
        request: function(config) {
            var header, isLocalRequest, url;
            return isLocalRequest = !0,
            /^https?:/.test(config.url) && (url = document.location.origin || window.location.protocol + "//" + window.location.host,
            config.url.indexOf(0 > url) && (isLocalRequest = !1)),
            config.skipAuthHeader || !isLocalRequest ? config : (header = AuthDataService.getAuthData(),
            header && (config.headers.Authorization = "Basic " + header),
            config)
        }
    }
}
]),
angular.module("neo4jApp.services").config(["$httpProvider", function($httpProvider) {
    return $httpProvider.interceptors.push("RequestInterceptor")
}
]);
var hasProp = {}.hasOwnProperty;
window.neo = window.neo || {},
neo.models = {},
neo.renderers = {
    node: [],
    relationship: []
},
neo.utils = {
    copy: function(src) {
        return JSON.parse(JSON.stringify(src))
    },
    extend: function(dest, src) {
        var k, v;
        if (neo.utils.isObject(dest) || !neo.utils.isObject(src)) {
            for (k in src)
                hasProp.call(src, k) && (v = src[k],
                dest[k] = v);
            return dest
        }
    },
    isArray: Array.isArray || function(obj) {
        return "[object Array]" === Object.prototype.toString.call(obj)
    }
    ,
    isObject: function(obj) {
        return Object(obj) === obj
    }
},
neo.collision = function() {
    var collide, collision;
    return collision = {},
    collide = function(node) {
        var nx1, nx2, ny1, ny2, r;
        return r = node.radius + 10,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r,
        function(quad, x1, y1, x2, y2) {
            var l, x, y;
            return quad.point && quad.point !== node && (x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = node.radius + 10 + quad.point.radius),
            r > l && (l = (l - r) / l * .5,
            node.x -= x *= l,
            node.y -= y *= l,
            quad.point.x += x,
            quad.point.y += y),
            x1 > nx2 || nx1 > x2 || y1 > ny2 || ny1 > y2
        }
    }
    ,
    collision.avoidOverlap = function(nodes) {
        var i, len, n, q, results;
        for (q = d3.geom.quadtree(nodes),
        results = [],
        i = 0,
        len = nodes.length; len > i; i++)
            n = nodes[i],
            results.push(q.visit(collide(n)));
        return results
    }
    ,
    collision
}();
var bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments)
    }
}
;
neo.models.Graph = function() {
    function Graph() {
        this.findRelationship = bind(this.findRelationship, this),
        this.findNodeNeighbourIds = bind(this.findNodeNeighbourIds, this),
        this.findNode = bind(this.findNode, this),
        this.pruneInternalRelationships = bind(this.pruneInternalRelationships, this),
        this.addInternalRelationships = bind(this.addInternalRelationships, this),
        this.addRelationships = bind(this.addRelationships, this),
        this.addNodes = bind(this.addNodes, this),
        this.nodeMap = {},
        this._nodes = [],
        this.relationshipMap = {},
        this._relationships = []
    }
    return Graph.prototype.nodes = function() {
        return this._nodes
    }
    ,
    Graph.prototype.relationships = function() {
        return this._relationships
    }
    ,
    Graph.prototype.groupedRelationships = function() {
        var NodePair, groups, i, ignored, len, nodePair, pair, ref, ref1, relationship, results;
        for (NodePair = function() {
            function NodePair(node1, node2) {
                this.relationships = [],
                node1.id < node2.id ? (this.nodeA = node1,
                this.nodeB = node2) : (this.nodeA = node2,
                this.nodeB = node1)
            }
            return NodePair.prototype.isLoop = function() {
                return this.nodeA === this.nodeB
            }
            ,
            NodePair.prototype.toString = function() {
                return this.nodeA.id + ":" + this.nodeB.id
            }
            ,
            NodePair
        }(),
        groups = {},
        ref = this._relationships,
        i = 0,
        len = ref.length; len > i; i++)
            relationship = ref[i],
            nodePair = new NodePair(relationship.source,relationship.target),
            nodePair = null  != (ref1 = groups[nodePair]) ? ref1 : nodePair,
            nodePair.relationships.push(relationship),
            groups[nodePair] = nodePair;
        results = [];
        for (ignored in groups)
            pair = groups[ignored],
            results.push(pair);
        return results
    }
    ,
    Graph.prototype.addNodes = function(nodes) {
        var i, len, node;
        for (i = 0,
        len = nodes.length; len > i; i++)
            node = nodes[i],
            null  == this.findNode(node.id) && (this.nodeMap[node.id] = node,
            this._nodes.push(node));
        return this
    }
    ,
    Graph.prototype.addRelationships = function(relationships) {
        var existingRelationship, i, len, relationship;
        for (i = 0,
        len = relationships.length; len > i; i++)
            relationship = relationships[i],
            existingRelationship = this.findRelationship(relationship.id),
            null  != existingRelationship ? existingRelationship.internal = !1 : (relationship.internal = !1,
            this.relationshipMap[relationship.id] = relationship,
            this._relationships.push(relationship));
        return this
    }
    ,
    Graph.prototype.addInternalRelationships = function(relationships) {
        var i, len, relationship;
        for (i = 0,
        len = relationships.length; len > i; i++)
            relationship = relationships[i],
            relationship.internal = !0,
            null  == this.findRelationship(relationship.id) && (this.relationshipMap[relationship.id] = relationship,
            this._relationships.push(relationship));
        return this
    }
    ,
    Graph.prototype.pruneInternalRelationships = function() {
        var relationships;
        return relationships = this._relationships.filter(function(relationship) {
            return !relationship.internal
        }),
        this.relationshipMap = {},
        this._relationships = [],
        this.addRelationships(relationships)
    }
    ,
    Graph.prototype.findNode = function(id) {
        return this.nodeMap[id]
    }
    ,
    Graph.prototype.findNodeNeighbourIds = function(id) {
        return this._relationships.filter(function(relationship) {
            return relationship.source.id === id || relationship.target.id === id
        }).map(function(relationship) {
            return relationship.target.id === id ? relationship.source.id : relationship.target.id
        })
    }
    ,
    Graph.prototype.findRelationship = function(id) {
        return this.relationshipMap[id]
    }
    ,
    Graph
}();
var NeoD3Geometry;
NeoD3Geometry = function() {
    function NeoD3Geometry(style1) {
        this.style = style1,
        this.relationshipRouting = new neo.utils.pairwiseArcsRelationshipRouting(this.style)
    }
    var addShortenedNextWord, fitCaptionIntoCircle, noEmptyLines, square;
    return square = function(distance) {
        return distance * distance
    }
    ,
    addShortenedNextWord = function(line, word, measure) {
        var results;
        for (results = []; !(word.length <= 2); ) {
            if (word = word.substr(0, word.length - 2) + "\u2026",
            measure(word) < line.remainingWidth) {
                line.text += " " + word;
                break
            }
            results.push(void 0)
        }
        return results
    }
    ,
    noEmptyLines = function(lines) {
        var i, len, line;
        for (i = 0,
        len = lines.length; len > i; i++)
            if (line = lines[i],
            0 === line.text.length)
                return !1;
        return !0
    }
    ,
    fitCaptionIntoCircle = function(node, style) {
        var candidateLines, candidateWords, captionText, consumedWords, emptyLine, fitOnFixedNumberOfLines, fontFamily, fontSize, i, lineCount, lineHeight, lines, maxLines, measure, ref, ref1, ref2, template, words;
        for (template = style.forNode(node).get("caption"),
        captionText = style.interpolate(template, node),
        fontFamily = "sans-serif",
        fontSize = parseFloat(style.forNode(node).get("font-size")),
        lineHeight = fontSize,
        measure = function(text) {
            return neo.utils.measureText(text, fontFamily, fontSize)
        }
        ,
        words = captionText.split(" "),
        emptyLine = function(lineCount, iLine) {
            var baseline, constainingHeight, lineWidth;
            return baseline = (1 + iLine - lineCount / 2) * lineHeight,
            constainingHeight = lineCount / 2 > iLine ? baseline - lineHeight : baseline,
            lineWidth = 2 * Math.sqrt(square(node.radius) - square(constainingHeight)),
            {
                node: node,
                text: "",
                baseline: baseline,
                remainingWidth: lineWidth
            }
        }
        ,
        fitOnFixedNumberOfLines = function(lineCount) {
            var i, iLine, iWord, line, lines, ref;
            for (lines = [],
            iWord = 0,
            iLine = i = 0,
            ref = lineCount - 1; ref >= 0 ? ref >= i : i >= ref; iLine = ref >= 0 ? ++i : --i) {
                for (line = emptyLine(lineCount, iLine); iWord < words.length && measure(" " + words[iWord]) < line.remainingWidth; )
                    line.text += " " + words[iWord],
                    line.remainingWidth -= measure(" " + words[iWord]),
                    iWord++;
                lines.push(line)
            }
            return iWord < words.length && addShortenedNextWord(lines[lineCount - 1], words[iWord], measure),
            [lines, iWord]
        }
        ,
        consumedWords = 0,
        maxLines = 2 * node.radius / fontSize,
        lines = [emptyLine(1, 0)],
        lineCount = i = 1,
        ref = maxLines; ref >= 1 ? ref >= i : i >= ref; lineCount = ref >= 1 ? ++i : --i)
            if (ref1 = fitOnFixedNumberOfLines(lineCount),
            candidateLines = ref1[0],
            candidateWords = ref1[1],
            noEmptyLines(candidateLines) && (ref2 = [candidateLines, candidateWords],
            lines = ref2[0],
            consumedWords = ref2[1]),
            consumedWords >= words.length)
                return lines;
        return lines
    }
    ,
    NeoD3Geometry.prototype.formatNodeCaptions = function(nodes) {
        var i, len, node, results;
        for (results = [],
        i = 0,
        len = nodes.length; len > i; i++)
            node = nodes[i],
            results.push(node.caption = fitCaptionIntoCircle(node, this.style));
        return results
    }
    ,
    NeoD3Geometry.prototype.formatRelationshipCaptions = function(relationships) {
        var i, len, relationship, results, template;
        for (results = [],
        i = 0,
        len = relationships.length; len > i; i++)
            relationship = relationships[i],
            template = this.style.forRelationship(relationship).get("caption"),
            results.push(relationship.caption = this.style.interpolate(template, relationship));
        return results
    }
    ,
    NeoD3Geometry.prototype.setNodeRadii = function(nodes) {
        var i, len, node, results;
        for (results = [],
        i = 0,
        len = nodes.length; len > i; i++)
            node = nodes[i],
            results.push(node.radius = parseFloat(this.style.forNode(node).get("diameter")) / 2);
        return results
    }
    ,
    NeoD3Geometry.prototype.onGraphChange = function(graph) {
        return this.setNodeRadii(graph.nodes()),
        this.formatNodeCaptions(graph.nodes()),
        this.formatRelationshipCaptions(graph.relationships()),
        this.relationshipRouting.measureRelationshipCaptions(graph.relationships())
    }
    ,
    NeoD3Geometry.prototype.onTick = function(graph) {
        return this.relationshipRouting.layoutRelationships(graph)
    }
    ,
    NeoD3Geometry
}();
var slice = [].slice;
neo.graphView = function() {
    function graphView(element, measureSize, graph, style) {
        var callbacks, layout;
        this.graph = graph,
        this.style = style,
        layout = neo.layout.force(),
        this.viz = neo.viz(element, measureSize, this.graph, layout, this.style),
        this.callbacks = {},
        callbacks = this.callbacks,
        this.viz.trigger = function() {
            return function() {
                var args, callback, event, i, len, ref, results;
                for (event = arguments[0],
                args = 2 <= arguments.length ? slice.call(arguments, 1) : [],
                ref = callbacks[event] || [],
                results = [],
                i = 0,
                len = ref.length; len > i; i++)
                    callback = ref[i],
                    results.push(callback.apply(null , args));
                return results
            }
        }()
    }
    return graphView.prototype.on = function(event, callback) {
        var base;
        return (null  != (base = this.callbacks)[event] ? base[event] : base[event] = []).push(callback),
        this
    }
    ,
    graphView.prototype.layout = function(value) {
        var layout;
        return arguments.length ? (layout = value,
        this) : layout
    }
    ,
    graphView.prototype.grass = function(value) {
        return arguments.length ? (this.style.importGrass(value),
        this) : this.style.toSheet()
    }
    ,
    graphView.prototype.update = function() {
        return this.viz.update(),
        this
    }
    ,
    graphView.prototype.resize = function() {
        return this.viz.resize(),
        this
    }
    ,
    graphView.prototype.boundingBox = function() {
        return this.viz.boundingBox()
    }
    ,
    graphView.prototype.collectStats = function() {
        return this.viz.collectStats()
    }
    ,
    graphView
}(),
neo.layout = function() {
    var _layout;
    return _layout = {},
    _layout.force = function() {
        var _force;
        return _force = {},
        _force.init = function(render) {
            var accelerateLayout, currentStats, d3force, forceLayout, linkDistance, newStatsBucket, oneRelationshipPerPairOfNodes;
            return forceLayout = {},
            linkDistance = 45,
            d3force = d3.layout.force().linkDistance(function(relationship) {
                return relationship.source.radius + relationship.target.radius + linkDistance
            }).charge(-1e3),
            newStatsBucket = function() {
                var bucket;
                return bucket = {
                    layoutTime: 0,
                    layoutSteps: 0
                }
            }
            ,
            currentStats = newStatsBucket(),
            forceLayout.collectStats = function() {
                var latestStats;
                return latestStats = currentStats,
                currentStats = newStatsBucket(),
                latestStats
            }
            ,
            accelerateLayout = function() {
                var d3Tick, maxAnimationFramesPerSecond, maxComputeTime, maxStepsPerTick, now;
                return maxStepsPerTick = 100,
                maxAnimationFramesPerSecond = 60,
                maxComputeTime = 1e3 / maxAnimationFramesPerSecond,
                now = window.performance && window.performance.now ? function() {
                    return window.performance.now()
                }
                 : function() {
                    return Date.now()
                }
                ,
                d3Tick = d3force.tick,
                d3force.tick = function() {
                    var startCalcs, startTick, step;
                    for (startTick = now(),
                    step = maxStepsPerTick; step-- && now() - startTick < maxComputeTime; ) {
                        if (startCalcs = now(),
                        currentStats.layoutSteps++,
                        neo.collision.avoidOverlap(d3force.nodes()),
                        d3Tick())
                            return maxStepsPerTick = 2,
                            !0;
                        currentStats.layoutTime += now() - startCalcs
                    }
                    return render(),
                    !1
                }
            }
            ,
            accelerateLayout(),
            oneRelationshipPerPairOfNodes = function(graph) {
                var i, len, pair, ref, results;
                for (ref = graph.groupedRelationships(),
                results = [],
                i = 0,
                len = ref.length; len > i; i++)
                    pair = ref[i],
                    results.push(pair.relationships[0]);
                return results
            }
            ,
            forceLayout.update = function(graph, size) {
                var center, nodes, radius, relationships;
                return nodes = neo.utils.cloneArray(graph.nodes()),
                relationships = oneRelationshipPerPairOfNodes(graph),
                radius = nodes.length * linkDistance / (2 * Math.PI),
                center = {
                    x: size[0] / 2,
                    y: size[1] / 2
                },
                neo.utils.circularLayout(nodes, center, radius),
                d3force.nodes(nodes).links(relationships).size(size).start()
            }
            ,
            forceLayout.drag = d3force.drag,
            forceLayout
        }
        ,
        _force
    }
    ,
    _layout
}();
var hasProp = {}.hasOwnProperty;
neo.models.Node = function() {
    function Node(id, labels, properties) {
        var key, value;
        this.id = id,
        this.labels = labels,
        this.propertyMap = properties,
        this.propertyList = function() {
            var results;
            results = [];
            for (key in properties)
                hasProp.call(properties, key) && (value = properties[key],
                results.push({
                    key: key,
                    value: value
                }));
            return results
        }()
    }
    return Node.prototype.toJSON = function() {
        return this.propertyMap
    }
    ,
    Node.prototype.isNode = !0,
    Node.prototype.isRelationship = !1,
    Node.prototype.relationshipCount = function(graph) {
        var i, len, node, ref, relationship, rels;
        for (node = this,
        rels = [],
        ref = graph.relationships(),
        i = 0,
        len = ref.length; len > i; i++)
            relationship = ref[i],
            (relationship.source === node || relationship.target === node) && rels.push[relationship];
        return rels.length
    }
    ,
    Node
}(),
neo.queryPlan = function(element) {
    var augment, color, colors, costColor, detailFontSize, display, dividerColor, fixedWidthFont, formatNumber, layout, linkColor, margin, maxChildOperators, maxComparableDbHits, maxComparableRows, maxCostHeight, operatorCategories, operatorColors, operatorCornerRadius, operatorDetailHeight, operatorDetails, operatorHeaderFontSize, operatorHeaderHeight, operatorMargin, operatorPadding, operatorWidth, plural, rankMargin, render, rows, standardFont, transform;
    return maxChildOperators = 2,
    maxComparableRows = 1e6,
    maxComparableDbHits = 1e6,
    operatorWidth = 180,
    operatorCornerRadius = 4,
    operatorHeaderHeight = 18,
    operatorHeaderFontSize = 11,
    operatorDetailHeight = 14,
    maxCostHeight = 50,
    detailFontSize = 10,
    operatorMargin = 50,
    operatorPadding = 3,
    rankMargin = 50,
    margin = 10,
    standardFont = "'Helvetica Neue',Helvetica,Arial,sans-serif",
    fixedWidthFont = "Monaco,'Courier New',Terminal,monospace",
    linkColor = "#DFE1E3",
    costColor = "#F25A29",
    dividerColor = "#DFE1E3",
    operatorColors = colorbrewer.Blues[9].slice(2),
    operatorCategories = {
        result: ["result"],
        seek: ["scan", "seek", "argument"],
        rows: ["limit", "top", "skip", "sort", "union", "projection"],
        other: [],
        filter: ["select", "filter", "apply", "distinct"],
        expand: ["expand", "product", "join", "optional", "path"],
        eager: ["eager"]
    },
    augment = function(color) {
        return {
            color: color,
            "border-color": d3.rgb(color).darker(),
            "text-color-internal": d3.hsl(color).l < .7 ? "#FFFFFF" : "#000000"
        }
    }
    ,
    colors = d3.scale.ordinal().domain(d3.keys(operatorCategories)).range(operatorColors),
    color = function(d) {
        var j, keyword, keywords, len, name;
        for (name in operatorCategories)
            for (keywords = operatorCategories[name],
            j = 0,
            len = keywords.length; len > j; j++)
                if (keyword = keywords[j],
                new RegExp(keyword,"i").test(d))
                    return augment(colors(name));
        return augment(colors("other"))
    }
    ,
    rows = function(operator) {
        var ref, ref1;
        return null  != (ref = null  != (ref1 = operator.Rows) ? ref1 : operator.EstimatedRows) ? ref : 0
    }
    ,
    plural = function(noun, count) {
        return 1 === count ? noun : noun + "s"
    }
    ,
    formatNumber = d3.format(",.0f"),
    operatorDetails = function(operator) {
        var detail, details, expression, identifiers, j, len, ref, ref1, ref2, ref3, wordWrap, y;
        if (!operator.expanded)
            return [];
        for (details = [],
        wordWrap = function(string, className) {
            var firstWord, lastWord, measure, results, words;
            for (measure = function(text) {
                return neo.utils.measureText(text, fixedWidthFont, 10)
            }
            ,
            words = string.split(/([^a-zA-Z\d])/),
            firstWord = 0,
            lastWord = 1,
            results = []; firstWord < words.length; ) {
                for (; lastWord < words.length && measure(words.slice(firstWord, lastWord + 1).join("")) < operatorWidth - 2 * operatorPadding; )
                    lastWord++;
                details.push({
                    className: className,
                    value: words.slice(firstWord, lastWord).join("")
                }),
                firstWord = lastWord,
                results.push(lastWord = firstWord + 1)
            }
            return results
        }
        ,
        (identifiers = null  != (ref = operator.identifiers) ? ref : null  != (ref1 = operator.KeyNames) ? ref1.split(", ") : void 0) && (wordWrap(identifiers.filter(function(d) {
            return !/^  /.test(d)
        }).join(", "), "identifiers"),
        details.push({
            className: "padding"
        })),
        (expression = null  != (ref2 = null  != (ref3 = operator.LegacyExpression) ? ref3 : operator.ExpandExpression) ? ref2 : operator.LabelName) && (wordWrap(expression, "expression"),
        details.push({
            className: "padding"
        })),
        null  != operator.Rows && null  != operator.EstimatedRows && details.push({
            className: "estimated-rows",
            key: "estimated rows",
            value: formatNumber(operator.EstimatedRows)
        }),
        null  == operator.DbHits || operator.alwaysShowCost || details.push({
            className: "db-hits",
            key: plural("db hit", operator.DbHits || 0),
            value: formatNumber(operator.DbHits || 0)
        }),
        details.length && "padding" === details[details.length - 1].className && details.pop(),
        y = operatorDetailHeight,
        j = 0,
        len = details.length; len > j; j++)
            detail = details[j],
            detail.y = y,
            y += "padding" === detail.className ? 2 * operatorPadding : operatorDetailHeight;
        return details
    }
    ,
    transform = function(queryPlan) {
        var collectLinks, links, operators, result;
        return operators = [],
        links = [],
        result = {
            operatorType: "Result",
            children: [queryPlan.root]
        },
        collectLinks = function(operator, rank) {
            var child, j, len, ref, results;
            for (operators.push(operator),
            operator.rank = rank,
            ref = operator.children,
            results = [],
            j = 0,
            len = ref.length; len > j; j++)
                child = ref[j],
                child.parent = operator,
                collectLinks(child, rank + 1),
                results.push(links.push({
                    source: child,
                    target: operator
                }));
            return results
        }
        ,
        collectLinks(result, 0),
        [operators, links]
    }
    ,
    layout = function(operators, links) {
        var alpha, center, child, childrenWidth, collide, costHeight, currentY, height, iterations, j, k, l, len, len1, len2, len3, len4, link, linkWidth, m, n, operator, operatorHeight, rank, ranks, ref, ref1, relaxDownwards, relaxUpwards, tx, width;
        for (costHeight = function() {
            var scale;
            return scale = d3.scale.log().domain([1, Math.max(d3.max(operators, function(operator) {
                return operator.DbHits || 0
            }), maxComparableDbHits)]).range([0, maxCostHeight]),
            function(operator) {
                var ref;
                return scale((null  != (ref = operator.DbHits) ? ref : 0) + 1)
            }
        }(),
        operatorHeight = function(operator) {
            var height;
            return height = operatorHeaderHeight,
            operator.expanded && (height += operatorDetails(operator).slice(-1)[0].y + 2 * operatorPadding),
            height += costHeight(operator)
        }
        ,
        linkWidth = function() {
            var scale;
            return scale = d3.scale.log().domain([1, Math.max(d3.max(operators, function(operator) {
                return rows(operator) + 1
            }), maxComparableRows)]).range([2, (operatorWidth - 2 * operatorCornerRadius) / maxChildOperators]),
            function(operator) {
                return scale(rows(operator) + 1)
            }
        }(),
        j = 0,
        len = operators.length; len > j; j++)
            for (operator = operators[j],
            operator.height = operatorHeight(operator),
            operator.costHeight = costHeight(operator),
            operator.costHeight > operatorDetailHeight + operatorPadding && (operator.alwaysShowCost = !0),
            childrenWidth = d3.sum(operator.children, linkWidth),
            tx = (operatorWidth - childrenWidth) / 2,
            ref = operator.children,
            k = 0,
            len1 = ref.length; len1 > k; k++)
                child = ref[k],
                child.tx = tx,
                tx += linkWidth(child);
        for (l = 0,
        len2 = links.length; len2 > l; l++)
            link = links[l],
            link.width = linkWidth(link.source);
        for (ranks = d3.nest().key(function(operator) {
            return operator.rank
        }).entries(operators),
        currentY = 0,
        m = 0,
        len3 = ranks.length; len3 > m; m++)
            for (rank = ranks[m],
            currentY -= d3.max(rank.values, operatorHeight) + rankMargin,
            ref1 = rank.values,
            n = 0,
            len4 = ref1.length; len4 > n; n++)
                operator = ref1[n],
                operator.x = 0,
                operator.y = currentY;
        for (width = d3.max(ranks.map(function(rank) {
            return rank.values.length * (operatorWidth + operatorMargin)
        })),
        height = -currentY,
        collide = function() {
            var dx, i, lastOperator, len5, len6, p, q, ref2, results, x0;
            for (results = [],
            p = 0,
            len5 = ranks.length; len5 > p; p++) {
                for (rank = ranks[p],
                x0 = 0,
                ref2 = rank.values,
                q = 0,
                len6 = ref2.length; len6 > q; q++)
                    operator = ref2[q],
                    dx = x0 - operator.x,
                    dx > 0 && (operator.x += dx),
                    x0 = operator.x + operatorWidth + operatorMargin;
                dx = x0 - operatorMargin - width,
                dx > 0 ? (lastOperator = rank.values[rank.values.length - 1],
                x0 = lastOperator.x -= dx,
                results.push(function() {
                    var r, ref3, results1;
                    for (results1 = [],
                    i = r = ref3 = rank.values.length - 2; r >= 0; i = r += -1)
                        operator = rank.values[i],
                        dx = operator.x + operatorWidth + operatorMargin - x0,
                        dx > 0 ? (operator.x -= operatorWidth,
                        results1.push(x0 = operator.x)) : results1.push(void 0);
                    return results1
                }())) : results.push(void 0)
            }
            return results
        }
        ,
        center = function(operator) {
            return operator.x + operatorWidth / 2
        }
        ,
        relaxUpwards = function(alpha) {
            var len5, p, results, x;
            for (results = [],
            p = 0,
            len5 = ranks.length; len5 > p; p++)
                rank = ranks[p],
                results.push(function() {
                    var len6, q, ref2, results1;
                    for (ref2 = rank.values,
                    results1 = [],
                    q = 0,
                    len6 = ref2.length; len6 > q; q++)
                        operator = ref2[q],
                        operator.children.length ? (x = d3.sum(operator.children, function(child) {
                            return linkWidth(child) * center(child)
                        }) / d3.sum(operator.children, linkWidth),
                        results1.push(operator.x += (x - center(operator)) * alpha)) : results1.push(void 0);
                    return results1
                }());
            return results
        }
        ,
        relaxDownwards = function(alpha) {
            var len5, p, ref2, results;
            for (ref2 = ranks.slice().reverse(),
            results = [],
            p = 0,
            len5 = ref2.length; len5 > p; p++)
                rank = ref2[p],
                results.push(function() {
                    var len6, q, ref3, results1;
                    for (ref3 = rank.values,
                    results1 = [],
                    q = 0,
                    len6 = ref3.length; len6 > q; q++)
                        operator = ref3[q],
                        operator.parent ? results1.push(operator.x += (center(operator.parent) - center(operator)) * alpha) : results1.push(void 0);
                    return results1
                }());
            return results
        }
        ,
        collide(),
        iterations = 300,
        alpha = 1; iterations--; )
            relaxUpwards(alpha),
            collide(),
            relaxDownwards(alpha),
            collide(),
            alpha *= .98;
        return width = d3.max(operators, function(o) {
            return o.x
        }) - d3.min(operators, function(o) {
            return o.x
        }) + operatorWidth,
        [width, height]
    }
    ,
    render = function(operators, links, width, height, redisplay) {
        var join, svg;
        return svg = d3.select(element),
        svg.transition().attr("width", width + 2 * margin).attr("height", height + 2 * margin).attr("viewBox", [d3.min(operators, function(o) {
            return o.x
        }) - margin, -margin - height, width + 2 * margin, height + 2 * margin].join(" ")),
        (join = function(parent, children) {
            var child, j, len, ref, results, selection;
            for (ref = d3.entries(children),
            results = [],
            j = 0,
            len = ref.length; len > j; j++)
                child = ref[j],
                selection = parent.selectAll(child.key).data(child.value.data),
                child.value.selections(selection.enter(), selection, selection.exit()),
                child.value.children ? results.push(join(selection, child.value.children)) : results.push(void 0);
            return results
        }
        )(svg, {
            "g.layer.links": {
                data: [links],
                selections: function(enter) {
                    return enter.append("g").attr("class", "layer links")
                },
                children: {
                    ".link": {
                        data: function(d) {
                            return d
                        },
                        selections: function(enter) {
                            return enter.append("g").attr("class", "link")
                        },
                        children: {
                            path: {
                                data: function(d) {
                                    return [d]
                                },
                                selections: function(enter, update) {
                                    return enter.append("path").attr("fill", linkColor),
                                    update.transition().attr("d", function(d) {
                                        var control1, control2, controlWidth, curvature, sourceX, sourceY, targetX, targetY, yi;
                                        return width = Math.max(1, d.width),
                                        sourceX = d.source.x + operatorWidth / 2,
                                        targetX = d.target.x + d.source.tx,
                                        sourceY = d.source.y + d.source.height,
                                        targetY = d.target.y,
                                        yi = d3.interpolateNumber(sourceY, targetY),
                                        curvature = .5,
                                        control1 = yi(curvature),
                                        control2 = yi(1 - curvature),
                                        controlWidth = Math.min(width / Math.PI, (targetY - sourceY) / Math.PI),
                                        sourceX > targetX + width / 2 && (controlWidth *= -1),
                                        ["M", sourceX + width / 2, sourceY, "C", sourceX + width / 2, control1 - controlWidth, targetX + width, control2 - controlWidth, targetX + width, targetY, "L", targetX, targetY, "C", targetX, control2 + controlWidth, sourceX - width / 2, control1 + controlWidth, sourceX - width / 2, sourceY, "Z"].join(" ")
                                    })
                                }
                            },
                            text: {
                                data: function(d) {
                                    var caption, key, ref, source, x, y;
                                    return x = d.source.x + operatorWidth / 2,
                                    y = d.source.y + d.source.height + operatorDetailHeight,
                                    source = d.source,
                                    null  != source.Rows || null  != source.EstimatedRows ? (ref = null  != source.Rows ? ["Rows", "row"] : ["EstimatedRows", "estimated row"],
                                    key = ref[0],
                                    caption = ref[1],
                                    [{
                                        x: x,
                                        y: y,
                                        text: formatNumber(source[key]) + "\xa0",
                                        anchor: "end"
                                    }, {
                                        x: x,
                                        y: y,
                                        text: plural(caption, source[key]),
                                        anchor: "start"
                                    }]) : []
                                },
                                selections: function(enter, update) {
                                    return enter.append("text").attr("font-size", detailFontSize).attr("font-family", standardFont),
                                    update.transition().attr("x", function(d) {
                                        return d.x
                                    }).attr("y", function(d) {
                                        return d.y
                                    }).attr("text-anchor", function(d) {
                                        return d.anchor
                                    }).text(function(d) {
                                        return d.text
                                    })
                                }
                            }
                        }
                    }
                }
            },
            "g.layer.operators": {
                data: [operators],
                selections: function(enter) {
                    return enter.append("g").attr("class", "layer operators")
                },
                children: {
                    ".operator": {
                        data: function(d) {
                            return d
                        },
                        selections: function(enter, update) {
                            return enter.append("g").attr("class", "operator"),
                            update.transition().attr("transform", function(d) {
                                return "translate(" + d.x + "," + d.y + ")"
                            })
                        },
                        children: {
                            "rect.background": {
                                data: function(d) {
                                    return [d]
                                },
                                selections: function(enter, update) {
                                    return enter.append("rect").attr("class", "background"),
                                    update.transition().attr("width", operatorWidth).attr("height", function(d) {
                                        return d.height
                                    }).attr("rx", operatorCornerRadius).attr("ry", operatorCornerRadius).attr("fill", "white").style("stroke", "none")
                                }
                            },
                            "g.header": {
                                data: function(d) {
                                    return [d]
                                },
                                selections: function(enter) {
                                    return enter.append("g").attr("class", "header").attr("pointer-events", "all").on("click", function(d) {
                                        return d.expanded = !d.expanded,
                                        redisplay()
                                    })
                                },
                                children: {
                                    "path.banner": {
                                        data: function(d) {
                                            return [d]
                                        },
                                        selections: function(enter, update) {
                                            return enter.append("path").attr("class", "banner"),
                                            update.attr("d", function(d) {
                                                var shaving;
                                                return shaving = d.height <= operatorHeaderHeight ? operatorCornerRadius : d.height < operatorHeaderHeight + operatorCornerRadius ? operatorCornerRadius - Math.sqrt(Math.pow(operatorCornerRadius, 2) - Math.pow(operatorCornerRadius - d.height + operatorHeaderHeight, 2)) : 0,
                                                ["M", operatorWidth - operatorCornerRadius, 0, "A", operatorCornerRadius, operatorCornerRadius, 0, 0, 1, operatorWidth, operatorCornerRadius, "L", operatorWidth, operatorHeaderHeight - operatorCornerRadius, "A", operatorCornerRadius, operatorCornerRadius, 0, 0, 1, operatorWidth - shaving, operatorHeaderHeight, "L", shaving, operatorHeaderHeight, "A", operatorCornerRadius, operatorCornerRadius, 0, 0, 1, 0, operatorHeaderHeight - operatorCornerRadius, "L", 0, operatorCornerRadius, "A", operatorCornerRadius, operatorCornerRadius, 0, 0, 1, operatorCornerRadius, 0, "Z"].join(" ")
                                            }).style("fill", function(d) {
                                                return color(d.operatorType).color
                                            })
                                        }
                                    },
                                    "path.expand": {
                                        data: function(d) {
                                            return "Result" === d.operatorType ? [] : [d]
                                        },
                                        selections: function(enter, update) {
                                            var rotateForExpand;
                                            return rotateForExpand = function(d) {
                                                return d3.transform(),
                                                "translate(" + operatorHeaderHeight / 2 + ", " + operatorHeaderHeight / 2 + ") " + ("rotate(" + (d.expanded ? 90 : 0) + ") ") + "scale(0.5)"
                                            }
                                            ,
                                            enter.append("path").attr("class", "expand").attr("fill", function(d) {
                                                return color(d.operatorType)["text-color-internal"]
                                            }).attr("d", "M -5 -10 L 8.66 0 L -5 10 Z").attr("transform", rotateForExpand),
                                            update.transition().attrTween("transform", function(d, i, a) {
                                                return d3.interpolateString(a, rotateForExpand(d))
                                            })
                                        }
                                    },
                                    "text.title": {
                                        data: function(d) {
                                            return [d]
                                        },
                                        selections: function(enter) {
                                            return enter.append("text").attr("class", "title").attr("font-size", operatorHeaderFontSize).attr("font-family", standardFont).attr("x", operatorHeaderHeight).attr("y", 13).attr("fill", function(d) {
                                                return color(d.operatorType)["text-color-internal"]
                                            }).text(function(d) {
                                                return d.operatorType
                                            })
                                        }
                                    }
                                }
                            },
                            "g.detail": {
                                data: operatorDetails,
                                selections: function(enter, update, exit) {
                                    return enter.append("g"),
                                    update.attr("class", function(d) {
                                        return "detail " + d.className
                                    }).attr("transform", function(d) {
                                        return "translate(0, " + (operatorHeaderHeight + d.y) + ")"
                                    }).attr("font-family", function(d) {
                                        return "expression" === d.className || "identifiers" === d.className ? fixedWidthFont : standardFont
                                    }),
                                    exit.remove()
                                },
                                children: {
                                    text: {
                                        data: function(d) {
                                            return d.key ? [{
                                                text: d.value + "\xa0",
                                                anchor: "end",
                                                x: operatorWidth / 2
                                            }, {
                                                text: d.key,
                                                anchor: "start",
                                                x: operatorWidth / 2
                                            }] : [{
                                                text: d.value,
                                                anchor: "start",
                                                x: operatorPadding
                                            }]
                                        },
                                        selections: function(enter, update, exit) {
                                            return enter.append("text").attr("font-size", detailFontSize),
                                            update.attr("x", function(d) {
                                                return d.x
                                            }).attr("text-anchor", function(d) {
                                                return d.anchor
                                            }).attr("fill", "black").transition().each("end", function() {
                                                return update.text(function(d) {
                                                    return d.text
                                                })
                                            }),
                                            exit.remove()
                                        }
                                    },
                                    "path.divider": {
                                        data: function(d) {
                                            return "padding" === d.className ? [d] : []
                                        },
                                        selections: function(enter, update) {
                                            return enter.append("path").attr("class", "divider").attr("visibility", "hidden"),
                                            update.attr("d", ["M", 0, 2 * -operatorPadding, "L", operatorWidth, 2 * -operatorPadding].join(" ")).attr("stroke", dividerColor).transition().each("end", function() {
                                                return update.attr("visibility", "visible")
                                            })
                                        }
                                    }
                                }
                            },
                            "path.cost": {
                                data: function(d) {
                                    return [d]
                                },
                                selections: function(enter, update) {
                                    return enter.append("path").attr("class", "cost").attr("fill", costColor),
                                    update.transition().attr("d", function(d) {
                                        var shaving;
                                        return d.costHeight < operatorCornerRadius ? (shaving = operatorCornerRadius - Math.sqrt(Math.pow(operatorCornerRadius, 2) - Math.pow(operatorCornerRadius - d.costHeight, 2)),
                                        ["M", operatorWidth - shaving, d.height - d.costHeight, "A", operatorCornerRadius, operatorCornerRadius, 0, 0, 1, operatorWidth - operatorCornerRadius, d.height, "L", operatorCornerRadius, d.height, "A", operatorCornerRadius, operatorCornerRadius, 0, 0, 1, shaving, d.height - d.costHeight, "Z"].join(" ")) : ["M", 0, d.height - d.costHeight, "L", operatorWidth, d.height - d.costHeight, "L", operatorWidth, d.height - operatorCornerRadius, "A", operatorCornerRadius, operatorCornerRadius, 0, 0, 1, operatorWidth - operatorCornerRadius, d.height, "L", operatorCornerRadius, d.height, "A", operatorCornerRadius, operatorCornerRadius, 0, 0, 1, 0, d.height - operatorCornerRadius, "Z"].join(" ")
                                    })
                                }
                            },
                            "text.cost": {
                                data: function(d) {
                                    var y;
                                    return d.alwaysShowCost ? (y = d.height - d.costHeight + operatorDetailHeight,
                                    [{
                                        text: formatNumber(d.DbHits) + "\xa0",
                                        anchor: "end",
                                        y: y
                                    }, {
                                        text: "db hits",
                                        anchor: "start",
                                        y: y
                                    }]) : []
                                },
                                selections: function(enter, update) {
                                    return enter.append("text").attr("class", "cost").attr("font-size", detailFontSize).attr("font-family", standardFont).attr("fill", "white"),
                                    update.attr("x", operatorWidth / 2).attr("text-anchor", function(d) {
                                        return d.anchor
                                    }).transition().attr("y", function(d) {
                                        return d.y
                                    }).each("end", function() {
                                        return update.text(function(d) {
                                            return d.text
                                        })
                                    })
                                }
                            },
                            "rect.outline": {
                                data: function(d) {
                                    return [d]
                                },
                                selections: function(enter, update) {
                                    return enter.append("rect").attr("class", "outline"),
                                    update.transition().attr("width", operatorWidth).attr("height", function(d) {
                                        return d.height
                                    }).attr("rx", operatorCornerRadius).attr("ry", operatorCornerRadius).attr("fill", "none").attr("stroke-width", 1).style("stroke", function(d) {
                                        return color(d.operatorType)["border-color"]
                                    })
                                }
                            }
                        }
                    }
                }
            }
        })
    }
    ,
    display = function(queryPlan) {
        var height, links, operators, ref, ref1, width;
        return ref = transform(queryPlan),
        operators = ref[0],
        links = ref[1],
        ref1 = layout(operators, links),
        width = ref1[0],
        height = ref1[1],
        render(operators, links, width, height, function() {
            return display(queryPlan)
        })
    }
    ,
    this.display = display,
    this
}
;
var hasProp = {}.hasOwnProperty;
neo.models.Relationship = function() {
    function Relationship(id, source, target, type, properties) {
        var key, value;
        this.id = id,
        this.source = source,
        this.target = target,
        this.type = type,
        this.propertyMap = properties,
        this.propertyList = function() {
            var ref, results;
            ref = this.propertyMap,
            results = [];
            for (key in ref)
                hasProp.call(ref, key) && (value = ref[key],
                results.push({
                    key: key,
                    value: value
                }));
            return results
        }
        .call(this)
    }
    return Relationship.prototype.toJSON = function() {
        return this.propertyMap
    }
    ,
    Relationship.prototype.isNode = !1,
    Relationship.prototype.isRelationship = !0,
    Relationship.prototype.isLoop = function() {
        return this.source === this.target
    }
    ,
    Relationship
}(),
neo.Renderer = function() {
    function Renderer(opts) {
        null  == opts && (opts = {}),
        neo.utils.extend(this, opts),
        null  == this.onGraphChange && (this.onGraphChange = function() {}
        ),
        null  == this.onTick && (this.onTick = function() {}
        )
    }
    return Renderer
}(),
neo.style = function() {
    var GraphStyle, Selector, StyleElement, StyleRule, _style;
    return _style = function(storage) {
        return new GraphStyle(storage)
    }
    ,
    _style.defaults = {
        autoColor: !0,
        colors: [{
            color: "#DFE1E3",
            "border-color": "#D4D6D7",
            "text-color-internal": "#000000"
        }, {
            color: "#F25A29",
            "border-color": "#DC4717",
            "text-color-internal": "#FFFFFF"
        }, {
            color: "#AD62CE",
            "border-color": "#9453B1",
            "text-color-internal": "#FFFFFF"
        }, {
            color: "#30B6AF",
            "border-color": "#46A39E",
            "text-color-internal": "#FFFFFF"
        }, {
            color: "#FF6C7C",
            "border-color": "#EB5D6C",
            "text-color-internal": "#FFFFFF"
        }, {
            color: "#FCC940",
            "border-color": "#F3BA25",
            "text-color-internal": "#000000"
        }, {
            color: "#4356C0",
            "border-color": "#3445A2",
            "text-color-internal": "#FFFFFF"
        }],
        style: {
            node: {
                diameter: "40px",
                color: "#DFE1E3",
                "border-color": "#D4D6D7",
                "border-width": "2px",
                "text-color-internal": "#000000",
                caption: "{id}",
                "font-size": "10px"
            },
            relationship: {
                color: "#D4D6D7",
                "shaft-width": "1px",
                "font-size": "8px",
                padding: "3px",
                "text-color-external": "#000000",
                "text-color-internal": "#FFFFFF"
            }
        },
        sizes: [{
            diameter: "10px"
        }, {
            diameter: "20px"
        }, {
            diameter: "30px"
        }, {
            diameter: "50px"
        }, {
            diameter: "80px"
        }],
        arrayWidths: [{
            "shaft-width": "1px"
        }, {
            "shaft-width": "2px"
        }, {
            "shaft-width": "3px"
        }, {
            "shaft-width": "5px"
        }, {
            "shaft-width": "8px"
        }, {
            "shaft-width": "13px"
        }, {
            "shaft-width": "25px"
        }, {
            "shaft-width": "38px"
        }]
    },
    Selector = function() {
        function Selector(selector) {
            var ref;
            ref = selector.indexOf(".") > 0 ? selector.split(".") : [selector, void 0],
            this.tag = ref[0],
            this.klass = ref[1]
        }
        return Selector.prototype.toString = function() {
            var str;
            return str = this.tag,
            null  != this.klass && (str += "." + this.klass),
            str
        }
        ,
        Selector
    }(),
    StyleRule = function() {
        function StyleRule(selector1, props1) {
            this.selector = selector1,
            this.props = props1
        }
        return StyleRule.prototype.matches = function(selector) {
            return this.selector.tag !== selector.tag || this.selector.klass !== selector.klass && this.selector.klass ? !1 : !0
        }
        ,
        StyleRule.prototype.matchesExact = function(selector) {
            return this.selector.tag === selector.tag && this.selector.klass === selector.klass
        }
        ,
        StyleRule
    }(),
    StyleElement = function() {
        function StyleElement(selector, data1) {
            this.data = data1,
            this.selector = selector,
            this.props = {}
        }
        return StyleElement.prototype.applyRules = function(rules) {
            var i, j, len, len1, rule;
            for (i = 0,
            len = rules.length; len > i; i++)
                if (rule = rules[i],
                rule.matches(this.selector)) {
                    neo.utils.extend(this.props, rule.props);
                    break
                }
            for (j = 0,
            len1 = rules.length; len1 > j; j++)
                if (rule = rules[j],
                rule.matchesExact(this.selector)) {
                    neo.utils.extend(this.props, rule.props);
                    break
                }
            return this
        }
        ,
        StyleElement.prototype.get = function(attr) {
            return this.props[attr] || ""
        }
        ,
        StyleElement
    }(),
    GraphStyle = function() {
        function GraphStyle(storage1) {
            this.storage = storage1,
            this.rules = [],
            this.loadRules()
        }
        return GraphStyle.prototype.selector = function(item) {
            return item.isNode ? this.nodeSelector(item) : item.isRelationship ? this.relationshipSelector(item) : void 0
        }
        ,
        GraphStyle.prototype.calculateStyle = function(selector, data) {
            return new StyleElement(selector,data).applyRules(this.rules)
        }
        ,
        GraphStyle.prototype.forEntity = function(item) {
            return this.calculateStyle(this.selector(item), item)
        }
        ,
        GraphStyle.prototype.forNode = function(node) {
            var ref, selector;
            return null  == node && (node = {}),
            selector = this.nodeSelector(node),
            (null  != (ref = node.labels) ? ref.length : void 0) > 0 && this.setDefaultStyling(selector),
            this.calculateStyle(selector, node)
        }
        ,
        GraphStyle.prototype.forRelationship = function(rel) {
            return this.calculateStyle(this.relationshipSelector(rel), rel)
        }
        ,
        GraphStyle.prototype.findAvailableDefaultColor = function() {
            var defaultColor, i, j, len, len1, ref, ref1, rule, usedColors;
            for (usedColors = {},
            ref = this.rules,
            i = 0,
            len = ref.length; len > i; i++)
                rule = ref[i],
                null  != rule.props.color && (usedColors[rule.props.color] = !0);
            for (ref1 = _style.defaults.colors,
            j = 0,
            len1 = ref1.length; len1 > j; j++)
                if (defaultColor = ref1[j],
                null  == usedColors[defaultColor.color])
                    return neo.utils.copy(defaultColor);
            return neo.utils.copy(_style.defaults.colors[0])
        }
        ,
        GraphStyle.prototype.setDefaultStyling = function(selector) {
            var rule;
            return rule = this.findRule(selector),
            _style.defaults.autoColor && null  == rule ? (rule = new StyleRule(selector,this.findAvailableDefaultColor()),
            this.rules.push(rule),
            this.persist()) : void 0
        }
        ,
        GraphStyle.prototype.change = function(item, props) {
            var rule, selector;
            return selector = this.selector(item),
            rule = this.findRule(selector),
            null  == rule && (rule = new StyleRule(selector,{}),
            this.rules.push(rule)),
            neo.utils.extend(rule.props, props),
            this.persist(),
            rule
        }
        ,
        GraphStyle.prototype.destroyRule = function(rule) {
            var idx;
            return idx = this.rules.indexOf(rule),
            null  != idx && this.rules.splice(idx, 1),
            this.persist()
        }
        ,
        GraphStyle.prototype.findRule = function(selector) {
            var i, len, r, ref, rule;
            for (ref = this.rules,
            i = 0,
            len = ref.length; len > i; i++)
                r = ref[i],
                r.matchesExact(selector) && (rule = r);
            return rule
        }
        ,
        GraphStyle.prototype.nodeSelector = function(node) {
            var ref, selector;
            return null  == node && (node = {}),
            selector = "node",
            (null  != (ref = node.labels) ? ref.length : void 0) > 0 && (selector += "." + node.labels[0]),
            new Selector(selector)
        }
        ,
        GraphStyle.prototype.relationshipSelector = function(rel) {
            var selector;
            return null  == rel && (rel = {}),
            selector = "relationship",
            null  != rel.type && (selector += "." + rel.type),
            new Selector(selector)
        }
        ,
        GraphStyle.prototype.importGrass = function(string) {
            var e, rules;
            try {
                return rules = this.parse(string),
                this.loadRules(rules),
                this.persist()
            } catch (_error) {
                e = _error
            }
        }
        ,
        GraphStyle.prototype.loadRules = function(data) {
            var props, rule;
            neo.utils.isObject(data) || (data = _style.defaults.style),
            this.rules.length = 0;
            for (rule in data)
                props = data[rule],
                this.rules.push(new StyleRule(new Selector(rule),neo.utils.copy(props)));
            return this
        }
        ,
        GraphStyle.prototype.parse = function(string) {
            var c, chars, i, insideProps, insideString, j, k, key, keyword, len, len1, prop, props, ref, ref1, rules, skipThis, v, val;
            for (chars = string.split(""),
            insideString = !1,
            insideProps = !1,
            keyword = "",
            props = "",
            rules = {},
            i = 0,
            len = chars.length; len > i; i++) {
                switch (c = chars[i],
                skipThis = !0,
                c) {
                case "{":
                    insideString ? skipThis = !1 : insideProps = !0;
                    break;
                case "}":
                    insideString ? skipThis = !1 : (insideProps = !1,
                    rules[keyword] = props,
                    keyword = "",
                    props = "");
                    break;
                case "'":
                case '"':
                    insideString ^= !0;
                    break;
                default:
                    skipThis = !1
                }
                skipThis || (insideProps ? props += c : c.match(/[\s\n]/) || (keyword += c))
            }
            for (k in rules)
                for (v = rules[k],
                rules[k] = {},
                ref = v.split(";"),
                j = 0,
                len1 = ref.length; len1 > j; j++)
                    prop = ref[j],
                    ref1 = prop.split(":"),
                    key = ref1[0],
                    val = ref1[1],
                    key && val && (rules[k][null  != key ? key.trim() : void 0] = null  != val ? val.trim() : void 0);
            return rules
        }
        ,
        GraphStyle.prototype.persist = function() {
            var ref;
            return null  != (ref = this.storage) ? ref.add("grass", JSON.stringify(this.toSheet())) : void 0
        }
        ,
        GraphStyle.prototype.resetToDefault = function() {
            return this.loadRules(),
            this.persist()
        }
        ,
        GraphStyle.prototype.toSheet = function() {
            var i, len, ref, rule, sheet;
            for (sheet = {},
            ref = this.rules,
            i = 0,
            len = ref.length; len > i; i++)
                rule = ref[i],
                sheet[rule.selector.toString()] = rule.props;
            return sheet
        }
        ,
        GraphStyle.prototype.toString = function() {
            var i, k, len, r, ref, ref1, str, v;
            for (str = "",
            ref = this.rules,
            i = 0,
            len = ref.length; len > i; i++) {
                r = ref[i],
                str += r.selector.toString() + " {\n",
                ref1 = r.props;
                for (k in ref1)
                    v = ref1[k],
                    "caption" === k && (v = "'" + v + "'"),
                    str += "  " + k + ": " + v + ";\n";
                str += "}\n\n"
            }
            return str
        }
        ,
        GraphStyle.prototype.nextDefaultColor = 0,
        GraphStyle.prototype.defaultColors = function() {
            return neo.utils.copy(_style.defaults.colors)
        }
        ,
        GraphStyle.prototype.interpolate = function(str, id, properties) {
            return str.replace(/\{([^{}]*)\}/g, function(a, b) {
                var r;
                return r = properties[b] || id,
                "string" == typeof r || "number" == typeof r ? r : a
            })
        }
        ,
        GraphStyle
    }(),
    _style
}();
var slice = [].slice;
neo.viz = function(el, measureSize, graph, layout, style) {
    var base_group, clickHandler, container, currentStats, force, geometry, layoutDimension, newStatsBucket, now, onNodeClick, onNodeDblClick, onNodeDragToggle, onNodeMouseOut, onNodeMouseOver, onRelMouseOut, onRelMouseOver, onRelationshipClick, panned, panning, rect, render, root, viz, zoomBehavior;
    return viz = {
        style: style
    },
    root = d3.select(el),
    base_group = root.append("g").attr("transform", "translate(0,0)"),
    rect = base_group.append("rect").style("fill", "none").style("pointer-events", "all").attr("x", "-2500").attr("y", "-2500").attr("width", "5000").attr("height", "5000"),
    container = base_group.append("g"),
    geometry = new NeoD3Geometry(style),
    panning = !1,
    layoutDimension = 200,
    viz.trigger = function() {
        var args, event;
        event = arguments[0],
        args = 2 <= arguments.length ? slice.call(arguments, 1) : []
    }
    ,
    onNodeClick = function(_this) {
        return function(node) {
            return viz.trigger("nodeClicked", node)
        }
    }(this),
    onNodeDblClick = function(_this) {
        return function(node) {
            return viz.trigger("nodeDblClicked", node)
        }
    }(this),
    onNodeDragToggle = function(node) {
        return viz.trigger("nodeDragToggle", node)
    }
    ,
    onRelationshipClick = function(_this) {
        return function(relationship) {
            return d3.event.stopPropagation(),
            viz.trigger("relationshipClicked", relationship)
        }
    }(this),
    onNodeMouseOver = function(node) {
        return viz.trigger("nodeMouseOver", node)
    }
    ,
    onNodeMouseOut = function(node) {
        return viz.trigger("nodeMouseOut", node)
    }
    ,
    onRelMouseOver = function(rel) {
        return viz.trigger("relMouseOver", rel)
    }
    ,
    onRelMouseOut = function(rel) {
        return viz.trigger("relMouseOut", rel)
    }
    ,
    panned = function() {
        return panning = !0,
        container.attr("transform", "translate(" + d3.event.translate + ")scale(1)")
    }
    ,
    zoomBehavior = d3.behavior.zoom().on("zoom", panned),
    rect.on("click", function() {
        return panning ? void 0 : viz.trigger("canvasClicked", el)
    }),
    base_group.call(zoomBehavior).on("dblclick.zoom", null ).on("click.zoom", function() {
        return panning = !1
    }).on("DOMMouseScroll.zoom", null ).on("wheel.zoom", null ).on("mousewheel.zoom", null ),
    newStatsBucket = function() {
        var bucket;
        return bucket = {
            frameCount: 0,
            geometry: 0,
            relationshipRenderers: function() {
                var timings;
                return timings = {},
                neo.renderers.relationship.forEach(function(r) {
                    return timings[r.name] = 0
                }),
                timings
            }()
        },
        bucket.duration = function() {
            return bucket.lastFrame - bucket.firstFrame
        }
        ,
        bucket.fps = function() {
            return (1e3 * bucket.frameCount / bucket.duration()).toFixed(1)
        }
        ,
        bucket.lps = function() {
            return (1e3 * bucket.layout.layoutSteps / bucket.duration()).toFixed(1)
        }
        ,
        bucket.top = function() {
            var name, ref, renderers, time, totalRenderTime;
            renderers = [],
            ref = bucket.relationshipRenderers;
            for (name in ref)
                time = ref[name],
                renderers.push({
                    name: name,
                    time: time
                });
            return renderers.push({
                name: "forceLayout",
                time: bucket.layout.layoutTime
            }),
            renderers.sort(function(a, b) {
                return b.time - a.time
            }),
            totalRenderTime = renderers.reduce(function(prev, current) {
                return prev + current.time
            }, 0),
            renderers.map(function(d) {
                return d.name + ": " + (100 * d.time / totalRenderTime).toFixed(1) + "%"
            }).join(", ")
        }
        ,
        bucket
    }
    ,
    currentStats = newStatsBucket(),
    now = window.performance && window.performance.now ? function() {
        return window.performance.now()
    }
     : function() {
        return Date.now()
    }
    ,
    render = function() {
        var i, j, len, len1, nodeGroups, ref, ref1, relationshipGroups, renderer, startRender, startRenderer;
        for (currentStats.firstFrame || (currentStats.firstFrame = now()),
        currentStats.frameCount++,
        startRender = now(),
        geometry.onTick(graph),
        currentStats.geometry += now() - startRender,
        nodeGroups = container.selectAll("g.node").attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"
        }),
        ref = neo.renderers.node,
        i = 0,
        len = ref.length; len > i; i++)
            renderer = ref[i],
            nodeGroups.call(renderer.onTick, viz);
        for (relationshipGroups = container.selectAll("g.relationship").attr("transform", function(d) {
            return "translate(" + d.source.x + " " + d.source.y + ") rotate(" + (d.naturalAngle + 180) + ")"
        }),
        ref1 = neo.renderers.relationship,
        j = 0,
        len1 = ref1.length; len1 > j; j++)
            renderer = ref1[j],
            startRenderer = now(),
            relationshipGroups.call(renderer.onTick, viz),
            currentStats.relationshipRenderers[renderer.name] += now() - startRenderer;
        return currentStats.lastFrame = now()
    }
    ,
    force = layout.init(render),
    force.drag().on("dragstart.node", function(d) {
        return onNodeDragToggle(d)
    }).on("dragend.node", function() {
        return onNodeDragToggle()
    }),
    viz.collectStats = function() {
        var latestStats;
        return latestStats = currentStats,
        latestStats.layout = force.collectStats(),
        currentStats = newStatsBucket(),
        latestStats
    }
    ,
    viz.update = function() {
        var i, j, layers, len, len1, nodeGroups, nodes, ref, ref1, relationshipGroups, relationships, renderer;
        if (graph) {
            for (layers = container.selectAll("g.layer").data(["relationships", "nodes"]),
            layers.enter().append("g").attr("class", function(d) {
                return "layer " + d
            }),
            nodes = graph.nodes(),
            relationships = graph.relationships(),
            relationshipGroups = container.select("g.layer.relationships").selectAll("g.relationship").data(relationships, function(d) {
                return d.id
            }),
            relationshipGroups.enter().append("g").attr("class", "relationship").on("mousedown", onRelationshipClick).on("mouseover", onRelMouseOver).on("mouseout", onRelMouseOut),
            relationshipGroups.classed("selected", function(relationship) {
                return relationship.selected
            }),
            geometry.onGraphChange(graph),
            ref = neo.renderers.relationship,
            i = 0,
            len = ref.length; len > i; i++)
                renderer = ref[i],
                relationshipGroups.call(renderer.onGraphChange, viz);
            for (relationshipGroups.exit().remove(),
            nodeGroups = container.select("g.layer.nodes").selectAll("g.node").data(nodes, function(d) {
                return d.id
            }),
            nodeGroups.enter().append("g").attr("class", "node").call(force.drag).call(clickHandler).on("mouseover", onNodeMouseOver).on("mouseout", onNodeMouseOut),
            nodeGroups.classed("selected", function(node) {
                return node.selected
            }),
            ref1 = neo.renderers.node,
            j = 0,
            len1 = ref1.length; len1 > j; j++)
                renderer = ref1[j],
                nodeGroups.call(renderer.onGraphChange, viz);
            return nodeGroups.exit().remove(),
            force.update(graph, [layoutDimension, layoutDimension]),
            viz.resize(),
            viz.trigger("updated")
        }
    }
    ,
    viz.resize = function() {
        var size;
        return size = measureSize(),
        root.attr("viewBox", [0, (layoutDimension - size.height) / 2, layoutDimension, size.height].join(" "))
    }
    ,
    viz.boundingBox = function() {
        return container.node().getBBox()
    }
    ,
    clickHandler = neo.utils.clickHandler(),
    clickHandler.on("click", onNodeClick),
    clickHandler.on("dblclick", onNodeDblClick),
    viz
}
;
var hasProp = {}.hasOwnProperty;
neo.utils.adjacentAngles = function() {
    function adjacentAngles() {}
    return adjacentAngles.prototype.findRuns = function(angleList, minSeparation) {
        var end, extendEnd, extendStart, key, minStart, p, runs, scanForDensePair, start, step, stepCount, tooDense, value;
        for (p = 0,
        start = 0,
        end = 0,
        runs = [],
        minStart = function() {
            return 0 === runs.length ? 0 : runs[0].start
        }
        ,
        scanForDensePair = function() {
            return start = p,
            end = angleList.wrapIndex(p + 1),
            end === minStart() ? "done" : (p = end,
            tooDense(start, end) ? extendEnd : scanForDensePair)
        }
        ,
        extendEnd = function() {
            return p === minStart() ? "done" : tooDense(start, angleList.wrapIndex(p + 1)) ? (end = angleList.wrapIndex(p + 1),
            p = end,
            extendEnd) : (p = start,
            extendStart)
        }
        ,
        extendStart = function() {
            var candidateStart;
            return candidateStart = angleList.wrapIndex(p - 1),
            tooDense(candidateStart, end) && candidateStart !== end ? (start = candidateStart,
            p = start,
            extendStart) : (runs.push({
                start: start,
                end: end
            }),
            p = end,
            scanForDensePair)
        }
        ,
        tooDense = function(start, end) {
            var run;
            return run = {
                start: start,
                end: end
            },
            angleList.angle(run) < angleList.length(run) * minSeparation
        }
        ,
        stepCount = 0,
        step = scanForDensePair; "done" !== step; ) {
            if (stepCount++ > 10 * angleList.totalLength()) {
                console.log("Warning: failed to layout arrows", function() {
                    var ref, results;
                    ref = angleList.list,
                    results = [];
                    for (key in ref)
                        hasProp.call(ref, key) && (value = ref[key],
                        results.push(key + ": " + value.angle));
                    return results;
                }().join("\n"), minSeparation);
                break
            }
            step = step()
        }
        return runs
    }
    ,
    adjacentAngles
}(),
neo.utils.angleList = function() {
    function angleList(list) {
        this.list = list
    }
    return angleList.prototype.getAngle = function(index) {
        return this.list[index].angle
    }
    ,
    angleList.prototype.fixed = function(index) {
        return this.list[index].fixed
    }
    ,
    angleList.prototype.totalLength = function() {
        return this.list.length
    }
    ,
    angleList.prototype.length = function(run) {
        return run.start < run.end ? run.end - run.start : run.end + this.list.length - run.start
    }
    ,
    angleList.prototype.angle = function(run) {
        return run.start < run.end ? this.list[run.end].angle - this.list[run.start].angle : 360 - (this.list[run.start].angle - this.list[run.end].angle)
    }
    ,
    angleList.prototype.wrapIndex = function(index) {
        return -1 === index ? this.list.length - 1 : index >= this.list.length ? index - this.list.length : index
    }
    ,
    angleList
}(),
neo.utils.arcArrow = function() {
    function arcArrow(startRadius, endRadius, endCentre, deflection, arrowWidth, headWidth, headLength, captionLayout) {
        var angleTangent, arcRadius, c1, c2, coord, cx, cy, deflectionRadians, endAngle, endAttach, endNormal, endOverlayCorner, endTangent, g1, g2, headRadius, homotheticCenter, intersectWithOtherCircle, midShaftAngle, negativeSweep, positiveSweep, radiusRatio, shaftRadius, square, startAngle, startAttach, startTangent, sweepAngle;
        this.deflection = deflection,
        square = function(l) {
            return l * l
        }
        ,
        deflectionRadians = this.deflection * Math.PI / 180,
        startAttach = {
            x: Math.cos(deflectionRadians) * startRadius,
            y: Math.sin(deflectionRadians) * startRadius
        },
        radiusRatio = startRadius / (endRadius + headLength),
        homotheticCenter = -endCentre * radiusRatio / (1 - radiusRatio),
        intersectWithOtherCircle = function(fixedPoint, radius, xCenter, polarity) {
            var A, B, C, gradient, hc, intersection;
            return gradient = fixedPoint.y / (fixedPoint.x - homotheticCenter),
            hc = fixedPoint.y - gradient * fixedPoint.x,
            A = 1 + square(gradient),
            B = 2 * (gradient * hc - xCenter),
            C = square(hc) + square(xCenter) - square(radius),
            intersection = {
                x: (-B + polarity * Math.sqrt(square(B) - 4 * A * C)) / (2 * A)
            },
            intersection.y = (intersection.x - homotheticCenter) * gradient,
            intersection
        }
        ,
        endAttach = intersectWithOtherCircle(startAttach, endRadius + headLength, endCentre, -1),
        g1 = -startAttach.x / startAttach.y,
        c1 = startAttach.y + square(startAttach.x) / startAttach.y,
        g2 = -(endAttach.x - endCentre) / endAttach.y,
        c2 = endAttach.y + (endAttach.x - endCentre) * endAttach.x / endAttach.y,
        cx = (c1 - c2) / (g2 - g1),
        cy = g1 * cx + c1,
        arcRadius = Math.sqrt(square(cx - startAttach.x) + square(cy - startAttach.y)),
        startAngle = Math.atan2(startAttach.x - cx, cy - startAttach.y),
        endAngle = Math.atan2(endAttach.x - cx, cy - endAttach.y),
        sweepAngle = endAngle - startAngle,
        this.deflection > 0 && (sweepAngle = 2 * Math.PI - sweepAngle),
        this.shaftLength = sweepAngle * arcRadius,
        startAngle > endAngle && (this.shaftLength = 0),
        midShaftAngle = (startAngle + endAngle) / 2,
        this.deflection > 0 && (midShaftAngle += Math.PI),
        this.midShaftPoint = {
            x: cx + arcRadius * Math.sin(midShaftAngle),
            y: cy - arcRadius * Math.cos(midShaftAngle)
        },
        startTangent = function(dr) {
            var dx, dy;
            return dx = (0 > dr ? 1 : -1) * Math.sqrt(square(dr) / (1 + square(g1))),
            dy = g1 * dx,
            {
                x: startAttach.x + dx,
                y: startAttach.y + dy
            }
        }
        ,
        endTangent = function(dr) {
            var dx, dy;
            return dx = (0 > dr ? -1 : 1) * Math.sqrt(square(dr) / (1 + square(g2))),
            dy = g2 * dx,
            {
                x: endAttach.x + dx,
                y: endAttach.y + dy
            }
        }
        ,
        angleTangent = function(angle, dr) {
            return {
                x: cx + (arcRadius + dr) * Math.sin(angle),
                y: cy - (arcRadius + dr) * Math.cos(angle)
            }
        }
        ,
        endNormal = function(dc) {
            var dx, dy;
            return dx = (0 > dc ? -1 : 1) * Math.sqrt(square(dc) / (1 + square(1 / g2))),
            dy = dx / g2,
            {
                x: endAttach.x + dx,
                y: endAttach.y - dy
            }
        }
        ,
        endOverlayCorner = function(dr, dc) {
            var arrowTip, shoulder;
            return shoulder = endTangent(dr),
            arrowTip = endNormal(dc),
            {
                x: shoulder.x + arrowTip.x - endAttach.x,
                y: shoulder.y + arrowTip.y - endAttach.y
            }
        }
        ,
        coord = function(point) {
            return point.x + "," + point.y
        }
        ,
        shaftRadius = arrowWidth / 2,
        headRadius = headWidth / 2,
        positiveSweep = startAttach.y > 0 ? 0 : 1,
        negativeSweep = startAttach.y < 0 ? 0 : 1,
        this.outline = function(shortCaptionLength) {
            var captionSweep, endBreak, startBreak;
            return startAngle > endAngle ? ["M", coord(endTangent(-headRadius)), "L", coord(endNormal(headLength)), "L", coord(endTangent(headRadius)), "Z"].join(" ") : "external" === captionLayout ? (captionSweep = shortCaptionLength / arcRadius,
            this.deflection > 0 && (captionSweep *= -1),
            startBreak = midShaftAngle - captionSweep / 2,
            endBreak = midShaftAngle + captionSweep / 2,
            ["M", coord(startTangent(shaftRadius)), "L", coord(startTangent(-shaftRadius)), "A", arcRadius - shaftRadius, arcRadius - shaftRadius, 0, 0, positiveSweep, coord(angleTangent(startBreak, -shaftRadius)), "L", coord(angleTangent(startBreak, shaftRadius)), "A", arcRadius + shaftRadius, arcRadius + shaftRadius, 0, 0, negativeSweep, coord(startTangent(shaftRadius)), "Z", "M", coord(angleTangent(endBreak, shaftRadius)), "L", coord(angleTangent(endBreak, -shaftRadius)), "A", arcRadius - shaftRadius, arcRadius - shaftRadius, 0, 0, positiveSweep, coord(endTangent(-shaftRadius)), "L", coord(endTangent(-headRadius)), "L", coord(endNormal(headLength)), "L", coord(endTangent(headRadius)), "L", coord(endTangent(shaftRadius)), "A", arcRadius + shaftRadius, arcRadius + shaftRadius, 0, 0, negativeSweep, coord(angleTangent(endBreak, shaftRadius))].join(" ")) : ["M", coord(startTangent(shaftRadius)), "L", coord(startTangent(-shaftRadius)), "A", arcRadius - shaftRadius, arcRadius - shaftRadius, 0, 0, positiveSweep, coord(endTangent(-shaftRadius)), "L", coord(endTangent(-headRadius)), "L", coord(endNormal(headLength)), "L", coord(endTangent(headRadius)), "L", coord(endTangent(shaftRadius)), "A", arcRadius + shaftRadius, arcRadius + shaftRadius, 0, 0, negativeSweep, coord(startTangent(shaftRadius))].join(" ")
        }
        ,
        this.overlay = function(minWidth) {
            var radius;
            return radius = Math.max(minWidth / 2, shaftRadius),
            ["M", coord(startTangent(radius)), "L", coord(startTangent(-radius)), "A", arcRadius - radius, arcRadius - radius, 0, 0, positiveSweep, coord(endTangent(-radius)), "L", coord(endOverlayCorner(-radius, headLength)), "L", coord(endOverlayCorner(radius, headLength)), "L", coord(endTangent(radius)), "A", arcRadius + radius, arcRadius + radius, 0, 0, negativeSweep, coord(startTangent(radius))].join(" ")
        }
    }
    return arcArrow
}(),
neo.utils.cloneArray = function(original) {
    var clone, i, idx, len, node;
    for (clone = new Array(original.length),
    idx = i = 0,
    len = original.length; len > i; idx = ++i)
        node = original[idx],
        clone[idx] = node;
    return clone
}
,
neo.utils.circularLayout = function(nodes, center, radius) {
    var i, j, k, len, len1, n, node, results, unlocatedNodes;
    for (unlocatedNodes = [],
    j = 0,
    len = nodes.length; len > j; j++)
        node = nodes[j],
        (null  == node.x || null  == node.y) && unlocatedNodes.push(node);
    for (results = [],
    i = k = 0,
    len1 = unlocatedNodes.length; len1 > k; i = ++k)
        n = unlocatedNodes[i],
        n.x = center.x + radius * Math.sin(2 * Math.PI * i / unlocatedNodes.length),
        results.push(n.y = center.y + radius * Math.cos(2 * Math.PI * i / unlocatedNodes.length));
    return results
}
,
neo.utils.distributeCircular = function(arrowAngles, minSeparation) {
    var angle, angleList, center, i, j, k, key, l, len, len1, list, m, moveableRuns, n, o, rawAngle, ref, ref1, ref2, ref3, ref4, ref5, result, run, runLength, runsOfTooDenseArrows, separation, splitByFixedArrows, tooDenseRun, wrapAngle;
    list = [],
    ref = arrowAngles.floating;
    for (key in ref)
        angle = ref[key],
        list.push({
            key: key,
            angle: angle,
            fixed: !1
        });
    ref1 = arrowAngles.fixed;
    for (key in ref1)
        angle = ref1[key],
        list.push({
            key: key,
            angle: angle,
            fixed: !0
        });
    for (list.sort(function(a, b) {
        return a.angle - b.angle
    }),
    angleList = new neo.utils.angleList(list),
    runsOfTooDenseArrows = (new neo.utils.adjacentAngles).findRuns(angleList, minSeparation),
    wrapAngle = function(angle) {
        return angle >= 360 ? angle - 360 : 0 > angle ? angle + 360 : angle
    }
    ,
    result = {},
    splitByFixedArrows = function(run) {
        var currentStart, i, j, ref2, runs, wrapped;
        for (runs = [],
        currentStart = run.start,
        i = j = 1,
        ref2 = angleList.length(run); ref2 >= 1 ? ref2 >= j : j >= ref2; i = ref2 >= 1 ? ++j : --j)
            wrapped = angleList.wrapIndex(run.start + i),
            angleList.fixed(wrapped) && (runs.push({
                start: currentStart,
                end: wrapped
            }),
            currentStart = wrapped);
        return angleList.fixed(run.end) || runs.push({
            start: currentStart,
            end: run.end
        }),
        runs
    }
    ,
    j = 0,
    len = runsOfTooDenseArrows.length; len > j; j++)
        for (tooDenseRun = runsOfTooDenseArrows[j],
        moveableRuns = splitByFixedArrows(tooDenseRun),
        k = 0,
        len1 = moveableRuns.length; len1 > k; k++)
            if (run = moveableRuns[k],
            runLength = angleList.length(run),
            angleList.fixed(run.start) && angleList.fixed(run.end))
                for (separation = angleList.angle(run) / runLength,
                i = l = 0,
                ref2 = runLength; ref2 >= 0 ? ref2 >= l : l >= ref2; i = ref2 >= 0 ? ++l : --l)
                    rawAngle = list[run.start].angle + i * separation,
                    result[list[angleList.wrapIndex(run.start + i)].key] = wrapAngle(rawAngle);
            else if (angleList.fixed(run.start) && !angleList.fixed(run.end))
                for (i = m = 0,
                ref3 = runLength; ref3 >= 0 ? ref3 >= m : m >= ref3; i = ref3 >= 0 ? ++m : --m)
                    rawAngle = list[run.start].angle + i * minSeparation,
                    result[list[angleList.wrapIndex(run.start + i)].key] = wrapAngle(rawAngle);
            else if (!angleList.fixed(run.start) && angleList.fixed(run.end))
                for (i = n = 0,
                ref4 = runLength; ref4 >= 0 ? ref4 >= n : n >= ref4; i = ref4 >= 0 ? ++n : --n)
                    rawAngle = list[run.end].angle - (runLength - i) * minSeparation,
                    result[list[angleList.wrapIndex(run.start + i)].key] = wrapAngle(rawAngle);
            else
                for (center = list[run.start].angle + angleList.angle(run) / 2,
                i = o = 0,
                ref5 = runLength; ref5 >= 0 ? ref5 >= o : o >= ref5; i = ref5 >= 0 ? ++o : --o)
                    rawAngle = center + (i - runLength / 2) * minSeparation,
                    result[list[angleList.wrapIndex(run.start + i)].key] = wrapAngle(rawAngle);
    for (key in arrowAngles.floating)
        result.hasOwnProperty(key) || (result[key] = arrowAngles.floating[key]);
    for (key in arrowAngles.fixed)
        result.hasOwnProperty(key) || (result[key] = arrowAngles.fixed[key]);
    return result
}
,
neo.utils.circumferentialRelationshipRouting = function() {
    function circumferentialRelationshipRouting(style) {
        this.style = style
    }
    return circumferentialRelationshipRouting.prototype.measureRelationshipCaption = function(relationship, caption) {
        var fontFamily, fontSize, padding;
        return fontFamily = "sans-serif",
        fontSize = parseFloat(this.style.forRelationship(relationship).get("font-size")),
        padding = parseFloat(this.style.forRelationship(relationship).get("padding")),
        neo.utils.measureText(caption, fontFamily, fontSize) + 2 * padding
    }
    ,
    circumferentialRelationshipRouting.prototype.captionFitsInsideArrowShaftWidth = function(relationship) {
        return parseFloat(this.style.forRelationship(relationship).get("shaft-width")) > parseFloat(this.style.forRelationship(relationship).get("font-size"))
    }
    ,
    circumferentialRelationshipRouting.prototype.measureRelationshipCaptions = function(relationships) {
        var i, len, relationship, results;
        for (results = [],
        i = 0,
        len = relationships.length; len > i; i++)
            relationship = relationships[i],
            relationship.captionLength = this.measureRelationshipCaption(relationship, relationship.type),
            results.push(relationship.captionLayout = this.captionFitsInsideArrowShaftWidth(relationship) ? "internal" : "external");
        return results
    }
    ,
    circumferentialRelationshipRouting.prototype.shortenCaption = function(relationship, caption, targetWidth) {
        var shortCaption, width;
        for (shortCaption = caption; ; ) {
            if (shortCaption.length <= 2)
                return ["", 0];
            if (shortCaption = shortCaption.substr(0, shortCaption.length - 2) + "\u2026",
            width = this.measureRelationshipCaption(relationship, shortCaption),
            targetWidth > width)
                return [shortCaption, width]
        }
    }
    ,
    circumferentialRelationshipRouting.prototype.layoutRelationships = function(graph) {
        var angle, arrowAngles, centreDistance, deflection, distributedAngles, dx, dy, headHeight, headRadius, i, id, j, k, l, len, len1, len2, len3, node, ref, ref1, ref2, ref3, relationship, relationshipMap, relationships, results, shaftRadius, sortedNodes, square;
        for (ref = graph.relationships(),
        i = 0,
        len = ref.length; len > i; i++)
            relationship = ref[i],
            dx = relationship.target.x - relationship.source.x,
            dy = relationship.target.y - relationship.source.y,
            relationship.naturalAngle = (Math.atan2(dy, dx) / Math.PI * 180 + 180) % 360,
            delete relationship.arrow;
        for (sortedNodes = graph.nodes().sort(function(a, b) {
            return b.relationshipCount(graph) - a.relationshipCount(graph)
        }),
        results = [],
        j = 0,
        len1 = sortedNodes.length; len1 > j; j++) {
            for (node = sortedNodes[j],
            relationships = [],
            ref1 = graph.relationships(),
            k = 0,
            len2 = ref1.length; len2 > k; k++)
                relationship = ref1[k],
                (relationship.source === node || relationship.target === node) && relationships.push(relationship);
            for (arrowAngles = {
                floating: {},
                fixed: {}
            },
            relationshipMap = {},
            l = 0,
            len3 = relationships.length; len3 > l; l++)
                relationship = relationships[l],
                relationshipMap[relationship.id] = relationship,
                node === relationship.source && (relationship.hasOwnProperty("arrow") ? arrowAngles.fixed[relationship.id] = relationship.naturalAngle + relationship.arrow.deflection : arrowAngles.floating[relationship.id] = relationship.naturalAngle),
                node === relationship.target && (relationship.hasOwnProperty("arrow") ? arrowAngles.fixed[relationship.id] = (relationship.naturalAngle - relationship.arrow.deflection + 180) % 360 : arrowAngles.floating[relationship.id] = (relationship.naturalAngle + 180) % 360);
            distributedAngles = {},
            ref2 = arrowAngles.floating;
            for (id in ref2)
                angle = ref2[id],
                distributedAngles[id] = angle;
            ref3 = arrowAngles.fixed;
            for (id in ref3)
                angle = ref3[id],
                distributedAngles[id] = angle;
            relationships.length > 1 && (distributedAngles = neo.utils.distributeCircular(arrowAngles, 30)),
            results.push(function() {
                var ref4, results1;
                results1 = [];
                for (id in distributedAngles)
                    angle = distributedAngles[id],
                    relationship = relationshipMap[id],
                    relationship.hasOwnProperty("arrow") ? results1.push(void 0) : (deflection = node === relationship.source ? angle - relationship.naturalAngle : (relationship.naturalAngle - angle + 180) % 360,
                    shaftRadius = parseFloat(this.style.forRelationship(relationship).get("shaft-width")) / 2 || 2,
                    headRadius = shaftRadius + 3,
                    headHeight = 2 * headRadius,
                    dx = relationship.target.x - relationship.source.x,
                    dy = relationship.target.y - relationship.source.y,
                    square = function(distance) {
                        return distance * distance
                    }
                    ,
                    centreDistance = Math.sqrt(square(dx) + square(dy)),
                    Math.abs(deflection) < Math.PI / 180 ? relationship.arrow = new neo.utils.straightArrow(relationship.source.radius,relationship.target.radius,centreDistance,shaftRadius,headRadius,headHeight,relationship.captionLayout) : relationship.arrow = new neo.utils.arcArrow(relationship.source.radius,relationship.target.radius,centreDistance,deflection,2 * shaftRadius,2 * headRadius,headHeight,relationship.captionLayout),
                    results1.push((ref4 = relationship.arrow.shaftLength > relationship.captionLength ? [relationship.caption, relationship.captionLength] : this.shortenCaption(relationship, relationship.caption, relationship.arrow.shaftLength),
                    relationship.shortCaption = ref4[0],
                    relationship.shortCaptionLength = ref4[1],
                    ref4)));
                return results1
            }
            .call(this))
        }
        return results
    }
    ,
    circumferentialRelationshipRouting
}(),
neo.utils.clickHandler = function() {
    var cc, event;
    return cc = function(selection) {
        var dist, down, last, tolerance, wait;
        return dist = function(a, b) {
            return Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2))
        }
        ,
        down = void 0,
        tolerance = 5,
        last = void 0,
        wait = null ,
        selection.on("mousedown", function() {
            return d3.event.target.__data__.fixed = !0,
            down = d3.mouse(document.body),
            last = +new Date,
            d3.event.stopPropagation()
        }),
        selection.on("mouseup", function() {
            return dist(down, d3.mouse(document.body)) > tolerance ? void 0 : wait ? (window.clearTimeout(wait),
            wait = null ,
            event.dblclick(d3.event.target.__data__)) : wait = window.setTimeout(function(e) {
                return function() {
                    return event.click(e.target.__data__),
                    wait = null 
                }
            }(d3.event), 250)
        })
    }
    ,
    event = d3.dispatch("click", "dblclick"),
    d3.rebind(cc, event, "on")
}
,
neo.utils.loopArrow = function() {
    function loopArrow(nodeRadius, straightLength, spreadDegrees, shaftWidth, headWidth, headLength, captionHeight) {
        var Point, endPoint, loopRadius, normalPoint, r1, r2, r3, shaftRadius, spread, startPoint;
        spread = spreadDegrees * Math.PI / 180,
        r1 = nodeRadius,
        r2 = nodeRadius + headLength,
        r3 = nodeRadius + straightLength,
        loopRadius = r3 * Math.tan(spread / 2),
        shaftRadius = shaftWidth / 2,
        this.shaftLength = 3 * loopRadius + shaftWidth,
        Point = function() {
            function Point(x, y) {
                this.x = x,
                this.y = y
            }
            return Point.prototype.toString = function() {
                return this.x + " " + this.y
            }
            ,
            Point
        }(),
        normalPoint = function(sweep, radius, displacement) {
            var cy, localLoopRadius;
            return localLoopRadius = radius * Math.tan(spread / 2),
            cy = radius / Math.cos(spread / 2),
            new Point((localLoopRadius + displacement) * Math.sin(sweep),cy + (localLoopRadius + displacement) * Math.cos(sweep))
        }
        ,
        this.midShaftPoint = normalPoint(0, r3, shaftRadius + captionHeight / 2 + 2),
        startPoint = function(radius, displacement) {
            return normalPoint((Math.PI + spread) / 2, radius, displacement)
        }
        ,
        endPoint = function(radius, displacement) {
            return normalPoint(-(Math.PI + spread) / 2, radius, displacement)
        }
        ,
        this.outline = function() {
            var inner, outer;
            return inner = loopRadius - shaftRadius,
            outer = loopRadius + shaftRadius,
            ["M", startPoint(r1, shaftRadius), "L", startPoint(r3, shaftRadius), "A", outer, outer, 0, 1, 1, endPoint(r3, shaftRadius), "L", endPoint(r2, shaftRadius), "L", endPoint(r2, -headWidth / 2), "L", endPoint(r1, 0), "L", endPoint(r2, headWidth / 2), "L", endPoint(r2, -shaftRadius), "L", endPoint(r3, -shaftRadius), "A", inner, inner, 0, 1, 0, startPoint(r3, -shaftRadius), "L", startPoint(r1, -shaftRadius), "Z"].join(" ")
        }
        ,
        this.overlay = function(minWidth) {
            var displacement, inner, outer;
            return displacement = Math.max(minWidth / 2, shaftRadius),
            inner = loopRadius - displacement,
            outer = loopRadius + displacement,
            ["M", startPoint(r1, displacement), "L", startPoint(r3, displacement), "A", outer, outer, 0, 1, 1, endPoint(r3, displacement), "L", endPoint(r2, displacement), "L", endPoint(r2, -displacement), "L", endPoint(r3, -displacement), "A", inner, inner, 0, 1, 0, startPoint(r3, -displacement), "L", startPoint(r1, -displacement), "Z"].join(" ")
        }
    }
    return loopArrow
}(),
neo.utils.pairwiseArcsRelationshipRouting = function() {
    function pairwiseArcsRelationshipRouting(style) {
        this.style = style
    }
    return pairwiseArcsRelationshipRouting.prototype.measureRelationshipCaption = function(relationship, caption) {
        var fontFamily, padding;
        return fontFamily = "sans-serif",
        padding = parseFloat(this.style.forRelationship(relationship).get("padding")),
        neo.utils.measureText(caption, fontFamily, relationship.captionHeight) + 2 * padding
    }
    ,
    pairwiseArcsRelationshipRouting.prototype.captionFitsInsideArrowShaftWidth = function(relationship) {
        return parseFloat(this.style.forRelationship(relationship).get("shaft-width")) > relationship.captionHeight
    }
    ,
    pairwiseArcsRelationshipRouting.prototype.measureRelationshipCaptions = function(relationships) {
        var j, len, relationship, results;
        for (results = [],
        j = 0,
        len = relationships.length; len > j; j++)
            relationship = relationships[j],
            relationship.captionHeight = parseFloat(this.style.forRelationship(relationship).get("font-size")),
            relationship.captionLength = this.measureRelationshipCaption(relationship, relationship.caption),
            results.push(relationship.captionLayout = this.captionFitsInsideArrowShaftWidth(relationship) && !relationship.isLoop() ? "internal" : "external");
        return results
    }
    ,
    pairwiseArcsRelationshipRouting.prototype.shortenCaption = function(relationship, caption, targetWidth) {
        var shortCaption, width;
        for (shortCaption = caption || "caption"; ; ) {
            if (shortCaption.length <= 2)
                return ["", 0];
            if (shortCaption = shortCaption.substr(0, shortCaption.length - 2) + "\u2026",
            width = this.measureRelationshipCaption(relationship, shortCaption),
            targetWidth > width)
                return [shortCaption, width]
        }
    }
    ,
    pairwiseArcsRelationshipRouting.prototype.computeGeometryForNonLoopArrows = function(nodePairs) {
        var angle, centreDistance, dx, dy, j, len, nodePair, relationship, results, square;
        for (square = function(distance) {
            return distance * distance
        }
        ,
        results = [],
        j = 0,
        len = nodePairs.length; len > j; j++)
            nodePair = nodePairs[j],
            nodePair.isLoop() ? results.push(void 0) : (dx = nodePair.nodeA.x - nodePair.nodeB.x,
            dy = nodePair.nodeA.y - nodePair.nodeB.y,
            angle = (Math.atan2(dy, dx) / Math.PI * 180 + 360) % 360,
            centreDistance = Math.sqrt(square(dx) + square(dy)),
            results.push(function() {
                var k, len1, ref, results1;
                for (ref = nodePair.relationships,
                results1 = [],
                k = 0,
                len1 = ref.length; len1 > k; k++)
                    relationship = ref[k],
                    relationship.naturalAngle = relationship.target === nodePair.nodeA ? (angle + 180) % 360 : angle,
                    results1.push(relationship.centreDistance = centreDistance);
                return results1
            }()));
        return results
    }
    ,
    pairwiseArcsRelationshipRouting.prototype.distributeAnglesForLoopArrows = function(nodePairs, relationships) {
        var angle, angles, biggestGap, end, i, j, k, l, len, len1, len2, node, nodePair, relationship, results, separation, start;
        for (results = [],
        j = 0,
        len = nodePairs.length; len > j; j++)
            if (nodePair = nodePairs[j],
            nodePair.isLoop()) {
                for (angles = [],
                node = nodePair.nodeA,
                k = 0,
                len1 = relationships.length; len1 > k; k++)
                    relationship = relationships[k],
                    relationship.isLoop() || (relationship.source === node && angles.push(relationship.naturalAngle),
                    relationship.target === node && angles.push(relationship.naturalAngle + 180));
                if (angles = angles.map(function(a) {
                    return (a + 360) % 360
                }).sort(function(a, b) {
                    return a - b
                }),
                angles.length > 0) {
                    for (biggestGap = {
                        start: 0,
                        end: 0
                    },
                    i = l = 0,
                    len2 = angles.length; len2 > l; i = ++l)
                        angle = angles[i],
                        start = angle,
                        end = i === angles.length - 1 ? angles[0] + 360 : angles[i + 1],
                        end - start > biggestGap.end - biggestGap.start && (biggestGap.start = start,
                        biggestGap.end = end);
                    separation = (biggestGap.end - biggestGap.start) / (nodePair.relationships.length + 1),
                    results.push(function() {
                        var len3, m, ref, results1;
                        for (ref = nodePair.relationships,
                        results1 = [],
                        i = m = 0,
                        len3 = ref.length; len3 > m; i = ++m)
                            relationship = ref[i],
                            results1.push(relationship.naturalAngle = (biggestGap.start + (i + 1) * separation - 90) % 360);
                        return results1
                    }())
                } else
                    separation = 360 / nodePair.relationships.length,
                    results.push(function() {
                        var len3, m, ref, results1;
                        for (ref = nodePair.relationships,
                        results1 = [],
                        i = m = 0,
                        len3 = ref.length; len3 > m; i = ++m)
                            relationship = ref[i],
                            results1.push(relationship.naturalAngle = i * separation);
                        return results1
                    }())
            } else
                results.push(void 0);
        return results
    }
    ,
    pairwiseArcsRelationshipRouting.prototype.layoutRelationships = function(graph) {
        var deflection, headHeight, headWidth, i, j, k, len, len1, middleRelationshipIndex, nodePair, nodePairs, ref, relationship, results, shaftWidth, spread;
        for (nodePairs = graph.groupedRelationships(),
        this.computeGeometryForNonLoopArrows(nodePairs),
        this.distributeAnglesForLoopArrows(nodePairs, graph.relationships()),
        results = [],
        j = 0,
        len = nodePairs.length; len > j; j++) {
            for (nodePair = nodePairs[j],
            ref = nodePair.relationships,
            k = 0,
            len1 = ref.length; len1 > k; k++)
                relationship = ref[k],
                delete relationship.arrow;
            middleRelationshipIndex = (nodePair.relationships.length - 1) / 2,
            results.push(function() {
                var l, len2, ref1, ref2, results1;
                for (ref1 = nodePair.relationships,
                results1 = [],
                i = l = 0,
                len2 = ref1.length; len2 > l; i = ++l)
                    relationship = ref1[i],
                    shaftWidth = parseFloat(this.style.forRelationship(relationship).get("shaft-width")) || 2,
                    headWidth = shaftWidth + 6,
                    headHeight = headWidth,
                    nodePair.isLoop() ? (spread = 30,
                    relationship.arrow = new neo.utils.loopArrow(relationship.source.radius,40,spread,shaftWidth,headWidth,headHeight,relationship.captionHeight)) : i === middleRelationshipIndex ? relationship.arrow = new neo.utils.straightArrow(relationship.source.radius,relationship.target.radius,relationship.centreDistance,shaftWidth,headWidth,headHeight,relationship.captionLayout) : (deflection = 30 * (i - middleRelationshipIndex),
                    nodePair.nodeA !== relationship.source && (deflection *= -1),
                    relationship.arrow = new neo.utils.arcArrow(relationship.source.radius,relationship.target.radius,relationship.centreDistance,deflection,shaftWidth,headWidth,headHeight,relationship.captionLayout)),
                    results1.push((ref2 = relationship.arrow.shaftLength > relationship.captionLength ? [relationship.caption, relationship.captionLength] : this.shortenCaption(relationship, relationship.caption, relationship.arrow.shaftLength),
                    relationship.shortCaption = ref2[0],
                    relationship.shortCaptionLength = ref2[1],
                    ref2));
                return results1
            }
            .call(this))
        }
        return results
    }
    ,
    pairwiseArcsRelationshipRouting
}(),
neo.utils.straightArrow = function() {
    function straightArrow(startRadius, endRadius, centreDistance, shaftWidth, headWidth, headHeight, captionLayout) {
        var endArrow, endShaft, headRadius, shaftRadius, startArrow;
        this.length = centreDistance - (startRadius + endRadius),
        this.shaftLength = this.length - headHeight,
        startArrow = startRadius,
        endShaft = startArrow + this.shaftLength,
        endArrow = startArrow + this.length,
        shaftRadius = shaftWidth / 2,
        headRadius = headWidth / 2,
        this.midShaftPoint = {
            x: startArrow + this.shaftLength / 2,
            y: 0
        },
        this.outline = function(shortCaptionLength) {
            var endBreak, startBreak;
            return "external" === captionLayout ? (startBreak = startArrow + (this.shaftLength - shortCaptionLength) / 2,
            endBreak = endShaft - (this.shaftLength - shortCaptionLength) / 2,
            ["M", startArrow, shaftRadius, "L", startBreak, shaftRadius, "L", startBreak, -shaftRadius, "L", startArrow, -shaftRadius, "Z", "M", endBreak, shaftRadius, "L", endShaft, shaftRadius, "L", endShaft, headRadius, "L", endArrow, 0, "L", endShaft, -headRadius, "L", endShaft, -shaftRadius, "L", endBreak, -shaftRadius, "Z"].join(" ")) : ["M", startArrow, shaftRadius, "L", endShaft, shaftRadius, "L", endShaft, headRadius, "L", endArrow, 0, "L", endShaft, -headRadius, "L", endShaft, -shaftRadius, "L", startArrow, -shaftRadius, "Z"].join(" ")
        }
        ,
        this.overlay = function(minWidth) {
            var radius;
            return radius = Math.max(minWidth / 2, shaftRadius),
            ["M", startArrow, radius, "L", endArrow, radius, "L", endArrow, -radius, "L", startArrow, -radius, "Z"].join(" ")
        }
    }
    return straightArrow.prototype.deflection = 0,
    straightArrow
}(),
neo.utils.measureText = function() {
    var cache, measureUsingCanvas;
    return measureUsingCanvas = function(text, font) {
        var canvas, canvasSelection, context;
        return canvasSelection = d3.select("canvas#textMeasurementCanvas").data([this]),
        canvasSelection.enter().append("canvas").attr("id", "textMeasurementCanvas").style("display", "none"),
        canvas = canvasSelection.node(),
        context = canvas.getContext("2d"),
        context.font = font,
        context.measureText(text).width
    }
    ,
    cache = function() {
        var cacheSize, list, map;
        return cacheSize = 1e4,
        map = {},
        list = [],
        function(key, calc) {
            var cached, result;
            return cached = map[key],
            cached ? cached : (result = calc(),
            list.length > cacheSize && (delete map[list.splice(0, 1)],
            list.push(key)),
            map[key] = result)
        }
    }(),
    function(text, fontFamily, fontSize) {
        var font;
        return font = "normal normal normal " + fontSize + "px/normal " + fontFamily,
        cache(text + font, function() {
            return measureUsingCanvas(text, font)
        })
    }
}(),
function() {
    var arrowPath, nodeCaption, nodeOutline, nodeRing, noop, relationshipOverlay, relationshipType;
    return noop = function() {}
    ,
    nodeOutline = new neo.Renderer({
        onGraphChange: function(selection, viz) {
            var circles;
            return circles = selection.selectAll("circle.outline").data(function(node) {
                return [node]
            }),
            circles.enter().append("circle").classed("outline", !0).attr({
                cx: 0,
                cy: 0
            }),
            circles.attr({
                r: function(node) {
                    return node.radius
                },
                fill: function(node) {
                    return viz.style.forNode(node).get("color")
                },
                stroke: function(node) {
                    return viz.style.forNode(node).get("border-color")
                },
                "stroke-width": function(node) {
                    return viz.style.forNode(node).get("border-width")
                }
            }),
            circles.exit().remove()
        },
        onTick: noop
    }),
    nodeCaption = new neo.Renderer({
        onGraphChange: function(selection, viz) {
            var text;
            return text = selection.selectAll("text").data(function(node) {
                return node.caption
            }),
            text.enter().append("text").attr({
                "text-anchor": "middle"
            }).attr({
                "pointer-events": "none"
            }),
            text.text(function(line) {
                return line.text
            }).attr("y", function(line) {
                return line.baseline
            }).attr("font-size", function(line) {
                return viz.style.forNode(line.node).get("font-size")
            }).attr({
                fill: function(line) {
                    return viz.style.forNode(line.node).get("text-color-internal")
                }
            }),
            text.exit().remove()
        },
        onTick: noop
    }),
    nodeRing = new neo.Renderer({
        onGraphChange: function(selection) {
            var circles;
            return circles = selection.selectAll("circle.ring").data(function(node) {
                return [node]
            }),
            circles.enter().insert("circle", ".outline").classed("ring", !0).attr({
                cx: 0,
                cy: 0,
                "stroke-width": "8px"
            }),
            circles.attr({
                r: function(node) {
                    return node.radius + 4
                }
            }),
            circles.exit().remove()
        },
        onTick: noop
    }),
    arrowPath = new neo.Renderer({
        name: "arrowPath",
        onGraphChange: function(selection, viz) {
            var paths;
            return paths = selection.selectAll("path.outline").data(function(rel) {
                return [rel]
            }),
            paths.enter().append("path").classed("outline", !0),
            paths.attr("fill", function(rel) {
                return viz.style.forRelationship(rel).get("color")
            }).attr("stroke", "none"),
            paths.exit().remove()
        },
        onTick: function(selection) {
            return selection.selectAll("path").attr("d", function(d) {
                return d.arrow.outline(d.shortCaptionLength)
            })
        }
    }),
    relationshipType = new neo.Renderer({
        name: "relationshipType",
        onGraphChange: function(selection, viz) {
            var texts;
            return texts = selection.selectAll("text").data(function(rel) {
                return [rel]
            }),
            texts.enter().append("text").attr({
                "text-anchor": "middle"
            }).attr({
                "pointer-events": "none"
            }),
            texts.attr("font-size", function(rel) {
                return viz.style.forRelationship(rel).get("font-size")
            }).attr("fill", function(rel) {
                return viz.style.forRelationship(rel).get("text-color-" + rel.captionLayout)
            }),
            texts.exit().remove()
        },
        onTick: function(selection, viz) {
            return selection.selectAll("text").attr("x", function(rel) {
                return rel.arrow.midShaftPoint.x
            }).attr("y", function(rel) {
                return rel.arrow.midShaftPoint.y + parseFloat(viz.style.forRelationship(rel).get("font-size")) / 2 - 1
            }).attr("transform", function(rel) {
                return rel.naturalAngle < 90 || rel.naturalAngle > 270 ? "rotate(180 " + rel.arrow.midShaftPoint.x + " " + rel.arrow.midShaftPoint.y + ")" : null 
            }).text(function(rel) {
                return rel.shortCaption
            })
        }
    }),
    relationshipOverlay = new neo.Renderer({
        name: "relationshipOverlay",
        onGraphChange: function(selection) {
            var rects;
            return rects = selection.selectAll("path.overlay").data(function(rel) {
                return [rel]
            }),
            rects.enter().append("path").classed("overlay", !0),
            rects.exit().remove()
        },
        onTick: function(selection) {
            var band;
            return band = 16,
            selection.selectAll("path.overlay").attr("d", function(d) {
                return d.arrow.overlay(band)
            })
        }
    }),
    neo.renderers.node.push(nodeOutline),
    neo.renderers.node.push(nodeCaption),
    neo.renderers.node.push(nodeRing),
    neo.renderers.relationship.push(arrowPath),
    neo.renderers.relationship.push(relationshipType),
    neo.renderers.relationship.push(relationshipOverlay)
}(),
angular.module("neo4jApp.services").service("HistoryService", ["Settings", "localStorageService", function(Settings, localStorageService) {
    var HistoryService, storageKey;
    return storageKey = "history",
    new (HistoryService = function() {
        function HistoryService() {
            this.history = localStorageService.get(storageKey),
            angular.isArray(this.history) || (this.history = []),
            this.current = "",
            this.cursor = -1
        }
        return HistoryService.prototype.add = function(input) {
            if (this.current = "",
            (null  != input ? input.length : void 0) > 0 && this.history[0] !== input) {
                for (this.history.unshift(input); !(this.history.length <= Settings.maxHistory); )
                    this.history.pop();
                localStorageService.set(storageKey, JSON.stringify(this.history))
            }
            return this.get(-1)
        }
        ,
        HistoryService.prototype.next = function() {
            var idx;
            return idx = this.cursor,
            null  == idx && (idx = this.history.length),
            idx--,
            this.get(idx)
        }
        ,
        HistoryService.prototype.prev = function() {
            var idx;
            return idx = this.cursor,
            null  == idx && (idx = -1),
            idx++,
            this.get(idx)
        }
        ,
        HistoryService.prototype.setBuffer = function(input) {
            return this.buffer = input
        }
        ,
        HistoryService.prototype.get = function(idx) {
            return -1 === this.cursor && -1 !== idx && (this.current = this.buffer),
            0 > idx && (idx = -1),
            idx >= this.history.length && (idx = this.history.length - 1),
            this.cursor = idx,
            this.history[idx] || this.current
        }
        ,
        HistoryService
    }())
}
]),
angular.module("neo4jApp.directives").directive("serverTopic", ["$rootScope", "Frame", "Settings", function($rootScope, Frame, Settings) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var command, topic;
            return topic = attrs.serverTopic,
            command = "server",
            topic ? element.on("click", function(e) {
                return e.preventDefault(),
                topic = topic.toLowerCase().trim(),
                Frame.create({
                    input: "" + Settings.cmdchar + command + " " + topic
                }),
                $rootScope.$$phase ? void 0 : $rootScope.$apply()
            }) : void 0
        }
    }
}
]),
angular.module("neo4jApp.services").service("CypherParser", ["Utils", "Cypher", function(Utils, Cypher) {
    var CypherParser;
    return new (CypherParser = function() {
        function CypherParser() {
            this.last_checked_query = ""
        }
        return CypherParser.prototype.isPeriodicCommit = function(input) {
            var clean_input, pattern;
            return pattern = /^\s*USING\sPERIODIC\sCOMMIT/i,
            clean_input = Utils.stripComments(input),
            pattern.test(clean_input)
        }
        ,
        CypherParser.prototype.isProfileExplain = function(input) {
            var clean_input, pattern;
            return pattern = /^\s*(PROFILE|EXPLAIN)\s/i,
            clean_input = Utils.stripComments(input),
            pattern.test(clean_input)
        }
        ,
        CypherParser.prototype.runHints = function(editor, cb) {
            var input, p, that;
            return (input = editor.getValue()) ? input === this.last_checked_query || this.isPeriodicCommit(input) || this.isProfileExplain(input) ? void 0 : (this.last_checked_query = input,
            that = this,
            p = Cypher.transaction().commit("EXPLAIN " + input),
            p.then(function(res) {
                return cb(null , res)
            }, function() {
                return cb(!0, null ),
                that.last_checked_query = ""
            })) : editor.clearGutter("cypher-hints")
        }
        ,
        CypherParser
    }())
}
]),
angular.module("neo4jApp.services").service("ConnectionStatusService", ["$rootScope", "AuthDataService", "Settings", "$timeout", function($rootScope, AuthDataService, Settings, $timeout) {
    var that;
    return this.updatePersistentAuthData = function(data) {
        return data ? AuthDataService.setAuthData(data) : AuthDataService.clearAuthData()
    }
    ,
    this.unpersistCredentials = function() {
        return AuthDataService.clearPersistentAuthData()
    }
    ,
    this.updateStoreCredentials = function(storeCredentials) {
        var ref, ref1;
        return (null  != (ref = $rootScope.neo4j) ? ref.enterpriseEdition : void 0) ? storeCredentials === !0 && (storeCredentials = null  != (ref1 = [!1, "false", "no"].indexOf(Settings.storeCredentials) < 0) ? ref1 : {
            yes: !1
        }) : storeCredentials = !0,
        storeCredentials || this.unpersistCredentials(),
        AuthDataService.setStoreCredentials(storeCredentials)
    }
    ,
    this.updateCredentialTimeout = function(credentialTimeout) {
        var ref;
        return (null  != (ref = $rootScope.neo4j) ? ref.enterpriseEdition : void 0) || (credentialTimeout = 0),
        AuthDataService.setCredentialTimeout(credentialTimeout)
    }
    ,
    this.connected_user = "",
    this.authorization_required = !0,
    this.is_connected = !1,
    this.session_start_time = new Date,
    this.session_countdown = null ,
    this.waiting_policies = !1,
    this.setConnectionAuthData = function(username, password) {
        return this.setConnectedUser(username),
        this.updatePersistentAuthData(username + ":" + password)
    }
    ,
    this.connectionAuthData = function() {
        return AuthDataService.getAuthData()
    }
    ,
    this.plainConnectionAuthData = function() {
        var data;
        return data = AuthDataService.getPlainAuthData(),
        data ? data.split(":") : ["", ""]
    }
    ,
    this.clearConnectionAuthData = function() {
        return this.setConnectedUser(""),
        this.updatePersistentAuthData(!1),
        AuthDataService.clearPolicies()
    }
    ,
    this.setConnectedUser = function(username) {
        return this.connected_user = username
    }
    ,
    this.connectedAsUser = function() {
        return this.connected_user
    }
    ,
    this.setAuthorizationRequired = function(authorization_required) {
        return this.authorization_required = authorization_required
    }
    ,
    this.authorizationRequired = function() {
        return this.authorization_required
    }
    ,
    this.setConnected = function(is_connected) {
        var old_connection;
        return old_connection = this.is_connected,
        this.is_connected = is_connected,
        old_connection !== is_connected && $rootScope.$emit("auth:status_updated", is_connected),
        is_connected ? void 0 : $rootScope.$emit("auth:disconnected")
    }
    ,
    this.isConnected = function() {
        return this.is_connected
    }
    ,
    this.setAuthPolicies = function(policies) {
        return $rootScope.neo4j && $rootScope.neo4j.version ? (policies.storeCredentials ? policies.storeCredentials && (this.updateStoreCredentials(!0),
        AuthDataService.persistCachedAuthData()) : this.updateStoreCredentials(!1),
        this.getCredentialTimeout() !== policies.credentialTimeout && (this.updateCredentialTimeout(policies.credentialTimeout),
        this.restartSessionCountdown()),
        this.waiting_policies = !1) : this.waiting_policies = policies
    }
    ,
    this.getStoreCredentials = function() {
        return AuthDataService.getPolicies().storeCredentials
    }
    ,
    this.getCredentialTimeout = function() {
        return AuthDataService.getPolicies().credentialTimeout
    }
    ,
    this.setSessionStartTimer = function(start_date) {
        return this.session_start_time = start_date,
        this.startSessionCountdown()
    }
    ,
    this.startSessionCountdown = function() {
        var that, ttl;
        return this.isConnected() && AuthDataService.getPolicies().credentialTimeout ? (that = this,
        this.session_start_time = new Date,
        ttl = (new Date).getTime() / 1e3 + AuthDataService.getPolicies().credentialTimeout - this.session_start_time.getTime() / 1e3,
        this.session_countdown = $timeout(function() {
            return that.clearConnectionAuthData(),
            that.setConnected(!1)
        }, 1e3 * ttl)) : void this.clearSessionCountdown()
    }
    ,
    this.clearSessionCountdown = function() {
        return this.session_countdown ? $timeout.cancel(this.session_countdown) : void 0
    }
    ,
    this.restartSessionCountdown = function() {
        return this.clearSessionCountdown(),
        this.startSessionCountdown()
    }
    ,
    this.getConnectionAge = function() {
        return Math.ceil(((new Date).getTime() - this.session_start_time.getTime()) / 1e3)
    }
    ,
    this.getConnectionStatusSummary = function() {
        return {
            user: this.connectedAsUser(),
            authorization_required: this.authorizationRequired(),
            is_connected: this.isConnected(),
            store_credentials: this.getStoreCredentials(),
            credential_timeout: this.getCredentialTimeout(),
            connection_age: this.getConnectionAge()
        }
    }
    ,
    $rootScope.$on("settings:saved", function() {
        return that.setAuthPolicies({
            storeCredentials: Settings.storeCredentials,
            credentialTimeout: AuthDataService.getPolicies().credentialTimeout
        }),
        AuthDataService.getPolicies().storeCredentials === !1 ? that.unpersistCredentials() : AuthDataService.persistCachedAuthData()
    }),
    $rootScope.$on("db:updated:edition", function(e, edition) {
        return AuthDataService.clearPolicies(),
        that.waiting_policies ? that.setAuthPolicies(that.waiting_policies) : void 0
    }),
    this.setConnectedUser(this.plainConnectionAuthData()[0]),
    that = this,
    this
}
]);
var bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments)
    }
}
;
angular.module("neo4jApp.services").service("UsageDataCollectionService", ["Settings", "localStorageService", "Intercom", "$timeout", function(Settings, localStorageService, Intercom, $timeout) {
    var UsageDataCollectionService, storageKey;
    return storageKey = "udc",
    new (UsageDataCollectionService = function() {
        function UsageDataCollectionService() {
            this.shouldPing = bind(this.shouldPing, this),
            this.pingLater = bind(this.pingLater, this),
            this.data = localStorageService.get(storageKey),
            angular.isObject(this.data) || (this.data = this.reset()),
            this.data.client_starts = (this.data.client_starts || 0) + 1,
            this.save()
        }
        return UsageDataCollectionService.prototype.reset = function() {
            return this.data = {
                uuid: UUID.genV1().toString(),
                created_at: Math.round(Date.now() / 1e3),
                client_starts: 0
            },
            this.save(),
            this.data
        }
        ,
        UsageDataCollectionService.prototype.save = function() {
            return localStorageService.set(storageKey, JSON.stringify(this.data))
        }
        ,
        UsageDataCollectionService.prototype.loadUDC = function() {
            return Intercom.load(),
            Intercom.reload()
        }
        ,
        UsageDataCollectionService.prototype.unloadUDC = function() {
            return Intercom.unload()
        }
        ,
        UsageDataCollectionService.prototype.set = function(key, value) {
            return this.data[key] = value,
            this.save(),
            value
        }
        ,
        UsageDataCollectionService.prototype.increment = function(key) {
            return this.data[key] = (this.data[key] || 0) + 1,
            this.save(),
            this.data[key]
        }
        ,
        UsageDataCollectionService.prototype.ping = function(event) {
            if (this.shouldPing(event))
                switch (event) {
                case "connect":
                    return this.connectUser(),
                    Intercom.update({
                        companies: [{
                            type: "company",
                            name: "Neo4j " + this.data.neo4j_version + " " + this.data.store_id,
                            company_id: this.data.store_id
                        }]
                    }),
                    Intercom.event("connect", {
                        store_id: this.data.store_id,
                        neo4j_version: this.data.neo4j_version,
                        client_starts: this.data.client_starts,
                        cypher_attempts: this.data.cypher_attempts,
                        cypher_wins: this.data.cypher_wins,
                        cypher_fails: this.data.cypher_fails,
                        accepts_replies: Settings.acceptsReplies
                    })
                }
        }
        ,
        UsageDataCollectionService.prototype.connectUser = function() {
            var userData;
            return userData = Settings.shouldReportUdc ? this.data : {},
            userData.name = Settings.userName,
            Intercom.user(this.data.uuid, userData)
        }
        ,
        UsageDataCollectionService.prototype.pingLater = function(event) {
            var timer;
            return timer = $timeout(function(_this) {
                return function() {
                    return _this.ping(event)
                }
            }(this), 1e3 * Settings.heartbeat)
        }
        ,
        UsageDataCollectionService.prototype.shouldPing = function(event) {
            var pingTime, today;
            return null  == Settings.shouldReportUdc ? (this.pingLater(event),
            !1) : this.hasRequiredData() ? this.isBeta() || Settings.shouldReportUdc ? (pingTime = new Date(this.data.pingTime || 0),
            today = new Date,
            today = new Date(today.getFullYear(),today.getMonth(),today.getDay()),
            today > pingTime ? (this.set("pingTime", today.getTime()),
            !0) : !1) : !1 : (this.pingLater(event),
            !1)
        }
        ,
        UsageDataCollectionService.prototype.isBeta = function() {
            return /-M\d\d/.test(this.data.neo4j_version)
        }
        ,
        UsageDataCollectionService.prototype.hasRequiredData = function() {
            return this.data.store_id && this.data.neo4j_version
        }
        ,
        UsageDataCollectionService.prototype.toggleMessenger = function() {
            return this.connectUser(),
            Intercom.toggle()
        }
        ,
        UsageDataCollectionService.prototype.showMessenger = function() {
            return this.connectUser(),
            Intercom.showMessenger()
        }
        ,
        UsageDataCollectionService.prototype.newMessage = function(message) {
            return this.connectUser(),
            Intercom.newMessage(message)
        }
        ,
        UsageDataCollectionService
    }())
}
]);
var slice = [].slice;
angular.module("neo4jApp.services").service("Intercom", ["$log", "$window", "$timeout", function($log, $window, $timeout) {
    var IntercomService;
    return new (IntercomService = function() {
        function IntercomService() {
            this._Intercom = $window.Intercom,
            this.booted = !1
        }
        return IntercomService.prototype.load = function() {
            return this._Intercom ? void 0 : function() {
                var d, i, ic, l;
                return ic = $window.Intercom,
                l = function() {
                    var s, x;
                    s = d.createElement("script"),
                    s.type = "text/javascript",
                    s.async = !0,
                    s.src = "https://widget.intercom.io/widget/lq70afwx",
                    x = d.getElementsByTagName("script")[0],
                    x.parentNode.insertBefore(s, x)
                }
                ,
                "function" == typeof ic ? ic("reattach_activator") : (d = document,
                i = function() {
                    i.c(arguments)
                }
                ,
                i.q = [],
                i.c = function(args) {
                    i.q.push(args)
                }
                ,
                $window.Intercom = i,
                l())
            }()
        }
        ,
        IntercomService.prototype.unload = function() {
            return this._Intercom = !1
        }
        ,
        IntercomService.prototype.reload = function() {
            return this._Intercom = $window.Intercom,
            this.booted = !1
        }
        ,
        IntercomService.prototype["do"] = function() {
            var args, command, params, that;
            return command = arguments[0],
            params = 2 <= arguments.length ? slice.call(arguments, 1) : [],
            this._Intercom ? (that = this,
            args = arguments,
            $timeout(function() {
                return $window.Intercom.apply(that, args)
            })) : void 0
        }
        ,
        IntercomService.prototype.user = function(userID, userData) {
            var intercomSettings;
            if (this._Intercom)
                return intercomSettings = {
                    app_id: "lq70afwx",
                    user_id: userID
                },
                angular.extend(intercomSettings, userData),
                this.booted ? void 0 : (this["do"]("boot", intercomSettings),
                this._Intercom("hide"),
                this._Intercom("onShow", function(_this) {
                    return function() {
                        return _this.isShowing = !0
                    }
                }(this)),
                this._Intercom("onHide", function(_this) {
                    return function() {
                        return _this.isShowing = !1
                    }
                }(this)),
                this.booted = !0)
        }
        ,
        IntercomService.prototype.toggle = function() {
            return this.isShowing ? this["do"]("hide") : (this.isShowing = !0,
            this["do"]("show"))
        }
        ,
        IntercomService.prototype.showMessenger = function() {
            return this["do"]("show")
        }
        ,
        IntercomService.prototype.newMessage = function(message) {
            return this["do"]("showNewMessage", message)
        }
        ,
        IntercomService.prototype.update = function(userData) {
            return this["do"]("update", userData)
        }
        ,
        IntercomService.prototype.event = function(eventName, eventData) {
            return this["do"]("trackEvent", eventName, eventData)
        }
        ,
        IntercomService
    }())
}
]),
angular.module("neo4jApp.controllers").controller("NotificationCtrl", ["$scope", "$sce", "$log", "Settings", "SettingsStore", function($scope, $sce, $log, Settings, SettingsStore) {
    return $scope.notifications = [],
    $scope.hasNotifications = function() {
        return $scope.notifications.length > 0
    }
    ,
    $scope.defaultNotifications = [{
        setting: "shouldReportUdc",
        message: "Hello and thanks for downloading Neo4j! Help us make Neo4j even better by sharing <a href='http://neo4j.com/legal/neo4j-user-experience/'> non&#8209;sensitive data</a>. Would that be OK?",
        style: "warning",
        options: [{
            label: "Yes, I'm happy to help!",
            icon: "fa-smile-o",
            btn: "btn-good",
            value: !0
        }, {
            label: "Sorry no, but good luck",
            icon: "fa-frown-o",
            btn: "btn-neutral",
            value: !1
        }]
    }],
    $scope.rememberThenDismiss = function(_this) {
        return function(notification, value) {
            return Settings[notification.setting] = value,
            SettingsStore.save(),
            $scope.notifications.shift()
        }
    }(this),
    angular.forEach($scope.defaultNotifications, function(_this) {
        return function(notification) {
            return null  == Settings[notification.setting] ? $scope.notifications.push(notification) : void 0
        }
    }(this))
}
]),
angular.module("neo4jApp.controllers").controller("SettingsCtrl", ["$scope", "$sce", "$log", "Settings", "SettingsStore", function($scope, $sce, $log, Settings, SettingsStore) {
    return $scope.settings = Settings,
    $scope.save = function() {
        return SettingsStore.save()
    }
}
]),
angular.module("neo4jApp.services").service("Canvg", ["$window", function($window) {
    return $window.canvg
}
]),
angular.module("neo4jApp.services").service("SVGUtils", [function() {
    return this.prepareForExport = function($element, dimensions) {
        var svg;
        return svg = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "svg")),
        svg.append("title").text("Neo4j Graph Visualization"),
        svg.append("desc").text("Created using Neo4j (http://www.neo4j.com/)"),
        d3.select($element.get(0)).selectAll("g.layer").each(function() {
            return svg.node().appendChild($(this).clone().get(0))
        }),
        svg.selectAll(".overlay, .ring").remove(),
        svg.selectAll("text").attr("font-family", "sans-serif"),
        svg.attr("width", dimensions.width),
        svg.attr("height", dimensions.height),
        svg.attr("viewBox", dimensions.viewBox),
        svg
    }
    ,
    this
}
]),
angular.module("neo4jApp.controllers").controller("AdLibDataController", ["$scope", "AuthService", "Frame", "Settings", function($scope, Settings) {
    return $scope.nodeLabelA = "Person",
    $scope.propertyKeyA = "name",
    $scope.propertyValueA = "Ann",
    $scope.nodeLabelB = "Person",
    $scope.propertyKeyB = "name",
    $scope.propertyValueB = "Dan",
    $scope.relationshipType = "KNOWS",
    $scope.relationshipDepth = 3
}
]),
angular.module("neo4jApp.filters").filter("tickitize", function() {
    return function(input) {
        return input.match(/^[A-Za-z][A-Za-z0-9_]*$/) ? input : "`" + input + "`"
    }
}),
angular.module("neo4jApp.controllers").controller("SysinfoController", ["$scope", "Settings", "Server", "$timeout", function($scope, Settings, Server, $timeout) {
    var refreshLater, timer;
    return $scope.autoRefresh = !1,
    $scope.sysinfo = {},
    $scope.refresh = function() {
        var base, base1, base2, base3, base4;
        return null  == (base = $scope.sysinfo).kernel && (base.kernel = {}),
        Server.jmx(["org.neo4j:instance=kernel#0,name=Configuration", "org.neo4j:instance=kernel#0,name=Kernel", "org.neo4j:instance=kernel#0,name=Store file sizes"]).success(function(response) {
            var a, i, len, r, results;
            for (results = [],
            i = 0,
            len = response.length; len > i; i++)
                r = response[i],
                results.push(function() {
                    var j, len1, ref, results1;
                    for (ref = r.attributes,
                    results1 = [],
                    j = 0,
                    len1 = ref.length; len1 > j; j++)
                        a = ref[j],
                        results1.push($scope.sysinfo.kernel[a.name] = a.value);
                    return results1
                }());
            return results
        }).error(function(r) {
            return $scope.sysinfo.kernel = {}
        }),
        null  == (base1 = $scope.sysinfo).primitives && (base1.primitives = {}),
        Server.jmx(["org.neo4j:instance=kernel#0,name=Primitive count"]).success(function(response) {
            var a, i, len, r, results;
            for (results = [],
            i = 0,
            len = response.length; len > i; i++)
                r = response[i],
                results.push(function() {
                    var j, len1, ref, results1;
                    for (ref = r.attributes,
                    results1 = [],
                    j = 0,
                    len1 = ref.length; len1 > j; j++)
                        a = ref[j],
                        results1.push($scope.sysinfo.primitives[a.name] = a.value);
                    return results1
                }());
            return results
        }).error(function(r) {
            return $scope.sysinfo.primitives = {}
        }),
        null  == (base2 = $scope.sysinfo).cache && (base2.cache = {
            available: !1
        }),
        Server.jmx(["org.neo4j:instance=kernel#0,name=Page cache"]).success(function(response) {
            var a, i, len, r, results;
            for (results = [],
            i = 0,
            len = response.length; len > i; i++)
                r = response[i],
                $scope.sysinfo.cache.available = !0,
                results.push(function() {
                    var j, len1, ref, results1;
                    for (ref = r.attributes,
                    results1 = [],
                    j = 0,
                    len1 = ref.length; len1 > j; j++)
                        a = ref[j],
                        results1.push($scope.sysinfo.cache[a.name] = a.value);
                    return results1
                }());
            return results
        }).error(function(r) {
            return $scope.sysinfo.cache = {
                available: !1
            }
        }),
        null  == (base3 = $scope.sysinfo).tx && (base3.tx = {
            available: !1
        }),
        Server.jmx(["org.neo4j:instance=kernel#0,name=Transactions"]).success(function(response) {
            var a, i, len, r, results;
            for (results = [],
            i = 0,
            len = response.length; len > i; i++)
                r = response[i],
                $scope.sysinfo.tx.available = !0,
                results.push(function() {
                    var j, len1, ref, results1;
                    for (ref = r.attributes,
                    results1 = [],
                    j = 0,
                    len1 = ref.length; len1 > j; j++)
                        a = ref[j],
                        results1.push($scope.sysinfo.tx[a.name] = a.value);
                    return results1
                }());
            return results
        }).error(function(r) {
            return $scope.sysinfo.tx = {
                available: !1
            }
        }),
        null  == (base4 = $scope.sysinfo).ha && (base4.ha = {}),
        Server.jmx(["org.neo4j:instance=kernel#0,name=High Availability"]).success(function(response) {
            var a, clusterMember, connectedMemberId, i, j, k, l, len, len1, len2, len3, ma, member, r, ref, ref1, ref2, results;
            for (results = [],
            i = 0,
            len = response.length; len > i; i++) {
                for (r = response[i],
                $scope.sysinfo.ha.clustered = !0,
                ref = r.attributes,
                j = 0,
                len1 = ref.length; len1 > j; j++)
                    if (a = ref[j],
                    "InstancesInCluster" === a.name)
                        for ($scope.sysinfo.ha.ClusterMembers = {},
                        ref1 = a.value,
                        k = 0,
                        len2 = ref1.length; len2 > k; k++) {
                            for (member = ref1[k],
                            clusterMember = {},
                            ref2 = member.value,
                            l = 0,
                            len3 = ref2.length; len3 > l; l++)
                                ma = ref2[l],
                                clusterMember[ma.name] = ma.value;
                            clusterMember.connected = !1,
                            $scope.sysinfo.ha.ClusterMembers[clusterMember.instanceId] = clusterMember
                        }
                    else
                        "InstanceId" === a.name && (connectedMemberId = a.value),
                        $scope.sysinfo.ha[a.name] = a.value;
                results.push($scope.sysinfo.ha.ClusterMembers[connectedMemberId].connected = !0)
            }
            return results
        }).error(function(r) {
            return $scope.sysinfo.ha = {
                clustered: !1
            }
        })
    }
    ,
    timer = null ,
    refreshLater = function(_this) {
        return function() {
            return $timeout.cancel(timer),
            $scope.autoRefresh ? ($scope.refresh(),
            timer = $timeout(refreshLater, 1e3 * Settings.refreshInterval)) : void 0
        }
    }(this),
    $scope.isMaster = function(member) {
        return "master" === member.haRole
    }
    ,
    $scope.toggleAutoRefresh = function() {
        return $scope.autoRefresh = !$scope.autoRefresh,
        refreshLater()
    }
    ,
    $scope.refresh()
}
]),
angular.module("neo4jApp.controllers").controller("FrameCtrl", ["$scope", function($scope) {
    return $scope.pinned = !1,
    $scope.pin = function(frame) {
        return $scope.pinned = !$scope.pinned,
        $scope.pinned ? frame.pinTime = (new Date).getTime() : (frame.pinTime = 0,
        frame.startTime = (new Date).getTime())
    }
}
]),
angular.module("neo4jApp.controllers").controller("FrameNotificationCtrl", ["$scope", "$timeout", "Editor", "Settings", function($scope, $timeout, Editor, Settings) {
    var $$id, addNotification;
    return $scope.notifications = [],
    $$id = 0,
    addNotification = function(type, message, fn, ttl) {
        var $$timeout, current_id, obj;
        return null  == type && (type = "default"),
        null  == ttl && (ttl = 0),
        current_id = ++$$id,
        obj = {
            type: type,
            message: message,
            fn: fn,
            $$id: current_id,
            $$is_closing: !1
        },
        $scope.notifications.push(obj),
        $$timeout = $timeout(function() {
            return $scope.close(obj)
        }, ttl),
        obj.$$timeout = $$timeout,
        obj
    }
    ,
    $scope.close = function(obj) {
        return obj.$$timeout && $timeout.cancel(obj.$$timeout),
        $timeout(function() {
            return $scope.notifications = $scope.notifications.filter(function(item) {
                return item.$$id !== obj.$$id
            })
        }, 700),
        obj.$$is_closing = !0
    }
    ,
    $scope.$on("frame.notif.max_neighbour_limit", function(event, result) {
        var fn, msg;
        return msg = "Rendering was limited to " + result.neighbourDisplayedSize + " of the node's total " + result.neighbourSize + " connections ",
        msg += "due to browser config maxNeighbours.",
        fn = function() {
            return Editor.setContent(Settings.cmdchar + "config maxNeighbours: " + result.neighbourDisplayedSize)
        }
        ,
        addNotification("default", msg, fn, 1e4)
    })
}
]),
angular.module("neo4jApp.directives").directive("cypherHint", [function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var unbind;
            return unbind = scope.$watch(attrs.cypherHint, function(val) {
                var i, inputArr, outputArr;
                if (val)
                    return val.position || (val.position = {
                        line: 1,
                        column: 1,
                        offset: 0
                    }),
                    inputArr = attrs.cypherInput.replace(/^\s*(EXPLAIN|PROFILE)\s*/, "").split("\n"),
                    1 === val.position.line && 1 === val.position.column && 0 === val.position.offset ? outputArr = inputArr : (outputArr = [inputArr[val.position.line - 1]],
                    outputArr.push(function() {
                        var j, ref, results;
                        for (results = [],
                        i = j = 0,
                        ref = val.position.column; ref >= 0 ? ref > j : j > ref; i = ref >= 0 ? ++j : --j)
                            results.push(" ");
                        return results
                    }().join("") + "^")),
                    element.text(outputArr.join("\n")),
                    unbind()
            })
        }
    }
}
]),
angular.module("neo4jApp.directives").directive("playSrc", ["$compile", "$rootScope", "Utils", function($compile, $rootScope, Utils) {
    return function(scope, element, attrs) {
        var unbind;
        return unbind = scope.$watch("frame.response", function(response) {
            return response ? (response.is_remote && (response.contents = Utils.cleanHTML(response.contents)),
            element.html(response.contents),
            $compile(element.contents())(scope),
            unbind()) : void 0
        })
    }
}
]);
var neo, indexOf = [].indexOf || function(item) {
    for (var i = 0, l = this.length; l > i; i++)
        if (i in this && this[i] === item)
            return i;
    return -1
}
;
"undefined" != typeof global && null  !== global && (global.neo = global.neo || {}),
"undefined" != typeof window && null  !== window && (window.neo = window.neo || {}),
neo = ("undefined" != typeof global && null  !== global ? global.neo : void 0) || ("undefined" != typeof window && null  !== window ? window.neo : void 0),
neo.helpers = function() {
    function helpers() {
        this.argv = function(input) {
            var rv;
            return rv = input.toLowerCase().split(" "),
            rv || []
        }
        ,
        this.parseId = function(resource) {
            var id;
            return null  == resource && (resource = ""),
            id = resource.substr(resource.lastIndexOf("/") + 1),
            parseInt(id, 10)
        }
        ,
        this.stripComments = function(input) {
            var j, len, row, rows, rv;
            for (rows = input.split("\n"),
            rv = [],
            j = 0,
            len = rows.length; len > j; j++)
                row = rows[j],
                0 !== row.indexOf("//") && rv.push(row);
            return rv.join("\n")
        }
        ,
        this.firstWord = function(input) {
            return input.split(/\n| /)[0]
        }
        ,
        this.extendDeep = function(_this) {
            return function(dst) {
                var index, key, obj, that, value;
                that = _this;
                for (index in arguments)
                    if (obj = arguments[index],
                    obj !== dst)
                        for (key in obj)
                            value = obj[key],
                            dst[key] && "object" == typeof dst[key] && Object.getOwnPropertyNames(dst[key]).length > 0 ? that.extendDeep(dst[key], value) : "function" != typeof dst[key] && (dst[key] = value);
                return dst
            }
        }(this),
        this.extend = function(objects) {
            var extended, i, j, merge, obj, ref;
            for (extended = {},
            merge = function(obj) {
                var index, prop, results;
                results = [];
                for (index in obj)
                    prop = obj[index],
                    Object.prototype.hasOwnProperty.call(obj, index) ? results.push(extended[index] = obj[index]) : results.push(void 0);
                return results
            }
            ,
            merge(arguments[0]),
            i = j = 1,
            ref = arguments.length; ref >= 1 ? ref > j : j > ref; i = ref >= 1 ? ++j : --j)
                obj = arguments[i],
                merge(obj);
            return extended
        }
        ,
        this.throttle = function(func, wait) {
            var last_timestamp, limit;
            return last_timestamp = null ,
            limit = wait,
            function() {
                var args, context, now;
                return context = this,
                args = arguments,
                now = Date.now(),
                !last_timestamp || now - last_timestamp >= limit ? (last_timestamp = now,
                func.apply(context, args)) : void 0
            }
        }
        ,
        this.parseTimeMillis = function(_this) {
            return function(timeWithOrWithoutUnit) {
                var unit, value;
                if (timeWithOrWithoutUnit += "",
                unit = timeWithOrWithoutUnit.match(/\D+/),
                value = parseInt(timeWithOrWithoutUnit),
                1 !== (null  != unit ? unit.length : void 0))
                    return 1e3 * value;
                switch (unit[0]) {
                case "ms":
                    return value;
                case "s":
                    return 1e3 * value;
                case "m":
                    return 1e3 * value * 60;
                default:
                    return 0
                }
            }
        }(this),
        this.ua2text = function(ua) {
            var i, j, ref, s;
            for (s = "",
            i = j = 0,
            ref = ua.length; ref >= 0 ? ref >= j : j >= ref; i = ref >= 0 ? ++j : --j)
                s = s + "" + String.fromCharCode(ua[i]);
            return s
        }
        ,
        this.escapeHTML = function(string) {
            var entityMap;
            return entityMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
                "/": "&#x2F;"
            },
            String(string).replace(/[&<>"'\/]/g, function(s) {
                return entityMap[s]
            })
        }
        ,
        this.cleanHTML = function(string) {
            return this.stripNGAttributes(this.stripScripts(string))
        }
        ,
        this.stripScripts = function(string) {
            return null  == string && (string = ""),
            string = string.replace(/(\s+(on[^\s=]+)[^\s=]*\s*=\s*("[^"]*"|'[^']*'|[\w\-.:]+\s*))/gi, ""),
            string.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*(<\/script>)?/gi, "")
        }
        ,
        this.stripNGAttributes = function(string) {
            return null  == string && (string = ""),
            string.replace(/(\s+(ng|data|x)[^\s=]*\s*=\s*("[^"]*"|'[^']*'|[\w\-.:]+\s*))/gi, "")
        }
        ,
        this.hostIsAllowed = function(hostname, whitelist, is_enterprise) {
            var whitelisted_hosts;
            return !is_enterprise || whitelist && "*" !== whitelist ? (whitelisted_hosts = is_enterprise ? whitelist.split(",") : ["http://guides.neo4j.com", "https://guides.neo4j.com", "http://localhost", "https://localhost"],
            indexOf.call(whitelisted_hosts, hostname) >= 0) : !0
        }
    }
    return helpers
}();
var neo;
"undefined" != typeof global && null  !== global && (global.neo = global.neo || {}),
"undefined" != typeof window && null  !== window && (window.neo = window.neo || {}),
neo = ("undefined" != typeof global && null  !== global ? global.neo : void 0) || ("undefined" != typeof window && null  !== window ? window.neo : void 0),
neo.serializer = function() {
    function serializer(opts) {
        null  == opts && (opts = {}),
        this.options = (new neo.helpers).extend(opts, {
            delimiter: ","
        }),
        this._output = "",
        this._columns = null ,
        this.append = function(row) {
            var cell, ref;
            if (!Array.isArray(row) && row.length === (null  != (ref = this._columns) ? ref.length : void 0))
                throw "CSV: Row must an Array of column size";
            return this._output += "\n",
            this._output += function() {
                var i, len, results;
                for (results = [],
                i = 0,
                len = row.length; len > i; i++)
                    cell = row[i],
                    results.push(this._escape(cell));
                return results
            }
            .call(this).join(this.options.delimiter)
        }
        ,
        this.columns = function(cols) {
            var c;
            if (null  == cols)
                return this._columns;
            if (!Array.isArray(cols))
                throw "CSV: Columns must an Array";
            return this._columns = function() {
                var i, len, results;
                for (results = [],
                i = 0,
                len = cols.length; len > i; i++)
                    c = cols[i],
                    results.push(this._escape(c));
                return results
            }
            .call(this),
            this._output = this._columns.join(this.options.delimiter)
        }
        ,
        this.output = function() {
            return this._output
        }
        ,
        this._escape = function(string) {
            return null  == string ? "" : ("string" != typeof string && (string = JSON.stringify(string)),
            string.length ? ((string.indexOf(this.options.delimiter) > 0 || string.indexOf('"') >= 0) && (string = '"' + string.replace(/"/g, '""') + '"'),
            string) : '""')
        }
    }
    return serializer
}();
