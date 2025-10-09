import { SelectionModel } from '@angular/cdk/collections';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    input,
    output,
    ViewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MatCheckboxChange,
    MatCheckboxModule
} from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    MatPaginator,
    MatPaginatorModule,
    PageEvent
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { cloneDeep } from 'lodash';

import { Resume } from '@models/resume';
import { MessageDialogComponent, MessageDialogResult } from '@components/message-dialog';

@Component({
    selector: 'resumes-table',
    templateUrl: './resumes-table.component.html',
    styleUrl: './resumes-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatSortModule
    ]
})
export class ResumesTableComponent implements AfterViewInit {
    private dialog = inject(MatDialog);
    @ViewChild(MatPaginator) private paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) private sort!: MatSort;

    resumes = input<Resume[]>([]);
    newResume = output();
    editResume = output<Resume>();
    viewResume = output<Resume>();
    copyResume = output<Resume>();
    downloadResume = output<Resume>();
    deleteResumes = output<string[]>();
    columns = ['select', 'fileName',  'description', 'created', 'updated'];
    dataSource = new MatTableDataSource<Resume>([]);
    selectionModel = new SelectionModel<Resume>(true, []);
    visibleRows: Resume[] = [];
    pageIndex = 0;
    pageSize = 10;
    pageSizeOptions = [10, 15, 20];

    get selectedResumes(): Resume[] {
        return this.selectionModel.selected;
    }

    get selectedResume(): Resume {
        return this.selectionModel.selected[0];
    }

    get allSelected(): boolean {
        return (
            this.selectionModel.hasValue() &&
            this.selectionModel.selected.length === this.visibleRows.length
        );
    }

    get selectAllIndeterminate(): boolean {
        return this.selectionModel.hasValue() && !this.allSelected;
    }

    get singleSelection(): boolean {
        return this.selectionModel.selected.length === 1;
    }

    constructor() {
        effect(() => {
            const resumes = this.resumes();
            if (resumes.length > 20) {
                this.pageSizeOptions.push(resumes.length);
            }
            this.dataSource.data = resumes;
            this.setVisibleRows(this.pageIndex, this.pageSize);
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.active = 'created';
        this.sort.direction = 'asc';
        this.sort.sortChange.emit();
        this.paginator.page.subscribe(({ pageIndex, pageSize }: PageEvent) => {
            this.setVisibleRows(pageIndex, pageSize);
            this.selectionModel.clear();
        });
    }

    onSelectAll({ checked }: MatCheckboxChange): void {
        if (checked) {
            this.selectionModel.setSelection(...this.visibleRows);
        } else {
            this.selectionModel.clear();
        }
    }

    onSelectResume(resume: Resume): void {
        if (this.selectionModel.isSelected(resume)) {
            this.selectionModel.deselect(resume);
        } else {
            this.selectionModel.select(resume);
        }
    }

    onEditResume(resume: Resume): void {
        this.editResume.emit(cloneDeep(resume));
    }

    onCopyResume(resume: Resume): void {
        this.copyResume.emit(resume);
        this.selectionModel.clear();
    }

    onDeleteResumes(resumes: Resume[]): void {
        const config = {
            data: {
                message: 'Are you sure you want to delete the selected resumes?',
                confirmLabel: 'Yes',
                cancelLabel: 'No'
            }
        }
        this.dialog.open(MessageDialogComponent, config)
            .afterClosed()
            .subscribe(result => {
                if (result === MessageDialogResult.Confirm) {
                    this.deleteResumes.emit(this.getIDs(resumes));
                    this.selectionModel.clear();
                }
            });
    }

    private setVisibleRows(pageIndex: number, pageSize: number): void {
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        this.visibleRows = this.dataSource.filteredData.slice(start, end);
    }

    private getIDs(resumes: Resume[]): string[] {
        return resumes.reduce((IDs: string[], resume: Resume) => {
            if (resume.id) {
                IDs.push(resume.id)
            }

            return IDs;
        }, []);
    }
}