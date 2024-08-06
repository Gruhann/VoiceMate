const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// Get reminders
router.get('/', async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.session.user._id });
        res.json(reminders);
    } catch (error) {
        res.status(500).send('Error fetching reminders');
    }
});

// Add a reminder
router.post('/add', async (req, res) => {
    const { reminder, date } = req.body;
    try {
        const newReminder = new Reminder({ reminder, date, user: req.session.user._id });
        await newReminder.save();
        res.status(201).send('Reminder added');
    } catch (error) {
        res.status(500).send('Error adding reminder');
    }
});

// Delete a reminder
router.delete('/delete/:id', async (req, res) => {
    try {
        await Reminder.findByIdAndDelete(req.params.id);
        res.status(200).send('Reminder deleted');
    } catch (error) {
        res.status(500).send('Error deleting reminder');
    }
});

module.exports = router;
