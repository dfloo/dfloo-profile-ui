import { Profile } from '@models/profile';
import { ResumeDTO } from '@models/resume';

export const getMockResumeDTO = (resumeId?: string): ResumeDTO => ({
    resumeId,
    fileName: `Mock_Resume_${resumeId}`,
    templateSettings: {
        templateName: 'default',
        fontFamily: 'default'
    },
    profile: Profile.getMockDTO('1'),
    description: 'Angular Focused',
    summary: 'Senior Software Engineer with 6+ years of experience in developing enterprise-grade solutions within the wealth management sector.',
    skills: [
        'Angular, React',
        'Java, Ruby, Go',
        'Jenkins, CI/CD',
        'Code Review',
        'UI/UX Design',
        'Product/Technical Requirements'
    ],
    experience: [
        {
            employer: 'MyVest',
            location: 'San Francisco, CA',
            startDate: '01/2019',
            endDate: '07/2025',
            title: 'Senior Software Engineer',
            description: 'Fintech company delivering portfolio management at scale',
            bulletPoints: ['First', 'Second', 'Third']
        }
    ],
    education: [
        {
            name: 'Villanova University',
            location: 'Villanova, PA',
            type: 'B.S. Chemical Engineering',
            completionDate: '05/2010'
        },
        {
            name: 'App Academy',
            location: 'San Francisco, CA',
            type: 'Software Engineering Program',
            completionDate: '11/2018'
        }
    ]
});
