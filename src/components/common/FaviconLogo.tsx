import React, { useState } from 'react';
import { Globe, Database, Key, Cloud, Server, FileText, Shield } from 'lucide-react';
import { CredentialType } from '../../types';

interface FaviconLogoProps {
  url?: string;
  name: string;
  type: CredentialType;
  size?: 'sm' | 'md' | 'lg';
}

export const FaviconLogo: React.FC<FaviconLogoProps> = ({ url, name, type, size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  // Extract clean domain for favicon lookup
  let domain = '';
  if (url) {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      domain = parsed.hostname;
    } catch {
      domain = '';
    }
  }

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  // Specific fallback icon based on CredentialType
  const renderFallbackIcon = () => {
    switch (type) {
      case 'DATABASE':
        return <Database className={`${iconSizes} text-emerald-400`} />;
      case 'API_KEYS':
        return <Key className={`${iconSizes} text-amber-400`} />;
      case 'CLOUD':
        return <Cloud className={`${iconSizes} text-sky-400`} />;
      case 'SERVER':
        return <Server className={`${iconSizes} text-indigo-400`} />;
      case 'SECURE_NOTES':
        return <FileText className={`${iconSizes} text-purple-400`} />;
      case 'WEBSITE':
      default:
        // Render first letter of app name if available
        if (name && name.trim().length > 0) {
          return <span className="font-bold text-blue-400 uppercase">{name.trim().charAt(0)}</span>;
        }
        return <Globe className={`${iconSizes} text-blue-400`} />;
    }
  };

  // If domain is present and no error occurred, load DuckDuckGo / Google favicon service
  const faviconUrl = domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : null;

  return (
    <div
      className={`${sizeClasses} rounded-xl flex items-center justify-center shrink-0 border border-slate-700/60 bg-slate-800/80 shadow-inner overflow-hidden`}
    >
      {faviconUrl && !imgError ? (
        <img
          src={faviconUrl}
          alt={name}
          className="w-full h-full object-contain p-1.5"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        renderFallbackIcon()
      )}
    </div>
  );
};
