const axios = require("axios");
const Report = require("../models/Report");
const { loadCompanyData } = require("../utils/dataLoader");
const { generatePromptFromCompanyData } = require("../utils/generatePrompt");
const { fetchStockData } = require("../utils/fetchStockData");

/*
Anthropic API References:
https://docs.anthropic.com/en/api/messages
https://docs.anthropic.com/en/docs/about-claude/models/all-models
*/

/**
 * @function generateReport
 * @desc Generates an equity research report for a given company ticker
 *       using company fundamentals and stock data, then calls Anthropic API
 *       to generate the report and updates the database with the result.
 * @param {String} reportId - MongoDB ID of the report document
 * @param {String} ticker - Company ticker symbol
 */
exports.generateReport = async (reportId, ticker) => {
  try {
    // Load fundamental company data from local JSON files, and fetch recent stock data from Yahoo Finance
    const companyData = await loadCompanyData(ticker);
    const stockData = await fetchStockData(ticker);

    // Format all input data into a prompt
    const prompt = generatePromptFromCompanyData(companyData, stockData);
    console.log("Prompt for LLM:", prompt);

    // Call Anthropic Claude API to generate the equity research report
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-5-haiku-20241022", // "claude-3-haiku-20240307",
        max_tokens: 1000,
        system:
          "You are a financial research assistant that writes clear and insightful reports.",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      }
    );

    // Process response from the API
    const blocks = response.data.content;
    const finalText = Array.isArray(blocks)
      ? blocks.map((b) => b.text).join("\n\n") // Combine multi-block responses
      : blocks;

    // Save the generated report to MongoDB with status = completed
    await Report.findByIdAndUpdate(reportId, {
      status: "completed",
      content: finalText,
    });
  } catch (err) {
    console.error("Report generation failed:", err);

    // Mark report as failed and store the error message
    await Report.findByIdAndUpdate(reportId, {
      status: "failed",
      content: `Error: ${err.message}`,
    });
  }
};
