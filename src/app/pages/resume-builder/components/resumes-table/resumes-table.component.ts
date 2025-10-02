import { SelectionModel } from '@angular/cdk/collections';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    input,
    output,
    ViewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MatCheckboxChange,
    MatCheckboxModule
} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    MatPaginator,
    MatPaginatorModule,
    PageEvent
} from '@angular/material/paginator';

import { Resume } from '@models/resume';

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
        MatTooltipModule
    ]
})
export class ResumesTableComponent implements AfterViewInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    resumes = input<Resume[]>([]);
    newResume = output();
    editResume = output<Resume>();
    viewResume = output<Resume>();
    copyResume = output<Resume>();
    downloadResume = output<string>();
    deleteResumes = output<string[]>();
    columns = ['select', 'fileName',  'description', 'updated'];
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
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.setVisibleRows(this.pageIndex, this.pageSize);
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

    onDeleteResumes(resumes: Resume[]): void {
        this.deleteResumes.emit(this.getIDs(resumes));
        this.selectionModel.clear();
    }

    onDownloadResume({ id }: Resume): void {
        if (id) {
            this.downloadResume.emit(id);
        }
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