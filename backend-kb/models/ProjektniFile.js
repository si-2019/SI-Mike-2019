/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ProjektniFile', {
    idProjektniFile: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    idProjektniZadatak: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'ProjektniZadatak',
        key: 'idprojektnogzadatka'
      }
    },
    file: {
      type: "mediumblob",
      allowNull: true
    },
    file_size: {
      type: DataTypes.INTEGER(100),
      allowNull: true
    },
    file_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nazivFile: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'ProjektniFile'
  });
};
