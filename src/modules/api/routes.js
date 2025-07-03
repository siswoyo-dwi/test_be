import express from 'express';
import kpiController from './controller.js';

const router = express.Router();

router.get('/total-vulnerabilities', kpiController.getTotalVulnerabilities);
router.get('/high-severity', kpiController.getHighSeverityVulnerabilities);
router.get('/unpatched-vulnerabilities', kpiController.getUnpatchedVulnerabilities);
router.get('/unsupported-applications', kpiController.getUnsupportedApplications);
router.get('/external-facing-assets', kpiController.getExternalFacingAssets);
router.get('/total-endpoints', kpiController.getTotalEndpoints);
router.get('/unique-users', kpiController.getUniqueUsers);
router.get('/expired-firewalls', kpiController.getExpiredFirewalls);

router.get('/chart/vulnerabilities-by-severity', kpiController.getVulnerabilitiesBySeverity);
router.get('/chart/vulnerabilities-over-time', kpiController.getVulnerabilitiesOverTime);
router.get('/chart/application-risk', kpiController.getApplicationRiskDistribution);
router.get('/chart/users-by-department', kpiController.getUsersByDepartment);
router.get('/chart/external-ips-by-country', kpiController.getExternalIPsByCountry);
router.get('/chart/unsupported-apps-by-bu', kpiController.getUnsupportedAppsByBU);
router.get('/chart/firewall-status-by-location', kpiController.getFirewallStatusByLocation);

router.get('/all-metrics', kpiController.getAllMetrics);

router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'API is operational',
    timestamp: new Date()
  });
});

export default router;