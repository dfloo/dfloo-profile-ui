import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

@Component({
    imports: [
        MatInputModule
    ],
    templateUrl: './profile-form.component.html',
    styleUrl: './profile-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileFormComponent implements OnInit {

    ngOnInit(): void {
        //
    }

}