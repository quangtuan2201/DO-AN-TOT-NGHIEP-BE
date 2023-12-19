"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Doctor_Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Doctor_Info.belongsTo(models.Markdown, {
      //   foreignKey: "doctorId",
      // });
      Doctor_Info.belongsTo(models.User, {
        foreignKey: "doctorId",
      });

      Doctor_Info.belongsTo(models.Allcode, {
        foreignKey: "provinceId",
        targetKey: "keyMap",
        as: "provinceData",
      });
    }
  }
  Doctor_Info.init(
    {
      count: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Doctor_Info",
      freezeTableName: true,
      // tableName: "allcodes",
    }
  );
  return Doctor_Info;
};
