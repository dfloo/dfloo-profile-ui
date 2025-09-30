import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { iso31661, iso31662 } from 'iso-3166';
import { skip } from 'rxjs';

export interface SelectOption {
    value?: string;
    label: string;
}

@Injectable()
export class ProfileFormFieldsService {
    
    getFields(): FormlyFieldConfig[] {
        const {
            firstName, middleName, lastName, address1, address2, city, state,
            zipCode, country, email, socialAccounts, phoneNumber
        } = this.getFieldConfigs();

        return [
            {
                fieldGroupClassName: 'd-flex',
                fieldGroup: [firstName, middleName, lastName]
            },
            {
                fieldGroupClassName: 'd-flex',
                fieldGroup: [address1, address2]
            },
            {
                fieldGroupClassName: 'd-flex',
                fieldGroup: [city, state, zipCode, country]
            },
            {
                fieldGroupClassName: 'd-flex',
                fieldGroup: [phoneNumber, email]
            },
            socialAccounts
        ];
    }

    

    private getFieldConfigs(): Record<string, FormlyFieldConfig> {
        return {
            email: {
                key: 'email',
                type: 'input',
                className: 'flex-grow',
                props: {
                    label: 'Email',
                    type: 'email',
                    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'
                },
                validation: {
                    messages: {
                        pattern: (_, field) => `"${field?.formControl?.value}" is not a valid email address`
                    }
                }
            },
            socialAccounts: {
                key: 'socialAccounts',
                type: 'repeat-section',
                className: 'flex-grow',
                props: {
                    label: 'Social Accounts',
                    addText: 'Add Social Account',
                    removeText: 'Remove Social Account'
                },
                fieldArray: {
                    fieldGroup:[{
                        fieldGroupClassName: 'd-flex',
                        fieldGroup: [{
                            key: 'label',
                            type: 'input',
                            className: 'flex-grow',
                            props: { label: 'Label' }
                        }, {
                            key: 'href',
                            type: 'input',
                            className: 'flex-grow',
                            props: { label: 'Link' }
                        }]
                    }]
                },
            },
            phoneNumber: {
                key: 'phoneNumber',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'Phone Number' }
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
                expressions: { 'props.options': this.getStates }
            },
            zipCode: {
                key: 'zipCode',
                type: 'input',
                className: 'flex-grow',
                props: { label: 'Zip/Postal Code' }
            },
            country: {
                key: 'country',
                type: 'select',
                className: 'flex-grow',
                props: {
                    label: 'Country',
                    options: []
                },
                expressions: { 'props.options': this.getCountries },
                hooks: { onInit: this.onCountryInit }
            }
        };
    }

    private onCountryInit(
        { form, formControl, model }: FormlyFieldConfig
    ): void {
        formControl?.valueChanges.pipe(skip(1))
            .subscribe(value => {
                if (value !== model.country) {
                    form?.get('state')?.setValue(null);
                }
            })
    }

    private getCountries(
        { model: { country } }: FormlyFieldConfig
    ): SelectOption[] {
        return [
            ...(country ? [{ label: 'Clear Selection' }] : []),
            ...iso31661.map(({ alpha2, name }) => ({
                value: alpha2,
                label: name
            }))
        ];
    }

    private getStates(
        { model: { state, country } }: FormlyFieldConfig
    ): SelectOption[] {
        return [
            ...(state ? [{ label: 'Clear Selection' }] : []),
            ...iso31662.filter(({ parent }) => parent === (country || 'US'))
                .map(({ code, name }) => ({
                    value: code,
                    label: name
                }))
        ];
    }
}
