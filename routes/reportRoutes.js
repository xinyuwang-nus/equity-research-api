const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

/**
 * @route   POST /api/reports
 * @desc    Submit a new report generation task for a given company ticker
 * @access  Private (requires authentication)
 */
router.post('/', authMiddleware, reportController.submitReport);

/**
 * @route   GET /api/reports
 * @desc    Get all reports submitted by the authenticated user
 * @access  Private (requires authentication)
 */
router.get('/', authMiddleware, reportController.getReports);

/**
 * @route   GET /api/reports/:id
 * @desc    Get a specific report by ID (if it belongs to the user)
 * @access  Private (requires authentication)
 */
router.get('/:id', authMiddleware, reportController.getReportById);

/**
 * @route   GET /api/reports/:id/export-text
 * @desc    Export report content as markdown text
 * @access  Private (requires authentication)
 */
router.get('/:id/export-text', authMiddleware, reportController.exportText);

/**
 * @route   GET /api/reports/:id/export-pdf
 * @desc    Export report content as a PDF file
 * @access  Private (requires authentication)
 */
router.get('/:id/export-pdf', authMiddleware, reportController.exportPDF);

/**
 * @route   DELETE /api/reports/:id
 * @desc    Delete a report by ID (only if owned by the user)
 * @access  Private (requires authentication)
 */
router.delete('/:id', authMiddleware, reportController.deleteReport);

/**
 * @route   GET /api/reports/admin/all
 * @desc    Get all reports from all users (admin only)
 * @access  Private/Admin
 */
router.get('/admin/all', authMiddleware, adminMiddleware, reportController.getAllReports);

module.exports = router;