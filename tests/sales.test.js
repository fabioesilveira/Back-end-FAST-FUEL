const {
    genOrderCode,
    genPaymentRef,
    round2,
    safeJsonParse,
    normalizeItems,
    parseSaleRow,
} = require("../utils/sales");

describe("sales utilities", () => {
    describe("round2", () => {
        test("rounds numbers to two decimal places", () => {
            expect(round2(10.456)).toBe(10.46);
        });

        test("rounds correctly near next integer", () => {
            expect(round2(3.999)).toBe(4);
        });

        test("handles numeric strings", () => {
            expect(round2("12.345")).toBe(12.35);
        });
    });

    describe("genOrderCode", () => {
        test("generates a 6 digit order code", () => {
            const code = genOrderCode();

            expect(code).toMatch(/^\d{6}$/);
        });
    });

    describe("genPaymentRef", () => {
        test("generates a payment reference with SIM prefix", () => {
            const ref = genPaymentRef();

            expect(ref).toMatch(/^SIM-[A-Z0-9]{6}$/);
        });
    });

    describe("safeJsonParse", () => {
        test("parses valid JSON strings", () => {
            expect(
                safeJsonParse('{"name":"Burger"}', null)
            ).toEqual({
                name: "Burger",
            });
        });

        test("returns fallback for invalid JSON", () => {
            expect(
                safeJsonParse("{invalid json}", [])
            ).toEqual([]);
        });

        test("returns fallback for null values", () => {
            expect(safeJsonParse(null, [])).toEqual([]);
        });

        test("returns already parsed values unchanged", () => {
            const value = { id: 1 };

            expect(safeJsonParse(value, null)).toEqual(value);
        });
    });

    describe("normalizeItems", () => {
        test("normalizes standard id and qty fields", () => {
            const result = normalizeItems([
                { id: 1, qty: 2 },
            ]);

            expect(result).toEqual([
                {
                    id: "1",
                    qty: 2,
                },
            ]);
        });

        test("supports alternative product id and quantity field names", () => {
            const result = normalizeItems([
                {
                    product_id: 5,
                    quantity: 3,
                },
            ]);

            expect(result).toEqual([
                {
                    id: "5",
                    qty: 3,
                },
            ]);
        });

        test("defaults quantity to 1", () => {
            const result = normalizeItems([
                {
                    productId: 10,
                },
            ]);

            expect(result).toEqual([
                {
                    id: "10",
                    qty: 1,
                },
            ]);
        });

        test("prevents quantities lower than 1", () => {
            const result = normalizeItems([
                {
                    id: 3,
                    qty: 0,
                },
            ]);

            expect(result).toEqual([
                {
                    id: "3",
                    qty: 1,
                },
            ]);
        });

        test("parses items passed as JSON string", () => {
            const result = normalizeItems(
                '[{"id":7,"qty":2}]'
            );

            expect(result).toEqual([
                {
                    id: "7",
                    qty: 2,
                },
            ]);
        });

        test("returns null for invalid JSON", () => {
            expect(
                normalizeItems("{invalid}")
            ).toBeNull();
        });

        test("returns null when input is not an array", () => {
            expect(
                normalizeItems({ id: 1 })
            ).toBeNull();
        });

        test("ignores items without a product id", () => {
            const result = normalizeItems([
                { qty: 2 },
                { id: 4, qty: 1 },
            ]);

            expect(result).toEqual([
                {
                    id: "4",
                    qty: 1,
                },
            ]);
        });
    });

    describe("parseSaleRow", () => {
        test("parses JSON fields from a database sale row", () => {
            const row = {
                id: 1,
                items: '[{"id":"1","qty":2}]',
                items_snapshot:
                    '[{"name":"Pit Stop Classic","price":5}]',
                delivery_address:
                    '{"street":"123 Market St","city":"San Jose"}',
            };

            const result = parseSaleRow(row);

            expect(result).toEqual({
                id: 1,
                items: [
                    {
                        id: "1",
                        qty: 2,
                    },
                ],
                items_snapshot: [
                    {
                        name: "Pit Stop Classic",
                        price: 5,
                    },
                ],
                delivery_address: {
                    street: "123 Market St",
                    city: "San Jose",
                },
            });
        });

        test("uses fallback values when JSON fields are invalid", () => {
            const row = {
                id: 1,
                items: "invalid",
                items_snapshot: "invalid",
                delivery_address: "invalid",
            };

            const result = parseSaleRow(row);

            expect(result.items).toEqual([]);
            expect(result.items_snapshot).toEqual([]);
            expect(result.delivery_address).toBeNull();
        });
    });
});