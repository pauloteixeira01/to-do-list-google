const FieldValidation = async (req, res, next) => {
    const { macaddress, type, name, description, when } = req.body;

    if (!macaddress) {
        return res.status(400).json({ error:  'Macaddress is required.'});
    }  
    if (!type) {
        return res.status(400).json({ error:  'Type is required.'});
    }  
    if (!name) {
        return res.status(400).json({ error:  'Title is required.'});
    }  
    if (!description) {
        return res.status(400).json({ error:  'Description is required.'});
    }  
    if (!when) {
        return res.status(400).json({ error:  'Date and hour are required.'});
    }  

    next();

}

module.exports = FieldValidation;