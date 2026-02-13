const fs = require('fs');
const path = require('path');

const filePath = 'd:/Github2/Sales-CRM/src/pages/LeadsManagement/NewLeads.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// The mess starts with ``` followed by imports
// We want to remove everything from line 179 down to the next 'export default function NewLeads' or similar?
// No, I'll just try to find the ``` pattern.

if (content.includes('```')) {
    console.log('Found backticks mess, attempting to fix...');
    // We want to delete from the first ``` to the end of the handleHitCall function that was being edited.
    // Or simpler: replace the whole handleHitCall with a clean one and remove the garbage.

    // Let's just restore the file from a known good state (AllLaeds.jsx modified)
    const goodFile = 'd:/Github2/Sales-CRM/src/pages/LeadsManagement/AllLeadPagePart/AllLaeds.jsx';
    let goodContent = fs.readFileSync(goodFile, 'utf8');

    // Modify goodContent for NewLeads
    goodContent = goodContent.replace(/AllLeads/g, 'NewLeads')
        .replace(/All Laeds/g, 'New Leads')
        .replace(/subview: '.*'/, "subview: 'new'")
        .replace(/tag: filterTag,/, "tag: filterTag,\n    subview: 'new',");

    fs.writeFileSync(filePath, goodContent);
    console.log('Fixed NewLeads.jsx by cloning AllLaeds.jsx');
} else {
    console.log('No backticks found in NewLeads.jsx');
}
