import { isEmpty } from '../updateUI.js';

describe('Update UI test', ()  => {
    test('isEmpty response to empty obj', () => {
        let emptyResp = {};        
        expect(isEmpty(emptyResp)).toBeTruthy();
    });
    test('isEmpty response to non-empty obj', () => {
        let resp = {
            high_temp: 72.8
        };
        expect(isEmpty(resp)).toBeFalsy();
    });
});
