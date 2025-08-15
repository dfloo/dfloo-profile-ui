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
    email?: string;
    socialAccounts?: string[][]

    constructor(props: Partial<Profile>) {
        super(props);
        Object.assign(this, props);
    }

    static normalize(record: ProfileDTO): Profile {
        return new Profile({
            id: record.profileId,
            ...record
        });
    }

    static serialize(profile: Profile): ProfileDTO {
        return {
            profileId: profile.id,
            ...profile
        }
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
    email?: string;
    socialAccounts?: string[][];
}
