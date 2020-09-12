const { formatDate, setHistoricalDates } = require('../index.js');

describe('Express server test', ()  => {
    test('Correct format for Weatherbit historical date API', () => {
        expect(setHistoricalDates("2020-09-22")).toStrictEqual({histStDate: "2019-09-22", histEndDate: "2019-09-23"});
    });
});
