import React, { useState, useMemo, useEffect ,useRef} from 'react';
import api from "./api"; 
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
  X,
  Infinity,
  CheckCircle,
  Circle,
  MessageSquare,
  Save,
  Calendar,
  Package,
  Navigation,
  Linkedin,
  ListFilter
} from 'lucide-react';

// 🔹 Updated normalize function for new backend structure
const normalizeData = (item, index) => ({
  id: item.id || `${item["First Name"]}-${item["Last Name"]}-${index}`,
  source: item["Source"] || "",
  batch: item["Batch"] || "",
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
  revenuePerMonth: item["Final Revenue"] ? `$${parseFloat(item["Final Revenue"]).toLocaleString()}` : item["Revenue/month"] || "",
  carriers: item["Carriers"] || "",
  techStack: item["Tech Stack"] || "",
  trackingSolution: item["Tracking Solution"] || "",
  returnSolution: item["Return Solution"] || "",
  insurance: item["Shipping Insurance"] || "",
  monthlyShippingVolume: item["Monthly Shipping Volume"] || null,
  conversationPoints: item["Conversation Points"] || "",
  dinner: item["Dinner"] || "",
  booth: item["Booth"] || "",
  phoneNo: item["Phone No"] || "",
  linkedin: item["LI profile"] || "",
  email1Sent: item["Email 1 Sent"] || false,
  email2Sent: item["Email 2 Sent"] || false,
  email3Sent: item["Email 3 Sent"] || false,
  called: item["Called"] || false,
  visited: item["Visited"] || item.visited || false,
  feedback: item["Feedback"] || item.feedback || ""
});

const BusinessSearchApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [viewMode, setViewMode] = useState('cards');
  const [sortBy, setSortBy] = useState('revenue');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterBatch, setFilterBatch] = useState('all');
  const [animationStep, setAnimationStep] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listening, setListening] = useState(false);
  const [savingStates, setSavingStates] = useState(new Set());
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/getAllData");
        setData(res.data.results || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const processedData = useMemo(() => {
    return data.map((item, index) => normalizeData(item, index));
  }, [data]);

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

  const handleVisitedChange = async (item, visited) => {
    const itemId = item.id;
    setSavingStates(prev => new Set([...prev, itemId]));
    
    try {
      console.log('Updating visited status:', { itemId, visited });
      
      const response = await api.post('/update-attendance', {
        attendee_id: itemId,
        visited: visited,
        feedback: null,
        save_type: 'visited_update'
      });

      console.log('✅ Visited status response:', response.data);

      setData(prevData => 
        prevData.map((dataItem, index) => {
          const dataItemId = dataItem.id ?? `${dataItem["First Name"]}-${dataItem["Last Name"]}-${index}`;
          return dataItemId === itemId 
            ? { 
                ...dataItem, 
                Visited: visited, 
                visited: visited,
                last_updated: response.data.timestamp 
              }
            : dataItem;
        })
      );

    } catch (error) {
      console.error('❌ Error updating visited status:', error);
      let errorMessage = 'Failed to update attendance status. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = `Error: ${error.response.data.detail}`;
      }
      
      alert(errorMessage);
    } finally {
      setSavingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleFeedbackChange = async (item, feedback) => {
    const itemId = item.id;
    setSavingStates(prev => new Set([...prev, itemId]));
    
    try {
      console.log('🎯 Manual save - Updating feedback:', { itemId, feedback });
      
      const response = await api.post('/update-attendance', {
        attendee_id: itemId,
        visited: null,
        feedback: feedback,
        save_type: 'manual_save'
      });
  
      console.log('✅ Manual save response:', response.data);
  
      setData(prevData => 
        prevData.map((dataItem, index) => {
          const dataItemId = dataItem.id ?? `${dataItem["First Name"]}-${dataItem["Last Name"]}-${index}`;
          return dataItemId === itemId 
            ? { 
                ...dataItem, 
                Feedback: feedback, 
                feedback: feedback,
                last_updated: response.data.timestamp 
              }
            : dataItem;
        })
      );

      console.log('✅ Manual save successful:', response.data.message);
      
    } catch (error) {
      console.error('❌ Error in manual save:', error);
      let errorMessage = 'Failed to save feedback. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = `Error: ${error.response.data.detail}`;
      }
      
      throw new Error(errorMessage);
    } finally {
      setSavingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const industries = useMemo(() => {
    return ['all', ...new Set(processedData.map(item => item.industry))];
  }, [processedData]);

  const batches = useMemo(() => {
    return ['all', ...new Set(processedData.map(item => item.batch))];
  }, [processedData]);

  const filteredData = useMemo(() => {
    let filtered = processedData;
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.firstName?.toLowerCase().includes(term) ||
        item.lastName.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        item.website?.toLowerCase().includes(term) ||
        item.industry?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term) 
      );
    }
    
    if (filterIndustry !== 'all') {
      filtered = filtered.filter(item => item.industry === filterIndustry);
    }

    if (filterBatch !== 'all') {
      filtered = filtered.filter(item => item.batch === filterBatch);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          const aRev = parseInt(a.revenuePerMonth.replace(/[$,]/g, '')) || 0;
          const bRev = parseInt(b.revenuePerMonth.replace(/[$,]/g, '')) || 0;
          return bRev - aRev;
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'batch':
          return a.batch.localeCompare(b.batch);
        default:
          return 0;
      }
    });
  }, [searchTerm, filterIndustry,filterBatch, sortBy, processedData]);

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

  const BatchBadge = ({ batch }) => (
    <div className="relative">
      <div className="flex items-center space-x-3">
        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ${
          batch === 'A' ? 'bg-gradient-to-br from-green-500 to-green-600' :
          batch === 'B' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
          batch === 'C' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
          'bg-gradient-to-br from-gray-500 to-gray-600'
        }`}>
          {batch}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Batch</p>
          <p className="text-xs text-gray-500">
            {batch === 'A' ? 'Priority' : batch === 'B' ? 'Standard' : batch === 'C' ? 'Follow-up' : 'Other'}
          </p>
        </div>
      </div>
    </div>
  );
   
  const AttendanceSection = ({ item }) => {
    const [localFeedback, setLocalFeedback] = useState(item.feedback || '');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const isSaving = savingStates.has(item.id);
    const timeoutRef = useRef(null);
    const recognitionRef = useRef(null);
  
    useEffect(() => {
      setLocalFeedback(item.feedback || '');
      setHasUnsavedChanges(false);
    }, [item.id, item.feedback]);
  
    useEffect(() => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;
  
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = true;
  
      recognition.onresult = (event) => {
        let transcript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }
  
        if (transcript.trim()) {
          const newFeedback = localFeedback + (localFeedback ? ' ' : '') + transcript.trim();
          setLocalFeedback(newFeedback);
          setHasUnsavedChanges(newFeedback !== (item.feedback || ''));
          handleFeedbackInputChange(newFeedback);
        }
      };
  
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone permissions.');
        }
      };
  
      recognition.onend = () => {
        setIsListening(false);
      };
  
      recognitionRef.current = recognition;
  
      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
      };
    }, [localFeedback, item.feedback]);
  
    const handleFeedbackInputChange = (value) => {
      setLocalFeedback(value);
      setHasUnsavedChanges(value !== (item.feedback || ''));
  
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
  
      timeoutRef.current = setTimeout(async () => {
        if (value !== (item.feedback || '')) {
          try {
            await handleFeedbackChange(item, value);
            setHasUnsavedChanges(false);
          } catch (error) {
            console.error('Auto-save failed:', error);
          }
        }
      }, 2000);
    };
  
    const handleManualSave = async () => {
      if (!hasUnsavedChanges || isSaving) return;
      try {
        await handleFeedbackChange(item, localFeedback);
        setHasUnsavedChanges(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } catch (error) {
        console.error('Manual save failed:', error);
        alert('Failed to save feedback. Please try again.');
      }
    };
  
    const handleVoiceToggle = () => {
      if (!recognitionRef.current) {
        alert('Speech recognition is not supported in this browser.');
        return;
      }
  
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
          alert('Failed to start voice recognition. Please try again.');
        }
      }
    };
  
    const clearFeedback = () => {
      if (confirm('Are you sure you want to clear all feedback?')) {
        setLocalFeedback('');
        setHasUnsavedChanges(true);
        handleFeedbackInputChange('');
      }
    };
  
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (recognitionRef.current && isListening) {
          recognitionRef.current.abort();
        }
      };
    }, [isListening]);
  
    return (
      // <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 space-y-3">
      //   <h4 className="flex items-center text-md font-bold text-gray-800 mb-3">
      //     <Calendar className="w-4 h-4 mr-2" />
      //     Event Attendance
      //   </h4>
        
      //   <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
      //     <div className="flex items-center space-x-3">
      //       <div className={`p-2 rounded-lg ${item.visited ? 'bg-green-100' : 'bg-gray-100'}`}>
      //         {item.visited ? (
      //           <CheckCircle className="w-4 h-4 text-green-600" />
      //         ) : (
      //           <Circle className="w-4 h-4 text-gray-400" />
      //         )}
      //       </div>
      //       <div>
      //         <p className="font-medium text-gray-900 text-sm">Event Attendance</p>
      //         <p className="text-xs text-gray-500">
      //           {item.visited ? 'Attended the event' : 'Did not attend'}
      //         </p>
      //       </div>
      //     </div>
          
      //     <div className="flex items-center space-x-2">
      //       {isSaving && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
      //       <label className="relative inline-flex items-center cursor-pointer">
      //         <input
      //           type="checkbox"
      //           className="sr-only peer"
      //           checked={item.visited || false}
      //           onChange={(e) => handleVisitedChange(item, e.target.checked)}
      //           disabled={isSaving}
      //         />
      //         <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-blue-600"></div>
      //       </label>
      //     </div>
      //   </div>

      //   <div className="p-3 bg-white rounded-lg shadow-sm">
      //     <div className="flex items-center justify-between mb-2">
      //       <div className="flex items-center space-x-2">
      //         <MessageSquare className="w-4 h-4 text-blue-600" />
      //         <label className="font-medium text-gray-900 text-sm">Remarks</label>
      //         {isSaving && (
      //           <div className="flex items-center space-x-2">
      //             <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      //             <span className="text-xs text-blue-600">Saving...</span>
      //           </div>
      //         )}
      //         {isListening && (
      //           <div className="flex items-center space-x-2">
      //             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      //             <span className="text-xs text-red-600 font-medium">Listening...</span>
      //           </div>
      //         )}
      //       </div>
            
      //       <div className="flex items-center space-x-2">
      //         <button
      //           onClick={handleVoiceToggle}
      //           disabled={isSaving}
      //           className={`flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
      //             isListening
      //               ? 'bg-red-600 text-white hover:bg-red-700'
      //               : 'bg-blue-600 text-white hover:bg-blue-700'
      //           } disabled:opacity-50 disabled:cursor-not-allowed`}
      //         >
      //           <Mic className="w-3 h-3 mr-1" />
      //           {isListening ? 'Stop' : 'Voice'}
      //         </button>

      //         {localFeedback && (
      //           <button
      //             onClick={clearFeedback}
      //             disabled={isSaving}
      //             className="flex items-center px-2 py-1 bg-gray-600 text-white rounded-lg text-xs font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      //           >
      //             <X className="w-3 h-3 mr-1" />
      //             Clear
      //           </button>
      //         )}

      //         {hasUnsavedChanges && !isSaving && (
      //           <button
      //             onClick={handleManualSave}
      //             className="flex items-center px-2 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
      //           >
      //             <Save className="w-3 h-3 mr-1" />
      //             Save
      //           </button>
      //         )}
      //       </div>
      //     </div>
          
      //     <div className="relative">
      //       <textarea
      //         value={localFeedback}
      //         onChange={(e) => handleFeedbackInputChange(e.target.value)}
      //         placeholder={isListening 
      //           ? "Listening for your voice input..." 
      //           : "Type or click 'Voice' to speak your remarks..."
      //         }
      //         className={`w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm ${
      //           isListening 
      //             ? 'border-red-300 bg-red-50' 
      //             : 'border-gray-200'
      //         }`}
      //         rows={3}
      //       />
            
      //       {isListening && (
      //         <div className="absolute top-1 right-1 flex items-center space-x-1 bg-red-100 px-2 py-1 rounded-full">
      //           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
      //           <span className="text-xs text-red-700 font-medium">Recording</span>
      //         </div>
      //       )}
      //     </div>
          
      //     <div className="flex items-center justify-between mt-2">
      //       <p className="text-xs text-gray-500">
      //         {isSaving 
      //           ? 'Saving...'
      //           : hasUnsavedChanges 
      //             ? 'Auto-save in 2s...' 
      //             : 'Auto-saved'
      //         }
      //       </p>
            
      //       {hasUnsavedChanges && !isSaving && (
      //         <div className="flex items-center text-orange-600">
      //           <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1 animate-pulse"></div>
      //           <span className="text-xs">Unsaved</span>
      //         </div>
      //       )}
      //     </div>
      //   </div>
      // </div>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200 space-y-2">
  <h4 className="flex items-center text-sm font-semibold text-gray-800 mb-2">
    <Calendar className="w-3 h-3 mr-1" />
    Event Attendance
  </h4>
  
  <div className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm">
    <div className="flex items-center space-x-2">
      <div className={`p-1.5 rounded-md ${item.visited ? 'bg-green-100' : 'bg-gray-100'}`}>
        {item.visited ? (
          <CheckCircle className="w-3 h-3 text-green-600" />
        ) : (
          <Circle className="w-3 h-3 text-gray-400" />
        )}
      </div>
      <div>
        <p className="font-medium text-gray-900 text-xs">Event Attendance</p>
        <p className="text-xs text-gray-500">
          {item.visited ? 'Attended' : 'Did not attend'}
        </p>
      </div>
    </div>
    
    <div className="flex items-center space-x-1">
      {isSaving && <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={item.visited || false}
          onChange={(e) => handleVisitedChange(item, e.target.checked)}
          disabled={isSaving}
        />
        <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 peer-checked:bg-blue-600"></div>
      </label>
    </div>
  </div>

  <div className="p-2 bg-white rounded-md shadow-sm">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center space-x-1">
        <MessageSquare className="w-3 h-3 text-blue-600" />
        <label className="font-medium text-gray-900 text-xs">Remarks</label>
        {isSaving && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-blue-600">Saving...</span>
          </div>
        )}
        {isListening && (
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-red-600 font-medium">Listening...</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={handleVoiceToggle}
          disabled={isSaving}
          className={`flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium transition-colors ${
            isListening
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Mic className="w-2.5 h-2.5 mr-0.5" />
          {isListening ? 'Stop' : 'Voice'}
        </button>

        {localFeedback && (
          <button
            onClick={clearFeedback}
            disabled={isSaving}
            className="flex items-center px-1.5 py-0.5 bg-gray-600 text-white rounded-md text-xs font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-2.5 h-2.5 mr-0.5" />
            Clear
          </button>
        )}

        {hasUnsavedChanges && !isSaving && (
          <button
            onClick={handleManualSave}
            className="flex items-center px-1.5 py-0.5 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700"
          >
            <Save className="w-2.5 h-2.5 mr-0.5" />
            Save
          </button>
        )}
      </div>
    </div>
    
    <div className="relative">
      <textarea
        value={localFeedback}
        onChange={(e) => handleFeedbackInputChange(e.target.value)}
        placeholder={isListening 
          ? "Listening for your voice input..." 
          : "Type or click 'Voice' to speak your remarks..."
        }
        className={`w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-xs ${
          isListening 
            ? 'border-red-300 bg-red-50' 
            : 'border-gray-200'
        }`}
        rows={2}
      />
      
      {isListening && (
        <div className="absolute top-0.5 right-0.5 flex items-center space-x-1 bg-red-100 px-1.5 py-0.5 rounded-full">
          <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-red-700 font-medium">Recording</span>
        </div>
      )}
    </div>
    
    <div className="flex items-center justify-between mt-1">
      <p className="text-xs text-gray-500">
        {isSaving 
          ? 'Saving...'
          : hasUnsavedChanges 
            ? 'Auto-save in 2s...' 
            : 'Auto-saved'
        }
      </p>
      
      {hasUnsavedChanges && !isSaving && (
        <div className="flex items-center text-orange-600">
          <div className="w-1 h-1 bg-orange-500 rounded-full mr-1 animate-pulse"></div>
          <span className="text-xs">Unsaved</span>
        </div>
      )}
    </div>
  </div>
</div>
    );
  };

  const totalRevenue = processedData.reduce((sum, item) => {
    return sum + (parseInt(item.revenuePerMonth.replace(/[$,]/g, '')) || 0);
  }, 0);
  
  const avgVolume = Math.round(
    processedData.reduce((sum, item) => sum + (item.monthlyShippingVolume || 0), 0) / (processedData.length || 1)
  );

  const highValueLeads = processedData.filter(item => 
    (parseInt(item.revenuePerMonth.replace(/[$,]/g, '')) || 0) > 40000
  ).length;

  const attendanceRate = Math.round(
    (processedData.filter(item => item.visited).length / (processedData.length || 1)) * 100
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="py-8 px-4">
              <h1 className="flex items-center space-x-3 text-4xl font-bold">
                <img
                  src="/LateShipment-Logo.svg"
                  alt="Left Logo"
                  className="h-12 w-auto object-contain"
                />
                <Infinity className="w-16 h-16 text-gray-700" />   
                <img
                  src="/Ecom-North-logo.svg"
                  alt="Ecom North Logo"
                  className="h-12 w-auto object-contain"
                />
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Toronto Summit – Canada
                </span>
              </h1>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard 
              icon={DollarSign}
              title="Total Monthly Revenue"
              value={`$${(totalRevenue/1000).toFixed(0)}K`}
              color="green"
            />
            <MetricCard 
              icon={Activity}
              title="Active Leads"
              value={processedData.length}
              color="yellow"
            />
            <MetricCard 
              icon={Package}
              title="Avg Monthly Volume"
              value={avgVolume}
              color="purple"
            />
            <MetricCard 
              icon={UserCheck}
              title="Attendance Rate"
              value={`${attendanceRate}%`}
              color="orange"
            />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 mb-8">
          {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-4"> //grid grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center */}
          {/* <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-5 text-gray-400" />
              <Mic
                onClick={handleMicClick}
                className={`absolute right-10 top-1/2 transform -translate-y-1/2 w-6 h-6 z-5 cursor-pointer ${
                  listening ? "text-red-500 animate-pulse" : "text-gray-700"
                }`}
              />
              <input
                type="text"
                placeholder="Search by name, brand, or website..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-20 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/90 backdrop-blur text-gray-900 placeholder-gray-500"
              />

              {searchTerm && (
                <X
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                />
              )}
            </div>  */}
            <div className="grid grid-cols-[1.2fr_0.5fr_0.3fr_auto] gap-4 items-center">
              <div className="relative"> {/* Remove lg:col-span-2 since we're using explicit grid template */}
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-5 text-gray-400" />
                <Mic
                  onClick={handleMicClick}
                  className={`absolute right-10 top-1/2 transform -translate-y-1/2 w-6 h-6 z-5 cursor-pointer ${
                    listening ? "text-red-500 animate-pulse" : "text-gray-700"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search by name, brand, or website..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-20 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/90 backdrop-blur text-gray-900 placeholder-gray-500"
                />
                {searchTerm && (
                  <X
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                )}
              </div> 
              
            
            <div className="relative">
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full py-4 pl-4 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/90 backdrop-blur appearance-none truncate"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="w-full py-4 pl-4 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/90 backdrop-blur appearance-none truncate"
              >
                {batches.map(batch => (
                  <option key={batch} value={batch}>
                    {batch === 'all' ? 'Batches' : batch}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 py-4 px-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/90 backdrop-blur appearance-none"
              >
                <option value="revenue">Revenue</option>
                <option value="name">Name</option>
                <option value="batch">Batch</option>
              </select>
              </div>
              {/* <ListFilter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /> */}
              
              {/* <div className="flex bg-gray-100 rounded-2xl p-1">
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
              </div> */}
            </div>
          </div>
        </div>

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

        {/* <div className={`${viewMode === 'cards' ? 'space-y-8' : 'space-y-4'}`}>
          {filteredData.map((item, index) => {
            const revenue = parseInt(item.revenuePerMonth.replace(/[$,]/g, '')) || 0;
            const isHighValue = revenue > 40000;
            
            return (
              <div 
                key={item.id || index} 
                className={`group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
                  viewMode === 'cards' 
                    ? 'bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl'
                    : 'bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 hover:shadow-xl'
                }`}
              >
                <div className={`relative ${viewMode === 'cards' ? 'p-8' : 'p-6'} bg-gradient-to-r from-gray-50/50 to-blue-50/50`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                          {item.firstName[0]}{item.lastName[0]}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${
                          item.visited ? 'bg-green-500' : 'bg-gray-400'
                        }`}>
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
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
                              className="text-white hover:underline"
                            >
                              {item.website}
                            </a>
                          </span>
                          <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
                            <Award className="w-4 h-4 mr-2" />
                            {item.title}
                          </span>
                          {item.monthlyShippingVolume && (
                            <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
                              <Package className="w-4 h-4 mr-2" />
                              {item.monthlyShippingVolume.toLocaleString()}/mo
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <p className="text-gray-700 font-medium">{item.business} • {item.industry}</p>
                          {item.source && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
                              {item.source}
                            </span>
                          )}
                          {item.conversationPoints && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
                              {item.conversationPoints}
                            </span>
                          )}
                          {item.dinner && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-medium">
                              Dinner: {item.dinner}
                            </span>
                          )}
                          {item.booth && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-medium">
                              Booth: {item.booth}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {item.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-4">
                      <div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {item.revenuePerMonth}
                        </div>
                        <div className="text-sm text-gray-500">Monthly Revenue</div>
                      </div>
                      <BatchBadge batch={item.batch} />
                    </div>
                  </div>
                </div>

                <div className={`${viewMode === 'cards' ? 'p-8' : 'p-6'}`}>
                  <div className="grid grid-cols-4 gap-4 mb-6 min-w-0"> 
                    <div className="group bg-gradient-to-br from-blue-50 to-orange-100 rounded-2xl p-4 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center mb-3">
                        <Mail className="w-5 h-5 text-orange-600 mr-2" />
                        <span className="text-sm font-semibold text-orange-800">Email</span>
                      </div>
                      <p className="text-sm text-orange-700 break-all">{item.emailId}</p>
                    </div>
                    <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center mb-3">
                        <Linkedin className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-semibold text-blue-800">Linkedin Profile</span>
                      </div>
                      <p>     
                        <a href={item.liProfile} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700" >
                           View Profile
                        </a>
                       </p>
                    </div>
                    <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200 hover:border-green-300 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center mb-3">
                        <Code className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-semibold text-green-800">Tech Stack</span>
                      </div>
                      <p className="text-sm text-green-700">{item.techStack}</p>
                    </div>
                    
                    <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center mb-3">
                        <Truck className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-sm font-semibold text-purple-800">Carriers</span>
                      </div>
                      <p className="text-sm text-purple-700">{item.carriers}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <AttendanceSection item={item} />
                  </div>

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
                          <div className="space-y-6">
                            <div className="group">
                              <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
                                <Navigation className="w-5 h-5 mr-2" />
                                Tracking Solutions
                              </h4>
                              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                  <p className="text-sm text-gray-600">{item.trackingSolution}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="group">
                              <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
                                <Code className="w-5 h-5 mr-2" />
                                Technology Details
                              </h4>
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Tech Stack:</p>
                                  <p className="text-sm text-gray-600">{item.techStack}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="group">
                              <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
                                <RotateCcw className="w-5 h-5 mr-2" />
                                Returns & Policies
                              </h4>
                              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                  <p className="text-sm text-gray-600">{item.returnSolution}</p>
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
        </div> */}

<div className={`${viewMode === 'cards' ? 'space-y-6' : 'space-y-3'}`}>
  {filteredData.map((item, index) => {
    const revenue = parseInt(item.revenuePerMonth.replace(/[$,]/g, '')) || 0;
    const isHighValue = revenue > 40000;
    
    return (
      <div 
        key={item.id || index} 
        className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
          viewMode === 'cards' 
            ? 'bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 hover:shadow-xl'
            : 'bg-white/70 backdrop-blur-lg rounded-xl shadow-md border border-white/10 hover:shadow-lg'
        }`}
      >
        <div className={`relative ${viewMode === 'cards' ? 'p-5' : 'p-4'} bg-gradient-to-r from-gray-50/50 to-blue-50/50`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {item.firstName[0]}{item.lastName[0]}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-3 border-white flex items-center justify-center ${
                  item.visited ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {item.firstName} {item.lastName}
                </h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm">
                    <Building className="w-3 h-3 mr-1" />
                    {item.brand}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm">
                    <Globe className="w-3 h-3 mr-1" />
                    <a
                      href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline"
                    >
                      {item.website}
                    </a>
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm">
                    <Award className="w-3 h-3 mr-1" />
                    {item.title}
                  </span>
                  {item.monthlyShippingVolume && (
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm">
                      <Package className="w-3 h-3 mr-1" />
                      {item.monthlyShippingVolume.toLocaleString()}/mo
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <p className="text-sm text-gray-700 font-medium">{item.business} • {item.industry}</p>
                  {item.source && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                      {item.source}
                    </span>
                  )}
                  {item.conversationPoints && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                      {item.conversationPoints}
                    </span>
                  )}
                  {item.dinner && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md text-xs font-medium">
                      Dinner: {item.dinner}
                    </span>
                  )}
                  {item.booth && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">
                      Booth: {item.booth}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-3 h-3 mr-1" />
                  {item.location}
                </div>
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {item.revenuePerMonth}
                </div>
                <div className="text-xs text-gray-500">Monthly Revenue</div>
              </div>
              <BatchBadge batch={item.batch} />
            </div>
          </div>
        </div>

        <div className={`${viewMode === 'cards' ? 'p-5' : 'p-4'}`}>
          <div className="grid grid-cols-4 gap-3 mb-4 min-w-0">
            <div className="group bg-gradient-to-br from-blue-50 to-orange-100 rounded-xl p-3 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-2">
                <Mail className="w-4 h-4 text-orange-600 mr-1" />
                <span className="text-xs font-semibold text-orange-800">Email</span>
              </div>
              <p className="text-xs text-orange-700 break-all">{item.emailId}</p>
            </div>
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-2">
                <Linkedin className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-xs font-semibold text-blue-800">LinkedIn</span>
              </div>
              <p>     
                <a href={item.liProfile} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700" >
                   View Profile
                </a>
               </p>
            </div>
            <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200 hover:border-green-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-2">
                <Code className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs font-semibold text-green-800">Tech Stack</span>
              </div>
              <p className="text-xs text-green-700">{item.techStack}</p>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-2">
                <Truck className="w-4 h-4 text-purple-600 mr-1" />
                <span className="text-xs font-semibold text-purple-800">Carriers</span>
              </div>
              <p className="text-xs text-purple-700">{item.carriers}</p>
            </div>
          </div>

          <div className="mb-4">
            <AttendanceSection item={item} />
          </div>

          <div className="border-2 border-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleExpanded(index)}
              className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 flex items-center justify-between transition-all duration-300 group"
            >
              <div className="flex items-center">
                <Eye className="w-4 h-4 text-gray-600 mr-2 group-hover:text-blue-600 transition-colors" />
                <span className="font-semibold text-sm text-gray-800 group-hover:text-blue-800 transition-colors">
                  Business Intelligence
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-600 mr-2 group-hover:text-blue-600">
                  {expandedCards.has(index) ? 'Hide' : 'Show'}
                </span>
                {expandedCards.has(index) ? (
                  <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                )}
              </div>
            </button>
            
            {expandedCards.has(index) && (
              <div className="p-4 border-t-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 animate-in slide-in-from-top duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="group">
                      <h4 className="flex items-center text-sm font-bold text-gray-800 mb-3">
                        <Navigation className="w-4 h-4 mr-1" />
                        Tracking Solutions
                      </h4>
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <p className="text-xs text-gray-600">{item.trackingSolution}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="group">
                      <h4 className="flex items-center text-sm font-bold text-gray-800 mb-3">
                        <Code className="w-4 h-4 mr-1" />
                        Technology Details
                      </h4>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <p className="text-xs font-medium text-gray-700 mb-1">Tech Stack:</p>
                          <p className="text-xs text-gray-600">{item.techStack}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="group">
                      <h4 className="flex items-center text-sm font-bold text-gray-800 mb-3">
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Returns & Policies
                      </h4>
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <p className="text-xs text-gray-600">{item.returnSolution}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="group">
                      <h4 className="flex items-center text-sm font-bold text-gray-800 mb-3">
                        <Shield className="w-4 h-4 mr-1" />
                        Insurance Coverage
                      </h4>
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <p className="text-xs text-gray-600">{item.insurance}</p>
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
                  setFilterBatch('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BusinessSearchApp;