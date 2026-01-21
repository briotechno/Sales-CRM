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
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-gray-50">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
          <Search className="text-orange-400" size={32} />
        </div>
        <p className="text-sm font-medium text-gray-600">No contacts found</p>
        <p className="text-xs text-gray-400 mt-1">
          Try a different search term
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => onChatSelect(contact)}
          className={`p-3.5 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedChat?.id === contact.id
              ? "bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-l-orange-500"
              : "bg-white hover:bg-orange-50"
            }`}
        >
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md ${contact.status === "online"
                    ? "bg-gradient-to-br from-orange-400 to-orange-600"
                    : contact.status === "away"
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                      : "bg-gradient-to-br from-gray-400 to-gray-600"
                  }`}
              >
                {contact.avatar}
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm ${contact.status === "online"
                    ? "bg-green-500"
                    : contact.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-gray-800 truncate">
                  {contact.name}
                </h3>
                <span className="text-xs text-gray-500 font-medium ml-2">
                  {contact.time}
                </span>
              </div>
              <p className="text-xs text-orange-600 font-medium mb-1">
                {contact.role}
              </p>
              <p className="text-xs text-gray-600 truncate leading-relaxed">
                {contact.lastMessage}
              </p>
            </div>
            {contact.unread > 0 && (
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center flex-shrink-0 shadow-md">
                {contact.unread}
              </div>
            )}
          </div>
        </div>
      ))}
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
      <div className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-base font-bold text-white shadow-lg ring-2 ring-orange-100">
              {selectedChat.avatar}
            </div>
            <div
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-md ${selectedChat.status === "online"
                  ? "bg-green-500"
                  : selectedChat.status === "away"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">
              {selectedChat.name}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              {selectedChat.status === "online" ? (
                <>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Active now
                </>
              ) : selectedChat.status === "away" ? (
                <>
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  Away
                </>
              ) : (
                "Last seen " + selectedChat.time
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative mr-2">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search in chat..."
              value={chatSearchQuery}
              onChange={(e) => setChatSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-48"
            />
            {chatSearchQuery && (
              <button
                onClick={() => setChatSearchQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <button className="p-2.5 hover:bg-orange-50 rounded-lg transition-all duration-200 group">
            <Phone
              className="text-gray-600 group-hover:text-orange-600 transition-colors"
              size={18}
            />
          </button>
          <button className="p-2.5 hover:bg-orange-50 rounded-lg transition-all duration-200 group">
            <Video
              className="text-gray-600 group-hover:text-orange-600 transition-colors"
              size={18}
            />
          </button>
          <button
            onClick={() => setNotifications(!notifications)}
            className="p-2.5 hover:bg-orange-50 rounded-lg transition-all duration-200"
          >
            {notifications ? (
              <Bell className="text-gray-600" size={18} />
            ) : (
              <BellOff className="text-gray-600" size={18} />
            )}
          </button>
          <button
            onClick={onToggleChatInfo}
            className={`p-2.5 rounded-lg transition-all duration-200 ${showChatInfo
                ? "bg-orange-100 text-orange-600"
                : "hover:bg-orange-50 text-gray-600 hover:text-orange-600"
              }`}
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Pinned Message Banner */}
      {pinnedMessage && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 py-2 flex items-center gap-2">
          <Pin className="text-orange-600" size={14} />
          <div className="flex-1">
            <p className="text-xs font-semibold text-orange-800">
              Pinned Message
            </p>
            <p className="text-xs text-orange-700 truncate">
              {pinnedMessage.text}
            </p>
          </div>
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
}) {
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  return (
    <div className="flex-1 p-6 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="space-y-4 pb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="group relative">
            {/* Reply Preview */}
            {msg.replyTo && (
              <div className="ml-14 mb-1 p-2 bg-gray-100 rounded-lg text-xs border-l-2 border-orange-500">
                <div className="flex items-center gap-1 text-orange-600 font-semibold mb-1">
                  <Reply size={12} />
                  <span>Replying to</span>
                </div>
                <p className="text-gray-600 truncate">{msg.replyTo.text}</p>
              </div>
            )}

            <div
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"
                } animate-fadeIn`}
            >
              <div className="relative max-w-md">
                <div
                  className={`px-4 py-2.5 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${msg.sender === "me"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                    }`}
                >
                  {/* Voice Message */}
                  {msg.isVoice && (
                    <div className="flex items-center gap-2 mb-1">
                      <Mic size={16} />
                      <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-white rounded-full"></div>
                      </div>
                      <span className="text-xs">{msg.duration}s</span>
                      <button className="hover:scale-110 transition-transform">
                        <Volume2 size={16} />
                      </button>
                    </div>
                  )}

                  {/* File Attachments */}
                  {msg.attachments && (
                    <div className="mb-2 space-y-2">
                      {msg.attachments.map((file, index) => (
                        <div key={index}>
                          {file.type?.startsWith("image/") ? (
                            <div className="relative group/img">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full max-w-xs rounded-lg cursor-pointer"
                              />
                              <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                <button className="p-1.5 bg-black/50 rounded-full hover:bg-black/70">
                                  <Download size={14} className="text-white" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs bg-black/10 rounded-lg px-3 py-2">
                              <File size={14} />
                              <div className="flex-1">
                                <p className="font-semibold truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs opacity-75">
                                  {file.size}
                                </p>
                              </div>
                              <button className="hover:scale-110 transition-transform">
                                <Download size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Text */}
                  <p className="text-sm break-words leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Message Footer */}
                  <div className="flex items-center justify-end gap-2 mt-1.5">
                    {msg.edited && (
                      <span
                        className={`text-xs italic ${msg.sender === "me"
                            ? "text-orange-200"
                            : "text-gray-400"
                          }`}
                      >
                        edited
                      </span>
                    )}
                    <p
                      className={`text-xs font-medium ${msg.sender === "me"
                          ? "text-orange-100"
                          : "text-gray-400"
                        }`}
                    >
                      {msg.time}
                    </p>
                    {msg.sender === "me" && (
                      <span
                        className={
                          msg.read ? "text-green-300" : "text-orange-200"
                        }
                      >
                        {msg.read ? (
                          <CheckCheck size={14} />
                        ) : (
                          <Check size={14} />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Reactions */}
                  {Object.keys(msg.reactions || {}).length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <span
                          key={emoji}
                          className="px-2 py-1 bg-white/20 rounded-full text-xs flex items-center gap-1 cursor-pointer hover:bg-white/30 transition-colors"
                          onClick={() => onReaction(msg.id, emoji)}
                        >
                          {emoji} <span className="font-semibold">{count}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Actions */}
                <div className="absolute top-0 -right-32 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white rounded-lg shadow-lg p-1">
                  {starredMessages.has(msg.id) && (
                    <Star
                      size={12}
                      className="text-yellow-500 fill-yellow-500 absolute -top-1 -left-1"
                    />
                  )}
                  <button
                    onClick={() => setShowReactionPicker(msg.id)}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    title="React"
                  >
                    <Smile size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => onReply(msg)}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    title="Reply"
                  >
                    <Reply size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowMessageMenu(msg.id)}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    title="More"
                  >
                    <MoreVertical size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* Reaction Picker */}
                {showReactionPicker === msg.id && (
                  <div className="absolute -top-12 left-0 bg-white rounded-lg shadow-xl p-2 flex gap-1 z-20 animate-fadeIn">
                    {reactions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => onReaction(msg.id, emoji)}
                        className="text-xl hover:bg-gray-100 rounded p-1.5 transition-all hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message Menu */}
                {showMessageMenu === msg.id && (
                  <div className="absolute top-8 right-0 bg-white rounded-lg shadow-xl p-1 min-w-[180px] z-20 animate-fadeIn">
                    <button
                      onClick={() => onReply(msg)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                    >
                      <Reply size={14} />
                      Reply
                    </button>
                    <button
                      onClick={() => onForward(msg)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                    >
                      <Forward size={14} />
                      Forward
                    </button>
                    <button
                      onClick={() => onCopy(msg.text)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                    >
                      <Copy size={14} />
                      Copy
                    </button>
                    <button
                      onClick={() => onStar(msg.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                    >
                      <Star
                        size={14}
                        className={
                          starredMessages.has(msg.id)
                            ? "fill-yellow-500 text-yellow-500"
                            : ""
                        }
                      />
                      {starredMessages.has(msg.id) ? "Unstar" : "Star"}
                    </button>
                    <button
                      onClick={() => onPin(msg.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                    >
                      <Pin size={14} />
                      Pin
                    </button>
                    {msg.sender === "me" && (
                      <>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={() => onEdit(msg)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 rounded text-gray-700"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(msg.id)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-red-50 rounded text-red-600"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {typingIndicator === selectedChatId && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl rounded-bl-md shadow-md">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Chat Info Sidebar Component
export function ChatInfoSidebar({ selectedChat, messages, starredMessages }) {
  const sharedMedia = messages.filter((msg) => msg.attachments).slice(0, 6);
  const starred = messages.filter((msg) => starredMessages.has(msg.id));

  return (
    <div className="w-80 border-l border-gray-200 bg-gradient-to-b from-white to-gray-50 overflow-y-auto custom-scrollbar">
      <div className="p-6">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-3xl font-bold text-white mx-auto shadow-xl ring-4 ring-orange-100">
              {selectedChat.avatar}
            </div>
            <div
              className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white shadow-lg ${selectedChat.status === "online"
                  ? "bg-green-500"
                  : selectedChat.status === "away"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
            />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {selectedChat.name}
          </h3>
          <p className="text-sm text-orange-600 font-medium">
            {selectedChat.role}
          </p>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
              Contact Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-orange-600" size={16} />
                </div>
                <span className="text-gray-700 text-xs break-all">
                  {selectedChat.email}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-orange-600" size={16} />
                </div>
                <span className="text-gray-700 text-xs">
                  {selectedChat.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
              Status
            </h4>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
              <div
                className={`w-3 h-3 rounded-full shadow-sm ${selectedChat.status === "online"
                    ? "bg-green-500 animate-pulse"
                    : selectedChat.status === "away"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
              />
              <span className="text-sm text-gray-700 font-medium capitalize">
                {selectedChat.status}
              </span>
            </div>
          </div>

          {/* Starred Messages */}
          {starred.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                Starred Messages ({starred.length})
              </h4>
              <div className="space-y-2">
                {starred.slice(0, 3).map((msg) => (
                  <div
                    key={msg.id}
                    className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <p className="text-xs text-gray-700 truncate">{msg.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shared Media */}
          {sharedMedia.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                Shared Media
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {sharedMedia.map((msg) =>
                  msg.attachments?.map((file, idx) => (
                    <div
                      key={`${msg.id}-${idx}`}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {file.type?.startsWith("image/") ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <File className="text-gray-400" size={24} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
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
    "😊",
    "😂",
    "❤️",
    "👍",
    "🎉",
    "🔥",
    "✨",
    "💯",
    "👏",
    "🙌",
    "💪",
    "🎯",
    "🚀",
    "💡",
    "⭐",
    "🎊",
    "🎈",
    "🌟",
    "💝",
    "🤝",
    "👌",
    "✌️",
    "🙏",
    "💖",
    "😍",
    "🥰",
    "😘",
    "😎",
    "🤗",
    "🤔",
    "😅",
    "😆",
    "🙂",
    "😉",
    "😇",
    "🥳",
    "😴",
    "🤩",
    "😜",
    "😋",
    "🤤",
    "🤯",
    "🥺",
    "😭",
    "😢",
    "😤",
    "😡",
    "🤬",
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
    <>
      {/* Reply/Edit Banner */}
      {(replyingTo || editingMessage) && (
        <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 border-t border-orange-200">
          <div className="flex items-start gap-3">
            <div className="w-1 h-12 bg-orange-500 rounded-full"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-orange-700 mb-1 flex items-center gap-1">
                {editingMessage ? (
                  <>
                    <FileText size={12} />
                    Editing Message
                  </>
                ) : (
                  <>
                    <ArrowLeft size={12} />
                    Replying to{" "}
                    {replyingTo.sender === "me" ? "yourself" : "them"}
                  </>
                )}
              </p>
              <p className="text-xs text-orange-600 truncate">
                {editingMessage ? editingMessage.text : replyingTo?.text}
              </p>
            </div>
            <button
              onClick={editingMessage ? cancelEdit : cancelReply}
              className="text-orange-600 hover:text-orange-700 p-1 hover:bg-orange-200 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Attached Files Preview */}
      {attachedFiles.length > 0 && (
        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm hover:shadow-md transition-shadow group"
              >
                {file.type?.startsWith("image/") ? (
                  <div className="relative">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded transition-colors"></div>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <File className="text-orange-500" size={20} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
                <button
                  onClick={() =>
                    setAttachedFiles(
                      attachedFiles.filter((_, i) => i !== index)
                    )
                  }
                  className="text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0 shadow-lg">
        <div className="flex items-end gap-2">
          {/* Attachment Button */}
          <div className="relative" ref={attachmentMenuRef}>
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 group ${showAttachmentMenu
                  ? "bg-orange-100 text-orange-600"
                  : "hover:bg-orange-50 text-gray-600"
                }`}
            >
              <Paperclip
                className="group-hover:text-orange-600 transition-colors"
                size={20}
              />
            </button>

            {showAttachmentMenu && (
              <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-xl shadow-2xl p-2 min-w-[200px] animate-slideUp z-50">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAttachmentClick("image")}
                    className="flex flex-col items-center gap-2 p-3 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors group-hover:scale-110">
                      <ImageIcon size={20} className="text-blue-600" />
                    </div>
                    <span className="font-medium text-xs">Photos</span>
                  </button>

                  <button
                    onClick={() => handleAttachmentClick("document")}
                    className="flex flex-col items-center gap-2 p-3 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-all group"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors group-hover:scale-110">
                      <FileText size={20} className="text-green-600" />
                    </div>
                    <span className="font-medium text-xs">Documents</span>
                  </button>

                  <button
                    onClick={() => handleAttachmentClick("camera")}
                    className="flex flex-col items-center gap-2 p-3 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-all group"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors group-hover:scale-110">
                      <Camera size={20} className="text-purple-600" />
                    </div>
                    <span className="font-medium text-xs">Camera</span>
                  </button>

                  <button
                    onClick={() => handleAttachmentClick("video")}
                    className="flex flex-col items-center gap-2 p-3 text-sm text-gray-700 hover:bg-red-50 rounded-lg transition-all group"
                  >
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors group-hover:scale-110">
                      <VideoIcon size={20} className="text-red-600" />
                    </div>
                    <span className="font-medium text-xs">Video</span>
                  </button>

                  <button
                    onClick={() => handleAttachmentClick("contact")}
                    className="flex flex-col items-center gap-2 p-3 text-sm text-gray-700 hover:bg-yellow-50 rounded-lg transition-all group"
                  >
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-200 transition-colors group-hover:scale-110">
                      <UserIcon size={20} className="text-yellow-600" />
                    </div>
                    <span className="font-medium text-xs">Contact</span>
                  </button>

                  <button
                    onClick={() => handleAttachmentClick("location")}
                    className="flex flex-col items-center gap-2 p-3 text-sm text-gray-700 hover:bg-pink-50 rounded-lg transition-all group"
                  >
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors group-hover:scale-110">
                      <MapPin size={20} className="text-pink-600" />
                    </div>
                    <span className="font-medium text-xs">Location</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Message Input Container */}
          <div className="flex-1 flex flex-col bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent focus-within:bg-white transition-all">
            <div className="flex items-end">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                placeholder={
                  editingMessage
                    ? "Edit your message..."
                    : replyingTo
                      ? "Type your reply..."
                      : "Type a message..."
                }
                rows={1}
                className="flex-1 px-4 py-3 text-sm bg-transparent border-none focus:outline-none resize-none placeholder-gray-400 max-h-32 overflow-y-auto custom-scrollbar"
                style={{ minHeight: "44px" }}
              />

              {/* Emoji Button */}
              <div className="relative pb-2 pr-2" ref={emojiPickerRef}>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-1.5 rounded-lg transition-all duration-200 flex-shrink-0 group ${showEmojiPicker
                      ? "bg-orange-100 text-orange-600"
                      : "hover:bg-orange-50 text-gray-600"
                    }`}
                >
                  <Smile
                    className="group-hover:text-orange-600 transition-colors"
                    size={20}
                  />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-3 animate-slideUp z-50">
                    <div className="mb-2 pb-2 border-b border-gray-200">
                      <p className="text-xs font-bold text-gray-700">
                        Pick an emoji
                      </p>
                    </div>
                    <div className="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto custom-scrollbar">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiClick(emoji)}
                          className="text-2xl hover:bg-orange-50 rounded-lg p-2 transition-all hover:scale-125 active:scale-95"
                          title={emoji}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Voice/Send Button */}
          {message.trim() || attachedFiles.length > 0 ? (
            <button
              onClick={onSend}
              className="p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:scale-105 active:scale-95"
              title={editingMessage ? "Save changes" : "Send message"}
            >
              <Send size={18} />
            </button>
          ) : (
            <button
              onClick={handleVoiceMessage}
              className={`p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0 ${isRecording
                  ? "bg-red-500 text-white animate-pulse scale-110"
                  : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:scale-105"
                } active:scale-95`}
              title={isRecording ? "Stop recording" : "Record voice message"}
            >
              <Mic size={18} />
            </button>
          )}
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="mt-3 flex items-center justify-between bg-gradient-to-r from-red-50 to-red-100 border border-red-300 rounded-xl p-3 shadow-sm animate-slideDown">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              </div>
              <div>
                <p className="text-sm text-red-700 font-bold">
                  Recording Voice Message
                </p>
                <p className="text-xs text-red-600">
                  {formatRecordingTime(recordingDuration)}
                </p>
              </div>
            </div>
            <button
              onClick={cancelRecording}
              className="text-red-600 hover:text-red-700 text-sm font-bold px-4 py-2 bg-white rounded-lg hover:bg-red-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Tips */}
        {!isRecording && !message && attachedFiles.length === 0 && (
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-400">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">
                Enter
              </kbd>{" "}
              to send,{" "}
              <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">
                Shift + Enter
              </kbd>{" "}
              for new line
            </p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={onFileSelect}
        accept="*/*"
      />

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        kbd {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}

// Empty State Component
export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center px-8">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-8 ring-orange-100">
            <MessageCircle className="text-white" size={48} />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to Messenger
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          Select a conversation from the sidebar to start messaging your team
          members or clients
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Online and ready to chat</span>
        </div>
      </div>
    </div>
  );
}
