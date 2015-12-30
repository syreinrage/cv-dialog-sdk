/**
 * Created by rburson on 5/4/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QueryContext_1 = require("./QueryContext");
var MapContext = (function (_super) {
    __extends(MapContext, _super);
    function MapContext(paneRef) {
        _super.call(this, paneRef);
    }
    Object.defineProperty(MapContext.prototype, "mapDef", {
        get: function () {
            return this.paneDef;
        },
        enumerable: true,
        configurable: true
    });
    return MapContext;
})(QueryContext_1.QueryContext);
exports.MapContext = MapContext;
