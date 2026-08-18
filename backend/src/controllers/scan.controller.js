import { ScanService } from '../services/scan.service.js';

export async function handleScan(req, res) {
  try {
    const { userId, content, contentType, appSource } = req.body;

    if (!userId || !content) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'userId and content are required fields in the request body.',
      });
    }

    const result = await ScanService.scanPayload({
      userId,
      content,
      contentType,
      appSource,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Scan Controller Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while executing the threat scanning pipeline.',
    });
  }
}
