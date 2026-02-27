const CRMForm = require('../models/crmFormModel');
const GoogleSheetsConfig = require('../models/googleSheetsModel');
const LeadSyncLog = require('../models/leadSyncLogModel');
const LeadService = require('../services/leadService');
const { google } = require('googleapis');
const Catalog = require('../models/catalogModel');
const ChannelConfig = require('../models/channelConfigModel');
const axios = require('axios');

const integrationController = {
    // --- CRM Forms ---
    createForm: async (req, res) => {
        try {
            const formId = await CRMForm.create({ ...req.body, user_id: req.user.id });
            res.status(201).json({ message: 'CRM Form created successfully', formId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getForms: async (req, res) => {
        try {
            const { page, limit, search, status } = req.query;
            const result = await CRMForm.findAllByUserId(req.user.id, { page, limit, search, status });
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateForm: async (req, res) => {
        try {
            await CRMForm.update(req.params.id, req.user.id, req.body);
            res.json({ message: 'CRM Form updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteForm: async (req, res) => {
        try {
            await CRMForm.delete(req.params.id, req.user.id);
            await LeadSyncLog.deleteByReferenceId(req.user.id, req.params.id, 'crm_form');
            res.json({ message: 'CRM Form deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },



    // Public Form Submission
    getPublicForm: async (req, res) => {
        const { slug } = req.params;
        try {
            const form = await CRMForm.findBySlug(slug);
            if (!form || form.status !== 'active') {
                return res.status(404).json({ message: 'Form not found or inactive' });
            }

            // Check if we need to fetch catalogs
            // Field name for services might be 'services' or 'interested_in'
            const fields = typeof form.fields === 'string' ? JSON.parse(form.fields) : form.fields;
            const needsCatalogs = fields.some(f => f.name === 'services' || f.name === 'interested_in' || f.label === 'Services');

            let catalogs = [];
            if (needsCatalogs) {
                const catalogResult = await Catalog.findAll(form.user_id, 1, 1000, 'Active');
                catalogs = catalogResult.catalogs.map(c => ({ id: c.id, name: c.name, minPrice: c.minPrice, maxPrice: c.maxPrice }));
            }

            // Return only public fields
            res.json({
                form_name: form.form_name,
                fields: form.fields,
                settings: form.settings,
                form_slug: form.form_slug,
                catalogs: catalogs
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    submitPublicForm: async (req, res) => {

        const { slug } = req.params;
        try {
            const form = await CRMForm.findBySlug(slug);
            if (!form || form.status !== 'active') {
                return res.status(404).json({ message: 'Form not found or inactive' });
            }

            const result = await LeadService.processLead(req.body, form.user_id, 'crm_form');

            await LeadSyncLog.create({
                user_id: form.user_id,
                channel_type: 'crm_form',
                reference_id: form.id,
                status: 'success',
                message: `Lead ${result.action} from form submission`,
                raw_data: req.body
            });

            res.json({ message: 'Form submitted successfully', action: result.action });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // --- Google Sheets ---
    createSheetConfig: async (req, res) => {
        try {
            const configId = await GoogleSheetsConfig.create({ ...req.body, user_id: req.user.id });
            res.status(201).json({ message: 'Google Sheets configuration saved', configId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getSheetsConfigs: async (req, res) => {
        try {
            const { page, limit, search, sync_frequency } = req.query;
            const result = await GoogleSheetsConfig.findAllByUserId(req.user.id, { page, limit, search, sync_frequency });
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateSheetConfig: async (req, res) => {
        try {
            await GoogleSheetsConfig.update(req.params.id, req.user.id, req.body);
            res.json({ message: 'Configuration updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteSheetConfig: async (req, res) => {
        try {
            await GoogleSheetsConfig.delete(req.params.id, req.user.id);
            res.json({ message: 'Configuration deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    syncSheet: async (req, res) => {
        const { id } = req.params;
        try {
            const config = await GoogleSheetsConfig.findById(id, req.user.id);
            if (!config) return res.status(404).json({ message: 'Configuration not found' });

            const credentials = JSON.parse(config.credentials_json);
            const privateKey = credentials.private_key.replace(/\\n/g, '\n');

            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: credentials.client_email,
                    private_key: privateKey,
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            });

            const client = await auth.getClient();
            const sheets = google.sheets({ version: 'v4', auth: client });

            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: config.spreadsheet_id,
                range: config.sheet_id || 'Sheet1',
            });



            const rows = response.data.values;
            if (!rows || rows.length < 2) {
                return res.status(400).json({ message: 'No data found in sheet' });
            }

            const headers = rows[0].map(h => h.toString().trim().toLowerCase());
            const mapping = typeof config.field_mapping === 'string' ? JSON.parse(config.field_mapping) : config.field_mapping;
            let successCount = 0;
            let errorCount = 0;

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const leadData = {};
                let hasData = false;

                Object.keys(mapping).forEach(crmField => {
                    const mappedHeader = mapping[crmField]?.toString().trim().toLowerCase();
                    if (!mappedHeader) return;

                    const sheetColumnIndex = headers.indexOf(mappedHeader);
                    if (sheetColumnIndex !== -1 && row[sheetColumnIndex]) {
                        leadData[crmField] = row[sheetColumnIndex];
                        hasData = true;
                    }
                });

                if (!hasData) continue;

                try {
                    await LeadService.processLead(leadData, req.user.id, 'google_sheets');
                    successCount++;
                } catch (err) {
                    errorCount++;
                    console.error(`Error processing row ${i}:`, err);
                }
            }


            await GoogleSheetsConfig.update(id, req.user.id, { last_sync_at: new Date() });

            await LeadSyncLog.create({
                user_id: req.user.id,
                channel_type: 'google_sheets',
                reference_id: config.id,
                status: 'success',
                message: `Sync completed: ${successCount} processed, ${errorCount} errors`,
                raw_data: { successCount, errorCount }
            });

            res.json({ message: 'Sync completed', successCount, errorCount });
        } catch (error) {
            await LeadSyncLog.create({
                user_id: req.user.id,
                channel_type: 'google_sheets',
                reference_id: req.params.id,
                status: 'error',
                message: `Sync failed: ${error.message}`,
                raw_data: { error: error.stack }
            });
            res.status(500).json({ message: `Sync failed: ${error.message}` });
        }
    },

    getLogs: async (req, res) => {
        try {
            const { page, limit, channel_type } = req.query;
            const logs = await LeadSyncLog.findAllByUserId(req.user.id, { page, limit, channel_type });
            res.json(logs);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // --- Channel Integrations (Meta, Justdial, IndiaMart) ---
    getChannelConfigs: async (req, res) => {
        try {
            const { type } = req.query;
            const configs = await ChannelConfig.findAll(req.user.id, type);
            res.json({ data: configs });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    saveChannelConfig: async (req, res) => {
        try {
            const configId = await ChannelConfig.create({ ...req.body, user_id: req.user.id });
            res.status(201).json({ message: 'Configuration saved successfully', id: configId });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteChannelConfig: async (req, res) => {
        try {
            const { id } = req.params;
            await ChannelConfig.delete(id, req.user.id);
            res.json({ message: 'Configuration deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    syncChannelLeads: async (req, res) => {
        const { id } = req.params;
        try {
            const config = await ChannelConfig.findById(id, req.user.id);
            if (!config) return res.status(404).json({ message: 'Configuration not found' });

            let successCount = 0;
            let errorCount = 0;

            // Logic varies by channel
            if (config.channel_type === 'indiamart') {
                // IndiaMart CRM API Example
                const response = await axios.get(`https://mapi.indiamart.com/wservce/enquiry/listing/GLUSR_MOBILE/${config.account_name}/GLUSR_MOBILE_KEY/${config.api_key}/`);

                const enquiries = response.data?.RESPONSE || [];
                for (const item of enquiries) {
                    try {
                        const leadData = {
                            name: item.SENDER_NAME,
                            email: item.SENDER_EMAIL,
                            mobile_number: item.SENDER_MOBILE,
                            interested_in: item.QUERY_PRODUCT_NAME,
                            location: item.SENDER_CITY,
                            message: item.QUERY_MESSAGE
                        };
                        await LeadService.processLead(leadData, req.user.id, 'indiamart');
                        successCount++;
                    } catch (e) { errorCount++; }
                }
            } else if (config.channel_type === 'meta') {
                // Meta would normally use webhooks, but manual sync could fetch from Meta API
                // For demo/dev purposes, we pretend to fetch 2 leads
                const mockMetaLeads = [
                    { name: "Meta Test User 1", email: "meta1@test.com", mobile_number: "9800000001", interested_in: "Facebook Ads Product" },
                    { name: "Meta Test User 2", email: "meta2@test.com", mobile_number: "9800000002", interested_in: "Insta Ads Product" }
                ];
                for (const lead of mockMetaLeads) {
                    await LeadService.processLead(lead, req.user.id, 'meta');
                    successCount++;
                }
            } else if (config.channel_type === 'justdial') {
                // Justdial API simulation
                const mockJDLeads = [
                    { name: "Justdial User", email: "jd@test.com", mobile_number: config.account_name, interested_in: "Local Service" }
                ];
                for (const lead of mockJDLeads) {
                    await LeadService.processLead(lead, req.user.id, 'justdial');
                    successCount++;
                }
            }

            await ChannelConfig.update(id, req.user.id, { last_sync_at: new Date() });

            await LeadSyncLog.create({
                user_id: req.user.id,
                channel_type: config.channel_type,
                reference_id: config.id,
                status: 'success',
                message: `Sync completed: ${successCount} leads found`,
                raw_data: { successCount, errorCount }
            });

            res.json({ message: 'Sync completed', successCount });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = integrationController;
