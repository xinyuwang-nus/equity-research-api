const Report = require('../models/Report');
const { generateReport } = require('../services/llmService');
const PDFDocument = require('pdfkit');

/**
 * Submit a new report generation request.
 * Saves the report to DB and triggers asynchronous LLM generation logic.
 */
exports.submitReport = async (req, res) => {
  const { ticker } = req.body;
  const userName = req.user.userName; // extracted from decoded JWT token via middleware

  if (!ticker) {
    return res.status(400).json({ error: 'Missing company ticker' });
  }

  // Create a new report document with user and ticker info
  const report = new Report({ userName, ticker });
  await report.save();

  generateReport(report._id, ticker);

  res.status(202).json({ message: 'Report generation started', reportId: report._id });
};

/**
 * Get all reports submitted by the authenticated user.
 */
exports.getReports = async (req, res) => {
  const userName = req.user.userName;

  const reports = await Report.find({ userName }).sort({ createdAt: -1 });
  res.json(reports);
};

/**
 * Get a single report by ID (only if it belongs to the current user).
 */
exports.getReportById = async (req, res) => {
  const { id } = req.params;
  const userName = req.user.userName;

  const report = await findAndAuthorizeReport(id, userName, res);
  if (report) res.json(report);
};

/**
 * Export a report as Markdown.
 */
exports.exportText = async (req, res) => {
  const { id } = req.params;
  const userName = req.user.userName;

  const report = await findAndAuthorizeReport(id, userName, res);
  if (!report) return;

  const content = Array.isArray(report.content)
    ? report.content.map(p => p.text).join('\n\n')
    : report.content;

  res.setHeader('Content-Disposition', `attachment; filename=report-${id}.md`);
  res.setHeader('Content-Type', 'text/markdown');
  res.send(content);
};

/**
 * Export a report as a PDF file.
 * Uses pdfkit to render plain text into a downloadable PDF.
 */
exports.exportPDF = async (req, res) => {
  const { id } = req.params;
  const userName = req.user.userName;

  const report = await findAndAuthorizeReport(id, userName, res);
  if (!report) return;

  const content = Array.isArray(report.content)
    ? report.content.map(p => p.text).join('\n\n')
    : report.content;

  const doc = new PDFDocument();
  res.setHeader('Content-Disposition', `attachment; filename=report-${id}.pdf`);
  res.setHeader('Content-Type', 'application/pdf');

  doc.pipe(res);
  doc.fontSize(12).text(content);
  doc.end();
};

/**
 * Delete a report if it belongs to the authenticated user.
 */
exports.deleteReport = async (req, res) => {
  const { id } = req.params;
  const userName = req.user.userName;

  try {
    const report = await findAndAuthorizeReport(id, userName, res);
    if (!report) return;

    await report.deleteOne();

    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('Error deleting report:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Admin-only: get all reports submitted by all users.
 */
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Error fetching all reports:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Helper function: load report by ID and check if it belongs to the user.
 * If unauthorized, sends the appropriate HTTP response and returns null.
 */
const findAndAuthorizeReport = async (id, userName, res) => {
  const report = await Report.findById(id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  if (report.userName !== userName) {
    return res.status(403).json({ error: 'Access denied' });
  }
  return report;
};
