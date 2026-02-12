import {
    ChangeDetectionStrategy,
    Component,
    inject,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { MatButton } from '@angular/material/button';

import { ResumeService } from '@api/resume';

interface WelcomeCard {
    text: string;
    background: string;
}

@Component({
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButton, NgStyle],
})
export class WelcomeComponent {
    private resumeService = inject(ResumeService);

    welcomeCards: WelcomeCard[] = welcomeCards;

    getBackground({ background }: WelcomeCard): Record<string, string> {
        return { 'background-image': `url('/assets/${background}')` };
    }

    viewResume(): void {
        this.resumeService
            .downloadDefaultResume()
            .subscribe((pdf) => window.open(URL.createObjectURL(pdf)));
    }

    viewSocial(account: 'github' | 'linkedin'): void {
        if (account === 'github') {
            window.open('https://github.com/dfloo');
        } else {
            window.open('https://www.linkedin.com/in/dfloo');
        }
    }
}

const welcomeCards: WelcomeCard[] = [
    {
        text: "Hi, I'm Devin, and I'm an engineer.",
        background: 'bocce.png',
    },
    {
        text: 'I started my career as a chemical engineer in the oil & gas industry.',
        background: 'refinery.jpg',
    },
    {
        text: 'During this time I gained an affinity for using code to automate/improve my day to day workflows.',
        background: 'spreadsheet.jpg',
    },
    {
        text: 'So I decided to embark on a career shift and focus fully on software development.',
        background: 'golden-gate.jpg',
    },
    {
        text: "Since then I've learned to develop, deploy and maintain modern web apps using numerous frameworks and technologies.",
        background: 'laptop.jpg',
    },
    {
        text: 'I pride myself on delivering above and beyond expectations and doing so with a smile.',
        background: 'hackathon.png',
    },
    {
        text: "I'm currently looking for my next role.</br>Let's schedule some time to talk.",
        background: 'office.jpg',
    },
];
