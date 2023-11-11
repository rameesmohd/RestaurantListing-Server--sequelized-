const restaurantModel = require('../model/restaurants');
const sequelize = require('../config/config')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')

const fetchData = async (req, res) => {
    try {
        const data = await restaurantModel.findAll();
        res.status(200).json({ data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
}

const createRestaurant = async (name, address, contact, image) => {
    try {
        const newRestaurant = await restaurantModel.create({
            name,
            address,
            contact,
            image
        });
        return newRestaurant;
    } catch (err) {
        console.error('Error creating restaurant:', err);
        throw err;
    }
};

const addData = async (req, res) => {
    const { name, address, contact } = req.body;
    let imageURL;
    if (req.files.image && req.files.image.length) {
        const image = req.files.image[0];
        if (image) {
            try {
                const upload = await cloudinary.uploader.upload(image.path);
                imageURL = upload.secure_url;
                fs.unlinkSync(image.path);
            } catch (error) {
                console.error('Error uploading to Cloudinary:', error);
                return res.status(500).json({ error: 'Image upload failed' });
            }
        }
    }
    try {
        const newRestaurant = await createRestaurant(name, address, contact, imageURL);
        console.log('Restaurant created:', newRestaurant);
        res.status(200).json({ data: newRestaurant });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create restaurant' });
    }
};

const updateData = async (req, res) => {
    try {
        const obj = req.body;
        let imageURL;
        if (req.files.image && req.files.image.length) {
            const image = req.files.image[0];
            if (image) {
                try {
                    const upload = await cloudinary.uploader.upload(image.path);
                    imageURL = upload.secure_url;
                    fs.unlinkSync(image.path);
                    obj.image = imageURL;
                } catch (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    return res.status(500).json({ error: 'Image upload failed' });
                }
            }
        }
        
        const rowsAffected = await restaurantModel.update(obj, {
            where: { id: obj.id },
        });
    
        if (rowsAffected > 0) {
            const updatedRestaurant = await restaurantModel.findOne({ where: { id: obj.id } });
            if (updatedRestaurant) {
                res.json(updatedRestaurant); 
            } else {
                res.status(404).send('Record not found'); 
            }
        } else {
            res.status(404).send('Record not updated');
        }
    } catch (error) {
        console.error('Error in updateData:', error);
        res.status(500).json({ error: 'Update failed' });
    }
};


const deleteData = async (req,res)=>{
    try {
        const { id } = req.query; 

        const deletedRestaurant = await restaurantModel.destroy({
            where: { id: id },
        });

        if (deletedRestaurant > 0) {
            res.status(200).send('Record deleted successfully');
        } else {
            res.status(404).send('Record not found');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'deletion failed' });
    }
}

module.exports = {
    fetchData,
    addData,
    updateData,
    deleteData
}