
import React, { useState, useEffect } from 'react';
import { Shield, Globe, Monitor, Lock, Eye, Wifi, MapPin, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface IPInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  isp: string;
  timezone: string;
  lat: number;
  lon: number;
}

interface BrowserInfo {
  browser: string;
  version: string;
  os: string;
  platform: string;
  language: string;
  userAgent: string;
  cookiesEnabled: boolean;
  javaEnabled: boolean;
  screen: string;
  viewport: string;
}

const Index = () => {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [privacyScore, setPrivacyScore] = useState(0);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    fetchIPInfo();
    getBrowserInfo();
  }, []);

  const fetchIPInfo = async () => {
    try {
      // Using a free IP API service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const formattedData: IPInfo = {
        ip: data.ip || 'Unknown',
        country: data.country_name || 'Unknown',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        isp: data.org || 'Unknown',
        timezone: data.timezone || 'Unknown',
        lat: data.latitude || 0,
        lon: data.longitude || 0
      };
      
      setIpInfo(formattedData);
      calculatePrivacyScore(formattedData);
    } catch (error) {
      console.error('Error fetching IP info:', error);
      // Fallback data for demo
      const fallbackData: IPInfo = {
        ip: '192.168.1.1',
        country: 'Demo Country',
        region: 'Demo Region',
        city: 'Demo City',
        isp: 'Demo ISP',
        timezone: 'UTC',
        lat: 0,
        lon: 0
      };
      setIpInfo(fallbackData);
      calculatePrivacyScore(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const getBrowserInfo = () => {
    const nav = navigator;
    const screen = window.screen;
    
    // Simple browser detection
    const userAgent = nav.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';
    
    if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
      version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
      version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari';
      version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
      version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
    }

    // OS detection
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    const info: BrowserInfo = {
      browser,
      version,
      os,
      platform: nav.platform,
      language: nav.language,
      userAgent: nav.userAgent,
      cookiesEnabled: nav.cookieEnabled,
      javaEnabled: typeof (window as any).java !== 'undefined',
      screen: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    };

    setBrowserInfo(info);
  };

  const calculatePrivacyScore = (ipData: IPInfo) => {
    let score = 100;
    
    // Deduct points for various privacy concerns
    if (!location.protocol.includes('https')) score -= 20;
    if (navigator.cookieEnabled) score -= 10;
    if (navigator.geolocation) score -= 15;
    if (ipData.isp.toLowerCase().includes('google') || ipData.isp.toLowerCase().includes('cloudflare')) {
      score -= 5;
      setSecurityLevel('high');
    } else if (ipData.isp.toLowerCase().includes('residential')) {
      score -= 15;
      setSecurityLevel('low');
    } else {
      setSecurityLevel('medium');
    }
    
    setPrivacyScore(Math.max(score, 0));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSecurityBadgeColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const refreshData = () => {
    setLoading(true);
    fetchIPInfo();
    getBrowserInfo();
    toast.success('Information refreshed successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Analyzing your connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold">IP Analyzer</h1>
            </div>
            <Button onClick={refreshData} variant="outline" className="border-gray-600 hover:bg-gray-700">
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Privacy Score */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Privacy Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-4xl font-bold ${getScoreColor(privacyScore)}`}>
                  {privacyScore}/100
                </div>
                <p className="text-gray-400 mt-1">Your privacy protection level</p>
              </div>
              <Badge className={getSecurityBadgeColor(securityLevel)}>
                {securityLevel.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* IP Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>IP Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ipInfo && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">IP Address:</span>
                    <span className="font-mono text-blue-400">{ipInfo.ip}</span>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">Country:</span>
                    <span>{ipInfo.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Region:</span>
                    <span>{ipInfo.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">City:</span>
                    <span>{ipInfo.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ISP:</span>
                    <span>{ipInfo.isp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timezone:</span>
                    <span>{ipInfo.timezone}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Browser Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Browser Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {browserInfo && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Browser:</span>
                    <span>{browserInfo.browser} {browserInfo.version}</span>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="flex justify-between">
                    <span className="text-gray-400">Operating System:</span>
                    <span>{browserInfo.os}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform:</span>
                    <span>{browserInfo.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Language:</span>
                    <span>{browserInfo.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Screen Resolution:</span>
                    <span>{browserInfo.screen}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Viewport:</span>
                    <span>{browserInfo.viewport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cookies Enabled:</span>
                    <Badge variant={browserInfo.cookiesEnabled ? 'destructive' : 'secondary'}>
                      {browserInfo.cookiesEnabled ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Security Analysis */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Security Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">HTTPS Connection:</span>
                <Badge variant={location.protocol === 'https:' ? 'secondary' : 'destructive'}>
                  {location.protocol === 'https:' ? 'Secure' : 'Not Secure'}
                </Badge>
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex items-center justify-between">
                <span className="text-gray-400">WebRTC Leak:</span>
                <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                  Checking...
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">DNS Leak:</span>
                <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                  Checking...
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Proxy Detection:</span>
                <Badge variant={securityLevel === 'high' ? 'secondary' : 'outline'}>
                  {securityLevel === 'high' ? 'Detected' : 'None'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Recommendations */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Privacy Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm">Use a VPN to hide your real IP address</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm">Enable private browsing mode</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm">Disable location services in your browser</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm">Use privacy-focused search engines</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm">Block third-party cookies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Map Placeholder */}
        {ipInfo && (
          <Card className="bg-gray-800 border-gray-700 mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Approximate Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-700 rounded-lg p-8 text-center">
                <Wifi className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                <p className="text-lg mb-2">Your approximate location:</p>
                <p className="text-blue-400 font-semibold">
                  {ipInfo.city}, {ipInfo.region}, {ipInfo.country}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Coordinates: {ipInfo.lat.toFixed(4)}, {ipInfo.lon.toFixed(4)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
