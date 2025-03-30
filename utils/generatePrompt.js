/**
 * Generates a detailed prompt for the language model using company metadata,
 * historical financial ratios, and optional live stock data.
 *
 * @param {Object} companyData - Includes metadata and financials for the company
 * @param {Object|null} stockData - Optional stock data from Yahoo Finance
 * @returns {string} - Formatted natural language prompt for LLM input
 */
exports.generatePromptFromCompanyData = (companyData, stockData) => {
  const { metadata, financials } = companyData;

  const financialSummary = financials
    .slice(0, 10) // only include the most recent 10 years
    .map(
      (f) =>
        `Year ${f.fiscal_year}: ` +
        `Revenue = ${f.total_revenue ?? "N/A"}, ` +
        `Net Income = ${f.net_income ?? "N/A"}, ` +
        `Assets = ${f.total_asset ?? "N/A"}, ` +
        `ROA = ${f.return_on_assets ?? "N/A"}, ` +
        `Current Ratio = ${f.current_ratio ?? "N/A"}, ` +
        `D/E = ${f.debt_to_equity ?? "N/A"}`
    )
    .join("\n");

  const metadataSummary = `
    Company Name       : ${metadata.company_name}
    Ticker             : ${metadata.ticker}
    Country            : ${metadata.country_name}
    Security Type      : ${metadata.security_type}
    Industry Sector ID : ${metadata.industry_sector_num}
    Exchange Country ID: ${metadata.exchange_country_id}
    `.trim();

  const stockInfo = stockData
    ? `
    Live Market Data:
    - Symbol         : ${stockData.symbol}
    - Current Price  : ${stockData.currentPrice} ${stockData.currency}
    - Market Cap     : ${stockData.marketCap}
    - P/E Ratio      : ${stockData.peRatio}
    - Dividend Yield : ${stockData.dividendYield ?? "N/A"}
    `.trim()
    : "";

  // Compose the full prompt string
  return `
    You are an expert financial analyst. Write a comprehensive equity research report for the following company:

    ${metadataSummary}

    ${stockInfo ? stockInfo + "\n" : ""}

    Use the financials provided below to analyze performance, financial health, and valuation.

    Financial Data (last 10 years):
    ${financialSummary}

    Your report should include:
    1. Executive Summary  
    2. Business and Market Overview  
    3. Financial Performance and Trends  
    4. Key Ratios and Financial Health  
    5. Investment Insights and Valuation Perspective  
    6. Risks and Considerations  
    7. Conclusion and Recommendation

    Write clearly and concisely in a professional tone.
    `.trim();
};

/*
  Prompt for LLM: You are an expert financial analyst. Write a comprehensive equity research report for the following company:
  
  Company Name: American Airlines Group Inc
  Ticker: AAL US
  Country: United States
  Security Type: Common Stock
  Industry Sector ID: 10004
  Exchange Country ID: 15
  
  Live Market Data:
  - Symbol: AAL
  - Current Price: 10.7 USD
  - Market Cap: 7036063232
  - P/E Ratio: 8.629032
  - Dividend Yield: N/A
  
  
  Use the financials provided below to analyze performance, financial health, and valuation.
  
  Financial Data (last 10 years):
  Year 2023: Revenue=353655, Net Income=8892, Assets=1198542, ROA=0.007419014102134093, Current Ratio=0.7174630898125154, D/E=-14.062843316766937
Year 2022: Revenue=641751, Net Income=-9267, Assets=1794540, ROA=-0.0051639974589588414, Current Ratio=0.7745827010622155, D/E=-9.808812051776695
Year 2021: Revenue=376785, Net Income=-28563, Assets=1855428, ROA=-0.015394291775266947, Current Ratio=0.9957647985817, D/E=-10.079479726357203
Year 2020: Revenue=268946, Net Income=-124215, Assets=1790614, ROA=-0.0693700596555148, Current Ratio=0.6153461786416213, D/E=-14.256639002613401
Year 2019: Revenue=763876, Net Income=27569, Assets=1945864, ROA=0.01416799940797507, Current Ratio=0.46436942815772897, D/E=-477.46033300685605
Year 2018: Revenue=798684, Net Income=24936, Assets=1995892, ROA=0.012493661981710433, Current Ratio=0.5351849872204784, D/E=-93.11242385083995
Year 2017: Revenue=767669, Net Income=38888, Assets=1891998, ROA=0.020553932932275826, Current Ratio=0.6532078650471946, D/E=16.54514262398457
Year 2016: Revenue=630606, Net Income=43844, Assets=1527696, ROA=0.028699427111153003, Current Ratio=0.7407376743800969, D/E=11.1343945098413
Year 2015: Revenue=739244, Net Income=122908, Assets=1727394, ROA=0.07115226751974361, Current Ratio=0.8920292268212894, D/E=10.599787799833463
Year 2014: Revenue=670815, Net Income=44626, Assets=1318302, ROA=0.03385112060817628, Current Ratio=0.9516092634904516, D/E=14.480659480025365
  
  Your report should include:
  1. Executive Summary
  2. Business and Market Overview
  3. Financial Performance and Trends
  4. Key Ratios and Financial Health
  5. Investment Insights and Valuation Perspective
  6. Risks and Considerations
  7. Conclusion and Recommendation
  
  Write clearly and concisely in a professional tone.
  */
