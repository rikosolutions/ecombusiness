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
  ListFilter,
  UserPlus,
  Edit3,
  Trash2,
  Plus,
  CookingPot,
  Utensils,Store,
  Briefcase,Container
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
  feedback: item["Feedback"] || item.feedback || "",
  assigned: item["Assigned"] || item.assigned || "",
  proposal: item["Proposal"] || ""
});

const leadAPI = {
  create: (leadData) => api.post('/create-lead', leadData),
  getAll: () => api.get('/get-leads'),
  update: (leadId, leadData) => api.put(`/update-lead/${leadId}`, leadData),
  delete: (leadId) => api.delete(`/delete-lead/${leadId}`),
  getStats: () => api.get('/leads-stats')
};

// Lead Form Modal Component
const LeadFormModal = ({ isOpen, onClose, editingLead, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingLead) {
      setFormData({
        firstName: editingLead.firstName || '',
        lastName: editingLead.lastName || '',
        company: editingLead.company || '',
        email: editingLead.email || '',
        comments: editingLead.comments || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        company: '',
        email: '',
        comments: ''
      });
    }
    setErrors({});
  }, [editingLead, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Invalid email format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving lead:', error);
      setErrors({ submit: error.response?.data?.detail || 'Failed to save lead' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {editingLead ? 'Edit Lead' : 'Add New Lead'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last name (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Lateshipment (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="lateshipment@example.com (optional)"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Additional notes or comments (optional)"
            />
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (editingLead ? 'Update Lead' : 'Create Lead')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LeadsListModal = ({ isOpen, onClose, leads, onEdit, onDelete, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Manage Leads</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No leads found. Create your first lead!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div key={lead.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </h3>
                      {lead.email && (
                        <p className="text-sm text-gray-600 mt-1">{lead.email}</p>
                      )}
                      {lead.company && (
                        <p className="text-sm text-blue-600 mt-1">
                          <a href={lead.company} target="_blank" rel="noopener noreferrer">
                            {lead.company}
                          </a>
                        </p>
                      )}
                      {lead.comments && (
                        <p className="text-sm text-gray-700 mt-2 bg-white p-2 rounded border">
                          {lead.comments}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                        title="Edit Lead"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this lead?')) {
                            onDelete(lead.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


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
  const [filterBooth, setFilterBooth] = useState('all'); 
  const [filterDinner, setFilterDinner] = useState('all');
  const [filterAttendance, setFilterAttendance] = useState('all');


  // Lead management states
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showLeadsList, setShowLeadsList] = useState(false);
  const [leads, setLeads] = useState([]);
  const [editingLead, setEditingLead] = useState(null);
  const [leadsLoading, setLeadsLoading] = useState(false);
  
  

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

   // Lead management functions
   const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const response = await leadAPI.getAll();
      setLeads(response.data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLeadsLoading(false);
    }
  };

  const handleSaveLead = async (leadData) => {
    try {
      if (editingLead) {
        await leadAPI.update(editingLead.id, leadData);
      } else {
        await leadAPI.create(leadData);
      }
      await fetchLeads();
      setShowLeadForm(false);
      setEditingLead(null);
    } catch (error) {
      throw error;
    }
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowLeadForm(true);
    setShowLeadsList(false);
  };

  const handleDeleteLead = async (leadId) => {
    await leadAPI.delete(leadId);
    await fetchLeads();
  };


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
        assigned: null, 
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

  const handleAssignmentChange = async (item, assigned) => {
    const itemId = item.id;
    setSavingStates(prev => new Set([...prev, itemId]))
    
    try {
      const response = await api.post('/update-attendance', {
        attendee_id: itemId,
        visited: null,
        feedback: null,
        assigned: assigned,
        save_type: 'assignment_update'
      });
  
      setData(prevData => 
        prevData.map((dataItem, index) => {
          const dataItemId = dataItem.id ?? `${dataItem["First Name"]}-${dataItem["Last Name"]}-${index}`;
          return dataItemId === itemId 
            ? { 
                ...dataItem, 
                Assigned: assigned, 
                assigned: assigned,
                last_updated: response.data.timestamp 
              }
            : dataItem;
        })
      );
    } catch (error) {
      console.error('❌ Error updating assignment:', error);
      alert('Failed to update assignment. Please try again.');
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
        assigned: null, 
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

    // ADD THESE NEW FILTER CONDITIONS:
  if (filterBooth !== 'all') {
    filtered = filtered.filter(item => {
      return item.booth && item.booth.trim() === "Yes";
    });
  }

  if (filterDinner !== 'all') {
    filtered = filtered.filter(item => {
      return item.dinner && item.dinner.trim() === "Yes";
    });
  }


    if (filterAttendance !== 'all') {
      filtered = filtered.filter(item => {
        if (filterAttendance === 'attended') {
          return item.visited === true;
        } else if (filterAttendance === 'not_attended') {
          return item.visited === false;
        }
        return true;
      });
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
  }, [searchTerm, filterIndustry,filterBatch,filterBooth, filterDinner, filterAttendance, sortBy, processedData]);

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
        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ${
          batch === 'A' ? 'bg-gradient-to-br from-green-800 to-green-500' :
          batch === 'B' ? 'bg-gradient-to-br from-blue-600 to-blue-400' :
          batch === 'C' ? 'bg-gradient-to-br from-purple-600 to-purple-400' :
          'bg-gradient-to-br from-gray-500 to-gray-600'
        }`}>
          {batch}
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
  {/* Assignment Section */}
<div className="p-2 bg-white rounded-md shadow-sm">
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center space-x-1">
      <UserPlus className="w-3 h-3 text-purple-600" />
      <label className="font-medium text-gray-900 text-xs">Assigned To</label>
    </div>
  </div>
  
  <div className="flex items-center space-x-3">
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        name={`assignment-${item.id}`}
        value="Sriram"
        checked={item.assigned === 'Sriram'}
        onChange={(e) => handleAssignmentChange(item, e.target.value)}
        disabled={isSaving}
        className="w-3 h-3 text-blue-600"
      />
      <span className="ml-2 text-xs font-medium text-gray-700">Sriram</span>
    </label>
    
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        name={`assignment-${item.id}`}
        value="LK"
        checked={item.assigned === 'LK'}
        onChange={(e) => handleAssignmentChange(item, e.target.value)}
        disabled={isSaving}
        className="w-3 h-3 text-green-600"
      />
      <span className="ml-2 text-xs font-medium text-gray-700">LK</span>
    </label>

    {item.assigned && (
      <button
        onClick={() => handleAssignmentChange(item, '')}
        disabled={isSaving}
        className="text-xs text-gray-500 hover:text-red-500"
      >
        Clear
      </button>
    )}
  </div>
</div>

  <div className="p-2 bg-white rounded-md shadow-sm">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center space-x-1">
        <MessageSquare className="w-3 h-3 text-blue-600" />
        <label className="font-medium text-gray-900 text-xs">Remarks</label>
        {isSaving && hasUnsavedChanges && (
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
        rows={5}
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
        {isSaving && hasUnsavedChanges
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
    (processedData.filter(item => item.visited).length) 
  );

  const boothRate = Math.round(
    (processedData.filter(item => {
      return item.booth && item.booth.trim() === "Yes";
    }).length)
  );
  
  const dinnerRate = Math.round(
    (processedData.filter(item => {
      return item.dinner && item.dinner.trim() === "Yes";
    }).length)
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
              icon={Activity}
              title="Active Leads"
              value={processedData.length}
              color="yellow"
            />
             {/* <MetricCard 
              icon={DollarSign}
              title="Booth"
              value={`${boothRate}`}
              color="green"
            />
            <MetricCard 
              icon={Package}
              title="Dinner"
              value={`${dinnerRate}`}
              color="purple"
            />
            <MetricCard 
              icon={UserCheck}
              title="Attendance"
              value={`${attendanceRate}`}
              color="orange"
            /> */}
            <div 
              className={`cursor-pointer transition-all ${filterBooth === 'yes' ? 'ring-3 ring-green-800' : ''}`}
              onClick={() => setFilterBooth(filterBooth === 'yes' ? 'all' : 'yes')}
            >
              <MetricCard
                icon={Store}
                title="Booth"
                value={`${boothRate}`}
                color="green"
              />
            </div>
            <div 
              className={`cursor-pointer transition-all ${filterDinner === 'yes' ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => setFilterDinner(filterDinner === 'yes' ? 'all' : 'yes')}
            >
              <MetricCard
                icon={Utensils}
                title="Dinner"
                value={`${dinnerRate}`}
                color="purple"
              />
            </div>
            <div 
              className={`cursor-pointer transition-all ${filterAttendance === 'attended' ? 'ring-2 ring-orange-500' : ''}`}
              onClick={() => setFilterAttendance(filterAttendance === 'attended' ? 'all' : 'attended')}
            >
              <MetricCard
                icon={UserCheck}
                title="Attendance"
                value={`${attendanceRate}`}
                color="orange"
              />
            </div>
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
            {/* <div className="grid grid-cols-[1.2fr_0.5fr_0.3fr_auto] gap-4 items-center"> */}
            <div className="grid grid-cols-[1fr_0.4fr_0.25fr_0.25fr_auto] gap-3 items-center">
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
                <option value="revenue" disabled>Sort By</option>
                <option value="revenue">Revenue</option>
                <option value="name">Name</option>
                <option value="batch">Batch</option>
              </select>
                {/* Add Lead Icon */}
    <button
      onClick={() => {
        setEditingLead(null);
        setShowLeadForm(true);
      }}
      className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
      title="Add New Lead"
    >
      <UserPlus className="w-5 h-5" />
    </button>
    
    {/* View Leads Icon */}
    <button
      onClick={() => {
        setShowLeadsList(true);
        fetchLeads();
      }}
      className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
      title="View All Leads"
    >
      <Eye className="w-5 h-5" />
    </button>
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
            ? 'bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20  hover:shadow-xl hover:bg-blue-100'
            : 'bg-white/70 backdrop-blur-lg rounded-xl shadow-md border border-white/10  hover:shadow-lg hover:bg-blue-100'
        }`}
      >
        <div className={`relative ${viewMode === 'cards' ? 'p-5' : 'p-4'} bg-gradient-to-r from-gray-50/50 to-blue-50/50`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
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
                  <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-blue-600 to-sky-700 text-white shadow-sm">
                    <Building className="w-3 h-3 mr-1" />
                    {item.brand}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-blue-500 to-emerald-600 text-white shadow-sm">
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
                  <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm">
                    <Award className="w-3 h-3 mr-1" />
                    {item.title}
                  </span>
                  {item.monthlyShippingVolume && (
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm" title="Monthly Shipping Volume">
                      <Container className="w-3 h-3 mr-1" />
                      {item.monthlyShippingVolume.toLocaleString()}/mo
                    </span>
                  )}
                   {item.proposal && (
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-sm">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {/* {item.proposal.toLocaleString()} */}
                      <a
                      href={item.proposal.startsWith("http") ? item.proposal : `https://${item.proposal}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:underline"
                      >
                      Proposal
                      </a>
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
                  {item.dinner === 'Yes' && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md text-xs font-medium">
                      Dinner: {item.dinner}
                    </span>
                  )}
                  {item.booth  === 'Yes' &&(
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">
                      Booth
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
            <div className="group bg-gradient-to-br from-orange-50 to-orange-70 rounded-xl p-3 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-2">
                <Mail className="w-4 h-4 text-orange-600 mr-1" />
                <span className="text-xs font-semibold text-orange-700">Email</span>
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
                        Comments
                      </h4>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <p className="text-xs text-gray-600">{item.comment}</p>
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
                  setFilterBooth('all');
                  setFilterDinner('all');
                  setFilterAttendance('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Add these before the final closing </div> */}
<LeadFormModal 
  isOpen={showLeadForm}
  onClose={() => {
    setShowLeadForm(false);
    setEditingLead(null);
  }}
  editingLead={editingLead}
  onSave={handleSaveLead}
/>

<LeadsListModal
  isOpen={showLeadsList}
  onClose={() => setShowLeadsList(false)}
  leads={leads}
  onEdit={handleEditLead}
  onDelete={handleDeleteLead}
  loading={leadsLoading}
/>


      </div>
    </div>
  );
};

export default BusinessSearchApp;

// import React, { useState, useMemo, useEffect ,useRef} from 'react';
// import api from "./api"; 
// import { 
//   Search, 
//   Building, 
//   Mail, 
//   Phone, 
//   ExternalLink, 
//   MapPin, 
//   DollarSign,
//   ChevronDown,
//   ChevronUp,
//   User,
//   Globe,
//   Code,
//   Truck,
//   Shield,
//   RotateCcw,
//   TrendingUp,
//   Star,
//   Sparkles,
//   Filter,
//   Grid,
//   List,
//   Eye,
//   Activity,
//   BarChart3,
//   UserCheck,
//   Target,
//   Users,
//   Award,
//   Mic,
//   X,
//   Infinity,
//   CheckCircle,
//   Circle,
//   MessageSquare,
//   Save,
//   Calendar
// } from 'lucide-react';

// // Example backend JSON (replace with real API call)
// const backendResponse = {
//   results: [
//     {
//       "First Name": "Matthew",
//       "Last Name": "Breech",
//       Brand: "Botanica",
//       Website: "botanica.co",
//       Business: "Ecommerce",
//       Comment: "https://www.tallgrass.ca/brand-partners",
//       Industry: "Candles / Home Fragrance Retailer",
//       Location: "Florida, USA",
//       Title: "Co-Founder and CEO",
//       "LI profile":
//         "https://www.linkedin.com/in/matthew-breech-84042a5/?originalSubdomain=ca",
//       "email id": "matt@tallgrass.ca",
//       "Revenue/month": " 2,080,000.00/month",
//       "Revenue/month.1": 2080000.0,
//       carriers: null,
//       "tech stack": "WooCommerce",
//       "Post Purchase TechStack": "Internal tracking page/email",
//       "Return Solutions ": "Manual/email-based",
//       "Shipping Insurance": "Not specified",
//       "Phone No": null,
//       Linkedin: true,
//       "Email 1 Sent": true,
//       "Email 2 Sent": false,
//       "Email 3 Sent": false,
//       Called: false,
//     },
//     {
//       "First Name": "Matthew",
//       "Last Name": "Wong",
//       Brand: "Claymoo",
//       Website: "claymoo.com",
//       Business: "Ecommerce",
//       Comment: null,
//       Industry: "/ Toys & Hobbies / Arts & Crafts",
//       Location: "Markham, ON, Canada",
//       Title: "Business Development",
//       "LI profile": "https://www.linkedin.com/in/ithinkwong/",
//       "email id": "matt@claymoo.com",
//       "Revenue/month": " 407,924.82/month",
//       "Revenue/month.1": 407924.82,
//       carriers: null,
//       "tech stack": "Shopify,Klaviyo",
//       "Post Purchase TechStack": "AfterShip mentioned",
//       "Return Solutions ": "Manual/email-based",
//       "Shipping Insurance": "Not specified",
//       "Phone No": null,
//       Linkedin: true,
//       "Email 1 Sent": true,
//       "Email 2 Sent": false,
//       "Email 3 Sent": false,
//       Called: false,
//     },
//   ],
// };

// const normalizeData = (item, index) => ({
//   id: item.id || `${item["First Name"]}-${item["Last Name"]}-${index}`, // More consistent ID
//   firstName: item["First Name"] || "",
//   lastName: item["Last Name"] || "",
//   brand: item["Brand"] || "",
//   website: item["Website"] || "",
//   business: item["Business"] || "",
//   comment: item["Comment"] || "",
//   industry: item["Industry"] || "",
//   location: item["Location"] || "",
//   title: item["Title"] || "",
//   liProfile: item["LI profile"] || "",
//   emailId: item["email id"] || "",
//   revenuePerMonth:
//     item["Revenue/month.1"] != null
//       ? `$${item["Revenue/month.1"].toLocaleString()}`
//       : item["Revenue/month"] || "",
//   carriers: item["carriers"] || "",
//   techStack: item["tech stack"] || "",
//   postPurchaseTechStack: item["Post Purchase TechStack"] || "",
//   returnSolutions: item["Return Solutions "] || "",
//   shipping: item["Shipping"] || "",
//   insurance: item["Shipping Insurance"] || "",
//   phoneNo: item["Phone No"] || "",
//   linkedin: item["LI profile"] || "",
//   email1Sent: item["Email 1 Sent"] || false,
//   email2Sent: item["Email 2 Sent"] || false,
//   email3Sent: item["Email 3 Sent"] || false,
//   called: item["Called"] || false,
//   // Fix: Check both 'Feedback' and 'feedback' to handle backend variations
//   visited: item["Visited"] || item.visited || false,
//   feedback: item["Feedback"] || item.feedback || ""
// });


// const BusinessSearchApp = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [expandedCards, setExpandedCards] = useState(new Set());
//   const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'compact'
//   const [sortBy, setSortBy] = useState('revenue'); // 'revenue', 'name', 'engagement'
//   const [filterIndustry, setFilterIndustry] = useState('all');
//   const [animationStep, setAnimationStep] = useState(0);
//   const [data, setData] = useState([]); // ✅ API data state
//   const [loading, setLoading] = useState(true);
//   const [listening, setListening] = useState(false);
//   const [savingStates, setSavingStates] = useState(new Set()); // Track which items are being saved
//   const recognitionRef = useRef(null);


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await api.get("/getAllData"); // token auto-attached
//         setData(res.data.results || []); // assuming backend returns { results: [...] }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   //Initialize Web Speech API inside useEffect:
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return;
  
//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;
  
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setSearchTerm(transcript);
//       setListening(false);
//     };
  
//     recognition.onerror = () => setListening(false);
//     recognition.onend = () => setListening(false);
  
//     recognitionRef.current = recognition;
//   }, []);
  

//   // 🔹 Process backend data
//   // const processedData = useMemo(() => {
//   //   return data.map(normalizeData);
//   // }, [data]);

//   const processedData = useMemo(() => {
//     return data.map((item, index) => normalizeData(item, index));
//   }, [data]);
//   //Add a handler to start/stop voice recognition:
//   const handleMicClick = () => {
//     if (!recognitionRef.current) return;
//     if (listening) {
//       recognitionRef.current.stop();
//       setListening(false);
//     } else {
//       recognitionRef.current.start();
//       setListening(true);
//     }
//   };

// // Handle visited status change - Updated for enhanced FastAPI
// const handleVisitedChange = async (item, visited) => {
//   const itemId = item.id;
//   setSavingStates(prev => new Set([...prev, itemId]));
  
//   try {
//     console.log('Updating visited status:', { itemId, visited });
    
//     const response = await api.post('/update-attendance', {
//       attendee_id: itemId,
//       visited: visited,
//       feedback: null,
//       save_type: 'visited_update'
//     });

//     console.log('✅ Visited status response:', response.data);

//     // Update local state with enhanced data
//     setData(prevData => 
//       prevData.map((dataItem, index) => {
//         const dataItemId = dataItem.id ?? `${dataItem["First Name"]}-${dataItem["Last Name"]}-${index}`;
//         return dataItemId === itemId 
//           ? { 
//               ...dataItem, 
//               Visited: visited, 
//               visited: visited,
//               last_updated: response.data.timestamp 
//             }
//           : dataItem;
//       })
//     );

//   } catch (error) {
//     console.error('❌ Error updating visited status:', error);
//     let errorMessage = 'Failed to update attendance status. Please try again.';
    
//     if (error.response?.data?.detail) {
//       errorMessage = `Error: ${error.response.data.detail}`;
//     }
    
//     alert(errorMessage);
//   } finally {
//     setSavingStates(prev => {
//       const newSet = new Set(prev);
//       newSet.delete(itemId);
//       return newSet;
//     });
//   }
// };

//   const handleFeedbackChange = async (item, feedback) => {
//     const itemId = item.id;
//     setSavingStates(prev => new Set([...prev, itemId]));
    
//     try {
//       console.log('🎯 Manual save - Updating feedback:', { itemId, feedback });
      
//       const response = await api.post('/update-attendance', {
//         attendee_id: itemId,
//         visited: null,
//         feedback: feedback,
//         save_type: 'manual_save'
//       });
  
//       console.log('✅ Manual save response:', response.data);
  
//       // Update local state with enhanced data
//       setData(prevData => 
//         prevData.map((dataItem, index) => {
//           const dataItemId = dataItem.id ?? `${dataItem["First Name"]}-${dataItem["Last Name"]}-${index}`;
//           return dataItemId === itemId 
//             ? { 
//                 ...dataItem, 
//                 Feedback: feedback, 
//                 feedback: feedback,
//                 last_updated: response.data.timestamp 
//               }
//             : dataItem;
//         })
//       );
  
//       console.log('✅ Manual save successful:', response.data.message);
      
//     } catch (error) {
//       console.error('❌ Error in manual save:', error);
//       let errorMessage = 'Failed to save feedback. Please try again.';
      
//       if (error.response?.data?.detail) {
//         errorMessage = `Error: ${error.response.data.detail}`;
//       }
      
//       throw new Error(errorMessage);
//     } finally {
//       setSavingStates(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(itemId);
//         return newSet;
//       });
//     }
//   };
  
//   // Get unique industries for filter
//   const industries = useMemo(() => {
//     return ['all', ...new Set(processedData.map(item => item.industry))];
//   }, [processedData]);

//   // Filter and sort data
//   const filteredData = useMemo(() => {
//     let filtered = processedData;
    
//     // Apply search filter
//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(item => 
//         item.firstName?.toLowerCase().includes(term) ||
//         item.lastName.toLowerCase().includes(term) ||
//         item.brand.toLowerCase().includes(term) ||
//         item.website?.toLowerCase().includes(term) ||
//         item.industry?.toLowerCase().includes(term) ||   // optional: add industry too
//         item.email?.toLowerCase().includes(term) 
//       );
//     }
    
//     // Apply industry filter
//     if (filterIndustry !== 'all') {
//       filtered = filtered.filter(item => item.industry === filterIndustry);
//     }
    
//     // Sort data
//     return filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'revenue':
//           const aRev = parseInt(a.revenuePerMonth.replace(/[$,]/g, '')) || 0;
//           const bRev = parseInt(b.revenuePerMonth.replace(/[$,]/g, '')) || 0;
//           return bRev - aRev;
//         case 'name':
//           return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
//         case 'engagement':
//           const aEng = [a.email1Sent, a.email2Sent, a.email3Sent, a.called].filter(Boolean).length;
//           const bEng = [b.email1Sent, b.email2Sent, b.email3Sent, b.called].filter(Boolean).length;
//           return bEng - aEng;
//         default:
//           return 0;
//       }
//     });
//   }, [searchTerm, filterIndustry, sortBy, processedData]);

//   // Calculate engagement score
//   const getEngagementScore = (item) => {
//     const total = 4;
//     const engaged = [item.email1Sent, item.email2Sent, item.email3Sent, item.called].filter(Boolean).length;
//     return Math.round((engaged / total) * 100);
//   };

//   const toggleExpanded = (index) => {
//     const newExpanded = new Set(expandedCards);
//     if (newExpanded.has(index)) {
//       newExpanded.delete(index);
//     } else {
//       newExpanded.add(index);
//     }
//     setExpandedCards(newExpanded);
//   };

//   const StatusBadge = ({ sent, label, icon: Icon }) => (
//     <div className={`group relative inline-flex items-center px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 ${
//       sent 
//         ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40' 
//         : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
//     }`}>
//       <Icon className="w-3 h-3 mr-1.5" />
//       {label}
//       {sent && <Sparkles className="w-3 h-3 ml-1 animate-pulse" />}
//     </div>
//   );

//   const colorMap = {
//     green: "from-green-500 to-green-600",
//     yellow: "from-yellow-500 to-yellow-600",
//     purple: "from-purple-500 to-purple-600",
//     orange: "from-orange-500 to-orange-600",
//     blue: "from-blue-500 to-blue-600",
//   };
  
// const MetricCard = ({ icon: Icon, title, value, trend, color = 'blue' }) => (
//     <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-xl">
//       <div className="flex items-center justify-between mb-4">
//         <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg`}>
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

//   const EngagementMeter = ({ score }) => (
//     <div className="relative">
//       <div className="flex items-center space-x-3">
//         <div className="relative w-16 h-16">
//           <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
//             <path
//               className="text-gray-200"
//               strokeWidth="3"
//               fill="none"
//               stroke="currentColor"
//               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//             />
//             <path
//               className={score > 75 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500'}
//               strokeWidth="3"
//               strokeDasharray={`${score}, 100`}
//               strokeLinecap="round"
//               fill="none"
//               stroke="currentColor"
//               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//             />
//           </svg>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <span className="text-sm font-bold">{score}%</span>
//           </div>
//         </div>
//         <div>
//           <p className="text-sm font-medium text-gray-700">Engagement</p>
//           <p className="text-xs text-gray-500">
//             {score > 75 ? 'Excellent' : score > 50 ? 'Good' : 'Needs Work'}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
   
//   const AttendanceSection = ({ item }) => {
//     const [localFeedback, setLocalFeedback] = useState(item.feedback || '');
//     const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//     const [isListening, setIsListening] = useState(false);
//     const isSaving = savingStates.has(item.id);
//     const timeoutRef = useRef(null);
//     const recognitionRef = useRef(null);
  
//     useEffect(() => {
//       setLocalFeedback(item.feedback || '');
//       setHasUnsavedChanges(false);
//     }, [item.id, item.feedback]);
  
//     // Initialize Speech Recognition for this textarea
//     useEffect(() => {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       if (!SpeechRecognition) return;
  
//       const recognition = new SpeechRecognition();
//       recognition.lang = "en-US";
//       recognition.interimResults = false;
//       recognition.maxAlternatives = 1;
//       recognition.continuous = true; // Allow continuous speech
  
//       recognition.onresult = (event) => {
//         let transcript = '';
        
//         // Get all results from the current session
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           if (event.results[i].isFinal) {
//             transcript += event.results[i][0].transcript + ' ';
//           }
//         }
  
//         if (transcript.trim()) {
//           // Append to existing feedback instead of replacing
//           const newFeedback = localFeedback + (localFeedback ? ' ' : '') + transcript.trim();
//           setLocalFeedback(newFeedback);
//           setHasUnsavedChanges(newFeedback !== (item.feedback || ''));
          
//           // Trigger auto-save
//           handleFeedbackInputChange(newFeedback);
//         }
//       };
  
//       recognition.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         setIsListening(false);
        
//         // Show user-friendly error messages
//         if (event.error === 'no-speech') {
//           alert('No speech detected. Please try again.');
//         } else if (event.error === 'not-allowed') {
//           alert('Microphone access denied. Please allow microphone permissions.');
//         } 
//         // else {
//         //   alert('Speech recognition error. Please try again.');
//         // }
//       };
  
//       recognition.onend = () => {
//         setIsListening(false);
//       };
  
//       recognitionRef.current = recognition;
  
//       // Cleanup
//       return () => {
//         if (recognitionRef.current) {
//           recognitionRef.current.abort();
//         }
//       };
//     }, [localFeedback, item.feedback]);
  
//     const handleFeedbackInputChange = (value) => {
//       setLocalFeedback(value);
//       setHasUnsavedChanges(value !== (item.feedback || ''));
  
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
  
//       timeoutRef.current = setTimeout(async () => {
//         if (value !== (item.feedback || '')) {
//           try {
//             await handleFeedbackChange(item, value);
//             setHasUnsavedChanges(false);
//           } catch (error) {
//             console.error('Auto-save failed:', error);
//           }
//         }
//       }, 2000);
//     };
  
//     const handleManualSave = async () => {
//       if (!hasUnsavedChanges || isSaving) return;
//       try {
//         await handleFeedbackChange(item, localFeedback);
//         setHasUnsavedChanges(false);
//         if (timeoutRef.current) {
//           clearTimeout(timeoutRef.current);
//         }
//       } catch (error) {
//         console.error('Manual save failed:', error);
//         alert('Failed to save feedback. Please try again.');
//       }
//     };
  
//     const handleVoiceToggle = () => {
//       if (!recognitionRef.current) {
//         alert('Speech recognition is not supported in this browser.');
//         return;
//       }
  
//       if (isListening) {
//         recognitionRef.current.stop();
//         setIsListening(false);
//       } else {
//         try {
//           recognitionRef.current.start();
//           setIsListening(true);
//         } catch (error) {
//           console.error('Failed to start speech recognition:', error);
//           alert('Failed to start voice recognition. Please try again.');
//         }
//       }
//     };
  
//     const clearFeedback = () => {
//       if (confirm('Are you sure you want to clear all feedback?')) {
//         setLocalFeedback('');
//         setHasUnsavedChanges(true);
//         handleFeedbackInputChange('');
//       }
//     };
  
//     useEffect(() => {
//       return () => {
//         if (timeoutRef.current) {
//           clearTimeout(timeoutRef.current);
//         }
//         if (recognitionRef.current && isListening) {
//           recognitionRef.current.abort();
//         }
//       };
//     }, [isListening]);
  
//     return (
//       <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 space-y-4">
//         <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
//           <Calendar className="w-5 h-5 mr-2" />
//           Event Attendance
//         </h4>
        
//         {/* Visited Status */}
//         <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
//           <div className="flex items-center space-x-3">
//             <div className={`p-2 rounded-lg ${item.visited ? 'bg-green-100' : 'bg-gray-100'}`}>
//               {item.visited ? (
//                 <CheckCircle className="w-5 h-5 text-green-600" />
//               ) : (
//                 <Circle className="w-5 h-5 text-gray-400" />
//               )}
//             </div>
//             <div>
//               <p className="font-medium text-gray-900">Event Attendance</p>
//               <p className="text-sm text-gray-500">
//                 {item.visited ? 'Attended the event' : 'Did not attend'}
//               </p>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-2">
//             {isSaving && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="sr-only peer"
//                 checked={item.visited || false}
//                 onChange={(e) => handleVisitedChange(item, e.target.checked)}
//                 disabled={isSaving}
//               />
//               <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-blue-600"></div>
//             </label>
//           </div>
//         </div>
  
//         {/* Enhanced Feedback section with Voice Input */}
//         <div className="p-4 bg-white rounded-xl shadow-sm">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center space-x-2">
//               <MessageSquare className="w-5 h-5 text-blue-600" />
//               <label className="font-medium text-gray-900">Remarks / Feedback</label>
//               {isSaving && (
//                 <div className="flex items-center space-x-2">
//                   <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//                   <span className="text-xs text-blue-600">Saving...</span>
//                 </div>
//               )}
//               {isListening && (
//                 <div className="flex items-center space-x-2">
//                   <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
//                   <span className="text-xs text-red-600 font-medium">Listening...</span>
//                 </div>
//               )}
//             </div>
            
//             <div className="flex items-center space-x-2">
//               {/* Voice Input Button */}
//               <button
//                 onClick={handleVoiceToggle}
//                 disabled={isSaving}
//                 className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
//                   isListening
//                     ? 'bg-red-600 text-white hover:bg-red-700'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                 } disabled:opacity-50 disabled:cursor-not-allowed`}
//                 title={isListening ? 'Stop voice input' : 'Start voice input'}
//               >
//                 <Mic className="w-3 h-3 mr-1" />
//                 {isListening ? 'Stop' : 'Voice'}
//               </button>
  
//               {/* Clear Button */}
//               {localFeedback && (
//                 <button
//                   onClick={clearFeedback}
//                   disabled={isSaving}
//                   className="flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                   title="Clear all feedback"
//                 >
//                   <X className="w-3 h-3 mr-1" />
//                   Clear
//                 </button>
//               )}
  
//               {/* Manual Save Button */}
//               {hasUnsavedChanges && !isSaving && (
//                 <button
//                   onClick={handleManualSave}
//                   className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
//                 >
//                   <Save className="w-3 h-3 mr-1" />
//                   Save Now
//                 </button>
//               )}
//             </div>
//           </div>
          
//           {/* Enhanced textarea with voice input indicator */}
//           <div className="relative">
//             <textarea
//               value={localFeedback}
//               onChange={(e) => handleFeedbackInputChange(e.target.value)}
//               placeholder={isListening 
//                 ? "Listening for your voice input..." 
//                 : "Type or click 'Voice' to speak your remarks and feedback..."
//               }
//               className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
//                 isListening 
//                   ? 'border-red-300 bg-red-50' 
//                   : 'border-gray-200'
//               }`}
//               rows={4}
//               disabled={false}
//               readOnly={false}
//               style={{ minHeight: '100px' }}
//             />
            
//             {/* Voice Input Indicator */}
//             {isListening && (
//               <div className="absolute top-2 right-2 flex items-center space-x-2 bg-red-100 px-2 py-1 rounded-full">
//                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                 <span className="text-xs text-red-700 font-medium">Recording</span>
//               </div>
//             )}
//           </div>
          
//           {/* Status Messages */}
//           <div className="flex items-center justify-between mt-2">
//             <div className="flex items-center space-x-4">
//               <p className="text-xs text-gray-500">
//                 {isSaving 
//                   ? 'Saving changes...'
//                   : hasUnsavedChanges 
//                     ? 'Changes will be saved automatically in 2 seconds...' 
//                     : 'Changes are saved automatically as you type'
//                 }
//               </p>
              
//               {isListening && (
//                 <p className="text-xs text-red-600 font-medium">
//                   Speak clearly. Your speech will be added to the existing text.
//                 </p>
//               )}
//             </div>
            
//             {hasUnsavedChanges && !isSaving && (
//               <div className="flex items-center text-orange-600">
//                 <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
//                 <span className="text-xs">Unsaved changes</span>
//               </div>
//             )}
//           </div>
  
//           {/* Character count and voice status */}
//           <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
//             <span className="text-xs text-gray-400">
//               {localFeedback.length} characters
//             </span>
            
//             <div className="text-xs text-gray-400">
//               Voice input: {
//                 !window.SpeechRecognition && !window.webkitSpeechRecognition 
//                   ? 'Not supported' 
//                   : 'Available'
//               }
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Calculate summary stats
//   const totalRevenue = processedData.reduce((sum, item) => {
//     return sum + (parseInt(item.revenuePerMonth.replace(/[$,]/g, '')) || 0);
//   }, 0);
  
//   const avgEngagement = Math.round(
//     processedData.reduce((sum, item) => sum + getEngagementScore(item), 0) / (processedData.length || 1)
//   );

//   const highValueLeads = processedData.filter(item => 
//     (parseInt(item.revenuePerMonth.replace(/[$,]/g, '')) || 0) > 40000
//   ).length;

//   const attendanceRate = Math.round(
//     (processedData.filter(item => item.visited).length / (processedData.length || 1)) * 100
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading attendee data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto p-6">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center space-x-4 mb-4">
           
//             <div className="py-8 px-4"> {/* Adds top/bottom padding + side spacing */}
//             <h1 className="flex items-center space-x-3 text-4xl font-bold">
//                 {/* Left Logo */}
//                 <img
//                 src="/LateShipment-Logo.svg"
//                 alt="Left Logo"
//                 className="h-12 w-auto object-contain"
//                 />

//                 {/* Handshake */}
//                 {/* <span className="text-3xl">🤝</span> */}
//                 <Infinity className="w-16 h-16 text-gray-700" />   
//                 {/* Right Logo */}
//                 <img
//                 src="/Ecom-North-logo.svg"
//                 alt="Ecom North Logo"
//                 className="h-12 w-auto object-contain"
//                 />

//                 {/* Gradient only on text */}
//                 <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 
//                                 bg-clip-text text-transparent">
//                 Toronto Summit – Canada
//                 </span>
//             </h1>

//             <p className="mt-3 text-gray-600 text-lg">
//                 {/* Advanced analytics for Lateshipment business relationships */}
//             </p>
//             </div>

//           </div>
          
//           {/* Summary Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//             <MetricCard 
//               icon={DollarSign}
//               title="Total Monthly Revenue"
//               value={`$${(totalRevenue/1000).toFixed(0)}K`}
//             //   trend="12"
//               color="green"
//             />
//             <MetricCard 
//               icon={Activity}
//               title="Active Leads"
//               value={processedData.length}
//             //   trend="8"
//               color="yellow"
//             />
//             <MetricCard 
//               icon={Target}
//               title="High Value Leads"
//               value={highValueLeads}
//             //   trend="15"
//               color="purple"
//             />
//             <MetricCard 
//               icon={UserCheck}
//               title="Attendance Rate"
//               value={`${attendanceRate}%`}
//               color="orange"
//             />

//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 mb-8">
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//             {/* Search */}
//             {/* <div>
//             <Mic
//                     onClick={handleMicClick}
//                     className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer ${
//                     listening ? "text-black-500 animate-pulse" : "text-red-400"
//                     }`}
//                 />
//             </div> */}
//             <div className="lg:col-span-2 relative">
//                {/* Left search icon */}
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-5 text-gray-400" />

//             {/* Mic button (always visible) */}
//             <Mic
//             onClick={handleMicClick}
//             className={`absolute right-10 top-1/2 transform -translate-y-1/2 w-6 h-6 z-5 cursor-pointer ${
//                 listening ? "text-red-500 animate-pulse" : "text-gray-700"
//             }`}
//             />

//             {/* Input field */}
//             <input
//             type="text"
//             placeholder="Search by name, brand, or website..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-20 py-4 border-2 border-gray-200 rounded-2xl 
//                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
//                         shadow-sm bg-white/90 backdrop-blur text-gray-900 placeholder-gray-500"
//             />

//             {/* Clear button (only show when text exists) */}
//             {searchTerm && (
//             <X
//                 onClick={() => setSearchTerm("")}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 
//                         text-gray-400 hover:text-gray-600 cursor-pointer"
//             />
//             )}
//             </div> 
            
//             {/* Industry Filter */}
//             <div className="relative">
//               <select
//                 value={filterIndustry}
//                 onChange={(e) => setFilterIndustry(e.target.value)}
//                 className="w-full py-4 px-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/90 backdrop-blur appearance-none"
//               >
//                 {industries.map(industry => (
//                   <option key={industry} value={industry}>
//                     {industry === 'all' ? 'All Industries' : industry}
//                   </option>
//                 ))}
//               </select>
//               <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//             </div>
            
//             {/* Sort & View Mode */}
//             <div className="flex space-x-2">
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="flex-1 py-4 px-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/90 backdrop-blur appearance-none"
//               >
//                 <option value="revenue">Revenue</option>
//                 <option value="name">Name</option>
//                 <option value="engagement">Engagement</option>
//               </select>
              
//               <div className="flex bg-gray-100 rounded-2xl p-1">
//                 <button
//                   onClick={() => setViewMode('cards')}
//                   className={`p-3 rounded-xl transition-all ${viewMode === 'cards' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}
//                 >
//                   <Grid className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('compact')}
//                   className={`p-3 rounded-xl transition-all ${viewMode === 'compact' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}
//                 >
//                   <List className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Results Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-4">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {filteredData.length} Results Found
//             </h2>
//             {searchTerm && (
//               <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//                 Searching: "{searchTerm}"
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Results */}
//         <div className={`${viewMode === 'cards' ? 'space-y-8' : 'space-y-4'}`}>
//           {filteredData.map((item, index) => {
//             const engagementScore = getEngagementScore(item);
//             const revenue = parseInt(item.revenuePerMonth.replace(/[$,]/g, '')) || 0;
//             const isHighValue = revenue > 40000;
            
//             return (
//               <div 
//                 key={item.id || index} 
//                 className={`group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${
//                   viewMode === 'cards' 
//                     ? 'bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl'
//                     : 'bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 hover:shadow-xl'
//                 }`}
//                 style={{
//                   transform: `translateY(${Math.sin(animationStep * 0.1 + index) * 2}px)`,
//                   transition: 'transform 0.1s ease-in-out'
//                 }}
//               >
  
//                 {/* Header Section */}
//                 <div className={`relative ${viewMode === 'cards' ? 'p-8' : 'p-6'} bg-gradient-to-r from-gray-50/50 to-blue-50/50`}>
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center space-x-6">
//                       {/* Enhanced Avatar */}
//                       <div className="relative">
//                         <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
//                           {item.firstName[0]}{item.lastName[0]}
//                         </div>
//                         <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${
//                           item.visited ? 'bg-green-500' : 'bg-gray-400'
//                         }`}>
//                           <div className="w-2 h-2 bg-white rounded-full"></div>
//                         </div>
//                       </div>
                      
//                       {/* Enhanced Basic Info */}
//                       <div className="flex-1">
//                         <h2 className="text-3xl font-bold text-gray-900 mb-2">
//                           {item.firstName} {item.lastName}
//                         </h2>
//                         <div className="flex flex-wrap gap-3 mb-3">
//                           <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
//                             <Building className="w-4 h-4 mr-2" />
//                             {item.brand}
//                           </span>
//                           <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
//                             <Globe className="w-4 h-4 mr-2" />
//                             <a
//         href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-600 hover:underline"
//       >
//         {item.website}
//       </a>
//                           </span>
//                           <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
//                             <Award className="w-4 h-4 mr-2" />
//                             {item.title}
//                           </span>
//                         </div>
//                         <p className="text-gray-700 font-medium mb-2">{item.business} • {item.industry}</p>
//                         <div className="flex items-center text-gray-600">
//                           <MapPin className="w-4 h-4 mr-2" />
//                           {item.location}
//                         </div>
//                       </div>
//                     </div>
                    
//                     {/* Enhanced Revenue & Engagement */}
//                     <div className="text-right space-y-4">
//                       <div>
//                         <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
//                           {item.revenuePerMonth}
//                         </div>
//                         <div className="text-sm text-gray-500">Monthly Revenue</div>
//                       </div>
//                       <EngagementMeter score={engagementScore} />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Enhanced Main Content */}
//                 <div className={`${viewMode === 'cards' ? 'p-8' : 'p-6'}`}>
//                   {/* Enhanced Quick Info Grid */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//                     <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-105">
//                       <div className="flex items-center mb-3">
//                         <Mail className="w-5 h-5 text-blue-600 mr-2" />
//                         <span className="text-sm font-semibold text-blue-800">Email</span>
//                       </div>
//                       <p className="text-sm text-blue-700 break-all">{item.emailId}</p>
//                     </div>
                    
//                     <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200 hover:border-green-300 transition-all duration-300 hover:scale-105">
//                       <div className="flex items-center mb-3">
//                         <Phone className="w-5 h-5 text-green-600 mr-2" />
//                         <span className="text-sm font-semibold text-green-800">Phone</span>
//                       </div>
//                       <p className="text-sm text-green-700">{item.phoneNo}</p>
//                     </div>
                    
//                     <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:scale-105">
//                       <div className="flex items-center mb-3">
//                         <ExternalLink className="w-5 h-5 text-purple-600 mr-2" />
//                         <span className="text-sm font-semibold text-purple-800">LinkedIn</span>
//                       </div>
//                       <p>
//                         <a
//                           href={item.liProfile}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-sm text-purple-700"
//                         >
//                           View Profile
//                         </a>
//                       </p>
//                     </div>
                    
//                     <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:scale-105">
//                       <div className="flex items-center mb-3">
//                         <User className="w-5 h-5 text-orange-600 mr-2" />
//                         <span className="text-sm font-semibold text-orange-800">Notes</span>
//                       </div>
//                       <p className="text-sm text-orange-700 line-clamp-2">{item.comment}</p>
//                     </div>
//                   </div>

//                   {/* Attendance Section */}
//                   <div className="mb-6">
//                     <AttendanceSection item={item} />
//                   </div>

//                   {/* Communication Status */}
//                   <div className="mb-6">
//                     <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                       <Activity className="w-5 h-5 mr-2" />
//                       Communication Timeline
//                     </h3>
//                     <div className="flex flex-wrap gap-3">
//                       <StatusBadge sent={item.email1Sent} label="Initial Email" icon={Mail} />
//                       <StatusBadge sent={item.email2Sent} label="Follow-up" icon={Mail} />
//                       <StatusBadge sent={item.email3Sent} label="Final Email" icon={Mail} />
//                       <StatusBadge sent={item.called} label="Phone Call" icon={Phone} />
//                     </div>
//                   </div>

//                   {/* Enhanced Expandable Details */}
//                   <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
//                     <button
//                       onClick={() => toggleExpanded(index)}
//                       className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 flex items-center justify-between transition-all duration-300 group"
//                     >
//                       <div className="flex items-center">
//                         <Eye className="w-5 h-5 text-gray-600 mr-3 group-hover:text-blue-600 transition-colors" />
//                         <span className="font-bold text-gray-800 group-hover:text-blue-800 transition-colors">
//                           Detailed Business Intelligence
//                         </span>
//                       </div>
//                       <div className="flex items-center">
//                         <span className="text-sm text-gray-600 mr-2 group-hover:text-blue-600">
//                           {expandedCards.has(index) ? 'Hide Details' : 'Show Details'}
//                         </span>
//                         {expandedCards.has(index) ? (
//                           <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
//                         ) : (
//                           <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
//                         )}
//                       </div>
//                     </button>
                    
//                     {expandedCards.has(index) && (
//                       <div className="p-6 border-t-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 animate-in slide-in-from-top duration-300">
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                           {/* Left Column */}
//                           <div className="space-y-6">
//                             <div className="group">
//                               <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
//                                 <Code className="w-5 h-5 mr-2" />
//                                 Technology Stack
//                               </h4>
//                               <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200 space-y-3">
//                                 <div className="p-3 bg-white rounded-xl shadow-sm">
//                                   <p className="text-sm font-medium text-gray-700 mb-1">Current Tech Stack:</p>
//                                   <p className="text-sm text-gray-600">{item.techStack}</p>
//                                 </div>
//                                 <div className="p-3 bg-white rounded-xl shadow-sm">
//                                   <p className="text-sm font-medium text-gray-700 mb-1">Post-Purchase Stack:</p>
//                                   <p className="text-sm text-gray-600">{item.postPurchaseTechStack}</p>
//                                 </div>
//                               </div>
//                             </div>
                            
//                             <div className="group">
//                               <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
//                                 <Truck className="w-5 h-5 mr-2" />
//                                 Logistics & Shipping
//                               </h4>
//                               <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 space-y-3">
//                                 <div className="p-3 bg-white rounded-xl shadow-sm">
//                                   <p className="text-sm font-medium text-gray-700 mb-1">Carriers:</p>
//                                   <p className="text-sm text-gray-600">{item.carriers}</p>
//                                 </div>
//                                 <div className="p-3 bg-white rounded-xl shadow-sm">
//                                   <p className="text-sm font-medium text-gray-700 mb-1">Shipping Policy:</p>
//                                   <p className="text-sm text-gray-600">{item.shipping}</p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
                          
//                           {/* Right Column */}
//                           <div className="space-y-6">
//                             <div className="group">
//                               <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
//                                 <RotateCcw className="w-5 h-5 mr-2" />
//                                 Returns & Policies
//                               </h4>
//                               <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
//                                 <div className="p-3 bg-white rounded-xl shadow-sm">
//                                   <p className="text-sm text-gray-600">{item.returnSolutions}</p>
//                                 </div>
//                               </div>
//                             </div>
                            
//                             <div className="group">
//                               <h4 className="flex items-center text-lg font-bold text-gray-800 mb-4">
//                                 <Shield className="w-5 h-5 mr-2" />
//                                 Insurance Coverage
//                               </h4>
//                               <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
//                                 <div className="p-3 bg-white rounded-xl shadow-sm">
//                                   <p className="text-sm text-gray-600">{item.insurance}</p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
        
//         {/* No Results */}
//         {filteredData.length === 0 && searchTerm && (
//           <div className="text-center py-16">
//             <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-white/20">
//               <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <Search className="w-12 h-12 text-gray-400" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-700 mb-3">
//                 No results found for "{searchTerm}"
//               </h3>
//               <p className="text-gray-500 mb-6">
//                 Try adjusting your search terms or filters to find what you're looking for.
//               </p>
//               <button
//                 onClick={() => {
//                   setSearchTerm('');
//                   setFilterIndustry('all');
//                 }}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };


// export default BusinessSearchApp;