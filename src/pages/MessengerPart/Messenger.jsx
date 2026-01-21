import React, { useState, useRef, useEffect, useMemo } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { MessageCircle, Search, Users, User, X } from "lucide-react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import {
  ChatHeader,
  ChatMessages,
  ChatInput,
  ChatInfoSidebar,
  ContactsList,
  EmptyState,
} from "../../pages/MessengerPart/MessengerComponents";

const SOCKET_URL = "http://localhost:5000"; // Adjust based on your backend port

export default function MessengerPage() {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  // State Management
  const [activeTab, setActiveTab] = useState("team");
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);

  const [teamMembers, setTeamMembers] = useState([]);
  const [clients, setClients] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [chatMessages, setChatMessages] = useState({}); // { conversationId: [messages] }
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const [typingIndicator, setTypingIndicator] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState({});
  const [notifications, setNotifications] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [starredMessages, setStarredMessages] = useState(new Set());

  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  // Data fetching and Socket setup
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/messenger/contacts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setTeamMembers(data.team);
          setClients(data.clients);
          console.log('Loaded contacts:', { team: data.team.length, clients: data.clients.length });
        } else {
          console.error('Failed to fetch contacts:', data);
          toast.error(data.message || "Failed to load contacts");
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast.error("Failed to load contacts");
      }
    };

    fetchContacts();

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, [currentUser]);

  useEffect(() => {
    if (socket && currentUser) {
      // Fetch current employee ID
      fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log('Profile API response:', data);

          // The API returns employee data directly (not nested in .employee)
          if (data.id) {
            const employeeId = data.id;
            setCurrentEmployeeId(employeeId);
            socket.emit("setup", { id: employeeId, type: "employee" });
            console.log('Socket setup with employee ID:', employeeId);
          } else {
            console.error('No employee ID in profile response:', data);
            toast.error('Failed to load employee profile');
          }
        })
        .catch(err => {
          console.error("Error fetching employee profile:", err);
          toast.error('Failed to load profile. Please refresh.');
        });

      socket.on("connected", () => {
        setSocketConnected(true);
        console.log('Socket connected successfully');
      });

      socket.on("message_received", (newMessage) => {
        const convId = newMessage.conversationId;
        setChatMessages((prev) => ({
          ...prev,
          [convId]: [...(prev[convId] || []), newMessage],
        }));
        toast.success("New message received!");
      });

      socket.on("typing", (room) => setTypingIndicator(room));
      socket.on("stop_typing", () => setTypingIndicator(null));
    }
  }, [socket, currentUser]);

  // Fetch history when chat is selected
  useEffect(() => {
    const fetchHistory = async () => {
      if (selectedChat) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/messenger/history/${selectedChat.id}/${selectedChat.type}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();
          if (data.success) {
            setCurrentConversationId(data.conversationId);
            setChatMessages((prev) => ({
              ...prev,
              [data.conversationId]: data.messages,
            }));
            if (socket) {
              socket.emit("join_chat", data.conversationId);
            }
            console.log('Loaded conversation:', data.conversationId, 'with', data.messages.length, 'messages');
          }
        } catch (error) {
          console.error("Error fetching history:", error);
          toast.error("Failed to load chat history");
        }
      }
    };

    fetchHistory();
  }, [selectedChat, socket]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, selectedChat]);


  // Handlers
  const handleSend = async () => {
    console.log('handleSend called', {
      message: message.trim(),
      selectedChat,
      currentConversationId,
      currentEmployeeId,
      socketConnected
    });

    if (!message.trim() && attachedFiles.length === 0) {
      console.log('No message or files to send');
      return;
    }

    if (!selectedChat) {
      toast.error('Please select a chat first');
      return;
    }

    if (!currentEmployeeId) {
      toast.error('Employee ID not loaded. Please refresh the page.');
      return;
    }

    try {
      if (editingMessage) {
        // Edit logic would go here
        setEditingMessage(null);
      } else {
        const newMessage = {
          conversationId: currentConversationId,
          sender: { id: currentEmployeeId, type: 'employee' },
          text: message.trim(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          participants: [
            { id: currentEmployeeId, type: 'employee' },
            { id: selectedChat.id, type: selectedChat.type }
          ],
          messageType: attachedFiles.length > 0 ? 'file' : 'text'
        };

        console.log('Sending message:', newMessage);

        // Update local state immediately for responsiveness
        const tempId = Date.now();
        setChatMessages(prev => ({
          ...prev,
          [currentConversationId]: [...(prev[currentConversationId] || []), {
            ...newMessage,
            id: tempId,
            sender_id: currentEmployeeId,
            sender_type: 'employee',
            created_at: new Date().toISOString()
          }]
        }));

        // Emit via socket for real-time delivery
        if (socket && socketConnected) {
          socket.emit("new_message", newMessage);
          console.log('Message emitted via socket');
        }

        // Save via REST API
        try {
          const formData = new FormData();
          if (currentConversationId) {
            formData.append('conversationId', currentConversationId);
          } else {
            formData.append('otherId', selectedChat.id);
            formData.append('otherType', selectedChat.type);
          }
          formData.append('text', message.trim());
          formData.append('messageType', attachedFiles.length > 0 ? 'file' : 'text');

          if (attachedFiles.length > 0) {
            attachedFiles.forEach(file => formData.append('file', file.file));
          }

          const response = await fetch('http://localhost:5000/api/messenger/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });

          const data = await response.json();
          console.log('Message saved via API:', data);

          if (!data.success) {
            toast.error(data.message || 'Failed to send message');
          } else {
            toast.success('Message sent!');
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
          toast.error('Failed to save message');
        }

        setMessage("");
        setAttachedFiles([]);
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Error in handleSend:', error);
      toast.error('Failed to send message');
    }
  };
  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target)
      ) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingDuration(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const handleChatSelect = (contact) => {
    setSelectedChat(contact);
    setShowChatInfo(false);
    setChatSearchQuery("");
    setReplyingTo(null);
    setEditingMessage(null);
    setMessage("");
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      type: file.type,
      url: URL.createObjectURL(file),
      file: file
    }));
    setAttachedFiles((prev) => [...prev, ...fileData]);
    setShowAttachmentMenu(false);
  };

  const handleVoiceMessage = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      // Voice message sending logic would go here
    }
  };

  const handleReaction = (messageId, emoji) => {
    if (socket && currentConversationId) {
      socket.emit("reaction", { messageId, emoji, conversationId: currentConversationId });
    }

    setChatMessages((prev) => {
      const messages = prev[currentConversationId] || [];
      return {
        ...prev,
        [currentConversationId]: messages.map((msg) =>
          msg.id === messageId
            ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [emoji]: (msg.reactions?.[emoji] || 0) + 1,
              },
            }
            : msg
        ),
      };
    });
    setShowReactionPicker(null);
  };

  const handleDeleteMessage = (messageId) => {
    setChatMessages((prev) => ({
      ...prev,
      [currentConversationId]: (prev[currentConversationId] || []).filter(
        (msg) => msg.id !== messageId
      ),
    }));
    setShowMessageMenu(null);
  };

  const handlePinMessage = (messageId) => {
    setPinnedMessages((prev) => ({
      ...prev,
      [selectedChat.id]: messageId,
    }));
    setShowMessageMenu(null);
  };

  const handleEditMessage = (msg) => {
    setEditingMessage(msg);
    setReplyingTo(null);
    setMessage(msg.text);
    setShowMessageMenu(null);
  };

  const handleReply = (msg) => {
    setReplyingTo(msg);
    setShowMessageMenu(null);
    setEditingMessage(null);
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    setShowMessageMenu(null);
    toast.success("Message copied to clipboard");
  };

  const handleStarMessage = (messageId) => {
    setStarredMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
    setShowMessageMenu(null);
  };

  const handleForwardMessage = (msg) => {
    console.log("Forward message:", msg);
    setShowMessageMenu(null);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setMessage("");
  };

  // Computed values
  const contacts = activeTab === "team" ? teamMembers : clients;
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const messages = currentConversationId ? chatMessages[currentConversationId] || [] : [];
  const filteredMessages = chatSearchQuery
    ? messages.filter((msg) =>
      msg.text.toLowerCase().includes(chatSearchQuery.toLowerCase())
    )
    : messages;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-4rem)] ml-5 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-[380px] bg-gray-50/30 flex flex-col h-full border-r border-gray-100">
            {/* Header */}
            <div className="px-6 pt-8 pb-6 bg-white shrink-0">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Chats</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Messenger Pro</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition-all cursor-pointer group">
                  <div className="relative">
                    <Users size={20} className="group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative group">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search chats, people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 text-sm bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50/50 transition-all placeholder:text-gray-400 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 bg-white rounded-lg p-1 transition-all"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 pb-2 bg-white shrink-0">
              <div className="flex p-1.5 bg-gray-50 rounded-[20px] gap-1">
                <button
                  onClick={() => setActiveTab("team")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "team"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <Users size={14} />
                  Team
                </button>
                <button
                  onClick={() => setActiveTab("clients")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "clients"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <User size={14} />
                  Clients
                </button>
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-hidden">
              <ContactsList
                contacts={filteredContacts}
                selectedChat={selectedChat}
                onChatSelect={handleChatSelect}
              />
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white h-full">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="flex-shrink-0">
                  <ChatHeader
                    selectedChat={selectedChat}
                    showChatInfo={showChatInfo}
                    onToggleChatInfo={() => setShowChatInfo(!showChatInfo)}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    chatSearchQuery={chatSearchQuery}
                    setChatSearchQuery={setChatSearchQuery}
                    pinnedMessage={
                      pinnedMessages[selectedChat.id]
                        ? messages.find(
                          (m) => m.id === pinnedMessages[selectedChat.id]
                        )
                        : null
                    }
                  />
                </div>

                {/* Messages Area */}
                <div className="flex-1 flex overflow-hidden">
                  <div className="flex-1 overflow-y-auto">
                    <ChatMessages
                      messages={filteredMessages}
                      typingIndicator={typingIndicator}
                      selectedChatId={selectedChat.id}
                      messagesEndRef={messagesEndRef}
                      showMessageMenu={showMessageMenu}
                      setShowMessageMenu={setShowMessageMenu}
                      showReactionPicker={showReactionPicker}
                      setShowReactionPicker={setShowReactionPicker}
                      onReaction={handleReaction}
                      onReply={handleReply}
                      onEdit={handleEditMessage}
                      onDelete={handleDeleteMessage}
                      onCopy={handleCopyMessage}
                      onStar={handleStarMessage}
                      onPin={handlePinMessage}
                      onForward={handleForwardMessage}
                      starredMessages={starredMessages}
                    />
                  </div>

                  {showChatInfo && (
                    <div className="flex-shrink-0 overflow-y-auto">
                      <ChatInfoSidebar
                        selectedChat={selectedChat}
                        messages={messages}
                        starredMessages={starredMessages}
                      />
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex-shrink-0">
                  <ChatInput
                    message={message}
                    setMessage={setMessage}
                    attachedFiles={attachedFiles}
                    setAttachedFiles={setAttachedFiles}
                    showEmojiPicker={showEmojiPicker}
                    setShowEmojiPicker={setShowEmojiPicker}
                    showAttachmentMenu={showAttachmentMenu}
                    setShowAttachmentMenu={setShowAttachmentMenu}
                    onSend={handleSend}
                    onFileSelect={handleFileSelect}
                    fileInputRef={fileInputRef}
                    emojiPickerRef={emojiPickerRef}
                    attachmentMenuRef={attachmentMenuRef}
                    isRecording={isRecording}
                    recordingDuration={recordingDuration}
                    handleVoiceMessage={handleVoiceMessage}
                    cancelRecording={cancelRecording}
                    replyingTo={replyingTo}
                    cancelReply={cancelReply}
                    editingMessage={editingMessage}
                    cancelEdit={cancelEdit}
                  />
                </div>
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #f97316 transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #f97316;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #ea580c;
        }
      `}</style>
    </DashboardLayout>
  );
}
