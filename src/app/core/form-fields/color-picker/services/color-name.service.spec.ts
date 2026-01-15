import { TestBed } from '@angular/core/testing';

import { ColorNameService } from './color-name.service';

describe('ColorNameService', () => {
    let service: ColorNameService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ColorNameService]
        });
        service = TestBed.inject(ColorNameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
