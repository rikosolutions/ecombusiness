import React, { useState, useMemo, useEffect ,useRef} from 'react';
import api from "./api"; 
// import  LSIcon  from '../assets/LateShipment-Logo.svg';
import { 
  Search, 
  Building, 
  Mail, 
  Phone, 
  ExternalLink, 
  MapPin, 
  DollarSign,
  ChevronDown,
  ChevronUp,
  User,
  Globe,
  Code,
  Truck,
  Shield,
  RotateCcw,
  TrendingUp,
  Star,
  Sparkles,
  Filter,
  Grid,
  List,
  Eye,
  Activity,
  BarChart3,
  UserCheck,
  Target,
  Users,
  Award,
  Mic,
  X
} from 'lucide-react';

// Example backend JSON (replace with real API call)
const backendResponse = {
  results: [
    {
      "First Name": "Matthew",
      "Last Name": "Breech",
      Brand: "Botanica",
      Website: "botanica.co",
      Business: "Ecommerce",
      Comment: "https://www.tallgrass.ca/brand-partners",
      Industry: "Candles / Home Fragrance Retailer",
      Location: "Florida, USA",
      Title: "Co-Founder and CEO",
      "LI profile":
        "https://www.linkedin.com/in/matthew-breech-84042a5/?originalSubdomain=ca",
      "email id": "matt@tallgrass.ca",
      "Revenue/month": " 2,080,000.00/month",
      "Revenue/month.1": 2080000.0,
      carriers: null,
      "tech stack": "WooCommerce",
      "Post Purchase TechStack": "Internal tracking page/email",
      "Return Solutions ": "Manual/email-based",
      "Shipping Insurance": "Not specified",
      "Phone No": null,
      Linkedin: true,
      "Email 1 Sent": true,
      "Email 2 Sent": false,
      "Email 3 Sent": false,
      Called: false,
    },
    {
      "First Name": "Matthew",
      "Last Name": "Wong",
      Brand: "Claymoo",
      Website: "claymoo.com",
      Business: "Ecommerce",
      Comment: null,
      Industry: "/ Toys & Hobbies / Arts & Crafts",
      Location: "Markham, ON, Canada",
      Title: "Business Development",
      "LI profile": "https://www.linkedin.com/in/ithinkwong/",
      "email id": "matt@claymoo.com",
      "Revenue/month": " 407,924.82/month",
      "Revenue/month.1": 407924.82,
      carriers: null,
      "tech stack": "Shopify,Klaviyo",
      "Post Purchase TechStack": "AfterShip mentioned",
      "Return Solutions ": "Manual/email-based",
      "Shipping Insurance": "Not specified",
      "Phone No": null,
      Linkedin: true,
      "Email 1 Sent": true,
      "Email 2 Sent": false,
      "Email 3 Sent": false,
      Called: false,
    },
  ],
};

// 🔹 Normalize backend JSON to match component structure
const normalizeData = (item) => ({
  firstName: item["First Name"] || "",
  lastName: item["Last Name"] || "",
  brand: item["Brand"] || "",
  website: item["Website"] || "",
  business: item["Business"] || "",
  comment: item["Comment"] || "",
  industry: item["Industry"] || "",
  location: item["Location"] || "",
  title: item["Title"] || "",
  liProfile: item["LI profile"] || "",
  emailId: item["email id"] || "",
  revenuePerMonth:
    item["Revenue/month.1"] != null
      ? `$${item["Revenue/month.1"].toLocaleString()}`
      : item["Revenue/month"] || "",
  carriers: item["carriers"] || "",
  techStack: item["tech stack"] || "",
  postPurchaseTechStack: item["Post Purchase TechStack"] || "",
  returnSolutions: item["Return Solutions "] || "",
  shipping: item["Shipping"] || "",
  insurance: item["Shipping Insurance"] || "",
  phoneNo: item["Phone No"] || "",
  linkedin: item["LI profile"] || "",
  email1Sent: item["Email 1 Sent"] || false,
  email2Sent: item["Email 2 Sent"] || false,
  email3Sent: item["Email 3 Sent"] || false,
  called: item["Called"] || false,
});

const BusinessSearchApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'compact'
  const [sortBy, setSortBy] = useState('revenue'); // 'revenue', 'name', 'engagement'
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [animationStep, setAnimationStep] = useState(0);
  const [data, setData] = useState([]); // ✅ API data state
  const [loading, setLoading] = useState(true);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/getAllData"); // token auto-attached
        setData(res.data.results || []); // assuming backend returns { results: [...] }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //Initialize Web Speech API inside useEffect:
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
  
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setListening(false);
    };
  
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  
    recognitionRef.current = recognition;
  }, []);
  

  // 🔹 Process backend data
  const processedData = useMemo(() => {
    return data.map(normalizeData);
  }, [data]);

  //Add a handler to start/stop voice recognition:
  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  // Animation effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setAnimationStep(prev => (prev + 1) % 100);
//     }, 50);
//     return () => clearInterval(timer);
//   }, []);
// 🔹 Fetch data from backend
useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Get unique industries for filter
  const industries = useMemo(() => {
    return ['all', ...new Set(processedData.map(item => item.industry))];
  }, [processedData]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = processedData;
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.firstName?.toLowerCase().includes(term) ||
        item.lastName.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        item.website?.toLowerCase().includes(term) ||
        item.industry?.toLowerCase().includes(term) ||   // optional: add industry too
        item.email?.toLowerCase().includes(term) 
      );
    }
    
    // Apply industry filter
    if (filterIndustry !== 'all') {
      filtered = filtered.filter(item => item.industry === filterIndustry);
    }
    
    // Sort data
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          const aRev = parseInt(a.revenuePerMonth.replace(/[$,]/g, '')) || 0;
          const bRev = parseInt(b.revenuePerMonth.replace(/[$,]/g, '')) || 0;
          return bRev - aRev;
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'engagement':
          const aEng = [a.email1Sent, a.email2Sent, a.email3Sent, a.called].filter(Boolean).length;
          const bEng = [b.email1Sent, b.email2Sent, b.email3Sent, b.called].filter(Boolean).length;
          return bEng - aEng;
        default:
          return 0;
      }
    });
  }, [searchTerm, filterIndustry, sortBy, processedData]);

  // Calculate engagement score
  const getEngagementScore = (item) => {
    const total = 4;
    const engaged = [item.email1Sent, item.email2Sent, item.email3Sent, item.called].filter(Boolean).length;
    return Math.round((engaged / total) * 100);
  };

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  const StatusBadge = ({ sent, label, icon: Icon }) => (
    <div className={`group relative inline-flex items-center px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 ${
      sent 
        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40' 
        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
    }`}>
      <Icon className="w-3 h-3 mr-1.5" />
      {label}
      {sent && <Sparkles className="w-3 h-3 ml-1 animate-pulse" />}
    </div>
  );

  const colorMap = {
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    blue: "from-blue-500 to-blue-600",
  };
  

//   const MetricCard = ({ icon: Icon, title, value, trend, color = 'blue' }) => (
//     <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-xl">
//       <div className="flex items-center justify-between mb-4">
//         <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 shadow-lg`}>
//           <Icon className="w-6 h-6 text-white" />
//         </div>
//         {trend && (
//           <div className="flex items-center text-green-600">
//             <TrendingUp className="w-4 h-4 mr-1" />
//             <span className="text-sm font-medium">+{trend}%</span>
//           </div>
//         )}
//       </div>
//       <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
//       <p className="text-2xl font-bold text-gray-900">{value}</p>
//     </div>
//   );
const MetricCard = ({ icon: Icon, title, value, trend, color = 'blue' }) => (
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">+{trend}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  const EngagementMeter = ({ score }) => (
    <div className="relative">
      <div className="flex items-center space-x-3">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              strokeWidth="3"
              fill="none"
              stroke="currentColor"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={score > 75 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500'}
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
              fill="none"
              stroke="currentColor"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold">{score}%</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Engagement</p>
          <p className="text-xs text-gray-500">
            {score > 75 ? 'Excellent' : score > 50 ? 'Good' : 'Needs Work'}
          </p>
        </div>
      </div>
    </div>
  );

  // Calculate summary stats
  const totalRevenue = processedData.reduce((sum, item) => {
    return sum + (parseInt(item.revenuePerMonth.replace(/[$,]/g, '')) || 0);
  }, 0);
  
  const avgEngagement = Math.round(
    processedData.reduce((sum, item) => sum + getEngagementScore(item), 0) / processedData.length
  );

  const highValueLeads = processedData.filter(item => 
    (parseInt(item.revenuePerMonth.replace(/[$,]/g, '')) || 0) > 40000
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {/* <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg"> className="p-3 bg-gray-100 rounded-2xl shadow-lg"*/}
            <div > 
              {/* <Activity className="w-8 h-8 text-white" /> */}
              {/* <img src="/LateShipment-Logo.svg" alt="Late Shipment Logo" className="inline-block mr-3 w-60 h-55" /> */}
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              <img src="/Ecom-North-logo.svg" alt="Ecom North Logo" className="inline-block mr-3 w-20 h-30" />Toronto Summit-Canada
              </h1>
              <p className="text-gray-600 text-lg">Advanced analytics for Lateshipment business relationships</p>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard 
              icon={DollarSign}
              title="Total Monthly Revenue"
              value={`$${(totalRevenue/1000).toFixed(0)}K`}
            //   trend="12"
              color="green"
            />
            <MetricCard 
              icon={Activity}
              title="Active Leads"
              value={processedData.length}
            //   trend="8"
              color="yellow"
            />
            <MetricCard 
              icon={Target}
              title="High Value Leads"
              value={highValueLeads}
            //   trend="15"
              color="purple"
            />
            <MetricCard 
              icon={UserCheck} //BarChart3
              title="Avg Engagement"
              value={`${avgEngagement}%`}
            //   trend="5"
              color="orange"
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            {/* <div>
            <Mic
                    onClick={handleMicClick}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer ${
                    listening ? "text-black-500 animate-pulse" : "text-red-400"
                    }`}
                />
            </div> */}
            <div className="lg:col-span-2 relative">
               {/* Left search icon */}
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-5 text-gray-400" />

            {/* Mic button (always visible) */}
            <Mic
            onClick={handleMicClick}
            className={`absolute right-10 top-1/2 transform -translate-y-1/2 w-6 h-6 z-5 cursor-pointer ${
                listening ? "text-red-500 animate-pulse" : "text-gray-700"
            }`}
            />

            {/* Input field */}
            <input
            type="text"
            placeholder="Search by name, brand, or website..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-20 py-4 border-2 border-gray-200 rounded-2xl 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        shadow-sm bg-white/90 backdrop-blur text-gray-900 placeholder-gray-500"
            />

            {/* Clear button (only show when text exists) */}
            {searchTerm && (
            <X
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 
                        text-gray-400 hover:text-gray-600 cursor-pointer"
            />
            )}
            </div> 
            
            {/* Industry Filter */}
            <div className="relative">
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full py-4 px-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/90 backdrop-blur appearance-none"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Sort & View Mode */}
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 py-4 px-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/90 backdrop-blur appearance-none"
              >
                <option value="revenue">Revenue</option>
                <option value="name">Name</option>
                <option value="engagement">Engagement</option>
              </select>
              
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'cards' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'compact' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredData.length} Results Found
            </h2>
            {searchTerm && (
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Searching: "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className={`${viewMode === 'cards' ? 'space-y-8' : 'space-y-4'}`}>
          {filteredData.map((item, index) => {
            const engagementScore = getEngagementScore(item);
            const revenue = parseInt(item.revenuePerMonth.replace(/[$,]/g, '')) || 0;
            const isHighValue = revenue > 40000;
            
            return (
              <div 
                key={index} 
                className={`group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
                  viewMode === 'cards' 
                    ? 'bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl'
                    : 'bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 hover:shadow-xl'
                }`}
                style={{
                  transform: `translateY(${Math.sin(animationStep * 0.1 + index) * 2}px)`,
                  transition: 'transform 0.1s ease-in-out'
                }}
              >
                {/* High Value Lead Badge */}
                {/* {isHighValue && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="flex items-center px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      High Value
                    </div>
                  </div>
                )} */}

                {/* Header Section */}
                <div className={`relative ${viewMode === 'cards' ? 'p-8' : 'p-6'} bg-gradient-to-r from-gray-50/50 to-blue-50/50`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-6">
                      {/* Enhanced Avatar */}
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                          {item.firstName[0]}{item.lastName[0]}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${
                          engagementScore > 75 ? 'bg-green-500' : engagementScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Enhanced Basic Info */}
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          {item.firstName} {item.lastName}
                        </h2>
                        <div className="flex flex-wrap gap-3 mb-3">
                          <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                            <Building className="w-4 h-4 mr-2" />
                            {item.brand}
                          </span>
                          <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                            <Globe className="w-4 h-4 mr-2" />
                            <a
        href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {item.website}
      </a>
                          </span>
                          <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                            <Award className="w-4 h-4 mr-2" />
                            {item.title}
                          </span>
                        </div>
                        <p className="text-gray-700 font-medium mb-2">{item.business} • {item.industry}</p>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {item.location}
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Revenue & Engagement */}
                    <div className="text-right space-y-4">
                      <div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {item.revenuePerMonth}
                        </div>
                        <div className="text-sm text-gray-500">Monthly Revenue</div>
                      </div>
                      <EngagementMeter score={engagementScore} />
                    </div>
                  </div>
                </div>

                {/* Enhanced Main Content */}
                <div className={`${viewMode === 'cards' ? 'p-8' : 'p-6'}`}>
                  {/* Enhanced Quick Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center mb-3">
                        <Mail className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-semibold text-blue-800">Email</span>
                      </div>
                      <p className="text-sm text-blue-700 break-all">{item.emailId}</p>
                    </div>
                    
                    <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200 hover:border-green-300 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center mb-3">
                        <Phone className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-semibold text-green-800">Phone</span>
                      </div>
                      <p className="text-sm text-green-700">{item.phoneNo}</p>
                    </div>
                    
                    <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center mb-3">
                        <ExternalLink className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-sm font-semibold text-purple-800">LinkedIn</span>
                      </div>
                      <p>
      <a
        href={item.liProfile}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-purple-700"
      >
        View Profile
      </a>
    </p>
                    </div>
                    
                    <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center mb-3">
                        <User className="w-5 h-5 text-orange-600 mr-2" />
                        <span className="text-sm font-semibold text-orange-800">Notes</span>
                      </div>
                      <p className="text-sm text-orange-700 line-clamp-2">{item.comment}</p>
                    </div>
                  </div>

                  {/* Enhanced Communication Status */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Communication Timeline
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <StatusBadge sent={item.email1Sent} label="Initial Email" icon={Mail} />
                      <StatusBadge sent={item.email2Sent} label="Follow-up" icon={Mail} />
                      <StatusBadge sent={item.email3Sent} label="Final Email" icon={Mail} />
                      <StatusBadge sent={item.called} label="Phone Call" icon={Phone} />
                    </div>
                  </div>

                  {/* Enhanced Expandable Details */}
                  <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 flex items-center justify-between transition-all duration-300 group"
                    >
                      <div className="flex items-center">
                        <Eye className="w-5 h-5 text-gray-600 mr-3 group-hover:text-blue-600 transition-colors" />
                        <span className="font-bold text-gray-800 group-hover:text-blue-800 transition-colors">
                          Detailed Business Intelligence
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2 group-hover:text-blue-600">
                          {expandedCards.has(index) ? 'Hide Details' : 'Show Details'}
                        </span>
                        {expandedCards.has(index) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                        )}
                      </div>
                    </button>
                    
                    {expandedCards.has(index) && (
                      <div className="p-6 border-t-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 animate-in slide-in-from-top duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Left Column */}
                          <div className="space-y-6">
                            <div className="group">
                              <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
                                <Code className="w-5 h-5 mr-2" />
                                Technology Stack
                              </h4>
                              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200 space-y-3">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Current Tech Stack:</p>
                                  <p className="text-sm text-gray-600">{item.techStack}</p>
                                </div>
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Post-Purchase Stack:</p>
                                  <p className="text-sm text-gray-600">{item.postPurchaseTechStack}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="group">
                              <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
                                <Truck className="w-5 h-5 mr-2" />
                                Logistics & Shipping
                              </h4>
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 space-y-3">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Carriers:</p>
                                  <p className="text-sm text-gray-600">{item.carriers}</p>
                                </div>
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Shipping Policy:</p>
                                  <p className="text-sm text-gray-600">{item.shipping}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Right Column */}
                          <div className="space-y-6">
                            <div className="group">
                              <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
                                <RotateCcw className="w-5 h-5 mr-2" />
                                Returns & Policies
                              </h4>
                              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                  <p className="text-sm text-gray-600">{item.returnSolutions}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="group">
                              <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
                                <Shield className="w-5 h-5 mr-2" />
                                Insurance Coverage
                              </h4>
                              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                  <p className="text-sm text-gray-600">{item.insurance}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* No Results */}
        {filteredData.length === 0 && searchTerm && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                No results found for "{searchTerm}"
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterIndustry('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        {/* <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Backend Integration Guide</h3>
            <p className="text-sm text-gray-600 mb-4">
              Replace the sample data with your API endpoint. Your backend should return comma-separated strings:
            </p>
            <div className="bg-gray-100 rounded-2xl p-4 font-mono text-xs text-gray-700 overflow-x-auto">
              "First Name, Last Name, Brand, Website, Business, Comment, Industry, Location, Title, LI profile, email id, Revenue/month, Revenue/month carriers, tech stack, Post Purchase TechStack, Return Solutions, Shipping, Insurance, Phone No, Linkedin, Email 1 Sent, Email 2 Sent, Email 3 Sent, Called"
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};


export default BusinessSearchApp;