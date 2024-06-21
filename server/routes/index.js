const userRoutes = require("./userRoutes");
const marksRoutes = require("./marksRoutes");

const routes = [...userRoutes, ...marksRoutes];

module.exports = routes;
