# Client-Quotation-Invoice Flow Fixes

## Summary of Changes Made

### 1. Database Schema Updates

#### Quotations Table
- **Added `client_id` column** to link quotations with clients
- Added foreign key constraint: `FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL`

### 2. Backend Model Updates

#### quotationModel.js
- **Auto-create or link clients**: When a quotation is created, the system now:
  - Checks if a client with the same email already exists
  - If yes: Links the quotation to the existing client (prevents duplicates)
  - If no: Creates a new client automatically and links the quotation
- **Client data stored**: Splits client_name into first_name and last_name
- **Client type detection**: Automatically sets type to 'organization' if company_name is provided, otherwise 'person'
- Updated `update` method to maintain client_id relationship

#### clientModel.js
- **Added `getClientQuotations` method**: Retrieves all quotations for a specific client
- Returns quotations with parsed line_items JSON

### 3. Backend Controller Updates

#### clientController.js
- **Added `getClientQuotations` endpoint**: Allows fetching all quotations for a specific client

### 4. Backend Routes Updates

#### clientRoutes.js
- **Added route**: `GET /api/clients/:id/quotations` to fetch client quotations
- Route placed before generic `:id` route to ensure proper matching

## How the Flow Works Now

### Creating a Quotation
1. User creates a quotation with client details (name, email, phone, company)
2. System checks if a client with that email exists
3. **If client exists**: Quotation is linked to existing client (no duplicate created)
4. **If client doesn't exist**: New client is created automatically and quotation is linked
5. Quotation is saved with `client_id` reference

### Creating Subsequent Quotations for Same Client
1. User creates another quotation with the same email
2. System finds existing client by email
3. Quotation is linked to the existing client
4. No duplicate client is created

### Viewing Client Quotations
1. Navigate to Client Management page
2. View a specific client
3. System fetches all quotations linked to that client via `client_id`
4. All quotations for that client are displayed

### Creating Invoice from Quotation
1. Client can view all their quotations
2. Select a quotation to create an invoice from
3. Invoice is created with:
   - Client details from the quotation
   - Line items from the quotation
   - Proper pricing calculations:
     - Subtotal = Sum of all line item totals
     - Tax Amount = (Subtotal × Tax Rate) / 100
     - Total Amount = Subtotal + Tax Amount - Discount
     - Balance Amount = Total Amount - Paid Amount
   - Status auto-updated based on payment:
     - Unpaid: paid_amount = 0
     - Partial: 0 \u003c paid_amount \u003c total_amount
     - Paid: paid_amount \u003e= total_amount

### Payment and Invoice Update Flow
1. When payment is made, update the invoice with:
   - `paid_amount`: Amount paid
   - `balance_amount`: Automatically calculated as (total_amount - paid_amount)
   - `status`: Automatically updated based on payment status
2. The CreateInvoiceModal has a useEffect that auto-calculates:
   - Subtotal from line items
   - Tax amount from tax rate
   - Total amount
   - Balance amount
   - Status based on paid amount

## Migration Required

To apply these changes to your existing database, you need to run the migration:

```bash
cd Backend
node src/scripts/addClientIdToQuotations.js
```

This will:
1. Add the `client_id` column to the quotations table
2. Add the foreign key constraint
3. Attempt to link existing quotations to clients based on email matching

## Testing the Flow

### Test 1: Create First Quotation
1. Go to Quotations page
2. Create a new quotation with client details
3. Check Clients page - a new client should be created automatically
4. Check the client's email matches the quotation

### Test 2: Create Second Quotation for Same Client
1. Create another quotation with the same email
2. Check Clients page - no duplicate client should be created
3. Both quotations should be linked to the same client

### Test 3: View Client Quotations
1. Go to Clients page
2. View a client's details
3. All quotations for that client should be displayed

### Test 4: Create Invoice from Quotation
1. Select a quotation
2. Create invoice
3. Verify all pricing calculations are correct
4. Make a partial payment
5. Verify status updates to "Partial"
6. Make full payment
7. Verify status updates to "Paid"

## Files Modified

### Backend
- `Backend/src/scripts/createQuotationsTable.js` - Added client_id column
- `Backend/src/scripts/addClientIdToQuotations.js` - Migration script (NEW)
- `Backend/src/models/quotationModel.js` - Auto-create/link clients
- `Backend/src/models/clientModel.js` - Added getClientQuotations method
- `Backend/src/controllers/clientController.js` - Added getClientQuotations endpoint
- `Backend/src/routes/clientRoutes.js` - Added quotations route

### Frontend
- No frontend changes required - existing code already supports the flow
- The CreateInvoiceModal already has proper calculation logic
- The AllInvoice.jsx already handles payment updates correctly

## Notes

1. **Email is the unique identifier** for client matching
2. **Existing quotations** will be linked to clients if emails match (via migration)
3. **Invoice calculations** are handled in the frontend modal's useEffect
4. **Payment status** is automatically updated based on paid_amount vs total_amount
5. **Client type** is auto-detected based on whether company_name is provided
