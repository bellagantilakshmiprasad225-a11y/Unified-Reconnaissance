import React, { useState } from 'react';
import {
  Wrench,
  Globe,
  Terminal,
  Network,
  Shield,
  Mail,
  AtSign,
  Building2,
  UserCheck,
  Share2,
  Image,
  MapPin,
  Camera,
  Cpu,
  FileText,
  Search
} from 'lucide-react';

import { WhoisTool } from '../components/intelligence/WhoisTool';
import { DnsTool } from '../components/intelligence/DnsTool';
import { ReverseDnsTool } from '../components/intelligence/ReverseDnsTool';
import { IpInfoTool } from '../components/intelligence/IpInfoTool';
import { EmailIntelTool } from '../components/intelligence/EmailIntelTool';
import { UsernameIntelTool } from '../components/intelligence/UsernameIntelTool';
import { CompanyIntelTool } from '../components/intelligence/CompanyIntelTool';
import { PeopleIntelTool } from '../components/intelligence/PeopleIntelTool';
import { SocialIntelTool } from '../components/intelligence/SocialIntelTool';
import { ReverseImageTool } from '../components/intelligence/ReverseImageTool';
import { MapsTool } from '../components/intelligence/MapsTool';
import { ScreenshotEvidenceTool } from '../components/intelligence/ScreenshotEvidenceTool';
import { TechDetectionTool } from '../components/intelligence/TechDetectionTool';
import { MetadataExtractorTool } from '../components/intelligence/MetadataExtractorTool';
import { QueryBuilderTool } from '../components/intelligence/QueryBuilderTool';

export const toolModules = [
  { id: 'whois', name: 'WHOIS Lookup', category: 'Domain', icon: Globe, component: WhoisTool },
  { id: 'dns', name: 'DNS Propagation', category: 'DNS', icon: Terminal, component: DnsTool },
  { id: 'rdns', name: 'Reverse DNS', category: 'Network', icon: Network, component: ReverseDnsTool },
  { id: 'ipinfo', name: 'IP Geolocation & ASN', category: 'Network', icon: Shield, component: IpInfoTool },
  { id: 'email', name: 'Email Intelligence', category: 'PII / Email', icon: Mail, component: EmailIntelTool },
  { id: 'username', name: 'Username Footprint', category: 'Social', icon: AtSign, component: UsernameIntelTool },
  { id: 'company', name: 'Company Intelligence', category: 'Corporate', icon: Building2, component: CompanyIntelTool },
  { id: 'people', name: 'People Intelligence', category: 'Identity', icon: UserCheck, component: PeopleIntelTool },
  { id: 'social', name: 'Social Media Hub', category: 'Social', icon: Share2, component: SocialIntelTool },
  { id: 'revimage', name: 'Reverse Image Search', category: 'Visual OSINT', icon: Image, component: ReverseImageTool },
  { id: 'maps', name: 'GIS Maps & Location', category: 'GEO OSINT', icon: MapPin, component: MapsTool },
  { id: 'screenshot', name: 'Screenshot Evidence', category: 'Evidence', icon: Camera, component: ScreenshotEvidenceTool },
  { id: 'tech', name: 'Technology Detection', category: 'Web Stack', icon: Cpu, component: TechDetectionTool },
  { id: 'metadata', name: 'Metadata Extractor', category: 'Document', icon: FileText, component: MetadataExtractorTool },
  { id: 'dorks', name: 'Advanced Query Builder', category: 'Dorks', icon: Search, component: QueryBuilderTool },
];

export const IntelligenceTools: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string>('whois');
  const [searchTerm, setSearchTerm] = useState('');

  const activeTool = toolModules.find((t) => t.id === activeToolId) || toolModules[0];
  const ActiveComponent = activeTool.component;

  const filteredTools = toolModules.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-400" /> Professional Intelligence Tools
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          15 defensive OSINT modules for domain analysis, network reconnaissance, and query generation.
        </p>
      </div>

      {/* Tool Module Selection Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            Select Tool Module ({toolModules.length})
          </h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter tool modules..."
            className="w-48 h-8 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeToolId === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveToolId(tool.id)}
                className={`p-3 rounded-lg border text-left transition-all font-mono group ${
                  isActive
                    ? 'bg-cyan-600/20 text-cyan-300 border-cyan-500/50 shadow-glow-cyan'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-950 text-slate-500">
                    {tool.category}
                  </span>
                </div>
                <p className="text-xs font-bold truncate">{tool.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tool Render Area */}
      <div className="pt-2">
        <ActiveComponent />
      </div>
    </div>
  );
};
