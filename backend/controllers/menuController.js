const Menu = require('../models/Menu');

const getMenu = async (req, res) => {
    try {
        const menus = await Menu.find({});
        res.json(menus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMenuByDay = async (req, res) => {
    try {
        const menu = await Menu.findOne({ day: req.params.day });
        if (!menu) return res.status(404).json({ message: 'Menu not found for this day' });
        res.json(menu);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createMenu = async (req, res) => {
    try {
        const { day, breakfast, lunch, snacks, dinner } = req.body;
        let menu = await Menu.findOne({ day });
        if (menu) return res.status(409).json({ message: 'Menu already exists for this day' });
        menu = await Menu.create({ day, breakfast, lunch, snacks, dinner });
        res.status(201).json({ success: true, message: 'Menu created successfully', menu });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateMenu = async (req, res) => {
    try {
        const menu = await Menu.findOneAndUpdate({ day: req.params.day }, req.body, { new: true });
        if (!menu) return res.status(404).json({ message: 'Menu not found' });
        res.json({ success: true, message: 'Menu updated successfully', menu });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findOneAndDelete({ day: req.params.day });
        if (!menu) return res.status(404).json({ message: 'Menu not found' });
        res.json({ success: true, message: 'Menu deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getMenu, getMenuByDay, createMenu, updateMenu, deleteMenu };
