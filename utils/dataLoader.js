const fs = require("fs/promises");
const path = require("path");

/**
 * Load company metadata and financial data for a given ticker symbol.
 * This function reads two local JSON files:
 * - company_metadata.json: contains company identification and basic info
 * - company_financial_ratios.json: contains historical financials
 *
 * It returns an object with:
 * - metadata: company metadata
 * - financials: computed financial metrics for each fiscal year
 *
 * @param {string} ticker - The stock ticker symbol
 * @returns {Object} { metadata, financials[] }
 */
exports.loadCompanyData = async (ticker) => {
  const basePath = path.join(__dirname, "../data");

  // Read both metadata and financials in parallel for performance
  const [metadataRaw, financialsRaw] = await Promise.all([
    fs.readFile(path.join(basePath, "company_metadata.json"), "utf-8"),
    fs.readFile(path.join(basePath, "company_financial_ratios.json"), "utf-8"),
  ]);

  const metadata = JSON.parse(metadataRaw);
  const financials = JSON.parse(financialsRaw);

  // Extract base ticker symbol (e.g., "AAL" from "AAL US")
  const cleanTicker = ticker.split(" ")[0].toUpperCase();

  // Find matching company metadata by ticker
  const meta = metadata.find(
    (c) => c.ticker && c.ticker.toUpperCase().startsWith(cleanTicker)
  );
  if (!meta)
    throw new Error(`Company metadata not found for ticker: ${ticker}`);

  const companyId = meta.company_id;

  // Filter financials for this specific company and compute derived metrics
  const companyFinancials = financials
    .filter((entry) => entry.company_id === companyId)
    .map((entry) => {
      const roa =
        entry.net_income && entry.total_asset
          ? entry.net_income / entry.total_asset
          : null;

      const currentRatio =
        entry.total_current_asset && entry.total_current_liab
          ? entry.total_current_asset / entry.total_current_liab
          : null;

      const debtToEquity =
        entry.total_liab && entry.total_equity
          ? entry.total_liab / entry.total_equity
          : null;

      return {
        fiscal_year: entry.fiscal_year,
        total_asset: entry.total_asset,
        total_liab: entry.total_liab,
        total_equity: entry.total_equity,
        net_income: entry.net_income,
        total_revenue: entry.total_revenue,
        current_ratio: currentRatio,
        return_on_assets: roa,
        debt_to_equity: debtToEquity,
      };
    })
    .sort((a, b) => b.fiscal_year - a.fiscal_year); // Sort by most recent year first

  return {
    metadata: meta,
    financials: companyFinancials,
  };
};
