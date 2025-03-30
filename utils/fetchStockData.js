const yahooFinance = require('yahoo-finance2').default;

/**
 * Fetch live stock data for a given ticker from Yahoo Finance.
 *
 * @param {string} ticker 
 * @returns {Object|null} stock data or null if request fails
 */
exports.fetchStockData = async (ticker) => {
  try {
    // Extract base ticker (e.g., 'AAL' from 'AAL US')
    const symbol = ticker.split(' ')[0].toUpperCase();

    // Fetch quote summary from Yahoo Finance using selected modules
    const quote = await yahooFinance.quoteSummary(symbol, {
      modules: ['price', 'summaryDetail']
    });

    return {
      symbol: quote.price.symbol,
      shortName: quote.price.shortName,
      currentPrice: quote.price.regularMarketPrice,
      currency: quote.price.currency,
      marketCap: quote.price.marketCap,
      peRatio: quote.summaryDetail.trailingPE,
      dividendYield: quote.summaryDetail.dividendYield,
    };
  } catch (err) {
    // Log error and return null if Yahoo Finance fetch fails
    console.error(`Failed to fetch Yahoo Finance data for ${ticker}:`, err.message);
    return null;
  }
};
