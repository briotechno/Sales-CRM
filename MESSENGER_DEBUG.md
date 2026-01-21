# Messenger Send Message - Debugging Guide

## What to Check in Browser Console

### 1. When you click Send, you should see:

```javascript
handleSend called { 
  message: "hy", 
  selectedChat: {...}, 
  currentConversationId: 1, 
  currentEmployeeId: 28,
  socketConnected: true 
}

Sending message: {
  conversationId: 1,
  sender: { id: 28, type: 'employee' },
  text: "hy",
  ...
}

Message emitted via socket
Message saved via API: { success: true, messageId: 123 }
```

### 2. If you see errors:

**Error: "Employee ID not loaded"**
- Solution: Refresh the page
- Check: `currentEmployeeId` should be a number

**Error: "Please select a chat first"**
- Solution: Click on a contact in the sidebar first

**Error: "No message or files to send"**
- Solution: Type something in the input box

**Error: "Failed to save message"**
- Check backend console for SQL errors
- Verify token is valid: `localStorage.getItem('token')`

### 3. Backend Console Should Show:

```
New client connected: <socket_id>
User joined room: 28_employee
```

When you send a message:
```
POST /api/messenger/send 200
```

## Quick Test Steps

1. Open Browser DevTools (F12)
2. Go to Console tab
3. Navigate to Messenger page
4. Click on any employee in Team tab
5. Type "test" in the message box
6. Click Send button
7. Watch console for logs

## Expected Flow

1. ✅ Message appears in chat immediately (optimistic update)
2. ✅ Toast notification: "Message sent!"
3. ✅ Message saved to database via API
4. ✅ Socket emits to other user (if online)
5. ✅ Input box clears

## If Nothing Happens

Check these in order:

1. **Is handleSend being called?**
   - Look for "handleSend called" in console
   - If not, check if ChatInput component is passing onSend prop correctly

2. **Is currentEmployeeId set?**
   - Type in console: `localStorage.getItem('token')`
   - Should return a JWT token

3. **Is the API endpoint working?**
   - Check Network tab for POST to `/api/messenger/send`
   - Should return 200 or 201 status

4. **Is Socket.io connected?**
   - Look for "Socket connected successfully" in console
   - Check socketConnected state

## Manual API Test

Run this in browser console:

```javascript
fetch('http://localhost:5000/api/messenger/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    otherId: 29,
    otherType: 'employee',
    text: 'Test message',
    messageType: 'text'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

Should return: `{ success: true, messageId: <number> }`
