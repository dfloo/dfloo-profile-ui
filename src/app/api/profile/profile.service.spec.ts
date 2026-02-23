import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UserService } from '@core/services';
import { ApiService } from '../api.service';
import { ProfileService } from './profile.service';
import { Profile } from '@models/profile';

describe('ProfileService', () => {
    let service: ProfileService;
    let mockApiService: jasmine.SpyObj<ApiService>;

    const setup = (isAuthenticated = true) => {
        mockApiService = jasmine.createSpyObj('ApiService', [
            'get',
            'post',
            'put',
        ]);
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: UserService,
                    useValue: { isAuthenticated$: of(isAuthenticated) },
                },
                { provide: ApiService, useValue: mockApiService },
            ],
        });
        service = TestBed.inject(ProfileService);
    };

    describe('#getUserProfile', () => {
        it('should make get request and normalize result', (done) => {
            setup();
            const mockDTO = Profile.getMockDTO('id');
            mockApiService.get.and.returnValue(of(mockDTO));

            service.getUserProfile().subscribe((profile) => {
                expect(mockApiService.get).toHaveBeenCalledWith('profiles');
                expect(profile).toEqual(Profile.normalize(mockDTO));
                done();
            });
        });

        it('should return guest profile for unauthenticated user', (done) => {
            setup(false);

            service.getUserProfile().subscribe((profile) => {
                expect(mockApiService.get).not.toHaveBeenCalled();
                expect(profile.firstName).toEqual('Guest');
                done();
            });
        });
    });

    describe('#createUserProfile', () => {
        it('should post serialized profile and normalize result', (done) => {
            setup();
            const mockDTO = Profile.getMockDTO('id');
            const normalized = Profile.normalize(mockDTO);
            const serialized = Profile.serialize(normalized);
            mockApiService.post.and.returnValue(of(mockDTO));

            service.createUserProfile(normalized).subscribe((result) => {
                expect(result).toEqual(normalized);
                expect(mockApiService.post).toHaveBeenCalledWith(
                    'profiles',
                    serialized,
                );
                done();
            });
        });
    });

    describe('#updateUserProfile', () => {
        it('should put serialized profile and normalize result', (done) => {
            setup();
            const mockDTO = Profile.getMockDTO('id');
            const normalized = Profile.normalize(mockDTO);
            const serialized = Profile.serialize(normalized);
            mockApiService.put.and.returnValue(of(mockDTO));

            service.updateUserProfile(normalized).subscribe((result) => {
                expect(result).toEqual(normalized);
                expect(mockApiService.put).toHaveBeenCalledWith(
                    'profiles',
                    serialized,
                );
                done();
            });
        });
    });
});
