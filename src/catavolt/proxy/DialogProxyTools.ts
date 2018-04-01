import {Log} from '../util';
import {FetchClient} from "../ws";

export class DialogProxyTools {

    public static ACTIONS = 'actions';
    public static AVAILABLE_VALUES = 'availableValues';
    public static AVAILABLE_VIEWS = 'availableViews';
    public static DIALOGS = 'dialogs';
    public static RECORD = 'record';
    public static RECORDS = 'records';
    public static REDIRECTIONS = 'redirections';
    public static SELECTED_VIEW = 'selectedView';
    public static SESSIONS = 'sessions';
    public static TENANTS = 'tenants';
    public static VIEW_MODE = 'viewMode';
    public static WORKBENCHES = 'workbenches';

    public static COMMON_FETCH_CLIENT = new FetchClient();

    public static commonFetchClient(): FetchClient {
        return this.COMMON_FETCH_CLIENT;
    }

    public static deleteAllDialogState(tenantId: string, userId: string, dialogId: string) {
        const dialog = this.readDialogState(tenantId, userId, dialogId);
        if (dialog) {
            this.deleteAllDialogStateFor(tenantId, userId, dialog);
        } else {
            this.deleteRedirectionState(tenantId, userId, dialogId);
        }
    }

    public static deleteAllDialogStateFor(tenantId: string, userId: string, dialog: any) {
        const dialogChildren = dialog.children;
        if (dialogChildren) {
            for (const child of dialogChildren) {
                this.deleteAllDialogStateFor(tenantId, userId, child);
            }
        }
        this.deleteRedirectionState(tenantId, userId, dialog.id);
        this.deleteDialogState(tenantId, userId, dialog.id);
        this.deleteRecordSetState(tenantId, userId, dialog.id);
        this.deleteRecordState(tenantId, userId, dialog.id);
        this.deleteDialogParentState(tenantId, userId, dialog.id);
        this.deleteDialogAliasState(tenantId, userId, dialog.id);
        this.deleteDialogReferringAliasState(tenantId, userId, dialog.id);
    }

    public static deleteAllState(tenantId: string, userId: string) {
        const keyCount = localStorage.length;
        for (let i = keyCount - 1; i > -1; --i) {
            const key = localStorage.key(i);
            Log.debug('Removing from localStorage: ' + key);
            localStorage.removeItem(key);
        }
    }

    public static deleteAllWorkbenchNavigation(tenantId: string, userId: string, navigationKey: string) {
        const previousNavigation = DialogProxyTools.readNavigationState(tenantId, userId, navigationKey);
        if (previousNavigation) {
            DialogProxyTools.deleteAllDialogState(tenantId, userId, previousNavigation.redirectionId);
        }
    }

    public static deleteDialogAliasState(tenantId: string, userId: string, dialogId: string) {
        this.deletePersistentState(tenantId, userId, 'dialog.' + dialogId + '.alias');
    }

    public static deleteDialogParentState(tenantId: string, userId: string, childId: string) {
        this.deletePersistentState(tenantId, userId, 'dialog.' + childId + '.parent');
    }

    public static deleteDialogReferringAliasState(tenantId: string, userId: string, dialogId: string) {
        this.deletePersistentState(tenantId, userId, 'dialog.' + dialogId + '.referringAlias');
    }

    public static deleteDialogState(tenantId: string, userId: string, dialogId: string) {
        this.deletePersistentState(tenantId, userId, 'dialog.' + dialogId);
    }

    public static deleteNavigationState(tenantId: string, userId: string, navigationId: string) {
        this.deletePersistentState(tenantId, userId, 'navigation.' + navigationId);
    }

    public static deletePersistentState(tenantId: string, userId: string, stateId: string) {
        const key: string = tenantId + '.' + userId + '.' + stateId;
        window.localStorage.removeItem(key);
    }

    public static deleteRecordSetState(tenantId: string, userId: string, dialogId: string) {
        this.deletePersistentState(tenantId, userId, 'dialog.' + dialogId + '.recordSet');
    }

    public static deleteRecordState(tenantId: string, userId: string, dialogId: string) {
        this.deletePersistentState(tenantId, userId, 'dialog.' + dialogId + '.record');
    }

    public static deleteRedirectionState(tenantId: string, userId: string, redirectionId: string) {
        this.deletePersistentState(tenantId, userId, 'redirection.' + redirectionId);
    }

    public static deleteSessionState(tenantId: string, userId: string) {
        this.deletePersistentState(tenantId, userId, 'session');
    }

    public static findDialogState(tenantId: string, userId: string, dialogId: string): any {
        const dialog = this.findRootDialogState(tenantId, userId, dialogId);
        if (!dialog) {
            return null;
        }
        return this.findDialogStateWithin(tenantId, userId, dialog, dialogId);
    }

    public static findDialogStateWithin(tenantId: string, userId: string, dialog: any, targetId: string): any {
        if (dialog && dialog.id === targetId) {
            return dialog;
        }
        const dialogChildren = dialog.children;
        if (dialogChildren) {
            for (const child of dialogChildren) {
                const nestedDialog = this.findDialogStateWithin(tenantId, userId, child, targetId);
                if (nestedDialog) {
                    return nestedDialog;
                }
            }
        }
        return null;
    }

    public static findRecordProperty(record: any, propertyName: string): any {
        for (const p of record.properties) {
            if (p.name === propertyName) {
                return p;
            }
        }
        return null;
    }

    public static findRootDialogState(tenantId: string, userId: string, dialogId: string): any {
        const dialog = this.readDialogState(tenantId, userId, dialogId);
        if (dialog) {
            return dialog;
        }
        const parentId = this.readDialogParentState(tenantId, userId, dialogId);
        if (parentId) {
            return this.findRootDialogState(tenantId, userId, parentId);
        }
        return null;
    }

    public static isDeleteSession(path: string[]): boolean {
        return path.length == 4 && path[0] == DialogProxyTools.TENANTS && path[2] == DialogProxyTools.SESSIONS;
    }

    public static isGetAvailableViews(path: string[]): boolean {
        return (
            path.length == 7 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.DIALOGS &&
            path[6] == DialogProxyTools.AVAILABLE_VIEWS
        );
    }

    public static isGetDialog(path: string[]): boolean {
        return (
            path.length == 6 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.DIALOGS
        );
    }

    public static isGetRecord(path: string[]): boolean {
        return (
            path.length == 7 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.DIALOGS &&
            path[6] == DialogProxyTools.RECORD
        );
    }

    public static isGetRedirection(path: string[]): boolean {
        return (
            path.length == 6 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.REDIRECTIONS
        );
    }

    public static isGetSelectedView(path: string[]): boolean {
        return (
            path.length == 7 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.DIALOGS &&
            path[6] == DialogProxyTools.SELECTED_VIEW
        );
    }

    public static isGetSession(path: string[]): boolean {
        return path.length == 4 && path[0] == DialogProxyTools.TENANTS && path[2] == DialogProxyTools.SESSIONS;
    }

    public static isGetTenant(path: string[]): boolean {
        return path.length == 2 && path[0] == DialogProxyTools.TENANTS;
    }

    public static isGetTenants(path: string[]): boolean {
        return path.length == 1 && path[0] == DialogProxyTools.TENANTS;
    }

    public static isGetViewMode(path: string[]): boolean {
        return (
            path.length == 7 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.DIALOGS &&
            path[6] == DialogProxyTools.VIEW_MODE
        );
    }

    public static isGetWorkbenches(path: string[]): boolean {
        return (
            path.length == 5 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.WORKBENCHES
        );
    }

    public static isPostAvailableValues(path: string[]): boolean {
        return (
            path.length == 9 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.DIALOGS &&
            path[6] == DialogProxyTools.RECORD &&
            path[8] == DialogProxyTools.AVAILABLE_VALUES
        );
    }

    public static isPostMenuAction(path: string[]): boolean {
        return (
            path.length == 8 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.DIALOGS &&
            path[6] == DialogProxyTools.ACTIONS
        );
    }

    public static isPostRecords(path: string[]): boolean {
        return (
            path.length == 7 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.DIALOGS &&
            path[6] == DialogProxyTools.RECORDS
        );
    }

    public static isPostSession(path: string[]): boolean {
        return path.length == 3 && path[0] == DialogProxyTools.TENANTS && path[2] == DialogProxyTools.SESSIONS;
    }

    public static isPostWorkbenchAction(path: string[]): boolean {
        return (
            path.length == 8 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.WORKBENCHES &&
            path[6] == DialogProxyTools.ACTIONS
        );
    }

    public static isPutRecord(path: string[]): boolean {
        return (
            path.length == 7 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.DIALOGS &&
            path[6] == DialogProxyTools.RECORD
        );
    }

    public static isPutSelectedView(path: string[]): boolean {
        return (
            path.length == 8 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.DIALOGS &&
            path[6] == DialogProxyTools.SELECTED_VIEW
        );
    }

    public static isPutViewMode(path: string[]): boolean {
        return (
            path.length == 8 &&
            path[0] == DialogProxyTools.TENANTS &&
            path[2] == DialogProxyTools.SESSIONS &&
            path[4] == DialogProxyTools.DIALOGS &&
            path[6] == DialogProxyTools.VIEW_MODE
        );
    }

    public static readDialogAliasState(tenantId: string, userId: string, dialogId: string) {
        return this.readPersistentState(tenantId, userId, 'dialog.' + dialogId + '.alias');
    }

    public static readDialogParentState(tenantId: string, userId: string, childId: string): any {
        return this.readPersistentState(tenantId, userId, 'dialog.' + childId + '.parent');
    }

    public static readDialogReferringAliasState(tenantId: string, userId: string, dialogId: string) {
        return this.readPersistentState(tenantId, userId, 'dialog.' + dialogId + '.referringAlias');
    }

    public static readDialogState(tenantId: string, userId: string, dialogId: string): any {
        return this.readPersistentState(tenantId, userId, 'dialog.' + dialogId);
    }

    public static readNavigationState(tenantId: string, userId: string, navigationId: string): any {
        return this.readPersistentState(tenantId, userId, 'navigation.' + navigationId);
    }

    public static readPersistentState(tenantId: string, userId: string, stateId: string): any {
        const key: string = tenantId + '.' + userId + '.' + stateId;
        const json: string = window.localStorage.getItem(key);
        return json ? JSON.parse(json) : null;
    }

    public static readRecordSetState(tenantId: string, userId: string, dialogId: string): any {
        return this.readPersistentState(tenantId, userId, 'dialog.' + dialogId + '.recordSet');
    }

    public static readRecordState(tenantId: string, userId: string, dialogId: string): any {
        return this.readPersistentState(tenantId, userId, 'dialog.' + dialogId + '.record');
    }

    public static readRedirectionState(tenantId: string, userId: string, redirectionId: string): any {
        return this.readPersistentState(tenantId, userId, 'redirection.' + redirectionId);
    }

    public static readSessionState(tenantId: string, userId: string): any {
        return this.readPersistentState(tenantId, userId, 'session');
    }

    public static updateRecordPropertyValue(record: any, propertyName: string, value: any): boolean {
        for (const p of record.properties) {
            if (p.name === propertyName) {
                p.value = value;
                return true;
            }
        }
        return false;
    }

    public static writeAllDialogParentState(tenantId: string, userId: string, parent: any) {
        const dialogChildren = parent.children;
        if (dialogChildren) {
            for (let i = 0; i < dialogChildren.length; i++) {
                const child = dialogChildren[i];
                this.writeDialogParentState(tenantId, userId, child, i, parent);
            }
        }
    }

    public static writeDialogAliasState(tenantId: string, userId: string, dialogId: string, alias: any) {
        this.writePersistentState(tenantId, userId, 'dialog.' + dialogId + '.alias', alias);
    }

    public static writeDialogParentState(tenantId: string,
                                         userId: string,
                                         child: any,
                                         childIndex: number,
                                         parent: any) {
        this.writePersistentState(tenantId, userId, 'dialog.' + child.id + '.parent', parent.id);
        const parentAlias = this.readDialogAliasState(tenantId, userId, parent.id);
        this.writeDialogAliasState(tenantId, userId, child.id, parentAlias + '_' + childIndex);
        this.writeAllDialogParentState(tenantId, userId, child);
    }

    public static writeDialogReferringAliasState(tenantId: string,
                                                 userId: string,
                                                 dialogId: string,
                                                 referringAlias: any) {
        this.writePersistentState(tenantId, userId, 'dialog.' + dialogId + '.referringAlias', referringAlias);
    }

    public static writeDialogState(tenantId: string, userId: string, dialog: any) {
        this.writePersistentState(tenantId, userId, 'dialog.' + dialog.id, dialog);
    }

    public static writePersistentState(tenantId: string, userId: string, stateId: string, state: any) {
        const key: string = tenantId + '.' + userId + '.' + stateId;
        window.localStorage.setItem(key, JSON.stringify(state));
    }

    public static writeRecordSetState(tenantId: string, userId: string, dialogId: string, recordSet: any): any {
        this.writePersistentState(tenantId, userId, 'dialog.' + dialogId + '.recordSet', recordSet);
    }

    public static writeRecordState(tenantId: string, userId: string, dialogId: string, record: any): any {
        this.writePersistentState(tenantId, userId, 'dialog.' + dialogId + '.record', record);
    }

    public static writeNavigationState(tenantId: string, userId: string, navigation: any) {
        this.writePersistentState(tenantId, userId, 'navigation.' + navigation.id, navigation);
    }

    public static writeRedirectionState(tenantId: string, userId: string, redirection: any) {
        this.writePersistentState(tenantId, userId, 'redirection.' + redirection.id, redirection);
    }

    public static writeSessionState(session: any) {
        this.writePersistentState(session.tenantId, session.userId, 'session', session);
    }
}
