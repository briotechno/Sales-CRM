import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, Zap, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGetWhatsAppTemplatesQuery, useSendWhatsAppMessageMutation } from '../../store/api/integrationApi';

const SendWhatsAppModal = ({ isOpen, onClose, lead }) => {
    const { data: templatesData, isLoading: isTemplatesLoading, error: templatesError, refetch } = useGetWhatsAppTemplatesQuery(undefined, { skip: !isOpen });
    const [sendMessage, { isLoading: isSending }] = useSendWhatsAppMessageMutation();

    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [variables, setVariables] = useState({});
    const [preview, setPreview] = useState('');

    const templates = templatesData?.data || [];

    useEffect(() => {
        if (selectedTemplate) {
            // Find body component to get variable count
            const bodyComponent = selectedTemplate.components.find(c => c.type === 'BODY');
            const text = bodyComponent?.text || '';
            setPreview(text);

            // Extract variables from text like {{1}}, {{2}}
            const variableMatches = text.match(/{{(\d+)}}/g);
            if (variableMatches) {
                const initialVars = {};
                variableMatches.forEach(match => {
                    const num = match.replace(/{{|}}/g, '');
                    // Default behavior: if {{1}} is usually name, fill it
                    if (num === '1' && lead?.name) {
                        initialVars[num] = lead.name;
                    } else {
                        initialVars[num] = '';
                    }
                });
                setVariables(initialVars);
            } else {
                setVariables({});
            }
        }
    }, [selectedTemplate, lead]);

    const handleVariableChange = (num, value) => {
        setVariables(prev => ({ ...prev, [num]: value }));
    };

    const getDynamicPreview = () => {
        let text = preview;
        Object.keys(variables).forEach(num => {
            const val = variables[num] || `{{${num}}}`;
            text = text.replace(`{{${num}}}`, val);
        });
        return text;
    };

    const handleSend = async () => {
        if (!selectedTemplate) return toast.error("Please select a template");
        
        try {
            // Format components for Meta API
            const bodyParams = Object.keys(variables)
                .sort((a, b) => a - b)
                .map(num => ({
                    type: "text",
                    text: variables[num]
                }));

            const payload = {
                phone: lead.whatsapp_number || lead.mobile_number || lead.phone,
                templateName: selectedTemplate.name,
                languageCode: selectedTemplate.language,
                leadId: lead.id,
                components: bodyParams.length > 0 ? [{
                    type: "body",
                    parameters: bodyParams
                }] : []
            };

            await sendMessage(payload).unwrap();
            toast.success("WhatsApp message sent successfully!");
            onClose();
        } catch (error) {
            toast.error(error.data?.message || "Failed to send message");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 bg-orange-500 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/20 rounded-sm">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold tracking-tight">Send WhatsApp Template</h3>
                            <p className="text-[11px] text-white/80 font-medium">To: {lead?.name} ({lead?.mobile_number || lead?.phone})</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Template Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Zap size={14} className="text-orange-500" /> Select Approved Template
                        </label>
                        {isTemplatesLoading ? (
                            <div className="h-12 bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center gap-3 text-gray-400">
                                <Loader2 size={18} className="animate-spin" />
                                <span className="text-xs font-semibold">Loading templates from Meta...</span>
                            </div>
                        ) : (
                            <select 
                                className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-orange-500 outline-none text-sm font-semibold text-gray-800"
                                onChange={(e) => {
                                    const t = templates.find(temp => temp.name === e.target.value);
                                    setSelectedTemplate(t);
                                }}
                                value={selectedTemplate?.name || ""}
                            >
                                <option value="">-- Choose a template --</option>
                                {templates.map(t => (
                                    <option key={t.id} value={t.name}>{t.name} ({t.language})</option>
                                ))}
                            </select>
                        )}
                        {templatesError && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm flex gap-3 animate-slideUp">
                                <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[11px] font-black text-amber-600 uppercase tracking-widest mb-1">Status: {templatesError.status}</p>
                                    <p className="text-[12px] text-amber-700 font-bold leading-relaxed">
                                        {templatesError.status === 404 
                                            ? "WhatsApp is not configured. Please go to Channel Settings -> WhatsApp and save your Meta API details first." 
                                            : (templatesError.data?.message || "Failed to load templates. Check your Meta Token and Business Account ID.")}
                                    </p>
                                </div>
                            </div>
                        )}
                        {!isTemplatesLoading && !templatesError && templates.length === 0 && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-sm flex gap-3 animate-slideUp">
                                <Info size={16} className="text-red-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] text-red-600 font-bold leading-relaxed">
                                    No approved templates found in your Meta Business Account. Please ensure you have approved templates in Meta Developers Portal.
                                </p>
                            </div>
                        )}
                    </div>

                    {selectedTemplate && (
                        <div className="animate-slideUp space-y-6">
                            {/* Dynamic Variables */}
                            {Object.keys(variables).length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b pb-2">Fill Template Variables</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.keys(variables).sort().map(num => (
                                            <div key={num} className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-gray-600">Variable &#123;&#123;{num}&#125;&#125;</label>
                                                <input 
                                                    type="text"
                                                    value={variables[num]}
                                                    onChange={(e) => handleVariableChange(num, e.target.value)}
                                                    placeholder={`Value for {{${num}}}`}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:border-orange-500 outline-none text-xs font-semibold"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Live Preview Card */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Message Preview</h4>
                                <div className="bg-[#E9EDEF] rounded-lg p-3 max-w-[85%] relative shadow-sm border border-gray-200">
                                    <div className="bg-white rounded-lg p-3 text-sm text-gray-800 leading-relaxed shadow-sm">
                                        {getDynamicPreview()}
                                    </div>
                                    <div className="flex items-center justify-end mt-1 gap-1">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">11:45 PM</span>
                                        <CheckCircle2 size={12} className="text-blue-500" />
                                    </div>
                                    {/* Whatsapp bubble tail */}
                                    <div className="absolute top-0 -left-1.5 w-4 h-4 bg-[#E9EDEF] rotate-45 -z-10"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wide"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSend}
                        disabled={!selectedTemplate || isSending}
                        className="px-8 py-2.5 bg-orange-500 text-white rounded-sm font-bold shadow-lg hover:shadow-xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 uppercase tracking-wide text-sm"
                    >
                        {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        {isSending ? "Sending..." : "Send via WhatsApp"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendWhatsAppModal;
