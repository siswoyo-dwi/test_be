import kpiModel from './model.js';

class KpiController {
  async getTotalVulnerabilities(req, res) {
    try {
      const result = await kpiModel.getTotalVulnerabilities();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve total vulnerabilities' });
      }
      res.json({ status: 'success', kpi: 'Total Vulnerabilities', value: result.count, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getHighSeverityVulnerabilities(req, res) {
    try {
      const result = await kpiModel.getHighSeverityVulnerabilities();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve high severity vulnerabilities' });
      }
      res.json({ status: 'success', kpi: 'High Severity Vulnerabilities', value: result.count, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getUnpatchedVulnerabilities(req, res) {
    try {
      const result = await kpiModel.getUnpatchedVulnerabilities();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve unpatched vulnerabilities' });
      }
      res.json({ status: 'success', kpi: 'Unpatched Vulnerabilities', value: result.count, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getUnsupportedApplications(req, res) {
    try {
      const result = await kpiModel.getUnsupportedApplications();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve unsupported applications' });
      }
      res.json({ status: 'success', kpi: 'Unsupported Applications', value: result.count, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getExternalFacingAssets(req, res) {
    try {
      const result = await kpiModel.getExternalFacingAssets();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve external facing assets' });
      }
      res.json({ status: 'success', kpi: 'External Facing Assets', value: result.count, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getTotalEndpoints(req, res) {
    try {
      const result = await kpiModel.getTotalEndpoints();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve total endpoints' });
      }
      res.json({ status: 'success', kpi: 'Total Endpoints', value: result.count, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getUniqueUsers(req, res) {
    try {
      const result = await kpiModel.getUniqueUsers();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve unique users' });
      }
      res.json({ status: 'success', kpi: 'Unique Users', value: result.count, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getExpiredFirewalls(req, res) {
    try {
      const result = await kpiModel.getExpiredFirewalls();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve expired firewalls' });
      }
      res.json({ status: 'success', kpi: 'Expired Firewalls', value: result.count, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getAllMetrics(req, res) {
    try {
      const result = await kpiModel.getAllMetrics();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve all metrics' });
      }
      res.json({ status: 'success', kpi: 'All Security KPIs', data: result.data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // Chart endpoints
  async getVulnerabilitiesBySeverity(req, res) {
    try {
      const result = await kpiModel.getVulnerabilitiesBySeverity();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve vulnerabilities by severity' });
      }
      res.json({ status: 'success', chart: 'Vulnerabilities by Severity', data: result.data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getVulnerabilitiesOverTime(req, res) {
    try {
      const result = await kpiModel.getVulnerabilitiesOverTime();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve vulnerabilities over time' });
      }
      res.json({ status: 'success', chart: 'Vulnerabilities Over Time', data: result.data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getApplicationRiskDistribution(req, res) {
    try {
      const result = await kpiModel.getApplicationRiskDistribution();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve application risk distribution' });
      }
      res.json({ status: 'success', chart: 'Application Risk Distribution', data: result.data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getUsersByDepartment(req, res) {
    try {
      const result = await kpiModel.getUsersByDepartment();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve users by department' });
      }
      res.json({ status: 'success', chart: 'User Count by Department', data: result.data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getExternalIPsByCountry(req, res) {
    try {
      const result = await kpiModel.getExternalIPsByCountry();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve external IPs by country' });
      }
      res.json({ status: 'success', chart: 'External IPs by Country', data: result.data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getUnsupportedAppsByBU(req, res) {
    try {
      const result = await kpiModel.getUnsupportedAppsByBU();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve unsupported apps by BU' });
      }
      res.json({ status: 'success', chart: 'Unsupported Apps by Business Unit', data: result.data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async getFirewallStatusByLocation(req, res) {
    try {
      const result = await kpiModel.getFirewallStatusByLocation();
      if (!result.success) {
        return res.status(500).json({ status: 'error', message: 'Failed to retrieve firewall status by location' });
      }
      res.json({ status: 'success', chart: 'Firewall Status by Location', data: result.data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default new KpiController();