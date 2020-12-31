// solution: (c) 2020 Nir Oren

const { generateReport } = require("./expenseReportGenerator");
const { USERNAMES, TRANSACTION_CATEGORIES } = require("../consts");

describe("generateReport tests", () => {
  test("should return a correct david report for january 2017", async () => {
    const report = await generateReport({
      username: USERNAMES.DAVID,
      startDate: "01/01/2017",
      endDate: "31/01/2017",
    });
    expect(report).toEqual({
      [TRANSACTION_CATEGORIES.EATING_OUT]: 678,
      [TRANSACTION_CATEGORIES.PUBLIC_TRANSPORTATION]: 272,
    });
  });
  test("should return a correct moshe report for April 2017 to Dec 2017", async () => {
    const report = await generateReport({
      username: USERNAMES.MOSHE,
      startDate: "01/04/2017",
      endDate: "31/01/2017",
    });
    expect(report).toEqual({});
  });
  test("should return correct a david report for 2017-2018", async () => {
    const report = await generateReport({
      username: USERNAMES.DAVID,
      startDate: "01/01/2017",
      endDate: "31/12/2018",
    });

    const expected = {};

    expect(report).toEqual({
      [TRANSACTION_CATEGORIES.BILLS]: 1809,
      [TRANSACTION_CATEGORIES.CAR_MAINTENANCE]: 2273,
      [TRANSACTION_CATEGORIES.EATING_OUT]: 4367,
      [TRANSACTION_CATEGORIES.MEDICAL]: 1994,
      [TRANSACTION_CATEGORIES.PUBLIC_TRANSPORTATION]: 5779,
      [TRANSACTION_CATEGORIES.VACATION]: 4108,
      [TRANSACTION_CATEGORIES.NO_CATEGORY]: 966,
    });
  });
  test("should return a correct moshe report for May 2017 to Dec 2018", async () => {
    const report = await generateReport({
      username: USERNAMES.MOSHE,
      startDate: "01/05/2017",
      endDate: "31/12/2018",
    });
    expect(report).toEqual({
      [TRANSACTION_CATEGORIES.BILLS]: 1838,
      [TRANSACTION_CATEGORIES.CAR_MAINTENANCE]: 1123,
      [TRANSACTION_CATEGORIES.EATING_OUT]: 4644,
      [TRANSACTION_CATEGORIES.MEDICAL]: 436,
      [TRANSACTION_CATEGORIES.PUBLIC_TRANSPORTATION]: 1951,
      [TRANSACTION_CATEGORIES.VACATION]: 4025,
      [TRANSACTION_CATEGORIES.NO_CATEGORY]: 275,
    });
  });
});
