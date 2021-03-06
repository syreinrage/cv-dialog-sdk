import {RecordVisitor} from "../proxy/RecordVisitor";
import {WorkPackageVisitor} from "./WorkPackageVisitor";

/**
 *
 */
export class SelectedWorkPackageVisitor extends RecordVisitor {

    private static CREATION_DATE_PROPERTY_NAME = "Creation_Date";
    private static DESCRIPTION_PROPERTY_NAME = "Description";
    private static DISCIPLINES_PROPERTY_NAME = "Disciplines";
    private static ID_PROPERTY_NAME = "Id";
    private static LAST_UPDATE_DATE_PROPERTY_NAME = "Last_Update_Date";
    private static NAME_PROPERTY_NAME = "Name";

    constructor(value: string | object) {
        super(value);
    }

    // --- State Management Helpers --- //

    public static createFromWorkPackageVisitor(workPackageVisitor: WorkPackageVisitor): SelectedWorkPackageVisitor {
        const selectedWorkPackageState = new SelectedWorkPackageVisitor({
            id: workPackageVisitor.visitId(),
            properties: [],
            annotations: [],
            type: "hxgn.api.dialog.Record"
        });
        selectedWorkPackageState.setCreationDate(workPackageVisitor.visitCreationDate());
        selectedWorkPackageState.setDescription(workPackageVisitor.visitDescription());
        selectedWorkPackageState.setDisciplines(workPackageVisitor.visitDisciplines());
        selectedWorkPackageState.setId(workPackageVisitor.visitId());
        selectedWorkPackageState.setLastUpdateDate(workPackageVisitor.visitLastUpdateDate());
        selectedWorkPackageState.setName(workPackageVisitor.visitName());
        return selectedWorkPackageState;
    }

    // --- State Management --- //

    public creationDate(): string {
        return this.visitPropertyValueAt(SelectedWorkPackageVisitor.CREATION_DATE_PROPERTY_NAME);
    }

    public setCreationDate(value: string) {
        this.visitAndSetPropertyValueAt(SelectedWorkPackageVisitor.CREATION_DATE_PROPERTY_NAME, value);
    }

    public description(): string {
        return this.visitPropertyValueAt(SelectedWorkPackageVisitor.DESCRIPTION_PROPERTY_NAME);
    }

    public setDescription(value: string) {
        this.visitAndSetPropertyValueAt(SelectedWorkPackageVisitor.DESCRIPTION_PROPERTY_NAME, value);
    }

    public disciplines(): string {
        return this.visitPropertyValueAt(SelectedWorkPackageVisitor.DISCIPLINES_PROPERTY_NAME);
    }

    public setDisciplines(value: string) {
        this.visitAndSetPropertyValueAt(SelectedWorkPackageVisitor.DISCIPLINES_PROPERTY_NAME, value);
    }

    public id(): string {
        return this.visitPropertyValueAt(SelectedWorkPackageVisitor.ID_PROPERTY_NAME);
    }

    public setId(value: string) {
        this.visitAndSetPropertyValueAt(SelectedWorkPackageVisitor.ID_PROPERTY_NAME, value);
    }

    public lastUpdateDate(): string {
        return this.visitPropertyValueAt(SelectedWorkPackageVisitor.LAST_UPDATE_DATE_PROPERTY_NAME);
    }

    public setLastUpdateDate(value: string) {
        this.visitAndSetPropertyValueAt(SelectedWorkPackageVisitor.LAST_UPDATE_DATE_PROPERTY_NAME, value);
    }

    public name(): string {
        return this.visitPropertyValueAt(SelectedWorkPackageVisitor.NAME_PROPERTY_NAME);
    }

    public setName(value: string) {
        this.visitAndSetPropertyValueAt(SelectedWorkPackageVisitor.NAME_PROPERTY_NAME, value);
    }

}
