const { gql } = require('apollo-server')

const typeDefs = gql`
    scalar Date

    type User {
        id: Int!
        firstName: String!
        lastName: String!
        email: String!
        type: String!
        admin: Boolean!
        locations: [Location]
        tours: [Tour]
      }

    type Location {
        id: Int!
        name: String!
        address: String!
        phone: String!
        rating: Int
        guides: [User]
        tours: [Tour]
        admin: [User]
    }

    type Tour {
        id: Int!
        title: String!
        location: Location!
        description: String!
        attendees: [User!]!
        guides: [User!]!
        startTime: Date!
        endTime: Date!
    }

    type Query {
        user(id: Int!): User
        allUsers: [User!]!
        allLocations: [Location!]!
        allTours: [Tour!]!
        tour(id: Int!): Tour
        location(id: Int!): Location
    }

    type Mutation {
        createUser(
            firstName: String! 
            lastName: String!
            email: String!
            password: String!
            type: String!
            admin: Boolean!
        ): User!
        updateUser(
            id: Int!
            firstName: String
            lastName: String
            email: String
            password: String
            type: String
            admin: Boolean
        ): User!
        deleteUser(
            id: Int!
        ): String
        createLocation(
            userId: Int!
            name: String!
            address: String!
            phone: String!
            rating: Int
        ): Location!
        updateLocation(
            id: Int
            userId: Int
            name: String
            address: String
            phone: String
            rating: Int
        ): Location
        deleteLocation(
            id: Int!
        ): String
        createTour(
            locationId: Int!
            title: String!
            description: String!
            startTime: Date!
            endTime: Date!
        ): Tour!
        updateTour(
            id: Int!
            locationId: Int
            title: String
            description: String
            startTime: Date
            endTime: Date
        ): Tour!
        deleteTour(
            id: Int!
        ): String
        addLocationUserConnection(
            locationId: Int!
            userId: Int!
        ): Location!
        addTourUserConnection(
            tourId: Int!
            userId: Int!
        ): User!
    }
`

module.exports = typeDefs