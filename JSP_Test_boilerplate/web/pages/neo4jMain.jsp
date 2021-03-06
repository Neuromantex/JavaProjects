<!DOCTYPE html>
<html lang="en" ng-app="neo4jApp" ng-controller="MainCtrl" class="no-js">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title ng-bind-template="Neo4j {{kernel.store_dir}}">Neo4j</title>
    <meta name="description" content="Neo4j Browser">
    <meta name="author" content="Neo Technology">
    <link rel="apple-touch-icon" sizes="57x57" href="images/device-icons/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="images/device-icons/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="images/device-icons/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="images/device-icons/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="images/device-icons/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="images/device-icons/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="images/device-icons/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="images/device-icons/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="images/device-icons/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" href="images/device-icons/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="images/device-icons/android-chrome-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="images/device-icons/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="images/device-icons/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="images/device-icons/manifest.json">
    <link rel="shortcut icon" href="images/device-icons/favicon.ico">
    <meta name="msapplication-TileColor" content="#2d89ef">
    <meta name="msapplication-TileImage" content="images/device-icons/mstile-144x144.png">
    <meta name="msapplication-config" content="images/device-icons/browserconfig.xml">
    <meta name="theme-color" content="#ffffff">
    <link rel="stylesheet" href="styles/68eddd94.main.css">
  </head>
  <body ng-class="{'connection-error': offline, 'show-drawer': isDrawerShown, 'modal-shown': isPopupShown}" ng-controller="LayoutCtrl" keyup="globalKey($event)" mousemove="globalMouse($event)" class="theme-{{theme}}"><!--[if lt IE 9]>
    <div id="incompatible">Sorry, you need to upgrade to the latest version of Internet Explorer<br>in order to use the Neo4j browser</div><![endif]-->
    <div id="page-container" class="ng-cloak">
      <div id="leftbar" ng-controller="SidebarCtrl">
        <div id="nav">
          <ul class="nav list-group">
            <li ng-class="{active: showingDrawer(&quot;database&quot;) }" class="nav-header">
              <div ng-click="toggleDrawer(&quot;database&quot;)" tooltip="Overview" tooltip-placement="bottom" class="cover"></div><a>Neo4j
                <div fancy-logo ng-class="{loading: currentFrame.isLoading}" class="logo">
                  <div class="ball one"></div>
                  <div class="ball two"></div>
                  <div class="ball three"></div>
                </div></a>
            </li>
            <li ng-class="{active: showingDrawer(&quot;scripts&quot;) }" tooltip="Favorites" tooltip-placement="bottom"><a ng-click="toggleDrawer(&quot;scripts&quot;)" class="fa fa-star"></a></li>
            <li ng-class="{active: showingDrawer(&quot;info&quot;) }" tooltip="Information" tooltip-placement="bottom"><a ng-click="toggleDrawer(&quot;info&quot;)" class="fa fa-info-circle"></a></li>
          </ul>
          <ul class="nav list-group bottom">
            <li ng-class="{active: showingDrawer(&quot;preferences&quot;) }" tooltip="Configuration" tooltip-placement="top"><a ng-click="toggleDrawer(&quot;preferences&quot;)" class="fa fa-cog"></a></li>
            <li ng-class="{active: showingDrawer(&quot;credits&quot;) }" tooltip="About" tooltip-placement="top"><a ng-click="toggleDrawer(&quot;credits&quot;)">&#64;</a></li>
          </ul>
        </div>
        <div id="drawer" ng-switch on="whichDrawer">
          <div ng-switch-when="database" class="pane animate-drawer">
            <div class="inner">
              <h4>Database Information</h4>
              <h5>Node labels</h5><a ng-show="labels.length" ng-click="editor.execScript('MATCH (n) RETURN n LIMIT 25')" class="token token-label">*</a><span ng-show="!labels.length">No labels in database</span><span ng-repeat="label in labels | orderBy: identity"><a ng-click="editor.execScript(substituteToken('MATCH (n:&lt;token&gt;) RETURN n LIMIT 25', label))" class="token token-label">{{label}}</a></span>
              <h5>Relationship types</h5><a ng-show="relationships.length" ng-click="editor.execScript('MATCH ()-[r]-&gt;() RETURN r LIMIT 25')" class="token token-relationship-type">*</a><span ng-show="!relationships.length">No relationships in database</span><span ng-repeat="relationshipType in relationships | orderBy: identity"><a ng-click="editor.execScript(substituteToken('MATCH ()-[r:&lt;token&gt;]-&gt;() RETURN r LIMIT 25', relationshipType))" class="token token-relationship-type">{{relationshipType}}</a></span>
              <div ng-show="propertyKeys">
                <h5>Property keys</h5><span ng-show="!propertyKeys.length">No property keys in database</span><span ng-repeat="propertyKey in propertyKeys | orderBy: identity"><a ng-click="editor.execScript(substituteToken('MATCH (n) WHERE has(n.&lt;token&gt;) RETURN DISTINCT &quot;node&quot; as element, n.&lt;token&gt; AS &lt;token&gt; LIMIT 25 UNION ALL MATCH ()-[r]-() WHERE has(r.&lt;token&gt;) RETURN DISTINCT &quot;relationship&quot; AS element, r.&lt;token&gt; AS &lt;token&gt; LIMIT 25', propertyKey))" class="token token-property-key">{{propertyKey}}</a></span>
              </div>
              <h5>Database</h5>
              <ul>
                <li class="pair">
                  <div class="key">Version:</div>
                  <div class="value">{{ neo4j.version }}</div>
                </li>
                <li class="pair">
                  <div class="key">Location:</div>
                  <div class="value">{{kernel.StoreDirectory || '-'}}</div>
                </li>
                <li class="pair">
                  <div class="key">Size:</div>
                  <div class="value">{{kernel.TotalStoreSize | humanReadableBytes}}</div>
                </li>
                <li class="pair">
                  <div class="key">Information</div><a play-topic="sysinfo" class="value">sysinfo</a>
                </li>
              </ul>
            </div>
          </div>
          <div ng-switch-when="scripts" class="pane animate-drawer">
            <div class="inner">
              <h4>Favorites<a ng-click="folderService.create()" class="create-folder">
                  <div class="fa fa-plus"></div>New folder</a></h4>
              <div ng-repeat="folder in folders" class="droppable">
                <h5 ng-click="folderService.expand(folder)" ng-if="folder.id != 'root'" ng-class="{folded: !folder.expanded}" class="folder"><i ng-class="{'fa-rotate-90': folder.expanded}" class="fa fa-caret-right"></i>
                  <div edit-in-place="folder.name" on-blur="folderService.save()"></div><a ng-click="removeFolder(folder)" tooltip-placement="left" tooltip="Remove folder" class="fa fa-trash-o"></a>
                </h5>
                <hr ng-if="folder.id == 'root'">
                <ul ng-show="folder.expanded" ui-sortable="sortableOptions" ng-model="folder.documents" ng-class="{'indented': folder.id != 'root'}" class="starred sortable">
                  <li ng-repeat="document in folder.documents">
                    <div ng-click="editor.loadDocument(document.id)" ng-class="{loaded: editor.document.id == document.id}" class="list-item"><a ng-click="playDocument(document.content);$event.stopPropagation()" ng-class="{&quot;icon-loaded fa-play-circle&quot;: editor.document.id == document.id, &quot;fa-circle-thin&quot;: editor.document.id != document.id}" class="fa icon"></a><a ng-click="playDocument(document.content);$event.stopPropagation()" class="fa fa-play-circle icon-inactive"></a><a ng-click="removeDocument(document);$event.stopPropagation()" class="fa fa-trash-o"></a>
                      <div class="contents"><a>{{document.content | autotitle}}</a></div>
                    </div>
                  </li>
                </ul>
              </div>
              <h5>Styling / Graph Style Sheet</h5>
              <ul>
                <li>
                  <button ng-click="editor.execScript(settings.cmdchar + 'style')" class="btn btn-sm btn-popup">Graph Style Sheet</button>
                </li>
              </ul>
              <h5>Import</h5>
              <file-upload upload="importDocument($content, $name)" extension="cyp|cypher|cql|txt|grass" message="Drop a file to import Cypher or Grass">&nbsp;</file-upload>
            </div>
          </div>
          <div ng-switch-when="info" class="pane animate-drawer">
            <div class="inner">
              <h4>Information</h4>
              <h5>Guides</h5>
              <ul>
                <li><a play-topic="intro">Getting started</a></li>
                <li><a play-topic="graphs">Basic graph concepts</a></li>
                <li><a play-topic="cypher">Writing Cypher queries</a></li>
              </ul>
              <h5>Reference</h5>
              <ul class="undecorated">
                <li><a href="http://neo4j.com/docs/{{neo4j.version | neo4jdoc }}/">Neo4j Manual</a></li>
                <li><a href="http://neo4j.com/developer/">Developer Resources</a></li>
                <li><a href="http://neo4j.com/docs/{{neo4j.version | neo4jdoc }}/cypher-refcard">Cypher</a></li>
                <li><a href="http://graphgist.neo4j.com/">GraphGists</a></li>
              </ul>
              <h5>Examples</h5>
              <ul>
                <li><a play-topic="movie-graph">Movie Graph</a></li>
                <li><a play-topic="northwind-graph">Northwind Graph</a></li>
                <li><a play-topic="query-template">Query Templates</a></li>
              </ul>
              <h5>Help</h5>
              <ul>
                <li><a help-topic="help">Help</a></li>
                <li><a help-topic="cypher">Cypher syntax</a></li>
                <li><a help-topic="commands">Available commands</a></li>
                <li><a help-topic="keys">Keyboard shortcuts</a></li>
              </ul>
            </div>
          </div>
          <div ng-switch-when="preferences" class="pane animate-drawer">
            <div class="inner">
              <h4>Configuration</h4>
              <form ng-controller="SettingsCtrl">
                <div ng-show="neo4j.config.allow_outgoing_browser_connections">
                  <h5>Messaging</h5>
                  <div class="form-group">
                    <label for="userName" tooltip="For in-browser chat with Neo4j staff" tooltip-placement="top">Name
                      <input id="userName" type="text" ng-model="settings.userName" ng-change="save()" class="form-control input">
                    </label>
                  </div>
                  <div class="checkbox">
                    <label for="shouldReportUdc">
                      <input id="shouldReportUdc" type="checkbox" ng-model="settings.shouldReportUdc" ng-change="save()"><span>&nbsp; Share non-sensitive data?</span>
                    </label>
                  </div>
                  <button ng-click="showMessenger()" class="btn btn-default btn-sm"> <span class="glyphicon glyphicon-envelope">&nbsp;Messenger</span></button>
                </div>
                <h5>User Interface</h5>
                <div class="form-group">
                  <label>Theme</label>
                  <div class="radio">
                    <label>
                      <input type="radio" name="themeRadio" id="theme1" value="normal" ng-model="settings.theme" ng-change="save()" checked="checked"><span tooltip="Colorful default theme." tooltip-placement="right">Normal</span>
                    </label>
                  </div>
                  <div class="radio">
                    <label>
                      <input type="radio" name="themeRadio" id="theme2" value="dark" ng-model="settings.theme" ng-change="save()"><span tooltip="Low contrast, great in dark surroundings." tooltip-placement="right">Dark</span>
                    </label>
                  </div>
                  <div class="radio">
                    <label>
                      <input type="radio" name="themeRadio" id="theme3" value="outline" ng-model="settings.theme" ng-change="save()"><span tooltip="Higher contrast, great when presenting." tooltip-placement="right">Outline</span>
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <label for="initCmd" tooltip="This command gets executed when connected." tooltip-placement="top">Initial Command
                    <input id="initCmd" type="string" ng-model="settings.initCmd" ng-change="save()" class="form-control input">
                  </label>
                </div>
                <h5>Preferences</h5>
                <div class="checkbox">
                  <label for="shouldReportUdc">
                    <input id="shouldReportUdc" type="checkbox" ng-model="settings.shouldReportUdc" ng-change="save()"><span>&nbsp; Help improve Neo4j? </span><a href="http://neo4j.com/legal/neo4j-user-experience/" class="fa fa-info-circle"> </a>
                  </label>
                </div>
                <div ng-show="neo4j.enterpriseEdition" class="checkbox">
                  <label for="storeCredentials">
                    <input id="storeCredentials" type="checkbox" ng-model="settings.storeCredentials" ng-change="save()"><span tooltip="Remember connection credentials in browser." tooltip-placement="right">
                       
                      &nbsp; Save login credentials</span>
                  </label>
                </div>
                <div class="checkbox">
                  <label for="enableMotd">
                    <input id="enableMotd" type="checkbox" ng-model="settings.enableMotd" ng-change="save()"><span tooltip="Show 'Message of the Day' link on start frame." tooltip-placement="right"> &nbsp; Enable MOTD feed</span>
                  </label>
                </div>
                <h5>Network Connection</h5>
                <div class="form-group">
                  <label for="maxExecutionTime" tooltip="Query timeout in seconds." tooltip-placement="top">Max Execution Time
                    <input id="maxExecutionTime" type="number" ng-model="settings.maxExecutionTime" ng-change="save()" class="form-control input">
                  </label>
                </div>
                <div class="form-group">
                  <label for="heartbeat" tooltip="Check connection and update meta data with this interval (in seconds)" tooltip-placement="top">Heartbeat interval
                    <input id="maxExecutionTime" type="number" ng-model="settings.heartbeat" ng-change="save()" class="form-control input">
                  </label>
                </div>
                <h5>Result Frames</h5>
                <div class="form-group">
                  <label for="maxFrames" tooltip="Max number of frames in stream. When reached, old frames gets retired." tooltip-placement="top">
                     
                    Max Frames
                    <input id="maxFrames" type="number" ng-model="settings.maxFrames" ng-change="save()" class="form-control input">
                  </label>
                </div>
                <div class="form-group">
                  <label for="maxHistory" tooltip="Max number of history entries. When reached, old entries gets retired." tooltip-placement="top">Max History
                    <input id="maxHistory" type="number" ng-model="settings.maxHistory" ng-change="save()" class="form-control input">
                  </label>
                </div>
                <div class="checkbox">
                  <label for="scrollToTop">
                    <input id="scrollToTop" type="checkbox" ng-model="settings.scrollToTop" ng-change="save()"><span tooltip="Automatically scroll stream to top on new frames." tooltip-placement="right">&nbsp; Scroll To Top</span>
                  </label>
                </div>
                <h5>Graph Visualization</h5>
                <div class="form-group">
                  <label for="maxNeighbours" tooltip="Limit exploratary queries to this limit." tooltip-placement="top">Max Neighbors
                    <input id="maxNeighbours" type="number" ng-model="settings.maxNeighbours" ng-change="save()" class="form-control input">
                  </label>
                </div>
                <div class="form-group">
                  <label for="maxRows" tooltip="Max number of rows to render in 'Rows' result view." tooltip-placement="top">Max Rows
                    <input id="maxRows" type="number" ng-model="settings.maxRows" ng-change="save()" class="form-control input">
                  </label>
                </div>
                <div class="form-group">
                  <label for="maxRawSize" tooltip="Limit rendering of raw output to this number of characters." tooltip-placement="top">
                     
                    Max Raw Size
                    <input id="maxRawSize" type="number" ng-model="settings.maxRawSize" ng-change="save()" class="form-control input">
                  </label>
                </div>
                <div class="form-group">
                  <label for="refreshInterval" tooltip="Refresh auto-refreshing frames on this interval (in seconds)" tooltip-placement="top">Refresh Interval
                    <input id="refreshInterval" type="number" ng-model="settings.refreshInterval" ng-change="save()" class="form-control input">
                  </label>
                </div>
              </form>
            </div>
          </div>
          <div ng-switch-when="credits" class="pane animate-drawer">
            <div class="inner">
              <h4>About Neo4j</h4>
              <h5>Made by<a href="http://neotechnology.com/" class="no-icon"> Neo Technology</a></h5>
              <p>Copyright &copy; 2002–<span>2016</span></p>
              <h5>License</h5>
              <p><a href="http://www.gnu.org/licenses/gpl.html" class="no-icon">GPLv3</a> or<a href="http://www.gnu.org/licenses/agpl-3.0.html" class="no-icon"> AGPL</a> for Open Source,<br>and<a href="http://neotechnology.com/" class="no-icon"> NTCL</a>
                <for>Commercial.</for>
              </p>
              <h5>Participate</h5>
              <ul>
                <li>Ask questions at<a href="http://stackoverflow.com/questions/tagged/neo4j" class="no-icon"> Stack Overflow</a></li>
                <li>Discuss Neo4j on<a href="http://groups.google.com/group/neo4j" class="no-icon"> Google Groups</a></li>
                <li>Visit a local<a href="http://neo4j.meetup.com/" class="no-icon"> Meetup Group</a></li>
                <li>Contribute code on<a href="http://github.com/neo4j" class="no-icon"> Github</a></li>
              </ul>
              <h5>Thanks</h5>
              <p>Neo4j wouldn't be possible without a fantastic community. Thanks for all the feedback, discussions and contributions.</p>
            </div>
            <footer>With&nbsp;<span class="fa fa-heart"></span> from Sweden.</footer>
          </div>
        </div>
      </div>
      <div id="main">
        <div id="editor" ng-controller="EditorCtrl" ng-mousedown="focusEditor($event)" ng-class="{'file-loaded': settings.filemode &amp;&amp; editor.document.id, 'maximize-editor': editor.maximized}">
          <div ng-if="settings.filemode &amp;&amp; editor.document.id" class="file-bar slide-down">
            <div class="title">{{editor.document.content | autotitle}}
            </div>
            <ul class="file-actions list-inline pull-left">
              <li ng-class="{'modified': editor.hasChanged()}"><a ng-click="star()" class="fa fa-star">Save</a></li>
              <li><a ng-click="create()" class="fa fa-plus">New</a></li>
              <li><a ng-click="clone()" class="fa fa-code-fork">Clone</a></li>
              <li><a exportable ng-click="exportScript(editor.content)" tooltip="Export to file" class="fa fa-download">Download</a></li>
            </ul>
            <ul class="file-actions list-inline pull-right">
              <li><a ng-click="editor.execScript(editor.content)" class="button fa fa-play"></a></li>
              <li><a ng-click="editor.setContent(&quot;&quot;)" class="button fa fa-times"></a></li>
            </ul>
          </div>
          <div class="view-editor"><span ng-class="{'one-line': editorOneLine, 'disable-highlighting': disableHighlighting}">
              <div class="prompt code-style">$</div>
              <ui-codemirror ui-codemirror-opts="{gutters:['cypher-hints'], theme: 'neo', mode: 'cypher', autofocus: true, lineNumbers: true, lineWrapping: true, onLoad: codemirrorLoaded}" ng-model="editor.content" placeholder="{{motd.tip}}"></ui-codemirror></span>
            <ul ng-if="!(settings.filemode &amp;&amp; editor.document.id)" class="controls list-inline">
              <li><a ng-class="{active: editorHasContent, 'enabled': editor.document.id, 'changed': editor.hasChanged()}" ng-click="star()" tooltip="Favorite" tooltip-placement="left" class="balled golden"><i ng-class="{'fa-exclamation': editor.hasChanged()}" class="fa fa-star"></i></a></li>
              <li ng-if="!settings.filemode"><a ng-click="editor.setContent(&quot;&quot;)" ng-class="{active: editorHasContent}" tooltip="Clear" tooltip-placement="left" class="balled add"><i class="fa fa-plus"></i></a></li>
              <li><a ng-click="editor.execScript(editor.content)" ng-class="{active: editorHasContent}" tooltip="Play" tooltip-placement="left" class="balled success"><i class="fa fa-play"></i></a></li>
            </ul>
            <div ng-if="editor.showMessage" ng-class="editor.errorCode" class="message-bar error slide-down"><span ng-bind-html-unsafe="editor.errorMessage"></span> Type <code click-to-code="':help commands'">:help commands</code> for a list of available commands.
              <div class="actions"><a ng-click="editor.showMessage = null" class="fa fa-times-circle"></a></div>
            </div>
            <div ng-if="unauthorized" ng-class="editor.errorCode" class="message-bar info"><span>
                Database access not available. Please use <code click-to-code="':server connect'">:server connect</code>
                to establish connection. There's a graph waiting for you.</span></div>
          </div>
        </div>
        <div frame-stream></div>
      </div>
      <div id="diagnostics" ng-show="showVizDiagnostics">
        <div>{{ visualizationStats.fps() }} frames/s; costs: {{ visualizationStats.top() }}</div>
      </div>
      <div id="error">{{errorMessage}}</div>
    </div>
    <script id="template/popover/popover.html" type="text/ng-template">
      <div ng-class="{ in: isOpen(), fade: animation()}" class="popover {{placement}}">
        <div class="arrow"></div>
        <div class="popover-inner">
          <h3 ng-bind="title" ng-show="title" class="popover-title"></h3>
          <div ng-bind-html-unsafe="content" class="popover-content"></div>
        </div>
      </div>
    </script>
    <script id="template/tooltip/tooltip-popup.html" type="text/ng-template"><div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner" ng-bind="content"></div>
</div>

    </script>
    <script id="template/tabs/tab.html" type="text/ng-template"><li ng-class="{active: active, disabled: disabled}">
  <a href ng-click="select()" tab-heading-transclude>{{heading}}</a>
</li>

    </script>
    <script id="template/tabs/tabset.html" type="text/ng-template"><div>
  <ul class="nav nav-{{type || 'tabs'}}" ng-class="{'nav-stacked': vertical, 'nav-justified': justified}" ng-transclude></ul>
  <div class="tab-content">
    <div class="tab-pane" 
         ng-repeat="tab in tabs" 
         ng-class="{active: tab.active}"
         tab-content-transclude="tab">
    </div>
  </div>
</div>

    </script>
    <script id="popup-styling" type="text/ng-template">
      <div id="grass" ng-controller="StylePreviewCtrl">
        <div class="modal-header"><a ng-click="togglePopup()" class="close pull-right">&times;</a>
          <ul class="list-inline">
            <li>
              <h3 style="display:inline;">Graph Style Sheet</h3>
            </li>
            <li><a exportable ng-click="exportGraSS(code)" tooltip-placement="bottom" tooltip="Export to file" class="fa fa-download"></a></li>
            <li><a exportable ng-click="reset()" tooltip-placement="bottom" tooltip="Reset to default style" class="fa fa-fire-extinguisher"></a></li>
          </ul>
        </div>
        <div class="modal-body">
          <textarea ng-model="code" disabled></textarea>
          <file-upload upload="import($content)" message="Drop a grass-file here to import">&nbsp;</file-upload>
        </div>
      </div>
    </script>
    <script id="template/modal/window.html" type="text/ng-template"><div tabindex="-1" role="dialog" class="modal fade" ng-class="{in: animate}" ng-style="{'z-index': 1050 + index*10, display: 'block'}" ng-click="close($event)">
    <div class="modal-dialog" ng-class="{'modal-sm': size == 'sm', 'modal-lg': size == 'lg'}"><div class="modal-content" modal-transclude></div></div>
</div>
    </script>
    <script id="template/modal/backdrop.html" type="text/ng-template"><div class="modal-backdrop fade {{ backdropClass }}"
     ng-class="{in: animate}"
     ng-style="{'z-index': 1040 + (index && 1 || 0) + index*10}"
></div>

    </script>
    <script id="inspector/graphItem.html" type="text/ng-template">
      <ul class="list-inline">
        <li ng-if="item.isNode" ng-repeat="label in item.labels">
          <div ng-style="styleForLabel(label)" ng-bind="label" class="token token-label"></div>
        </li>
        <li ng-if="!item.isNode">
          <div ng-style="styleForItem(item)" ng-bind="item.type" class="token token-relationship-type"></div>
        </li>
        <li ng-if="item.propertyList.length == 0" class="empty">No properties</li>
        <li class="pair">
          <div ng-bind-template="&lt;id&gt;: " class="key"></div>
          <div ng-bind="item.id" class="value"></div>
        </li>
        <li ng-repeat="property in item.propertyList" class="pair">
          <div ng-bind-template="{{property.key}}: " class="key"></div>
          <div ng-bind="property.value" class="value"></div>
        </li>
      </ul>
    </script>
    <script id="inspector/label.html" type="text/ng-template">
      <ul class="list-inline">
        <li class="inspector-icon">
          <div ng-style="{&quot;background-color&quot;: item.style.props.color, &quot;color&quot;: item.style.props[&quot;text-color-internal&quot;]}" class="token token-label">{{item.label || '*'}}</div>
        </li>
        <li class="colors">
          <ul class="list-inline">
            <li>Color:</li>
            <li ng-repeat="scheme in colors"><a ng-style="{&quot;background-color&quot;: scheme.color}" ng-class="{active: scheme.color == item.style.props.color &amp;&amp; scheme[&quot;border-color&quot;] == item.style.props[&quot;border-color&quot;]}" ng-click="selectScheme(item, scheme)"></a></li>
          </ul>
        </li>
        <li class="node-sizes">
          <ul class="list-inline">
            <li>Size:</li>
            <li ng-repeat="size in sizes"><a ng-class="{active: sizeLessThan(size.diameter, item.style.props.diameter)}" ng-style="nodeDisplaySize($index)" ng-click="selectSize(item, size)"></a></li>
          </ul>
        </li>
        <li class="attributes">
          <ul class="list-inline">
            <li>Caption:</li>
            <li><a ng-click="selectCaption(item, &quot;&lt;id&gt;&quot;)" ng-class="{selected: isSelectedCaption(item, '&lt;id&gt;')}" class="attribute">&lt;id&gt;</a></li>
            <li ng-repeat="property in item.attrs"><a ng-click="selectCaption(item, &quot;{&quot; + property + &quot;}&quot;)" ng-bind="property" ng-class="{selected: isSelectedCaption(item, '{' + property + '}')}" class="attribute"></a></li>
          </ul>
        </li>
      </ul>
    </script>
    <script id="inspector/relationshipType.html" type="text/ng-template">
      <ul class="list-inline">
        <li class="inspector-icon">
          <div ng-style="{&quot;background-color&quot;: item.style.props.color, &quot;color&quot;: item.style.props[&quot;text-color-internal&quot;]}" class="token token-relationship-type">{{item.type  || '*'}}</div>
        </li>
        <li class="colors">
          <ul class="list-inline">
            <li>Color:</li>
            <li ng-repeat="scheme in colors"><a ng-style="{&quot;background-color&quot;: scheme.color}" ng-class="{active: scheme.color == item.style.props.color &amp;&amp; scheme[&quot;border-color&quot;] == item.style.props[&quot;border-color&quot;]}" ng-click="selectScheme(item, scheme)"></a></li>
          </ul>
        </li>
        <li class="arrow-widths">
          <ul class="list-inline">
            <li>Size:</li>
            <li ng-repeat="arrowWidth in arrowWidths"><a ng-style="arrowDisplayWidth($index)" ng-class="{active: arrowWidth[&quot;shaft-width&quot;] == item.style.props[&quot;shaft-width&quot;]}" ng-click="selectArrowWidth(item, arrowWidth)"></a></li>
          </ul>
        </li>
        <li class="attributes">
          <ul class="list-inline">
            <li>Caption:</li>
            <li><a ng-click="selectCaption(item, &quot;&lt;id&gt;&quot;)" ng-class="{selected: isSelectedCaption(item, '&lt;id&gt;')}" class="attribute">&lt;id&gt;</a></li>
            <li><a ng-click="selectCaption(item, &quot;&lt;type&gt;&quot;)" ng-class="{selected: isSelectedCaption(item, '&lt;type&gt;')}" class="attribute">&lt;type&gt;</a></li>
            <li ng-repeat="property in item.attrs"><a ng-click="selectCaption(item, &quot;{&quot; + property + &quot;}&quot;)" ng-bind="property" ng-class="{selected: isSelectedCaption(item, '{' + property + '}')}" class="attribute"></a></li>
          </ul>
        </li>
      </ul>
    </script>
    <script id="template/carousel/carousel.html" type="text/ng-template">
      <div ng-mouseenter="pause()" ng-mouseleave="play()" no-ng-animate class="carousel">
        <div class="carousel-indicators-wrapper">
          <ol ng-show="slides.length &gt; 1" class="carousel-indicators">
            <li ng-repeat="slide in slides track by $index" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>
          </ol>
        </div>
        <div ng-transclude class="carousel-inner"></div><a ng-click="prev()" ng-show="slides.length &gt; 1 &amp;&amp; !slides[0].active" class="carousel-control left">&lsaquo;</a><a ng-click="next()" ng-show="slides.length &gt; 1 &amp;&amp; !slides[slides.length - 1].active" class="carousel-control right">&rsaquo;</a>
      </div>
    </script>
    <script id="template/carousel/slide.html" type="text/ng-template">
      <div ng-class="{ 'active': leaving || (active &amp;&amp; !entering), 'prev': (next || active) &amp;&amp; direction=='prev', 'next': (next || active) &amp;&amp; direction=='next', 'right': direction=='prev',  'left': direction=='next'  }" ng-transclude class="item"></div>
    </script>
    <!-- banner for going to webadmin, only if needed-->
    <div ng-hide="goodBrowser" class="ng-cloak">
      <div style="position: fixed; bottom: 0; right: 0; border: 0; z-index: 998"><a href="../webadmin"><img src="images/webadmin-banner.png" alt="Switch to Classic UI"></a></div>
      <div style="position: fixed; bottom: 0; right: 0; border: 0; z-index: 999"><a ng-click="hideWebadminBanner = true"><img src="images/dismiss.png" alt="Dismiss"></a></div>
    </div>
    <script src="scripts/8537a860.components.js"></script>
    <script src="scripts/ded362b3.scripts.js"></script>
  </body>
</html>