/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var PaneContext = (function () {
            function PaneContext(paneRef) {
                this._lastRefreshTime = new Date(0);
                this._parentContext = null;
                this._paneRef = null;
                this._paneRef = paneRef;
                this._binaryCache = {};
            }
            PaneContext.resolveSettingsFromNavRequest = function (initialSettings, navRequest) {
                var result = ObjUtil.addAllProps(initialSettings, {});
                if (navRequest instanceof dialog.FormContext) {
                    ObjUtil.addAllProps(navRequest.dialogRedirection.fromDialogProperties, result);
                    ObjUtil.addAllProps(navRequest.offlineProps, result);
                }
                else if (navRequest instanceof dialog.NullNavRequest) {
                    ObjUtil.addAllProps(navRequest.fromDialogProperties, result);
                }
                var destroyed = result['fromDialogDestroyed'];
                if (destroyed)
                    result['destroyed'] = true;
                return result;
            };
            Object.defineProperty(PaneContext.prototype, "actionSource", {
                get: function () {
                    return this.parentContext ? this.parentContext.actionSource : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "dialogAlias", {
                get: function () {
                    return this.dialogRedirection.dialogProperties['dialogAlias'];
                },
                enumerable: true,
                configurable: true
            });
            PaneContext.prototype.findMenuDefAt = function (actionId) {
                var result = null;
                this.menuDefs.some(function (md) {
                    result = md.findAtId(actionId);
                    return result != null;
                });
                return result;
            };
            PaneContext.prototype.formatForRead = function (propValue, propName) {
                return dialog.PropFormatter.formatForRead(propValue, this.propDefAtName(propName));
            };
            PaneContext.prototype.formatForWrite = function (propValue, propName) {
                return dialog.PropFormatter.formatForWrite(propValue, this.propDefAtName(propName));
            };
            Object.defineProperty(PaneContext.prototype, "formDef", {
                get: function () {
                    return this.parentContext.formDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "isRefreshNeeded", {
                get: function () {
                    return this._lastRefreshTime.getTime() < dialog.AppContext.singleton.lastMaintenanceTime.getTime();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "lastRefreshTime", {
                get: function () {
                    return this._lastRefreshTime;
                },
                set: function (time) {
                    this._lastRefreshTime = time;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "menuDefs", {
                get: function () {
                    return this.paneDef.menuDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "offlineCapable", {
                get: function () {
                    return this._parentContext && this._parentContext.offlineCapable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "paneDef", {
                get: function () {
                    if (this.paneRef == null) {
                        return this.formDef.headerDef;
                    }
                    else {
                        return this.formDef.childrenDefs[this.paneRef];
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "paneRef", {
                get: function () {
                    return this._paneRef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "paneTitle", {
                get: function () {
                    return this.paneDef.findTitle();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "parentContext", {
                get: function () {
                    return this._parentContext;
                },
                set: function (parentContext) {
                    this._parentContext = parentContext;
                },
                enumerable: true,
                configurable: true
            });
            PaneContext.prototype.parseValue = function (formattedValue, propName) {
                return dialog.PropFormatter.parse(formattedValue, this.propDefAtName(propName));
            };
            PaneContext.prototype.propDefAtName = function (propName) {
                return this.entityRecDef.propDefAtName(propName);
            };
            Object.defineProperty(PaneContext.prototype, "sessionContext", {
                get: function () {
                    return this.parentContext.sessionContext;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PaneContext.prototype, "dialogRedirection", {
                /** --------------------- MODULE ------------------------------*/
                //*** let's pretend this has module level visibility
                get: function () {
                    return this.paneDef.dialogRedirection;
                },
                enumerable: true,
                configurable: true
            });
            PaneContext.ANNO_NAME_KEY = "com.catavolt.annoName";
            PaneContext.PROP_NAME_KEY = "com.catavolt.propName";
            return PaneContext;
        })();
        dialog.PaneContext = PaneContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));