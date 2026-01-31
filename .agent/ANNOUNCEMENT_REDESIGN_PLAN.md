# Announcement Page Redesign - Implementation Plan

## Changes to Implement

### 1. **Action Buttons Redesign** (Based on uploaded image)
- View button: Blue background with white eye icon
- Edit button: Green background with white pencil icon  
- Delete button: Red background with white trash icon
- Remove the current hover-only background approach
- Make buttons more prominent and colorful

### 2. **Date Range Filter**
- Add date filter dropdown next to category filter
- Options: All, Today, This Week, This Month, Custom Range
- Custom range shows two date inputs
- Filter announcements based on selected date range

### 3. **Enhanced Metrics Cards**
- Add category-wise breakdown metrics
- Show filtered count vs total count
- Add trending indicator
- Make metrics dynamic based on active filters

### 4. **Card Design Improvements**
- Cleaner card layout
- Better spacing and typography
- Enhanced hover effects
- Improved action button placement

### 5. **Clear Filters Functionality**
- Add "Clear All Filters" button when filters are active
- Show active filter count
- Reset all filters with one click

## Code Structure

```jsx
// State additions
const [dateFilter, setDateFilter] = useState("All");
const [customStartDate, setCustomStartDate] = useState("");
const [customEndDate, setCustomEndDate] = useState("");
const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);

// Date filtering function
const getFilteredAnnouncementsByDate = () => {
  // Filter logic based on dateFilter state
};

// Enhanced stats calculation
const stats = {
  total: pagination.total,
  filtered: filteredAnnouncements.length,
  byCategory: categoryBreakdown,
  thisWeek: weekCount
};

// Action buttons (matching image)
<button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
  <Eye size={16} />
</button>
<button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded">
  <Pencil size={16} />
</button>
<button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded">
  <Trash2 size={16} />
</button>
```

This plan maintains existing functionality while adding the requested features.
