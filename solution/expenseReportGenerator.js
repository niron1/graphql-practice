// solution: (c) 2020 Nir Oren
const axios = require("axios");
const { GraphQLClient } = require("graphql-request");
const {
  GRAPHQL_ENDPOINT,
  SERVER_BASE_URL,
  TRANSACTION_CATEGORIES,
  USERNAMES,
} = require("../consts");

const client = new GraphQLClient(GRAPHQL_ENDPOINT);
const { asyncPool } = require("./pool");

const CONCURRENCY_LIMIT = 10;

/**
 * Generates a report object containing the total spending of the given user in the given date range.
 * The report object's keys are all the transaction categories, and the values are the total spending
 * in each category.
 *
 * @param username             The username for which to generate the report (the USERNAMES const contains the possible usernames).
 * @param startDate (optional) Limit the transactions the report takes into account to ones that happened on or after the given startDate.
 *                             Date format is `DD/MM/YYYY` (for example `01/10/2017` or `15/08/2018`)
 * @param endDate   (optional) Limit the transactions the report takes into account to ones that happened on or before the given endDate.
 *                             Date format is `DD/MM/YYYY` (for example `01/10/2017` or `15/08/2018`)
 * @returns Promise            Example return value:
 *
 *                                {
 *                                   EATING_OUT: 4325,
 *                                   GROCERIES: 0,
 *                                   VACATION: 228,
 *                                   MEDICAL: 780,
 *                                   PUBLIC_TRANSPORTATION: 0,
 *                                   CAR_MAINTENANCE: 2000,
 *                                   SAVINGS: 350,
 *                                   BILLS: 0,
 *                                   ENTERTAINMENT: 0
 *                                }
 */

async function generateReport({ username, startDate, endDate }) {

  if (!Object.values(USERNAMES).includes(username)) {
    throw new Error('username parameter must be of the pre-defined');
  }

  const query = `query transactions(
      $username: String!,
      $startDate: String,
      $endDate: String) {
    transactions(
      username: $username,
      startDate: $startDate,
      endDate: $endDate) {
        amount
        description
        date
    }
  }`;

  const {transactions} = await client.request(query, {
    username,
    startDate,
    endDate,
  });

  const report = {};

  const processItems = async (item) => {
    const {description: transactionDescription} = item;
    const axiosResult = await axios.post(`${SERVER_BASE_URL}/transaction/classification`, {
      transactionDescription,
    });
    const {data: {transactionCategory}} = axiosResult;
    const {amount} = item;
    const myCategory = (!transactionCategory && TRANSACTION_CATEGORIES.NO_CATEGORY) || transactionCategory;
    report[myCategory] = (report[myCategory] || 0) + amount;
  };

  if (CONCURRENCY_LIMIT === 0) {
    await Promise.all(transactions.map(processItems));
  } else {
    await asyncPool(CONCURRENCY_LIMIT, transactions, processItems);
  }
  return report;
}

module.exports = {
  generateReport,
};
