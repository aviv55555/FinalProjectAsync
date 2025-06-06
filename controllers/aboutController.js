/**
     @file controllers/aboutController.js
     @description Controller for the "About" page – returns information about us.
*/

class AboutController {
    constructor() {
        this.teamMembers = [{ first_name: 'Bar', last_name: 'Azarya' }, { first_name: 'Aviv Meir', last_name: 'Ovadia' }];
    }

    getAboutInfo = async (req, res) => {
        try {
            return res.json(this.teamMembers);
        } catch (error) {
            return res.status(500).json({ error: 'Server error', message: error.message });
        }
    }
}

module.exports = new AboutController();
