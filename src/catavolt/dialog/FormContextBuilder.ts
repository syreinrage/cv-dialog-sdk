/**
 * Created by rburson on 3/30/15.
 */

import {DialogRedirection} from "./DialogRedirection";
import {ActionSource} from "./ActionSource";
import {SessionContext} from "../ws/SessionContext";
import {Future} from "../fp/Future";
import {FormContext} from "./FormContext";
import {DialogService} from "./DialogService";
import {Try} from "../fp/Try";
import {XOpenEditorModelResult} from "./XOpenEditorModelResult";
import {XFormDef} from "./XFormDef";
import {Failure} from "../fp/Failure";
import {FormDef} from "./FormDef";
import {Success} from "../fp/Success";
import {ObjUtil} from "../util/ObjUtil";
import {MenuDef} from "./MenuDef";
import {XOpenDialogModelResult} from "./XOpenDialogModelResult";
import {XFormModelComp} from "./XFormModelComp";
import {XGetActiveColumnDefsResult} from "./XGetActiveColumnDefsResult";
import {GeoLocationContext} from "./GeoLocationContext";
import {GeoLocationDef} from "./GeoLocationDef";
import {GeoFixContext} from "./GeoFixContext";
import {GeoFixDef} from "./GeoFixDef";
import {BarcodeScanContext} from "./BarcodeScanContext";
import {BarcodeScanDef} from "./BarcodeScanDef";
import {ImagePickerContext} from "./ImagePickerContext";
import {XPaneDef} from "./XPaneDef";
import {PaneContext} from "./PaneContext";
import {PaneDef} from "./PaneDef";
import {ListDef} from "./ListDef";
import {ListContext} from "./ListContext";
import {DetailsDef} from "./DetailsDef";
import {DetailsContext} from "./DetailsContext";
import {MapDef} from "./MapDef";
import {MapContext} from "./MapContext";
import {GraphDef} from "./GraphDef";
import {GraphContext} from "./GraphContext";
import {CalendarDef} from "./CalendarDef";
import {CalendarContext} from "./CalendarContext";
import {ImagePickerDef} from "./ImagePickerDef";
import {DialogHandle} from "./DialogHandle";
import {XPaneDefRef} from "./XPaneDefRef";

export class FormContextBuilder {

    constructor(private _dialogRedirection:DialogRedirection,
                private _actionSource:ActionSource,
                private _sessionContext:SessionContext) {
    }

    get actionSource():ActionSource {
        return this._actionSource;
    }

    build():Future<FormContext> {
        if (!this.dialogRedirection.isEditor) {
            return Future.createFailedFuture<FormContext>('FormContextBuilder::build', 'Forms with a root query model are not supported');
        }
        var xOpenFr = DialogService.openEditorModelFromRedir(this._dialogRedirection, this.sessionContext);

        var openAllFr:Future<Array<Try<any>>> = xOpenFr.bind((formXOpen:XOpenEditorModelResult)=> {

            var formXOpenFr = Future.createSuccessfulFuture('FormContext/open/openForm', formXOpen);
            var formXFormDefFr = this.fetchXFormDef(formXOpen);
            var formMenuDefsFr = DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle, this.sessionContext);
            var formChildrenFr = formXFormDefFr.bind((xFormDef:XFormDef)=> {
                var childrenXOpenFr = this.openChildren(formXOpen);
                var childrenXPaneDefsFr = this.fetchChildrenXPaneDefs(formXOpen, xFormDef);
                var childrenActiveColDefsFr = this.fetchChildrenActiveColDefs(formXOpen);
                var childrenMenuDefsFr = this.fetchChildrenMenuDefs(formXOpen);
                return Future.sequence([childrenXOpenFr, childrenXPaneDefsFr, childrenActiveColDefsFr, childrenMenuDefsFr]);
            });
            return Future.sequence<any>([formXOpenFr, formXFormDefFr, formMenuDefsFr, formChildrenFr]);
        });

        return openAllFr.bind((value:Array<Try<any>>)=> {
            var formDefTry = this.completeOpenPromise(value);

            var formContextTry:Try<FormContext> = null;
            if (formDefTry.isFailure) {
                formContextTry = new Failure<FormContext>(formDefTry.failure);
            } else {
                var formDef:FormDef = formDefTry.success;
                var childContexts = this.createChildrenContexts(formDef);
                var formContext = new FormContext(this.dialogRedirection,
                    this._actionSource, formDef, childContexts, false, false, this.sessionContext);
                formContextTry = new Success(formContext);
            }
            return Future.createCompletedFuture('FormContextBuilder::build', formContextTry);
        });

    }

    get dialogRedirection():DialogRedirection {
        return this._dialogRedirection;
    }

    get sessionContext():SessionContext {
        return this._sessionContext;
    }

    private completeOpenPromise(openAllResults:Array<Try<any>>):Try<FormDef> {

        var flattenedTry:Try<Array<any>> = Try.flatten(openAllResults);
        if (flattenedTry.isFailure) {
            return new Failure<FormDef>('FormContextBuilder::build: ' + ObjUtil.formatRecAttr(flattenedTry.failure));
        }
        var flattened = flattenedTry.success;

        if (flattened.length != 4) return new Failure<FormDef>('FormContextBuilder::build: Open form should have resulted in 4 elements');

        var formXOpen:XOpenEditorModelResult = flattened[0];
        var formXFormDef:XFormDef = flattened[1];
        var formMenuDefs:Array<MenuDef> = flattened[2];
        var formChildren:Array<any> = flattened[3];

        if (formChildren.length != 4) return new Failure<FormDef>('FormContextBuilder::build: Open form should have resulted in 3 elements for children panes');

        var childrenXOpens:Array<XOpenDialogModelResult> = formChildren[0];
        var childrenXPaneDefs:Array<XPaneDef> = formChildren[1];
        var childrenXActiveColDefs:Array<XGetActiveColumnDefsResult> = formChildren[2];
        var childrenMenuDefs:Array<Array<MenuDef>> = formChildren[3];

        return FormDef.fromOpenFormResult(formXOpen, formXFormDef, formMenuDefs, childrenXOpens,
            childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs);

    }

    private createChildrenContexts(formDef:FormDef):Array<PaneContext> {
        var result:Array<PaneContext> = [];
        formDef.childrenDefs.forEach((paneDef:PaneDef, i)=> {
            if (paneDef instanceof ListDef) {
                result.push(new ListContext(i));
            } else if (paneDef instanceof DetailsDef) {
                result.push(new DetailsContext(i));
            } else if (paneDef instanceof MapDef) {
                result.push(new MapContext(i));
            } else if (paneDef instanceof GraphDef) {
                result.push(new GraphContext(i));
            } else if (paneDef instanceof CalendarDef) {
                result.push(new CalendarContext(i));
            } else if (paneDef instanceof ImagePickerDef) {
                result.push(new ImagePickerContext(i));
            } else if (paneDef instanceof BarcodeScanDef) {
                result.push(new BarcodeScanContext(i));
            } else if (paneDef instanceof GeoFixDef) {
                result.push(new GeoFixContext(i));
            } else if (paneDef instanceof GeoLocationDef) {
                result.push(new GeoLocationContext(i));
            }
        });
        return result;
    }

    private fetchChildrenActiveColDefs(formXOpen:XOpenEditorModelResult):Future<Array<Try<XGetActiveColumnDefsResult>>> {
        var xComps = formXOpen.formModel.children;
        var seqOfFutures:Array<Future<XGetActiveColumnDefsResult>> = xComps.map((xComp:XFormModelComp)=> {
            if (xComp.redirection.isQuery) {
                return DialogService.getActiveColumnDefs(xComp.redirection.dialogHandle, this.sessionContext);
            } else {
                return Future.createSuccessfulFuture('FormContextBuilder::fetchChildrenActiveColDefs', null);
            }
        });
        return Future.sequence(seqOfFutures);
    }

    private fetchChildrenMenuDefs(formXOpen:XOpenEditorModelResult):Future<Array<Try<Array<MenuDef>>>> {
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = xComps.map((xComp:XFormModelComp)=> {
            if (xComp.redirection.isEditor) {
                return DialogService.getEditorModelMenuDefs(xComp.redirection.dialogHandle, this.sessionContext);
            } else {
                return DialogService.getQueryModelMenuDefs(xComp.redirection.dialogHandle, this.sessionContext);
            }
        });
        return Future.sequence(seqOfFutures);
    }

    private fetchChildrenXPaneDefs(formXOpen:XOpenEditorModelResult, xFormDef:XFormDef):Future<Array<Try<XPaneDef>>> {

        var formHandle:DialogHandle = formXOpen.formModel.form.redirection.dialogHandle;
        var xRefs = xFormDef.paneDefRefs;
        var seqOfFutures:Array<Future<XPaneDef>> = xRefs.map((xRef:XPaneDefRef)=> {
            return DialogService.getEditorModelPaneDef(formHandle, xRef.paneId, this.sessionContext);
        });
        return Future.sequence(seqOfFutures);
    }

    private fetchXFormDef(xformOpenResult:XOpenEditorModelResult):Future<XFormDef> {
        var dialogHandle = xformOpenResult.formRedirection.dialogHandle;
        var formPaneId = xformOpenResult.formPaneId;
        return DialogService.getEditorModelPaneDef(dialogHandle, formPaneId,
            this.sessionContext).bind((value:XPaneDef)=> {
            if (value instanceof XFormDef) {
                return Future.createSuccessfulFuture('fetchXFormDef/success', value);
            } else {
                return Future.createFailedFuture<XFormDef>('fetchXFormDef/failure',
                    'Expected reponse to contain an XFormDef but got ' + ObjUtil.formatRecAttr(value));
            }
        });

    }

    private openChildren(formXOpen:XOpenEditorModelResult):Future<Array<Try<XOpenDialogModelResult>>> {
        var xComps = formXOpen.formModel.children;
        var seqOfFutures:Array<Future<XOpenDialogModelResult>> = [];
        xComps.forEach((nextXComp:XFormModelComp)=> {
            var nextFr = null;
            if (nextXComp.redirection.isEditor) {
                nextFr = DialogService.openEditorModelFromRedir(nextXComp.redirection, this.sessionContext);
            } else {
                nextFr = DialogService.openQueryModelFromRedir(nextXComp.redirection, this.sessionContext);
            }
            seqOfFutures.push(nextFr);
        });
        return Future.sequence<XOpenDialogModelResult>(seqOfFutures);
    }

}
