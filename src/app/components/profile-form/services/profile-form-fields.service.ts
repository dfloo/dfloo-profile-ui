import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { iso31661, iso31662 } from 'iso-3166';
import { skip } from 'rxjs';

export interface SelectOption {
    value: string;
    label: string;
}

@Injectable()
export class ProfileFormFieldsService {
    
    getFields(): FormlyFieldConfig[] {
        const {
            email,
            firstName,
            middleName,
            lastName,
            address1,
            address2,
            city,
            state,
            zipCode,
            country
        } = this.getBaseFields();

        return [
            {
                fieldGroupClassName: 'd-flex',
                fieldGroup:[firstName, middleName, lastName]
            },
            {
                fieldGroupClassName: 'd-flex',
                fieldGroup: [address1, address2]
            },
            {
                fieldGroupClassName: 'd-flex',
                fieldGroup: [city, state, zipCode, country]
            },
            email
        ];
    }

    private getBaseFields(): Record<string, FormlyFieldConfig> {
        return {
            email: {
                key: 'email',
                type: 'input',
                props: { label: 'Email' }
            },
            firstName: {
                key: 'firstName',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'First Name' }
            },
            middleName: {
                key: 'middleName',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'Middle Name' }
            },
            lastName: {
                key: 'lastName',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'Last Name' }
            },
            address1: {
                key: 'address1',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'Address' }
            },
            address2: {
                key: 'address2',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'Address Cont.' }
            },
            city: {
                key: 'city',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'City' }
            },
            state: {
                key: 'state',
                type: 'select',
                className: 'flex-grow',
                props: {
                    label: 'State/Province',
                    options: []
                },
                expressions: {
                    'props.options': this.getStates
                }
            },
            zipCode: {
                key: 'zipCode',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'Zip Code' }
            },
            country: {
                key: 'country',
                type: 'select',
                className: 'flex-grow',
                props: {
                    label: 'Country',
                    options: this.getCountries()
                },
                defaultValue: 'US',
                hooks: { onInit: this.onCountryInit }
            }
        };
    }

    private onCountryInit({ form, formControl, model }: FormlyFieldConfig): void {
        formControl?.valueChanges.pipe(skip(1))
            .subscribe(value => {
                if (value !== model.country) {
                    form?.get('state')?.setValue(null);
                }
            })
    }

    private getCountries(): SelectOption[] {
        return iso31661.map(({ alpha2, name}) => ({
            value: alpha2,
            label: name
        }));
    }

    private getStates({ model }: FormlyFieldConfig): SelectOption[] {
        return iso31662.filter(({ parent }) => parent === model.country)
            .map(({ code, name }) => ({
                value: code,
                label: name
            }));
    }
}
