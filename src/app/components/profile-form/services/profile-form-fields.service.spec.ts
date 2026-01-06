import { TestBed } from '@angular/core/testing';

import { ProfileFormFieldsService } from './profile-form-fields.service';

describe('ProfileFormFieldsService', () => {
    let service: ProfileFormFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ProfileFormFieldsService],
        });
        service = TestBed.inject(ProfileFormFieldsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getFields should return the field configs', () => {
        expect(service.getFields()).toBeTruthy();
    });
});
