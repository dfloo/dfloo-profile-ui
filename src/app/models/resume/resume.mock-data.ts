import { ResumeDTO } from '@models/resume';

export const getMockResumeDTO = (): ResumeDTO => ({
    "resumeId": "resumeId",
    "profile": {
        "profileId": "profileId",
        "phoneNumber": "",
        "email": "devin.p.flood@gmail.com",
        "firstName": "Devin",
        "middleName": "P.",
        "lastName": "Flood",
        "address1": "",
        "address2": "",
        "city": "Bay Area",
        "state": "US-CA",
        "zipCode": "",
        "country": "",
        "socialAccounts": [
            {
                "href": "https://github.com/dfloo",
                "label": "github"
            },
            {
                "href": "https://www.linkedin.com/in/dfloo/",
                "label": "linkedin"
            }
        ],
        "created": "0001-01-01T00:00:00Z",
        "updated": "2025-10-23T19:00:08.775604Z"
    },
    "sections": [
        "Summary",
        "Skills",
        "Experience",
        "Education"
    ],
    "description": "Default Resume",
    "summary": "Senior Software Engineer with 6+ years of experience in developing enterprise-grade solutions within the wealth management sector. Adept in identifying gaps in requirements and technical constraints that could impact feature delivery. Strong intuition for UI/UX design.",
    "skills": [
        "Angular, AngularJS, React",
        "Java, Ruby, Go",
        "Javascript, Typescript",
        "HTML, CSS, SCSS, Tailwind",
        "PostgreSQL, Oracle, Cassandra, MongoDB",
        "Jasmine, Spectator, CodeceptJS, Cypress",
        "Linux, Mac, Windows",
        "Jira, Jenkins, Gitlab CI/CD"
    ],
    "experience": [
        {
            "employer": "MyVest",
            "location": "San Francisco, CA",
            "title": "Senior Software Engineer",
            "startDate": "01/2019",
            "endDate": "07/2025",
            "description": "",
            "bulletPoints": [
                "Led full-stack feature development using agile practices",
                "Delivered sophisticated features on time with minimal defects",
                "Provided engineering estimates and documented technical requirements",
                "Facilitated cross-team collaboration and knowledge sharing",
                "Optimized automated testing suites ensuring code stability",
                "Assisted QA and Operations teams with testing in staging and production environments"
            ]
        },
        {
            "employer": "Absorption Processing Solutions",
            "location": "Bartlesville, OK",
            "title": "Process Engineer",
            "startDate": "01/2013",
            "endDate": "08/2018",
            "description": "(Formerly AET Inc / AET Partners LLC)",
            "bulletPoints": [
                "Responsible for supporting the patented AET Process®  technology portfolio",
                "Developed process design packages including: detailed simulations, heat/material balances, sized equipment lists, flow diagrams, operation/control write-ups, etc.",
                "Installation and maintenance of email/web server, and document management system"
            ]
        },
        {
            "employer": "Lanxess",
            "location": "Orange, TX",
            "title": "Technical Analyst",
            "startDate": "10/2011",
            "endDate": "12/2012",
            "description": "",
            "bulletPoints": [
                "Provided data analysis support to the head of global manufacturing for the PBR business unit",
                "Coordinated with Site and CapEx managers across facilities in Brazil, France, Germany and US",
                "Maintained custom spreadsheets for tracking budgets, costs, production rates, quality/safety KPIs",
                "Developed automated reporting views using SAP Crystal Repost and Business Warehouse"
            ]
        },
        {
            "employer": "Medtronic",
            "location": "Northridge, CA",
            "title": "R\u0026D Intern",
            "startDate": "06/2011",
            "endDate": "09/2011",
            "description": "",
            "bulletPoints": [
                "Worked on various research projects in the development of electrochemical glucose sensors",
                "Operated laboratory scale equipment in a clean room environment including: low pressure/plasma enhanced CVD, various thin film measurement techniques, absorption spectroscopy, centrifuges"
            ]
        }
    ],
    "education": [
        {
            "name": "Villanova University",
            "location": "Villanova, PA",
            "type": "B.S. Chemical Engineering",
            "completionDate": "05/2010"
        },
        {
            "name": "App Academy",
            "location": "San Francisco, CA",
            "type": "Software Engineering Program",
            "completionDate": "11/2018"
        }
    ],
    "fileName": "Devin_Flood_Resume",
    "templateSettings": {
        "templateName": "default",
        "fontFamily": "default"
    },
    "created": "0001-01-01T00:00:00Z",
    "updated": "2025-10-23T19:00:08.775604Z"
} as ResumeDTO);
