export interface OSINTSearchLink {
  platform: string;
  category: string;
  url: string;
  description: string;
  iconName?: string;
}

export function generateWhoisLinks(domain: string): OSINTSearchLink[] {
  const enc = encodeURIComponent(domain.trim());
  return [
    {
      platform: 'ICANN Lookup',
      category: 'WHOIS',
      url: `https://lookup.icann.org/en/lookup?q=${enc}`,
      description: 'Official ICANN domain registration data lookup',
    },
    {
      platform: 'Whois.com',
      category: 'WHOIS',
      url: `https://www.whois.com/whois/${enc}`,
      description: 'Public WHOIS record & registrar information',
    },
    {
      platform: 'ViewDNS.info WHOIS',
      category: 'WHOIS',
      url: `https://viewdns.info/whois/?domain=${enc}`,
      description: 'Detailed WHOIS and domain history info',
    },
    {
      platform: 'SecurityTrails',
      category: 'WHOIS & DNS',
      url: `https://securitytrails.com/domain/${enc}/dns`,
      description: 'Historical DNS records and domain infrastructure',
    },
  ];
}

export function generateDnsLinks(domain: string): OSINTSearchLink[] {
  const enc = encodeURIComponent(domain.trim());
  return [
    {
      platform: 'DNSChecker',
      category: 'DNS Propagation',
      url: `https://dnschecker.org/#A/${enc}`,
      description: 'Global DNS A, MX, TXT, NS record propagation',
    },
    {
      platform: 'MXToolbox',
      category: 'MX & DNS',
      url: `https://mxtoolbox.com/SuperTool.aspx?action=mx%3a${enc}`,
      description: 'Mail server records and MX health check',
    },
    {
      platform: 'Google Admin Toolbox Dig',
      category: 'DNS Dig',
      url: `https://toolbox.googleapps.com/apps/dig/#A/${enc}`,
      description: 'Official Google web-based DNS lookup utility',
    },
    {
      platform: 'Cloudflare 1.1.1.1 DNS Query',
      category: 'DNS Query',
      url: `https://one.one.one.one/dns-query?name=${enc}`,
      description: 'Fast DNS resolution test',
    },
  ];
}

export function generateIpLinks(ip: string): OSINTSearchLink[] {
  const enc = encodeURIComponent(ip.trim());
  return [
    {
      platform: 'IPinfo.io',
      category: 'IP Geolocation & ASN',
      url: `https://ipinfo.io/${enc}`,
      description: 'Public IP details, ISP, ASN, and general location',
    },
    {
      platform: 'ARIN / RIPE Whois',
      category: 'IP WHOIS',
      url: `https://whois.arin.net/rest/nets;q=${enc}?showDetails=true`,
      description: 'Regional Internet Registry IP allocation data',
    },
    {
      platform: 'AbuseIPDB',
      category: 'IP Reputation',
      url: `https://www.abuseipdb.com/check/${enc}`,
      description: 'Public abuse reporting & threat score history',
    },
    {
      platform: 'Shodan (Public Query)',
      category: 'Host Info',
      url: `https://www.shodan.io/host/${enc}`,
      description: 'Publicly indexed host details and services',
    },
  ];
}

export function generateEmailLinks(email: string): OSINTSearchLink[] {
  const enc = encodeURIComponent(email.trim());
  const domainPart = email.split('@')[1] ? encodeURIComponent(email.split('@')[1]) : '';
  return [
    {
      platform: 'Google Search Dork',
      category: 'Public Exposure',
      url: `https://www.google.com/search?q=%22${enc}%22`,
      description: 'Search for exact email mentions across public websites',
    },
    {
      platform: 'Have I Been Pwned',
      category: 'Data Breach Exposure',
      url: `https://haveibeenpwned.com/account/${enc}`,
      description: 'Check public data breach disclosure registries',
    },
    {
      platform: 'GitHub Search',
      category: 'Code Repositories',
      url: `https://github.com/search?q=%22${enc}%22&type=code`,
      description: 'Search public GitHub commits and code listings',
    },
    {
      platform: 'Hunter.io Domain Search',
      category: 'Corporate Pattern',
      url: `https://hunter.io/search/${domainPart}`,
      description: 'Find public email formats for target domain',
    },
  ];
}

export function generateUsernameLinks(username: string): OSINTSearchLink[] {
  const clean = username.replace(/^@/, '').trim();
  const enc = encodeURIComponent(clean);
  return [
    {
      platform: 'GitHub',
      category: 'Developer Profile',
      url: `https://github.com/${enc}`,
      description: 'Public GitHub profile & public repositories',
    },
    {
      platform: 'X (Twitter)',
      category: 'Social Media',
      url: `https://x.com/${enc}`,
      description: 'Public X timeline & media',
    },
    {
      platform: 'Reddit User',
      category: 'Community Profile',
      url: `https://www.reddit.com/user/${enc}`,
      description: 'Public Reddit posts & comments',
    },
    {
      platform: 'Keybase Profile',
      category: 'Identity Verification',
      url: `https://keybase.io/${enc}`,
      description: 'Cryptographic public identity claims',
    },
    {
      platform: 'Google Search Username',
      category: 'Global Web Presence',
      url: `https://www.google.com/search?q=%22${enc}%22`,
      description: 'Find public mentions of username across the web',
    },
  ];
}

export function generateCompanyLinks(company: string): OSINTSearchLink[] {
  const enc = encodeURIComponent(company.trim());
  return [
    {
      platform: 'Google Search',
      category: 'Web Search',
      url: `https://www.google.com/search?q=${enc}`,
      description: 'General web search for company information',
    },
    {
      platform: 'LinkedIn Company Search',
      category: 'Professional Network',
      url: `https://www.linkedin.com/search/results/companies/?keywords=${enc}`,
      description: 'Official LinkedIn company profiles',
    },
    {
      platform: 'Crunchbase Search',
      category: 'Corporate Intelligence',
      url: `https://www.crunchbase.com/textsearch?q=${enc}`,
      description: 'Funding, leadership, and organization overview',
    },
    {
      platform: 'OpenCorporates',
      category: 'Legal Registry',
      url: `https://opencorporates.com/companies?q=${enc}`,
      description: 'Global corporate registration database',
    },
  ];
}

export function generatePeopleLinks(personName: string): OSINTSearchLink[] {
  const enc = encodeURIComponent(personName.trim());
  return [
    {
      platform: 'Google Search',
      category: 'General Search',
      url: `https://www.google.com/search?q=%22${enc}%22`,
      description: 'Exact match web search for public references',
    },
    {
      platform: 'LinkedIn People Search',
      category: 'Professional Profile',
      url: `https://www.linkedin.com/search/results/people/?keywords=${enc}`,
      description: 'LinkedIn public professional profiles',
    },
    {
      platform: 'Google Scholar',
      category: 'Academic & Publications',
      url: `https://scholar.google.com/scholar?q=${enc}`,
      description: 'Research papers, patents, and academic citations',
    },
  ];
}

export function generateMapLinks(query: string): OSINTSearchLink[] {
  const enc = encodeURIComponent(query.trim());
  return [
    {
      platform: 'Google Maps',
      category: 'Satellite & Maps',
      url: `https://www.google.com/maps/search/${enc}`,
      description: 'Google Maps address, location, and street view',
    },
    {
      platform: 'OpenStreetMap',
      category: 'Open GIS Data',
      url: `https://www.openstreetmap.org/search?query=${enc}`,
      description: 'Open source collaborative world map',
    },
    {
      platform: 'Wikimapia',
      category: 'Geographic Annotations',
      url: `https://wikimapia.org/#lang=en&q=${enc}`,
      description: 'User-annotated geographic points of interest',
    },
  ];
}
