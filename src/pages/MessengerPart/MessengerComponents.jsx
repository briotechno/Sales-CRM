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
} from "lucide-react";

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
  onForward,
  starredMessages,
  currentUserId,
  currentUserType,
}) {
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  return (
    <div className="flex-1 px-4 py-8 md:px-8 bg-white relative">
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FF7B1D 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

      <div className="space-y-8 pb-4 relative z-10">
        {messages.map((msg, idx) => {
          // Check if message is from current user
          const isMe = (Number(msg.sender_id) === Number(currentUserId) && msg.sender_type === currentUserType) || msg.sender === "me";
          const showTime = idx === 0 || messages[idx - 1].time !== msg.time;

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
              {msg.replyTo && (
                <div className={`mb-1 px-4 py-3 rounded-2xl text-xs flex max-w-[80%] border-2 transition-all group-hover:scale-[1.02] ${isMe
                  ? "bg-orange-50/50 border-orange-100 text-orange-900 italic mr-2"
                  : "bg-gray-50 border-gray-100 text-gray-600 ml-2"
                  }`}>
                  <div className="flex items-start gap-2">
                    <Reply size={12} className="text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-black text-[10px] uppercase tracking-wider mb-1 opacity-70">
                        {msg.replyTo.sender === "me" ? "Me" : "Contact"}
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
                    className={`px-5 py-3.5 rounded-3xl shadow-sm transition-all duration-300 relative group-hover/msg:shadow-xl ${isMe
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-none hover:rotate-[-0.5deg]"
                      : "bg-white border-2 border-gray-100 text-gray-800 rounded-bl-none hover:rotate-[0.5deg]"
                      }`}
                  >
                    {/* Voice Message */}
                    {msg.isVoice && (
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

                    {/* File Attachments */}
                    {msg.attachments && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {msg.attachments.map((file, index) => (
                          <div key={index} className="w-full">
                            {file.type?.startsWith("image/") ? (
                              <div className="relative group/img overflow-hidden rounded-2xl shadow-md cursor-pointer aspect-video md:aspect-auto">
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="w-full max-h-[300px] object-cover transition-all duration-700 group-hover/img:scale-110 group-hover/img:rotate-1"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-4">
                                  <div className="flex items-center justify-between w-full">
                                    <span className="text-white text-[10px] font-bold truncate pr-4">{file.name}</span>
                                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/40 transition-colors">
                                      <Download size={14} className="text-white" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02] ${isMe ? "bg-white/10" : "bg-gray-50 border border-gray-100"
                                }`}>
                                <div className={`p-3 rounded-xl ${isMe ? "bg-white/20" : "bg-orange-50"}`}>
                                  <FileText size={20} className={isMe ? "text-white" : "text-orange-500"} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-black text-sm truncate uppercase tracking-tight">
                                    {file.name}
                                  </p>
                                  <p className="text-[10px] font-bold opacity-60">
                                    {file.size} • DOCUMENT
                                  </p>
                                </div>
                                <button className="p-2 hover:bg-black/5 rounded-lg transition-transform hover:rotate-12">
                                  <Download size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message Text */}
                    <p className={`text-[15px] leading-[1.6] font-medium selection:bg-white/30 selection:text-white ${isMe ? "drop-shadow-sm" : ""}`}>
                      {msg.text}
                    </p>

                    {/* Message Footer */}
                    <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-black/5">
                      {msg.edited && (
                        <span className={`text-[9px] font-black uppercase tracking-widest italic opacity-50`}>
                          Edited
                        </span>
                      )}

                      {(msg.sender === "me" || (Number(msg.sender_id) === Number(currentUserId) && msg.sender_type === currentUserType)) && (
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

                  {/* Bubble Actions - Hidden until hover */}
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isMe ? "-left-40" : "-right-40"} opacity-0 group-hover/msg:opacity-100 transition-all duration-300 flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 z-20`}>
                    {[
                      { icon: Smile, onClick: () => setShowReactionPicker(msg.id), title: "React" },
                      { icon: Reply, onClick: () => onReply(msg), title: "Reply" },
                      { icon: Star, onClick: () => onStar(msg.id), title: "Star", color: starredMessages.has(msg.id) ? "fill-yellow-400 text-yellow-400" : "" },
                      { icon: MoreVertical, onClick: () => setShowMessageMenu(msg.id), title: "More" }
                    ].map((act, i) => (
                      <button
                        key={i}
                        onClick={act.onClick}
                        className={`p-2 transition-all hover:scale-125 active:scale-90 rounded-xl group/btn ${act.color ? act.color : "hover:bg-orange-50 hover:text-orange-500 text-gray-500"}`}
                        title={act.title}
                      >
                        <act.icon size={16} className={`${act.color ? "" : "group-hover/btn:rotate-12 transition-transform"}`} />
                      </button>
                    ))}
                  </div>

                  {/* Starred Indicator */}
                  {starredMessages.has(msg.id) && (
                    <div className={`absolute -top-2 ${isMe ? "-right-2" : "-left-2"} bg-white rounded-full p-1 shadow-lg ring-1 ring-orange-100`}>
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    </div>
                  )}

                  {/* Reaction Picker Popover */}
                  {showReactionPicker === msg.id && (
                    <div className="absolute bottom-full left-0 mb-4 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl p-2 flex gap-1 z-30 animate-scaleUp border border-orange-50 ring-4 ring-black/5">
                      {reactions.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => onReaction(msg.id, emoji)}
                          className="text-2xl hover:bg-orange-100 rounded-full w-10 h-10 flex items-center justify-center transition-all hover:scale-150 active:scale-95 duration-300"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Context Menu */}
                  {showMessageMenu === msg.id && (
                    <div className={`absolute bottom-full mb-4 ${isMe ? "right-0" : "left-0"} bg-white rounded-2xl shadow-2xl p-2 min-w-[200px] z-30 animate-slideUp border border-gray-100 overflow-hidden`}>
                      <div className="px-3 py-2 border-b border-gray-50 mb-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message Actions</p>
                      </div>
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
                            onClick={item.onClick}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-orange-50 rounded-xl transition-all group ${item.color || "text-gray-700 hover:text-orange-600"}`}
                          >
                            <span className="font-bold">{item.label}</span>
                            <item.icon size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}

                        {isMe && (
                          <>
                            <div className="h-[1px] bg-gray-50 my-1 mx-2"></div>
                            <button
                              onClick={() => onEdit(msg)}
                              className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-blue-50 text-blue-600 rounded-xl transition-all group"
                            >
                              <span className="font-black">Edit</span>
                              <Edit3 size={14} className="opacity-70 group-hover:rotate-12 transition-transform" />
                            </button>
                            <button
                              onClick={() => onDelete(msg.id)}
                              className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 rounded-xl transition-all group"
                            >
                              <span className="font-black">Delete</span>
                              <Trash2 size={14} className="opacity-70 group-hover:scale-110 transition-transform" />
                            </button>
                          </>
                        )}
                      </div>
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
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachmentClick = (type) => {
    if (type === "file" || type === "image" || type === "document") {
      fileInputRef.current?.click();
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
                {editingMessage ? "Modifying message" : `Replying to ${replyingTo.sender === "me" ? "yourself" : "contact"}`}
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
      {attachedFiles.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 px-4 py-3 bg-white/50 backdrop-blur-sm border-t border-gray-100 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 max-w-7xl mx-auto">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white border-2 border-orange-50 rounded-2xl p-2 min-w-[180px] shadow-sm hover:shadow-lg transition-all group relative animate-scaleUp"
              >
                {file.type?.startsWith("image/") ? (
                  <img src={file.url} alt="" className="w-10 h-10 object-cover rounded-xl" />
                ) : (
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                    <File size={16} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-gray-800 truncate">{file.name}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">{file.size}</p>
                </div>
                <button
                  onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 md:gap-3 px-4 pb-4">
        {/* Attachment Menu */}
        <div className="relative" ref={attachmentMenuRef}>
          <button
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group ${showAttachmentMenu ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-gray-100/80 text-gray-400 hover:bg-gray-200"
              }`}
          >
            <Paperclip size={20} className={showAttachmentMenu ? "" : "group-hover:rotate-12 transition-transform shadow-sm"} />
          </button>

          {showAttachmentMenu && (
            <div className="absolute bottom-full mb-4 left-0 bg-white border border-gray-100 rounded-3xl shadow-2xl p-3 min-w-[240px] animate-scaleUp z-50">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: ImageIcon, label: "Photos", color: "bg-blue-50 text-blue-600", onClick: () => handleAttachmentClick("image") },
                  { icon: FileText, label: "Docs", color: "bg-green-50 text-green-600", onClick: () => handleAttachmentClick("document") },
                  { icon: Camera, label: "Camera", color: "bg-purple-50 text-purple-600", onClick: () => handleAttachmentClick("camera") },
                  { icon: VideoIcon, label: "Video", color: "bg-red-50 text-red-600", onClick: () => handleAttachmentClick("video") },
                  { icon: UserIcon, label: "Contact", color: "bg-yellow-50 text-yellow-600", onClick: () => handleAttachmentClick("contact") },
                  { icon: MapPin, label: "Location", color: "bg-pink-50 text-pink-600", onClick: () => handleAttachmentClick("location") },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.onClick}
                    className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-2xl transition-all group"
                  >
                    <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                      <item.icon size={22} />
                    </div>
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{item.label}</span>
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

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              placeholder={editingMessage ? "Modify your message..." : "Type something brilliant..."}
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-2.5 pl-1 pr-4 placeholder-gray-400/80 min-h-[44px] max-h-48 custom-scrollbar resize-none font-medium text-gray-700"
              style={{ height: 'auto' }}
            />

            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-4 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[32px] shadow-2xl p-4 w-[320px] animate-scaleUp z-50 overflow-hidden">
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
