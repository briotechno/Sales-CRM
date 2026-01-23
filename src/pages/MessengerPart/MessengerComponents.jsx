import React from "react";
import {
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  Send,
  Paperclip,
  Smile,
  ImageIcon,
  File,
  X,
  Search,
  MessageCircle,
  Mail,
  Camera,
  Mic,
  User as UserIcon,
  MoreVertical,
  Copy,
  Forward,
  Trash2,
  Edit3,
  Star,
  Pin,
  Bell,
  BellOff,
  Volume2,
  Clock,
  Download,
  Reply,
  ArrowLeft,
  FileText,
  Video as VideoIcon,
  MapPin,
  MessageSquare,
  Square,
  Plus,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/";

const handleDownload = async (url, fileName) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback to basic open if fetch fails
    window.open(url, '_blank');
  }
};

// Contacts List Component
export function ContactsList({ contacts, selectedChat, onChatSelect }) {
  if (contacts.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300">
          <Search className="text-orange-400" size={32} />
        </div>
        <p className="text-base font-bold text-gray-800">No contacts found</p>
        <p className="text-sm text-gray-400 mt-2 max-w-[200px]">
          We couldn't find any matching contacts or messages.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
      <div className="py-2">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onChatSelect(contact)}
            className={`mx-3 mb-1 p-3.5 rounded-xl cursor-pointer transition-all duration-300 relative group overflow-hidden ${selectedChat?.id === contact.id
              ? "bg-orange-50 shadow-sm ring-1 ring-orange-200"
              : "hover:bg-gray-50 bg-transparent"
              }`}
          >
            {/* Active Indicator */}
            {selectedChat?.id === contact.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(255,123,29,0.5)]"></div>
            )}

            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-white shadow-md transition-transform duration-500 group-hover:scale-105 ${contact.status === "online"
                    ? "bg-gradient-to-br from-orange-400 to-orange-600"
                    : contact.status === "away"
                      ? "bg-gradient-to-br from-yellow-400/80 to-yellow-600/80"
                      : "bg-gradient-to-br from-gray-300 to-gray-400"
                    }`}
                >
                  {contact.avatar}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ring-1 ring-black/5 ${contact.status === "online"
                    ? "bg-green-500"
                    : contact.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                    }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`text-sm font-black transition-colors truncate ${selectedChat?.id === contact.id ? "text-orange-900" : "text-gray-900"
                    }`}>
                    {contact.name}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 flex-shrink-0">
                    {contact.time}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider mb-0.5">
                      {contact.role}
                    </span>
                    <p className={`text-xs truncate transition-colors leading-tight ${selectedChat?.id === contact.id ? "text-orange-700/80 font-medium" : "text-gray-500"
                      }`}>
                      {contact.lastMessage}
                    </p>
                  </div>

                  {contact.unread > 0 && (
                    <div className="bg-orange-500 text-white text-[10px] font-black rounded-full min-w-[20px] h-[20px] flex items-center justify-center flex-shrink-0 shadow-[0_4px_10px_rgba(255,123,29,0.3)] animate-pulse">
                      {contact.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Chat Header Component
export function ChatHeader({
  selectedChat,
  showChatInfo,
  onToggleChatInfo,
  notifications,
  setNotifications,
  chatSearchQuery,
  setChatSearchQuery,
  pinnedMessage,
}) {
  return (
    <>
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={onToggleChatInfo}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-base font-black text-white shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:rotate-6 ring-4 ring-orange-50">
              {selectedChat.avatar}
            </div>
            <div
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white shadow-md ${selectedChat.status === "online"
                ? "bg-green-500"
                : selectedChat.status === "away"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
                }`}
            />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1">
              {selectedChat.name}
            </h2>
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${selectedChat.status === "online" ? "text-green-600" : "text-gray-400"
                }`}>
                {selectedChat.status === "online" ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                    {selectedChat.status}
                  </>
                )}
              </span>
              <span className="text-gray-200">|</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedChat.role}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Internal Search */}
          <div className="relative group hidden md:block">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-orange-500"
              size={14}
            />
            <input
              type="text"
              placeholder="Find in history..."
              value={chatSearchQuery}
              onChange={(e) => setChatSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-2 text-xs bg-gray-50 border-2 border-transparent rounded-full focus:outline-none focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50 w-48 transition-all"
            />
            {chatSearchQuery && (
              <button
                onClick={() => setChatSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="h-8 w-[1px] bg-gray-100 mx-1"></div>

          <div className="flex items-center gap-1">
            {[
              { icon: Phone, title: "Call" },
              { icon: Video, title: "Video Chat" },
            ].map((btn, i) => (
              <button
                key={i}
                className="p-2.5 hover:bg-orange-50 text-gray-500 hover:text-orange-600 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
                title={btn.title}
              >
                <btn.icon size={20} className="transition-transform group-hover:rotate-12" />
              </button>
            ))}

            <button
              onClick={() => setNotifications(!notifications)}
              className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group ${notifications ? "text-gray-500 hover:bg-orange-50 hover:text-orange-600" : "text-gray-400 hover:bg-gray-100"
                }`}
              title={notifications ? "Mute" : "Unmute"}
            >
              {notifications ? <Bell size={20} /> : <BellOff size={20} />}
            </button>

            <button
              onClick={onToggleChatInfo}
              className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group ml-1 ${showChatInfo
                ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                : "bg-gray-50 text-gray-500 hover:bg-orange-100 hover:text-orange-600"
                }`}
            >
              <Info size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Pinned Message Banner - Modern Style */}
      {pinnedMessage && (
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200/50 px-6 py-2.5 flex items-center gap-4 animate-slideDown shadow-inner">
          <div className="p-1.5 bg-orange-500 rounded-lg text-white animate-bounce-subtle">
            <Pin size={12} fill="white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-0.5">
              Pinned Message
            </p>
            <p className="text-xs text-orange-800 truncate font-medium">
              {pinnedMessage.text}
            </p>
          </div>
          <button className="text-[10px] font-black text-orange-600 hover:text-orange-900 uppercase tracking-widest hover:underline px-2 py-1">
            Jump
          </button>
        </div>
      )}
    </>
  );
}

// Chat Messages Component
export function ChatMessages({
  messages,
  typingIndicator,
  selectedChatId,
  messagesEndRef,
  showMessageMenu,
  setShowMessageMenu,
  showReactionPicker,
  setShowReactionPicker,
  onReaction,
  onReply,
  onEdit,
  onDelete,
  onCopy,
  onStar,
  onPin,
  onForward,
  starredMessages,
  currentUserId,
  currentUserType,
}) {
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  return (
    <div className="flex-1 px-4 py-6 md:px-8 bg-white relative">

      <div className="space-y-8 pb-20 relative z-10">
        {/* Decorative Grid Pattern - Moved inside to avoid layout shift */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FF7B1D 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        {messages.map((msg, idx) => {
          // Check if message is from current user
          const isMe = !!((Number(msg.sender_id) === Number(currentUserId) && msg.sender_type === currentUserType) || msg.sender === "me");
          const showTime = !!(idx === 0 || (messages[idx - 1] && messages[idx - 1].time !== msg.time));

          const getInitials = () => {
            if (msg.sender_name) return msg.sender_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            if (typeof msg.sender === 'string') return msg.sender.substring(0, 2);
            return "??";
          };

          return (
            <div key={msg.id} className={`group relative flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {showTime && (
                <div className="w-full flex justify-center mb-6 mt-2">
                  <span className="px-4 py-1.5 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] rounded-full border border-gray-100 shadow-sm">
                    {msg.time || 'Just now'}
                  </span>
                </div>
              )}

              {/* Reply Preview */}
              {!!(msg.replyTo && (msg.replyTo.text || msg.replyTo.sender_name || msg.replyTo.sender)) && (
                <div className={`mb-1 px-4 py-3 rounded-2xl text-xs flex max-w-[80%] border-2 transition-all group-hover:scale-[1.02] ${isMe
                  ? "bg-orange-50/50 border-orange-100 text-orange-900 italic mr-2"
                  : "bg-gray-50 border-gray-100 text-gray-600 ml-2"
                  }`}>
                  <div className="flex items-start gap-2">
                    <Reply size={12} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-black text-[10px] uppercase tracking-wider mb-1 opacity-70">
                        {msg.replyTo.sender_name || msg.replyTo.sender}
                      </span>
                      <p className="truncate line-clamp-2">{msg.replyTo.text}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"} items-end gap-2 group/msg`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-orange-700 shadow-sm uppercase">
                    {getInitials()}
                  </div>
                )}

                <div className="relative group/bubble max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
                  <div
                    className={`px-5 py-3.5 rounded-3xl shadow-sm transition-all duration-300 relative group-hover/msg:shadow-xl min-w-[120px] ${isMe
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-none hover:rotate-[-0.5deg]"
                      : "bg-white border-2 border-gray-100 text-gray-800 rounded-bl-none hover:rotate-[0.5deg]"
                      }`}
                  >
                    {/* Forwarded Badge */}
                    {!!(msg.is_forwarded === true || msg.is_forwarded === 1 || msg.is_forwarded === "1") && (
                      <div className={`flex items-center gap-1.5 mb-2 opacity-80 ${isMe ? "text-orange-100" : "text-gray-400"}`}>
                        <Forward size={12} className="italic" />
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] italic">Forwarded</span>
                      </div>
                    )}

                    {/* Voice Message */}
                    {!!msg.isVoice && msg.duration > 0 && (
                      <div className="flex items-center gap-3 mb-2 p-2 bg-black/5 rounded-xl">
                        <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                          <Mic size={16} />
                        </button>
                        <div className="flex-1 flex items-center gap-1">
                          {[1, 2, 3, 4, 5, 6, 1, 2, 3].map((h, i) => (
                            <div key={i} className="flex-1 bg-white/40 rounded-full" style={{ height: h * 4 + 'px' }}></div>
                          ))}
                        </div>
                        <span className="text-[10px] font-black opacity-80">{msg.duration}s</span>
                      </div>
                    )}

                    {/* File Attachments (Single or Multiple) */}
                    {(msg.file_url || (msg.attachments && msg.attachments.length > 0)) && (
                      <div className="mb-3 space-y-3">
                        {/* If we have a consolidated attachments array, render it specifically */}
                        {msg.attachments && msg.attachments.length > 0 ? (
                          <div className={`grid gap-2 ${msg.attachments.filter(f => f.message_type === 'image').length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {msg.attachments.map((file, index) => {
                              const isImg = file.message_type === 'image' || file.file_url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
                              const isVid = file.message_type === 'video' || file.file_url.match(/\.(mp4|webm|ogg)$/i);
                              const fUrl = file.file_url.startsWith('http') || file.file_url.startsWith('blob:') || file.file_url.startsWith('data:') ? file.file_url : `${API_BASE_URL.replace(/\/api\/?$/, '')}/${file.file_url}`;

                              if (isImg) {
                                return (
                                  <div key={index} className="relative group/img overflow-hidden rounded-2xl shadow-sm cursor-pointer ring-1 ring-black/5 bg-gray-50">
                                    <img
                                      src={fUrl}
                                      alt={file.file_name}
                                      className="w-full h-48 object-cover transition-all duration-700 group-hover/img:scale-105"
                                      onClick={() => window.open(fUrl, '_blank')}
                                    />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDownload(fUrl, file.file_name || 'image.png');
                                        }}
                                        className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 shadow-lg"
                                      >
                                        <Download size={14} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              } else if (isVid) {
                                return (
                                  <div key={index} className="relative group/vid overflow-hidden rounded-2xl shadow-sm bg-black/10 ring-1 ring-black/5">
                                    <video src={fUrl} className="w-full max-h-[300px] object-cover" controls />
                                  </div>
                                );
                              } else {
                                return (
                                  <div
                                    key={index}
                                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all hover:shadow-md cursor-pointer ${isMe ? "bg-white/10 border-white/20" : "bg-gray-50 border-gray-100"}`}
                                    onClick={() => window.open(fUrl, '_blank')}
                                  >
                                    <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center shadow-inner ${isMe ? "bg-white/20 text-white" : "bg-[#f8f9fa] text-[#FF7B1D]"}`}>
                                      <FileText size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm font-bold truncate mb-0.5 ${isMe ? "text-white" : "text-gray-900"}`}>{file.file_name || 'Document'}</p>
                                      <p className={`text-[9px] uppercase font-black tracking-widest opacity-60 ${isMe ? "text-white/80" : "text-gray-500"}`}>
                                        {file.file_size || '0 KB'}
                                      </p>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(fUrl, file.file_name);
                                      }}
                                      className={`p-2 rounded-full transition-all ${isMe ? "hover:bg-white/20 text-white" : "hover:bg-gray-200 text-gray-500"}`}
                                    >
                                      <Download size={18} />
                                    </button>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        ) : msg.file_url && (
                          /* Fallback for single file stored in legacy columns */
                          <div className="w-full">
                            {msg.message_type === 'image' || msg.file_url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                              <div className="relative group/img overflow-hidden rounded-2xl shadow-sm cursor-pointer ring-1 ring-black/5 bg-gray-50 max-w-sm">
                                <img
                                  src={msg.file_url.startsWith('http') || msg.file_url.startsWith('blob:') || msg.file_url.startsWith('data:') ? msg.file_url : `${API_BASE_URL.replace(/\/api\/?$/, '')}/${msg.file_url}`}
                                  alt={msg.file_name}
                                  className="w-full h-auto max-h-[400px] object-cover transition-all duration-700 group-hover/img:scale-105"
                                  onClick={() => window.open(msg.file_url.startsWith('http') || msg.file_url.startsWith('blob:') || msg.file_url.startsWith('data:') ? msg.file_url : `${API_BASE_URL.replace(/\/api\/?$/, '')}/${msg.file_url}`, '_blank')}
                                />
                                <div className="absolute top-3 right-3 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownload(
                                        msg.file_url.startsWith('http') || msg.file_url.startsWith('blob:') || msg.file_url.startsWith('data:') ? msg.file_url : `${API_BASE_URL.replace(/\/api\/?$/, '')}/${msg.file_url}`,
                                        msg.file_name || 'image.png'
                                      );
                                    }}
                                    className="p-2.5 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-all block shadow-lg"
                                  >
                                    <Download size={16} />
                                  </button>
                                </div>
                              </div>
                            ) : msg.message_type === 'video' || msg.file_url.match(/\.(mp4|webm|ogg)$/i) ? (
                              <div className="relative group/vid overflow-hidden rounded-2xl shadow-sm bg-black/10 ring-1 ring-black/5 max-w-sm">
                                <video
                                  src={msg.file_url.startsWith('http') || msg.file_url.startsWith('blob:') || msg.file_url.startsWith('data:') ? msg.file_url : `${API_BASE_URL.replace(/\/api\/?$/, '')}/${msg.file_url}`}
                                  className="w-full max-h-[400px] object-cover"
                                  controls
                                />
                              </div>
                            ) : (
                              <div
                                className={`flex items-center gap-4 p-4 rounded-3xl border transition-all hover:shadow-md cursor-pointer ${isMe ? "bg-white/10 border-white/20" : "bg-gray-50 border-gray-100"
                                  }`}
                                onClick={() => window.open(msg.file_url.startsWith('http') || msg.file_url.startsWith('blob:') || msg.file_url.startsWith('data:') ? msg.file_url : `${API_BASE_URL.replace(/\/api\/?$/, '')}/${msg.file_url}`, '_blank')}
                              >
                                <div className={`w-14 h-14 flex-shrink-0 rounded-[20px] flex items-center justify-center shadow-inner ${isMe ? "bg-white/20 text-white" : "bg-[#f8f9fa] text-[#FF7B1D]"
                                  }`}>
                                  <FileText size={28} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-bold truncate mb-0.5 ${isMe ? "text-white" : "text-gray-900"}`}>{msg.file_name || 'Document'}</p>
                                  <p className={`text-[10px] uppercase font-black tracking-widest opacity-60 ${isMe ? "text-white/80" : "text-gray-500"}`}>
                                    {msg.file_size || '0 KB'} • {msg.file_name?.split('.').pop().toUpperCase() || 'FILE'}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(
                                      msg.file_url.startsWith('http') || msg.file_url.startsWith('blob:') || msg.file_url.startsWith('data:') ? msg.file_url : `${API_BASE_URL.replace(/\/api\/?$/, '')}/${msg.file_url}`,
                                      msg.file_name
                                    );
                                  }}
                                  className={`p-2.5 rounded-full transition-all ${isMe ? "hover:bg-white/20 text-white" : "hover:bg-gray-200 text-gray-500"}`}
                                >
                                  <Download size={20} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {msg.text && (
                      <p className={`leading-[1.6] font-medium selection:bg-white/30 selection:text-white ${isMe ? "drop-shadow-sm" : ""} ${/^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/.test(msg.text.trim()) && msg.text.trim().length <= 8 ? "text-4xl py-2" : "text-[15px]"}`}>
                        {msg.text}
                      </p>
                    )}

                    {/* Message Footer */}
                    {!!(msg.is_edited || msg.edited || isMe) && (
                      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-black/5">
                        {!!(msg.is_edited === true || msg.is_edited === 1 || msg.edited === true || msg.edited === 1) && (
                          <span className={`text-[9px] font-black uppercase tracking-widest italic opacity-50`}>
                            Edited
                          </span>
                        )}

                        {isMe && (
                          <div className="flex items-center gap-0.5">
                            {msg.is_read || msg.read ? (
                              <CheckCheck size={14} className="text-blue-300 drop-shadow-[0_0_4px_rgba(59,130,246,0.6)]" />
                            ) : msg.is_delivered ? (
                              <CheckCheck size={14} className="text-white/70" />
                            ) : (
                              <Check size={14} className="text-white/50" />
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reactions - Floating Style */}
                    {Object.keys(msg.reactions || {}).length > 0 && (
                      <div className={`absolute bottom-[-14px] flex gap-1 ${isMe ? "right-2" : "left-2"} z-10`}>
                        {Object.entries(msg.reactions).map(([emoji, count]) => (
                          <span
                            key={emoji}
                            className="px-2 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-black flex items-center gap-1 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer ring-1 ring-black/5"
                            onClick={() => onReaction(msg.id, emoji)}
                          >
                            {emoji} <span>{count}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bubble Actions - Pill Style */}
                  <div
                    className={`absolute bottom-full mb-2 ${isMe ? "right-0" : "left-0"} ${showMessageMenu === msg.id ? "opacity-100 visible" : "opacity-0 invisible group-hover/msg:opacity-100 group-hover/msg:visible"} transition-all duration-300 z-50 message-menu-container`}
                  >
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-gray-100/50 hover:scale-105 transition-transform relative">
                      {[
                        { icon: Smile, onClick: () => setShowReactionPicker(msg.id), title: "React" },
                        { icon: Reply, onClick: () => onReply(msg), title: "Reply" },
                        { icon: Star, onClick: () => onStar(msg.id), title: "Star", color: starredMessages.has(msg.id) ? "fill-yellow-400 text-yellow-400" : "text-gray-400" },
                        { icon: MoreVertical, onClick: () => setShowMessageMenu(msg.id), title: "More" }
                      ].map((act, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            act.onClick();
                          }}
                          className={`p-1 transition-all hover:scale-125 active:scale-90 rounded-full group/btn ${act.color ? act.color : "hover:bg-orange-50 hover:text-orange-500 text-gray-500"}`}
                          title={act.title}
                        >
                          <act.icon size={16} className={`${act.color && act.color.includes('fill') ? "" : "group-hover/btn:rotate-12 transition-transform"}`} />
                        </button>
                      ))}

                      {/* Context Menu - Compact & Shadow Focused */}
                      {showMessageMenu === msg.id && (
                        <div
                          className={`absolute ${idx < 4 ? "top-full mt-2" : "bottom-full mb-2"} ${isMe ? "right-0" : "left-0"} bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.25)] p-1.5 min-w-[170px] z-[110] animate-scaleUp border border-gray-100/80 overflow-hidden`}
                        >
                          <div className="space-y-0.5">
                            {[
                              { icon: Reply, label: "Reply", onClick: () => onReply(msg) },
                              { icon: Forward, label: "Forward", onClick: () => onForward(msg) },
                              { icon: Copy, label: "Copy Text", onClick: () => onCopy(msg.text) },
                              { icon: Star, label: starredMessages.has(msg.id) ? "Unstar" : "Star", onClick: () => onStar(msg.id), color: starredMessages.has(msg.id) ? "text-yellow-600 fill-yellow-400" : "" },
                              { icon: Pin, label: "Pin to Chat", onClick: () => onPin(msg.id) },
                            ].map((item, i) => (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  item.onClick();
                                  setShowMessageMenu(null);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-orange-50 rounded-xl transition-all group ${item.color || "text-gray-700 hover:text-orange-600"}`}
                              >
                                <span className="font-bold">{item.label}</span>
                                <item.icon size={14} className="opacity-40 group-hover:opacity-100" />
                              </button>
                            ))}

                            {isMe && (
                              <div className="pt-1 mt-1 border-t border-gray-50">
                                <button
                                  onClick={(e) => { e.stopPropagation(); onEdit(msg); setShowMessageMenu(null); }}
                                  className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-orange-50 text-gray-700 rounded-xl transition-all group"
                                >
                                  <span className="font-bold">Edit Message</span>
                                  <Edit3 size={14} className="opacity-40 group-hover:opacity-100" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); onDelete(msg.id); setShowMessageMenu(null); }}
                                  className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-red-50 text-red-600 rounded-xl transition-all group"
                                >
                                  <span className="font-bold">Delete</span>
                                  <Trash2 size={14} className="opacity-40 group-hover:opacity-100" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Starred Indicator */}
                  {starredMessages.has(msg.id) && (
                    <div className={`absolute -top-2 ${isMe ? "-right-2" : "-left-2"} bg-white rounded-full p-1.5 shadow-lg ring-1 ring-orange-100 z-10`}>
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    </div>
                  )}

                  {/* Reaction Picker Popover */}
                  {showReactionPicker === msg.id && (
                    <div className={`absolute bottom-full ${isMe ? "right-0" : "left-0"} mb-6 bg-white/95 backdrop-blur-xl rounded-full shadow-2xl p-2.5 flex gap-1.5 z-40 animate-scaleUp border border-orange-50 ring-4 ring-black/5 reaction-picker-container`}>
                      {reactions.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => onReaction(msg.id, emoji)}
                          className="text-2xl hover:bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-150 active:scale-95 duration-300"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}


                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator - Modernized */}
        {typingIndicator === selectedChatId && (
          <div className="flex items-end gap-2 animate-fadeIn pt-4">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-black text-orange-600 uppercase shadow-sm">
              TY
            </div>
            <div className="bg-white border-2 border-gray-100 px-6 py-4 rounded-3xl rounded-bl-none shadow-sm flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-orange-200 rounded-full animate-pulse-fast"></span>
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse-fast" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse-fast" style={{ animationDelay: '0.4s' }}></span>
              <span className="ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Typing</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <style jsx>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.5) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-pulse-fast { animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 2s infinite; }
      `}</style>
    </div>
  );
}

// Chat Info Sidebar Component
export function ChatInfoSidebar({ selectedChat, messages, starredMessages }) {
  const sharedMedia = messages.filter((msg) => msg.attachments).slice(0, 6);
  const starred = messages.filter((msg) => starredMessages.has(msg.id));

  return (
    <div className="w-80 border-l border-gray-100 bg-white h-full flex flex-col overflow-hidden animate-slideLeft">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-8">
          {/* Profile Section */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6 group cursor-help">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-4xl font-black text-white mx-auto shadow-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-105 ring-8 ring-orange-50">
                {selectedChat.avatar}
              </div>
              <div
                className={`absolute bottom-[-10px] right-[-10px] w-8 h-8 rounded-full border-4 border-white shadow-xl flex items-center justify-center ${selectedChat.status === "online"
                  ? "bg-green-500"
                  : selectedChat.status === "away"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                  }`}
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
              {selectedChat.name}
            </h3>
            <div className="px-4 py-1 bg-orange-50 inline-block rounded-full">
              <span className="text-xs text-orange-600 font-black uppercase tracking-widest">
                {selectedChat.role}
              </span>
            </div>
          </div>

          {/* Core Info Cards */}
          <div className="space-y-6">
            <div className="bg-gray-50/50 rounded-3xl p-6 border-2 border-transparent hover:border-orange-100 transition-all hover:bg-white hover:shadow-xl group">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Quick Details
                </h4>
                <div className="w-8 h-1 bg-orange-500/20 rounded-full group-hover:w-12 transition-all"></div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: selectedChat.email },
                  { icon: Phone, label: "Hotline", value: selectedChat.phone },
                  { icon: Clock, label: "Local Time", value: "2:45 PM (GMT+5:30)" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group/item">
                    <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover/item:scale-110 group-hover/item:rotate-6">
                      <item.icon className="text-orange-500" size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">{item.label}</p>
                      <p className="text-xs font-bold text-gray-800 break-all leading-tight">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Gallery - Modern Grid */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <ImageIcon size={14} className="text-orange-500" />
                  Media & Links
                </h4>
                <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline">See All</button>
              </div>

              {sharedMedia.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {sharedMedia.map((msg) =>
                    msg.attachments?.map((file, idx) => (
                      <div
                        key={`${msg.id}-${idx}`}
                        className="aspect-square bg-gray-50 rounded-2xl overflow-hidden cursor-pointer group/tile relative border border-gray-100 shadow-inner"
                      >
                        {file.type?.startsWith("image/") ? (
                          <>
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover/tile:scale-125"
                            />
                            <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover/tile:opacity-100 transition-opacity"></div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center transition-all group-hover/tile:bg-orange-50">
                            <File className="text-gray-300 group-hover/tile:text-orange-400 group-hover/tile:rotate-12 transition-all" size={20} />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Empty Gallery</p>
                </div>
              )}
            </div>

            {/* Starred Messages Section */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-[-20px] left-[-20px] w-16 h-16 bg-orange-500/5 rounded-full blur-2xl"></div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  Key Messages
                </h4>
                <span className="text-[10px] font-black text-gray-300">{starred.length}</span>
              </div>

              <div className="space-y-3 relative z-10">
                {starred.length > 0 ? (
                  starred.slice(0, 3).map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 bg-orange-50/50 hover:bg-orange-50 rounded-2xl transition-all border border-orange-100/30 group/star"
                    >
                      <p className="text-xs text-gray-700 font-medium line-clamp-2 leading-relaxed">{msg.text}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-orange-200/20">
                        <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">{msg.time}</span>
                        <ArrowLeft size={10} className="text-orange-300 opacity-0 group-hover/star:opacity-100 -rotate-45 transition-all" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-[10px] font-medium text-gray-400 italic">No pinned gems yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Actions */}
            <div className="pt-4 space-y-2">
              <button className="w-full py-4 px-6 bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-xl hover:shadow-red-200 flex items-center justify-center gap-2 group">
                <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
                Clear History
              </button>
              <button className="w-full py-4 px-6 border-2 border-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest rounded-2xl hover:border-orange-500 hover:text-orange-600 transition-all duration-300 flex items-center justify-center gap-2 group">
                <BellOff size={16} />
                Block Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideLeft { animation: slideLeft 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
}

// Chat Input Component
export function ChatInput({
  message,
  setMessage,
  attachedFiles,
  setAttachedFiles,
  showEmojiPicker,
  setShowEmojiPicker,
  showAttachmentMenu,
  setShowAttachmentMenu,
  onSend,
  onFileSelect,
  fileInputRef,
  emojiPickerRef,
  textareaRef,
  attachmentMenuRef,
  isRecording,
  recordingDuration,
  handleVoiceMessage,
  cancelRecording,
  replyingTo,
  cancelReply,
  editingMessage,
  cancelEdit,
}) {
  const emojis = [
    "😊", "😂", "❤️", "👍", "🎉", "🔥", "✨", "💯", "👏", "🙌", "💪", "🎯", "🚀", "💡", "⭐", "🎊",
    "🎈", "🌟", "💝", "🤝", "👌", "✌️", "🙏", "💖", "😍", "🥰", "😘", "😎", "🤗", "🤔", "😅", "😆",
    "🙂", "😉", "😇", "🥳", "😴", "🤩", "😜", "😋", "🤤", "🤯", "🥺", "😭", "😢", "😤", "😡", "🤬",
  ];

  const handleEmojiClick = (emoji) => {
    const editor = textareaRef.current;
    if (!editor) return;

    editor.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(emoji);
    range.insertNode(textNode);

    // Move cursor after emoji
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    // Update state
    setMessage(editor.innerText);
  };

  const handleAttachmentClick = (type) => {
    if (fileInputRef.current) {
      if (type === "image") fileInputRef.current.accept = "image/*";
      else if (type === "video") fileInputRef.current.accept = "video/*";
      else if (type === "document") fileInputRef.current.accept = ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx";
      else fileInputRef.current.accept = "*/*";

      fileInputRef.current.click();
    }
    setShowAttachmentMenu(false);
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 relative z-40">
      {/* Reply/Edit Banner - Modern Style */}
      {(replyingTo || editingMessage) && (
        <div className="absolute bottom-full left-0 right-0 p-4 bg-orange-50/95 backdrop-blur-md border-t border-orange-200 animate-slideUp">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
              {editingMessage ? <Edit3 size={18} /> : <Reply size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-0.5">
                {editingMessage ? "Modifying message" : `Replying to ${replyingTo.sender_name || 'contact'}`}
              </p>
              <p className="text-sm text-orange-800 truncate font-semibold">
                {editingMessage ? editingMessage.text : replyingTo?.text}
              </p>
            </div>
            <button
              onClick={editingMessage ? cancelEdit : cancelReply}
              className="w-8 h-8 flex items-center justify-center bg-orange-200/50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-full transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Attached Files Preview - Floating Style */}
      {/* Attached Files Preview - WhatsApp Style Modern Media Tray */}
      {attachedFiles.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 py-6 px-10 bg-[#f8f9fa] backdrop-blur-xl border-t border-gray-100 animate-slideUp z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Ready to send • {attachedFiles.length} item{attachedFiles.length > 1 ? 's' : ''}</span>
              <button
                onClick={() => setAttachedFiles([])}
                className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest"
              >
                Clear All
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
              {attachedFiles.map((file, index) => {
                const isImage = file.type?.startsWith("image/");
                const isVideo = file.type?.startsWith("video/");
                const extension = file.name.split('.').pop().toUpperCase();

                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-36 h-48 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Media Content */}
                    <div className="h-28 w-full bg-gray-50 flex items-center justify-center relative overflow-hidden border-b border-gray-50">
                      {isImage ? (
                        <img src={file.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : isVideo ? (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                          <div className="z-10 bg-white/20 backdrop-blur-md rounded-full p-2 group-hover:scale-110 transition-transform">
                            <VideoIcon size={20} className="text-white" />
                          </div>
                          <video src={file.url} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 group-hover:scale-110 transition-transform duration-300">
                          <div className="w-12 h-12 bg-orange-50 rounded-[18px] flex items-center justify-center text-orange-500 shadow-inner">
                            <FileText size={24} />
                          </div>
                          <span className="text-[9px] font-black text-orange-600/60">{extension}</span>
                        </div>
                      )}
                    </div>

                    {/* Meta Data */}
                    <div className="p-3">
                      <p className="text-[10px] font-bold text-gray-800 truncate mb-1">{file.name}</p>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{file.size}</p>
                    </div>

                    {/* Delete Action */}
                    <button
                      onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 shadow-lg scale-90 group-hover:scale-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}

              {/* Add More Trigger */}
              <button
                onClick={() => setShowAttachmentMenu(true)}
                className="flex-shrink-0 w-36 h-48 bg-white border-2 border-dashed border-gray-100 rounded-[24px] flex flex-col items-center justify-center gap-3 text-gray-300 hover:text-orange-500 hover:border-orange-100 hover:bg-orange-50/10 transition-all group"
              >
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-orange-50 transition-colors">
                  <Plus size={24} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">Add Files</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 md:gap-3 px-4 pb-4">
        {/* Attachment Menu */}
        <div className="relative" ref={attachmentMenuRef}>
          <button
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className="w-12 h-12 bg-[#FF7B1D] text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-100 hover:scale-110 active:scale-95 transition-all duration-300 group z-50 relative"
          >
            <Paperclip size={20} className={`transition-transform duration-300 ${showAttachmentMenu ? "rotate-45" : "group-hover:rotate-12"}`} />
          </button>

          {showAttachmentMenu && (
            <div className="absolute bottom-full mb-6 left-0 bg-white rounded-[36px] shadow-[0_25px_70px_rgba(0,0,0,0.18)] p-6 min-w-[320px] animate-scaleUp z-[60] border border-gray-100/50">
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: ImageIcon, label: "Photos", color: "bg-[#E7F0FF] text-[#007AFF]", type: "image" },
                  { icon: FileText, label: "Docs", color: "bg-[#E7F8F0] text-[#24B47E]", type: "document" },
                  { icon: VideoIcon, label: "Video", color: "bg-[#FFE7E7] text-[#FF3B30]", type: "video" },
                  { icon: Camera, label: "Camera", color: "bg-[#F3E7FF] text-[#AF52DE]", type: "camera" },
                  { icon: UserIcon, label: "Contact", color: "bg-[#FFF9E7] text-[#FFCC00]", type: "contact" },
                  { icon: MapPin, label: "Location", color: "bg-[#FFE7F5] text-[#FF2D55]", type: "location" },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleAttachmentClick(item.type)}
                    className="flex flex-col items-center gap-2 group outline-none"
                  >
                    <div className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 group-active:scale-95 transition-all duration-300 ring-4 ring-transparent group-hover:ring-black/5`}>
                      <item.icon size={26} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest transition-colors group-hover:text-gray-900">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="flex-1 relative">
          <div className={`bg-gray-100/80 rounded-[32px] transition-all p-1.5 flex items-center gap-1 border-2 border-transparent ${message.length > 0 ? "bg-white border-orange-100 shadow-sm" : ""}`}>
            <button
              ref={emojiPickerRef}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${showEmojiPicker ? "text-orange-500" : "text-gray-400 hover:text-orange-500"}`}
            >
              <Smile size={22} className="opacity-80" />
            </button>

            <div
              ref={textareaRef}
              contentEditable
              onInput={(e) => setMessage(e.currentTarget.innerText)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-2.5 pl-1 pr-4 placeholder-gray-400/80 min-h-[44px] max-h-48 custom-scrollbar overflow-y-auto font-medium text-gray-700 break-words empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400/80"
              data-placeholder={editingMessage ? "Modify your message..." : "Type something brilliant..."}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                document.execCommand("insertText", false, text);
              }}
            />

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 md:left-[-12px] mb-4 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[32px] shadow-2xl p-4 w-[320px] animate-scaleUp z-50 overflow-hidden">
                <div className="mb-3 flex items-center justify-between px-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pick an emoji</span>
                  <X size={14} className="text-gray-300 cursor-pointer hover:text-gray-600" onClick={() => setShowEmojiPicker(false)} />
                </div>
                <div className="grid grid-cols-6 gap-1 max-h-60 overflow-y-auto custom-scrollbar p-1">
                  {emojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleEmojiClick(emoji)}
                      className="w-10 h-10 text-2xl flex items-center justify-center hover:bg-orange-50 rounded-xl transition-all hover:scale-125 active:scale-90"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Send/Record Button */}
        <div className="flex-shrink-0">
          {message.trim() || attachedFiles.length > 0 ? (
            <button
              onClick={onSend}
              className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-100 hover:scale-105 active:scale-95 transition-all group"
            >
              <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          ) : (
            <button
              onClick={handleVoiceMessage}
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-all group shadow-sm ${isRecording
                ? "bg-red-500 text-white shadow-red-200 animate-pulse-slow"
                : "bg-gray-100/80 text-orange-500 hover:bg-gray-200"
                }`}
            >
              {isRecording ? <Square size={18} fill="white" /> : <Mic size={22} className="group-hover:scale-110 transition-transform" />}
            </button>
          )}
        </div>
      </div>

      {/* Recording Overlay */}
      {isRecording && (
        <div className="max-w-7xl mx-auto mt-4 px-6 py-4 bg-red-50 rounded-2xl flex items-center justify-between animate-slideUp border border-red-100">
          <div className="flex items-center gap-4">
            <div className="flex gap-1 items-center">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="w-1 bg-red-500 rounded-full animate-wave" style={{ height: (Math.random() * 15 + 5) + 'px', animationDelay: i * 0.1 + 's' }}></div>
              ))}
            </div>
            <div>
              <span className="text-[10px] font-black text-red-700 uppercase tracking-widest block">Recording Audio</span>
              <span className="text-xl font-black text-red-600 tabular-nums">{formatRecordingTime(recordingDuration)}</span>
            </div>
          </div>
          <button onClick={cancelRecording} className="px-6 py-2 bg-white text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
            Delete
          </button>
        </div>
      )}

      {/* Shortcuts Help */}
      <div className="max-w-7xl mx-auto mt-2 hidden md:flex justify-center">
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">
          Type <span className="text-orange-400">/</span> for commands • <span className="text-orange-400">Shift+Enter</span> for new line
        </p>
      </div>

      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFileSelect} accept="*/*" />

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2); }
        }
        .animate-wave { animation: wave 1s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// Empty State Component
export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-white relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-40"></div>

      <div className="relative text-center max-w-md px-12 group">
        <div className="relative inline-block mb-10">
          <div className="w-32 h-32 bg-white border-4 border-gray-50 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[30px] flex items-center justify-center shadow-inner">
              <MessageSquare className="text-white" size={40} />
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl animate-bounce-subtle">
            <span className="text-xl">👋</span>
          </div>
        </div>

        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
          Connect & <span className="text-orange-500">Collaborate</span>
        </h2>
        <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10">
          Select a team member or client from the list to begin a new journey of communication. Everything you need is just a click away.
        </p>

        <div className="inline-flex items-center gap-6 p-2 bg-gray-50 rounded-full border border-gray-100">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-orange-600 italic">
                U{i}
              </div>
            ))}
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l border-gray-200 pl-6">
            Team members currently active
          </p>
        </div>
      </div>
    </div>
  );
}
// Forward Modal Component
export function ForwardModal({ contacts, onClose, onForward }) {
  const [selectedContacts, setSelectedContacts] = React.useState([]);

  const toggleContact = (contact) => {
    setSelectedContacts((prev) =>
      prev.find((c) => c.id === contact.id && c.type === contact.type)
        ? prev.filter((c) => !(c.id === contact.id && c.type === contact.type))
        : [...prev, contact]
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp border border-gray-100">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-900">Forward Message</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">Select recipients</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-2">
            {[...contacts.team, ...contacts.clients].map((contact) => (
              <button
                key={`${contact.id}_${contact.type}`}
                onClick={() => toggleContact(contact)}
                className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${selectedContacts.find((c) => c.id === contact.id && c.type === contact.type)
                  ? "bg-orange-50 border-2 border-orange-200"
                  : "hover:bg-gray-50 border-2 border-transparent"
                  }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-[10px] font-black text-orange-700 uppercase">
                  {(contact.avatar || contact.name).substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-gray-900">{contact.name}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{contact.role}</p>
                </div>
                {selectedContacts.find((c) => c.id === contact.id && c.type === contact.type) && (
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white">
                    <Check size={14} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onForward(selectedContacts)}
            disabled={selectedContacts.length === 0}
            className={`flex-1 px-4 py-3 font-black uppercase tracking-widest rounded-2xl transition-all ${selectedContacts.length > 0
              ? "bg-orange-500 text-white shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            Forward ({selectedContacts.length})
          </button>
        </div>
      </div>
    </div>
  );
}
