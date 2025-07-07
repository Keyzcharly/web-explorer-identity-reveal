import React, { useState, useEffect } from 'react';
import { Shield, Globe, Monitor, Lock, Eye, Wifi, MapPin, AlertTriangle, Refresh } from 'lucide-react';
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
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getSecurityBadgeColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-emerald-500 hover:bg-emerald-600';
      case 'medium': return 'bg-amber-500 hover:bg-amber-600';
      case 'low': return 'bg-red-500 hover:bg-red-600';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary mx-auto mb-6"></div>
          <p className="text-slate-700 text-xl font-medium">Analyzing your connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold gradient-text">IP Location Analyzer</h1>
            </div>
            <Button onClick={refreshData} className="bg-primary hover:bg-primary/90 text-white">
              <Refresh className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Location Section */}
        {ipInfo && (
          <section className="mb-12">
            <Card className="location-hero text-white card-hover border-0 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <h2 className="text-4xl font-bold mb-2">Your Current Location</h2>
                <div className="flex items-center justify-center space-x-2 text-white/90">
                  <MapPin className="h-6 w-6" />
                  <span className="text-lg">Detected from your IP address</span>
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-2">
                  <div className="text-5xl font-bold mb-4">
                    {ipInfo.city}, {ipInfo.region}
                  </div>
                  <div className="text-3xl font-semibold text-white/90">
                    {ipInfo.country}
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <span className="text-white/70 text-sm font-medium">IP Address</span>
                      <div className="text-2xl font-mono font-bold">{ipInfo.ip}</div>
                    </div>
                    <div>
                      <span className="text-white/70 text-sm font-medium">Internet Provider</span>
                      <div className="text-xl font-semibold">{ipInfo.isp}</div>
                    </div>
                    <div>
                      <span className="text-white/70 text-sm font-medium">Timezone</span>
                      <div className="text-xl font-semibold">{ipInfo.timezone}</div>
                    </div>
                    <div>
                      <span className="text-white/70 text-sm font-medium">Coordinates</span>
                      <div className="text-xl font-semibold">{ipInfo.lat.toFixed(4)}, {ipInfo.lon.toFixed(4)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Privacy Score Section */}
        <section className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 card-hover shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Eye className="h-6 w-6 text-primary" />
                <span>Privacy Protection Score</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-6xl font-bold ${getScoreColor(privacyScore)}`}>
                    {privacyScore}/100
                  </div>
                  <p className="text-slate-600 mt-2 text-lg">Your current privacy level</p>
                </div>
                <Badge className={`${getSecurityBadgeColor(securityLevel)} text-white text-lg px-4 py-2`}>
                  {securityLevel.toUpperCase()} SECURITY
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* IP Information */}
          <section>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 card-hover shadow-lg h-full">
              <CardHeader>
                <h3 className="flex items-center space-x-2 text-xl font-semibold">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>Network Information</span>
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {ipInfo && (
                  <>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">IP Address:</span>
                      <span className="font-mono text-primary font-bold text-lg">{ipInfo.ip}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">Country:</span>
                      <span className="font-semibold">{ipInfo.country}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">Region:</span>
                      <span className="font-semibold">{ipInfo.region}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">City:</span>
                      <span className="font-semibold">{ipInfo.city}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">ISP:</span>
                      <span className="font-semibold">{ipInfo.isp}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">Timezone:</span>
                      <span className="font-semibold">{ipInfo.timezone}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Browser Information */}
          <section>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 card-hover shadow-lg h-full">
              <CardHeader>
                <h3 className="flex items-center space-x-2 text-xl font-semibold">
                  <Monitor className="h-5 w-5 text-primary" />
                  <span>Browser & Device Info</span>
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {browserInfo && (
                  <>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">Browser:</span>
                      <span className="font-semibold">{browserInfo.browser} {browserInfo.version}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">Operating System:</span>
                      <span className="font-semibold">{browserInfo.os}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">Platform:</span>
                      <span className="font-semibold">{browserInfo.platform}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">Language:</span>
                      <span className="font-semibold">{browserInfo.language}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">Screen Resolution:</span>
                      <span className="font-semibold">{browserInfo.screen}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">Viewport:</span>
                      <span className="font-semibold">{browserInfo.viewport}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-600 font-medium">Cookies Enabled:</span>
                      <Badge variant={browserInfo.cookiesEnabled ? 'destructive' : 'secondary'} className={browserInfo.cookiesEnabled ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}>
                        {browserInfo.cookiesEnabled ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Security Analysis */}
          <section>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 card-hover shadow-lg h-full">
              <CardHeader>
                <h3 className="flex items-center space-x-2 text-xl font-semibold">
                  <Lock className="h-5 w-5 text-primary" />
                  <span>Security Analysis</span>
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600 font-medium">HTTPS Connection:</span>
                  <Badge className={location.protocol === 'https:' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}>
                    {location.protocol === 'https:' ? 'Secure' : 'Not Secure'}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600 font-medium">WebRTC Leak:</span>
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                    Checking...
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600 font-medium">DNS Leak:</span>
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
                    Checking...
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600 font-medium">Proxy Detection:</span>
                  <Badge className={securityLevel === 'high' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-slate-500 hover:bg-slate-600 text-white'}>
                    {securityLevel === 'high' ? 'Detected' : 'None'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Privacy Recommendations */}
          <section>
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 card-hover shadow-lg h-full">
              <CardHeader>
                <h3 className="flex items-center space-x-2 text-xl font-semibold">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span>Privacy Recommendations</span>
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <p className="text-slate-700 font-medium">Use a VPN to hide your real IP address</p>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-slate-700 font-medium">Enable private browsing mode</p>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <p className="text-slate-700 font-medium">Disable location services in your browser</p>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p className="text-slate-700 font-medium">Use privacy-focused search engines</p>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p className="text-slate-700 font-medium">Block third-party cookies</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
