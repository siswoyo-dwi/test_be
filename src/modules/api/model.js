import db from '../../config/config.js';

class KpiModel {
  async getTotalVulnerabilities() {
    try {
      const result = await db.query('SELECT COUNT(*) FROM correlated_vulnerabilityassessment');
      return { success: true, count: parseInt(result.rows[0].count) };
    } catch (error) {
      console.error('Error getting total vulnerabilities:', error);
      return { success: false, error: error.message };
    }
  }

  async getHighSeverityVulnerabilities() {
    try {
      const result = await db.query(`
        SELECT COUNT(*) FROM correlated_vulnerabilityassessment
        WHERE severity IN ('High', 'Critical')
      `);
      
      return { success: true, count: parseInt(result.rows[0].count) };
    } catch (error) {
      console.error('Error getting high severity vulnerabilities:', error);
      return { success: false, error: error.message };
    }
  }

  async getUnpatchedVulnerabilities() {
    try {
      const result = await db.query(`
        SELECT COUNT(*) 
        FROM correlated_vulnerabilityassessment
        WHERE patch_available = 'Yes' 
        AND (remediation_status NOT IN ('Resolved') OR remediation_status IS NULL)
      `);
      
      return { success: true, count: parseInt(result.rows[0].count) };
    } catch (error) {
      console.error('Error getting unpatched vulnerabilities:', error);
      return { success: false, error: error.message };
    }
  }

  async getUnsupportedApplications() {
    try {
      const result = await db.query('SELECT COUNT(*) FROM generated_nonsupportedapp_full');
      return { success: true, count: parseInt(result.rows[0].count) };
    } catch (error) {
      console.error('Error getting unsupported applications:', error);
      return { success: false, error: error.message };
    }
  }

  async getExternalFacingAssets() {
    try {
      const result = await db.query('SELECT COUNT(DISTINCT ip) FROM generated_externalfacingip_full');
      return { success: true, count: parseInt(result.rows[0].count) };
    } catch (error) {
      console.error('Error getting external facing assets:', error);
      return { success: false, error: error.message };
    }
  }

  async getTotalEndpoints() {
    try {
      const result = await db.query('SELECT COUNT(*) FROM generated_endpoint_customsites');
      return { success: true, count: parseInt(result.rows[0].count) };
    } catch (error) {
      console.error('Error getting total endpoints:', error);
      return { success: false, error: error.message };
    }
  }

  async getUniqueUsers() {
    try {
      const result = await db.query('SELECT COUNT(DISTINCT email) FROM generated_userlist_withmanagernames');
      return { success: true, count: parseInt(result.rows[0].count) };
    } catch (error) {
      console.error('Error getting unique users:', error);
      return { success: false, error: error.message };
    }
  }

  async getExpiredFirewalls() {
  try {
    const result = await db.query(`
      SELECT COUNT(*) 
      FROM generated_firewallsample_clean 
      WHERE end_of_support_date < CURRENT_DATE::text
    `);
    return { success: true, count: parseInt(result.rows[0].count) };
  } catch (error) {
    console.error('Error getting expired firewalls:', error);
    try {
      return { success: true, count: 0 };
    } catch (fallbackError) {
      return { success: false, error: error.message };
    }
  }
}

  // Chart Data Methods
  async getVulnerabilitiesBySeverity() {
    try {
      const result = await db.query(`
        SELECT 
          COALESCE(severity, 'None') as severity,
          COUNT(*) as count
        FROM correlated_vulnerabilityassessment
        GROUP BY severity
        ORDER BY 
          CASE 
            WHEN severity = 'Critical' THEN 1
            WHEN severity = 'High' THEN 2
            WHEN severity = 'Medium' THEN 3
            WHEN severity = 'Low' THEN 4
            ELSE 5
          END
      `);
      
      return { 
        success: true, 
        data: result.rows.map(row => ({
          severity: row.severity,
          count: parseInt(row.count)
        }))
      };
    } catch (error) {
      console.error('Error getting vulnerabilities by severity:', error);
      return { success: false, error: error.message };
    }
  }

 async getVulnerabilitiesOverTime() {
  try {
    console.log('Getting vulnerabilities over time');
    
    // Get all vulnerability dates
    const result = await db.query(`
      SELECT discovered_date 
      FROM correlated_vulnerabilityassessment
      WHERE discovered_date IS NOT NULL
    `);
    
    console.log(`Query returned ${result.rows.length} rows`);
    
   
    if (result.rows.length > 0) {
      const monthCounts = {};
      
      result.rows.forEach(row => {
        const dateStr = row.discovered_date;
        const monthKey = dateStr.substring(0, 7); 
   
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      });
      const data = Object.keys(monthCounts)
        .sort()
        .map(month => ({
          month,
          count: monthCounts[month]
        }));
      
      console.log(`Grouped into ${data.length} months`);
      
      return {
        success: true,
        data
      };
    } else {
      return {
        success: true,
        data: [],
        message: "No vulnerability date data available"
      };
    }
  } catch (error) {
    console.error('Error getting vulnerabilities over time:', error);
    return { success: false, error: error.message };
  }
}
  async getApplicationRiskDistribution() {
    try {
      const result = await db.query(`
        SELECT 
          COALESCE(criticality, 'Unknown') as criticality,
          COUNT(*) as count
        FROM generated_applicationsample_full_v2
        GROUP BY criticality
        ORDER BY COUNT(*) DESC
      `);
      
      return { 
        success: true, 
        data: result.rows.map(row => ({
          criticality: row.criticality,
          count: parseInt(row.count)
        }))
      };
    } catch (error) {
      console.error('Error getting application risk distribution:', error);
      return { success: false, error: error.message };
    }
  }

  async getUsersByDepartment() {
    try {
      const result = await db.query(`
        SELECT 
          COALESCE(department, 'Unknown') as department,
          COUNT(DISTINCT email) as count
        FROM generated_userlist_withmanagernames
        GROUP BY department
        ORDER BY COUNT(DISTINCT email) DESC
      `);
      
      return { 
        success: true, 
        data: result.rows.map(row => ({
          department: row.department,
          count: parseInt(row.count)
        }))
      };
    } catch (error) {
      console.error('Error getting users by department:', error);
      return { success: false, error: error.message };
    }
  }

  async getExternalIPsByCountry() {
    try {
      const result = await db.query(`
        SELECT 
          COALESCE(country, 'Unknown') as country,
          COUNT(DISTINCT ip) as count
        FROM generated_externalfacingip_full
        GROUP BY country
        ORDER BY COUNT(DISTINCT ip) DESC
      `);
      
      return { 
        success: true, 
        data: result.rows.map(row => ({
          country: row.country,
          count: parseInt(row.count)
        }))
      };
    } catch (error) {
      console.error('Error getting external IPs by country:', error);
      return { success: false, error: error.message };
    }
  }

 async getUnsupportedAppsByBU() {
  try {
    console.log('Getting unsupported apps by BU');
    
    const result = await db.query(`
      SELECT 
        COALESCE(bu_name, 'Unknown') as business_unit,
        COUNT(*) as count
      FROM generated_nonsupportedapp_full
      GROUP BY bu_name
      ORDER BY COUNT(*) DESC
    `);
    
    return { 
      success: true, 
      data: result.rows.map(row => ({
        business_unit: row.business_unit,
        count: parseInt(row.count)
      }))
    };
  } catch (error) {
    console.error('Error getting unsupported apps by BU:', error);
    }
  }


  async getFirewallStatusByLocation() {
    try {
        console.log('Getting firewall status by location');

        const result = await db.query(`
        SELECT 
            COALESCE(country, 'Unknown') as location,
            COALESCE(brand, 'Unknown') as os,
            COUNT(*) as total,
            COUNT(CASE 
            WHEN end_of_support_date IS NOT NULL 
            AND end_of_support_date < CURRENT_DATE::text 
            THEN 1 
            END) as expired
        FROM generated_firewallsample_clean
        GROUP BY country, brand
        ORDER BY country, brand
        `);
        
        return { 
        success: true, 
        data: result.rows.map(row => ({
            location: row.location,
            os: row.os,
            total: parseInt(row.total),
            expired: parseInt(row.expired || 0)
        }))
        };
    } catch (error) {
        console.error('Error getting firewall status by location:', error);  
        } 
    }
    
  async getAllMetrics() {
    try {
      const [
        totalVulnerabilities,
        highSeverity,
        unpatchedVulnerabilities,
        unsupportedApps,
        externalFacingAssets,
        totalEndpoints,
        uniqueUsers,
        expiredFirewalls
      ] = await Promise.all([
        this.getTotalVulnerabilities(),
        this.getHighSeverityVulnerabilities(),
        this.getUnpatchedVulnerabilities(),
        this.getUnsupportedApplications(),
        this.getExternalFacingAssets(),
        this.getTotalEndpoints(),
        this.getUniqueUsers(),
        this.getExpiredFirewalls()
      ]);

      return {
        success: true,
        data: {
          total_vulnerabilities: totalVulnerabilities.success ? totalVulnerabilities.count : null,
          high_severity_vulnerabilities: highSeverity.success ? highSeverity.count : null,
          unpatched_vulnerabilities: unpatchedVulnerabilities.success ? unpatchedVulnerabilities.count : null,
          unsupported_applications: unsupportedApps.success ? unsupportedApps.count : null,
          external_facing_assets: externalFacingAssets.success ? externalFacingAssets.count : null,
          total_endpoints: totalEndpoints.success ? totalEndpoints.count : null,
          unique_users: uniqueUsers.success ? uniqueUsers.count : null,
          expired_firewalls: expiredFirewalls.success ? expiredFirewalls.count : null
        }
      };
    } catch (error) {
      console.error('Error getting all metrics:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new KpiModel();