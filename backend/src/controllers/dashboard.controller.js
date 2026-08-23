import { DashboardService } from '../services/dashboard.service.js';

export async function getDashboardSummary(req, res) {
  try {
    const { childId = 'child-1' } = req.query;
    const summary = await DashboardService.getSummary(childId);
    return res.status(200).json(summary);
  } catch (error) {
    console.error('Dashboard Summary Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve dashboard summary metrics.' });
  }
}

export async function getDashboardLogs(req, res) {
  try {
    const { childId = 'child-1', status, page = 1, limit = 20 } = req.query;

    const logsData = await DashboardService.getLogs({
      childUserId: childId,
      status,
      page,
      limit,
    });

    return res.status(200).json(logsData);
  } catch (error) {
    console.error('Dashboard Logs Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve activity logs.' });
  }
}

export async function getDashboardSettings(req, res) {
  try {
    const { childId = 'child-1' } = req.query;
    const settings = await DashboardService.getSettings(childId);
    return res.status(200).json({ settings });
  } catch (error) {
    console.error('Dashboard Settings Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve settings.' });
  }
}

export async function updateDashboardSettings(req, res) {
  try {
    const { childId = 'child-1', settings } = req.body;

    if (!settings) {
      return res.status(400).json({ error: 'Settings payload object is required.' });
    }

    const updated = await DashboardService.updateSettings(childId, settings);
    return res.status(200).json({
      message: 'Settings updated successfully.',
      settings: updated,
    });
  } catch (error) {
    console.error('Dashboard Settings Error:', error);
    return res.status(500).json({ error: 'Failed to update rules and settings.' });
  }
}
