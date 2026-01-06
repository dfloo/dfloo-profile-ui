import { BaseModel } from '../base.model';

export class Profile extends BaseModel {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phoneNumber?: string;
    email?: string;
    socialAccounts?: SocialAccount[];

    constructor(props: Partial<Profile>) {
        super(props);
        Object.assign(this, {
            ...props,
            created: this.created,
            updated: this.updated,
        });
    }

    static normalize(record: ProfileDTO): Profile {
        return new Profile({
            id: record.profileId,
            firstName: record.firstName,
            middleName: record.middleName,
            lastName: record.lastName,
            phoneNumber: record.phoneNumber,
            email: record.email,
            socialAccounts: record.socialAccounts,
            address1: record.address1,
            address2: record.address2,
            city: record.city,
            state: record.state,
            country: record.country,
            zipCode: record.zipCode,
            created: record.created,
            updated: record.updated,
        });
    }

    static serialize(profile: Profile): ProfileDTO {
        const socialAccounts = profile.socialAccounts
            ? profile.socialAccounts.filter(
                  (a) => a?.href !== '' && a?.label !== '',
              )
            : undefined;
        return {
            profileId: profile.id,
            firstName: profile.firstName,
            middleName: profile.middleName,
            lastName: profile.lastName,
            phoneNumber: profile.phoneNumber,
            email: profile.email,
            socialAccounts,
            address1: profile.address1,
            address2: profile.address2,
            city: profile.city,
            state: profile.state,
            country: profile.country,
            zipCode: profile.zipCode,
        };
    }

    static getMockDTO(profileId: string): ProfileDTO {
        return {
            profileId,
            email: 'devin.p.flood@gmail.com',
            firstName: 'Devin',
            middleName: 'P.',
            lastName: 'Flood',
            address1: '',
            address2: '',
            city: 'Bay Area',
            state: 'US-CA',
            zipCode: '',
            country: '',
            socialAccounts: [
                {
                    href: 'https://github.com/dfloo',
                    label: 'github',
                },
                {
                    href: 'https://www.linkedin.com/in/dfloo/',
                    label: 'linkedin',
                },
            ],
        };
    }
}

export interface ProfileDTO {
    profileId?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    phoneNumber?: string;
    email?: string;
    socialAccounts?: SocialAccount[];
    created?: string;
    updated?: string;
}

interface SocialAccount {
    href?: string;
    label?: string;
}
