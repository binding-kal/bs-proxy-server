require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper function to format player tag correctly for Supercell API
const formatTag = (tag) => {
    let cleanTag = tag.trim().toUpperCase();
    if (cleanTag.startsWith('#')) {
        return '%23' + cleanTag.substring(1);
    }
    return '%23' + cleanTag;
};

// Main endpoint to fetch player data
app.get('/api/player/:tag', async (req, res) => {
    try {
        const { tag } = req.params;
        const formattedTag = formatTag(tag);
        
        const response = await axios.get(`https://api.brawlstars.com/v1/players/${formattedTag}`, {
            headers: {
                'Authorization': `Bearer ${process.env.SUPERCELL_API_KEY}`
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching player data:', error.response?.data || error.message);
        const status = error.response?.status || 500;
        res.status(status).json({ 
            error: 'Failed to fetch player data', 
            details: error.response?.data || error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
    console.log(`Please ensure your SUPERCELL_API_KEY is added to the .env file.`);
});
