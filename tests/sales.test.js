const { round2 } = require("../utils/sales");

describe("round2 utility", () => {

    test("rounds numbers to two decimal places", () => {
        expect(round2(10.456)).toBe(10.46);
    });

    test("rounds correctly near next integer", () => {
        expect(round2(3.999)).toBe(4);
    });

});