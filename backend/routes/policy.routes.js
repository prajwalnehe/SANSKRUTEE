import { Router } from 'express';
import { Policy } from '../models/Policy.js';

const router = Router();

// Public route to get policy content
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const allowedTypes = ['privacy', 'terms', 'shipping', 'returns'];
    
    if (!allowedTypes.includes(type.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid policy type' });
    }

    const policy = await Policy.findOne({ type: type.toLowerCase() });
    
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    return res.json(policy);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch policy', error: err.message });
  }
});

export default router;







