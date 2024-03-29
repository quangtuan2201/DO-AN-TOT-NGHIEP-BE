"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Clinic.init(
    {
      address: DataTypes.STRING,
      name: DataTypes.STRING,
      image: DataTypes.TEXT,
      descriptionMarkdown: DataTypes.TEXT("long"),
      descriptionHTML: DataTypes.TEXT("long"),
    },
    {
      sequelize,
      modelName: "Clinic",
    }
  );
  return Clinic;
};
