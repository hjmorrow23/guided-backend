const bcrypt = require('bcryptjs')

const resolvers = {
    Query: {
        async user (root, { id }, { models }) {
              return models.User.findByPk(id)
        },
        async allUsers (root, args, { models }) {
              return models.User.findAll()
        },
        async allLocations (root, args, { models }) {
            try {
                return models.Location.findAll()
            } catch(error) {
                console.log(error)
            }
              
        },
        async allTours (root, args, { models }) {
              return models.Tour.findAll()
        },
        async location (root, { id }, { models }) {
              return models.Location.findByPk(id)
        },
        async tour (root, { id }, { models }) {
              return models.Tour.findByPk(id)
        }
    },
    Mutation: {
        async createUser (root, { firstName, lastName, email, type, admin, password }, { models }) {
            return models.User.create({
                firstName,
                lastName,
                email,
                type,
                admin,
                password: await bcrypt.hash(password, 10),
              })
        },
        async updateUser (root, { id, firstName, lastName, email, type, admin, password }, { models }) {
            await models.User.update({
                firstName,
                lastName,
                email,
                type,
                admin,
                password: await bcrypt.hash(password, 10),
              }, {
                returning: true,
                where: { 
                    id
                }
              });
              return models.User.findByPk(id)
        },
        async deleteUser (root, { id }, { models }) {
            await models.User.destroy({ 
                where: {
                    id
                }
            });
            return `User with id of ${id} deleted`;
        },
        async createLocation (root, { userId, name, address, phone, rating }, { models }) {
            return models.Location.create({ 
                userId, 
                name, 
                address, 
                phone, 
                rating 
            })
        },
        async updateLocation (root, { id, userId, name, address, phone, rating }, { models }) {
            await models.Location.update({ 
                userId, 
                name, 
                address, 
                phone, 
                rating 
            }, {
                returning: true,
                where: { 
                    id
                }
            });
            return models.Location.findByPk(id)
        },
        async deleteLocation (root, { id }, { models }) {
            await models.Location.destroy({ 
                where: {
                    id
                }
            });
            return `Location with id of ${id} deleted`;
        },
        async createTour (root, { locationId, title, description, startTime, endTime }, { models }) {
            try {
                return models.Tour.create({ 
                    locationId, 
                    title, 
                    description, 
                    startTime, 
                    endTime 
                })
            } catch(error) {
                throw new Error(error.message)
            }
            
        },
        async updateTour (root, { id, locationId, title, description, startTime, endTime }, { models }) {
            try {
                await models.Tour.update({ 
                    locationId, 
                    title, 
                    description, 
                    startTime, 
                    endTime 
                }, {
                    returning: true,
                    where: { 
                        id
                    }
                })
                return models.Tour.findByPk(id)
            } catch(error) {
                throw new Error(error.message)
            }
            
        },
        async deleteTour (root, { id }, { models }) {
            await models.Tour.destroy({ 
                where: {
                    id
                }
            });
            return `Tour with id of ${id} deleted`;
        },
        async addLocationUserConnection (root, { locationId, userId }, { models }) {
            try {
                const location = await models.Location.findByPk(locationId);
                const user = await models.User.findByPk(userId);
                await user.addLocation(location);
                await location.addUser(user);
                return location
            } catch(error) {
                throw new Error(error.message)
            }
            
        },
        async addTourUserConnection (root, { tourId, userId }, { models }) {
            try {
                const tour = await models.Tour.findByPk(tourId);
                const user = await models.User.findByPk(userId);
                await user.addTour(tour);
                await tour.addUser(user);
                return user
            } catch(error) {
                throw new Error(error.message)
            }
            
        },
    },
    User: {
        async locations (user) {
            return user.getLocations()
        },
        async tours (user) {
            return user.getTours()
        }
    },
    Location: {
        async admin (location) {
            const admins = await location.getUsers();
            return admins.filter(user => user.admin)
        },
        async guides (location) {
            const users = await location.getUsers();
            return users.filter(user => user.type === 'guide')
        },
        async tours (location) {
            return location.getTours()
        }
    },
    Tour: {
        async location (tour) {
            return tour.getLocation()
        },
        async guides (tour) {
            const users = await tour.getUsers()
            return users.filter(user => user.type === 'guide')
        },
        async attendees (tour) {
            const users = await tour.getUsers()
            return users.filter(user => user.type === 'attendee')
        }
    },
}

module.exports = resolvers